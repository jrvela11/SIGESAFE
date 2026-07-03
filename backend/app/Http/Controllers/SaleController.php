<?php

namespace App\Http\Controllers;

use App\Http\Requests\SaleStoreRequest;
use App\Http\Resources\SaleCollection;
use App\Http\Resources\SaleResource;
use App\Models\Inventory;
use App\Models\InventoryMovement;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleDetail;
use App\Services\InvoiceService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\HttpException;

class SaleController extends Controller
{

    protected InvoiceService $invoiceService;

    // 🚀 INYECTAR EL SERVICIO EN EL CONSTRUCTOR
    public function __construct(InvoiceService $invoiceService)
    {
        $this->invoiceService = $invoiceService;
    }
    public function index(Request $request)
    {
        $sales = Sale::with(['customer', 'user'])->orderBy('id', 'desc')->get();
        return new SaleCollection($sales);
    }

    public function store(SaleStoreRequest $request)
    {
        try {
            // Variables de control fuera del scope del Closure de la transacción
            $sale = null;

            // 1. PERSISTENCIA LOCAL RÁPIDA (Dentro de la transacción SQL)
            $invoice = DB::transaction(function () use ($request, &$sale) {
                $subtotalAcumulado = 0;
                $igvAcumulado = 0;
                $tipoVenta = $request->input('tipo_venta');
                $tipoComprobante = $request->input('tipo_comprobante'); // '01' o '03'

                $serie = $request->input('serie');
                $ultimoCorrelativo = Sale::where('serie', $serie)->latest('id')->value('correlativo') ?? '0000000000';
                $nuevoCorrelativo = str_pad((int)$ultimoCorrelativo + 1, 10, '0', STR_PAD_LEFT);

                $sale = Sale::create([
                    'customer_id'      => $request->input('customer_id'),
                    'user_id'          => $request->input('user_id'),
                    'tipo_venta'       => $tipoVenta,
                    'tipo_comprobante' => $tipoComprobante,
                    'serie'            => $serie,
                    'correlativo'      => $nuevoCorrelativo,
                    'subtotal'         => 0, // Se actualizará al final
                    'igv'              => 0,
                    'total'            => 0,
                    'metodo_pago'      => $request->input('metodo_pago'),
                    'estado_pago'      => $request->input('estado_pago'),
                    'fecha_venta'      => now(),
                ]);

                $invoiceDetails = [];

                foreach ($request->input('items') as $item) {
                    $product = Product::findOrFail($item['product_id']);
                    $cantidadRequerida = $item['cantidad'];

                    if ($product->stock_actual < $cantidadRequerida) {
                        throw new \Exception("Stock insuficiente para: {$product->nombre}");
                    }

                    // Crear el detalle de la venta
                    $precioUnitario = ($tipoVenta === 'mayorista') ? $product->precio_mayorista : $product->precio_minorista;
                    $subtotalItem = ($precioUnitario * $cantidadRequerida) - ($item['descuento'] ?? 0);

                    $saleDetail = $sale->details()->create([
                        'product_id'      => $product->id,
                        'cantidad'        => $cantidadRequerida,
                        'precio_unitario' => $precioUnitario,
                        'descuento'       => $item['descuento'] ?? 0,
                        'subtotal'        => $subtotalItem,
                        'estado'          => true,
                    ]);

                    // Mapeamos los datos para estructurar el comprobante localmente
                    $invoiceDetails[] = [
                        'product_id'      => $product->id,
                        'cantidad'        => $cantidadRequerida,
                        'precio_unitario' => $precioUnitario,
                    ];

                    // Lógica FIFO y registro en Kardex
                    $lotes = Inventory::where('product_id', $product->id)
                        ->where('estado', true)
                        ->where('cantidad_actual', '>', 0)
                        ->orderBy('created_at', 'asc')
                        ->get();

                    $cantidadRestante = $cantidadRequerida;

                    foreach ($lotes as $lote) {
                        if ($cantidadRestante <= 0) break;

                        $descuentoLote = min($lote->cantidad_actual, $cantidadRestante);

                        // Actualizar lote
                        $lote->decrement('cantidad_actual', $descuentoLote);

                        // REGISTRO EN KARDEX
                        InventoryMovement::create([
                            'inventory_id'   => $lote->id,
                            'sale_detail_id' => $saleDetail->id,
                            'tipo'           => 'salida',
                            'cantidad'       => $descuentoLote,
                            'descripcion'    => "Venta {$serie}-{$nuevoCorrelativo} - Producto: {$product->nombre}",
                        ]);

                        $cantidadRestante -= $descuentoLote;
                    }

                    // Actualizar stock global y acumuladores
                    $product->decrement('stock_actual', $cantidadRequerida);
                    $subtotalAcumulado += $subtotalItem;
                    if ($product->afecto_igv) $igvAcumulado += ($subtotalItem * 0.18);
                }

                // Actualizar totales de la cabecera de la venta
                $sale->update([
                    'subtotal' => $subtotalAcumulado,
                    'igv'      => $igvAcumulado,
                    'total'    => $subtotalAcumulado + $igvAcumulado,
                ]);

                // Configurar el payload para guardar el Invoice local en la base de datos
                $customerId = $sale->customer_id ?? 1;

                $invoicePayload = [
                    'customer_id'       => $customerId,
                    'sale_id'           => $sale->id,
                    'tipo_comprobante'  => $tipoComprobante,
                    'serie'             => ($tipoComprobante === '01') ? 'F001' : 'B001',
                    'moneda'            => 'PEN',
                    'fecha_vencimiento' => null,
                    'detalles'          => $invoiceDetails
                ];

                // Retornamos la instancia generada localmente para consumirla fuera del Closure
                return $this->invoiceService->generate($invoicePayload);
            });

            // =========================================================================
            // 🚀 COMUNICACIÓN SÍNCRONA CON LA API DE SUNAT (FUERA DE LA TRANSACCIÓN SQL)
            // =========================================================================
            $sunatService = app(\App\Services\SunatBillingService::class);

            // Eager load de las relaciones requeridas por el formateador de ApisPerú
            $invoice->load(['items', 'customer']);

            // Petición HTTP externa (Toma de 1.5 a 3 segundos en promedio)
            $resultadoSunat = $sunatService->enviar($invoice);

            if ($resultadoSunat['invoice_accepted']) {
                $invoice->update([
                    'estado_sunat'      => 'ACEPTADO',
                    'sunat_description' => $resultadoSunat['description'],
                    'hash'              => $resultadoSunat['hash'],
                    'cdr_path'          => $resultadoSunat['cdr_zip'],
                    'xml_path'          => $resultadoSunat['xml'],
                ]);
            } else {
                $invoice->update([
                    'estado_sunat'      => 'RECHAZADO',
                    'sunat_description' => $resultadoSunat['description']
                ]);
            }

            if (!$sale) {
                throw new \Exception("La venta no pudo ser inicializada correctamente.");
            }
            // 2. RETORNO EXITOSO DIRECTO HACIA EL FRONTEND EN REACT
            return response()->json([
                'success' => true,
                'message' => 'Venta procesada y comprobante enviado a SUNAT exitosamente.',
                'sale'    => new SaleResource($sale->load(['details.product'])),
                'invoice' => $invoice
            ], 201);
        } catch (\Exception $e) {
            // Captura excepciones de stock, fallos de base de datos o caídas imprevistas del API de facturación
            return response()->json([
                'success' => false,
                'message' => 'Ocurrió un error al procesar el flujo de la venta.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function show(Request $request, Sale $sale)
    {
        return new SaleResource($sale);
    }

    public function update(Request $request, Sale $sale)
    {
        $sale->update($request->only(['estado_pago']));

        return new SaleResource($sale);
    }

    public function destroy(Request $request, Sale $sale)
    {
        $sale->delete();

        return response()->noContent();
    }
}
