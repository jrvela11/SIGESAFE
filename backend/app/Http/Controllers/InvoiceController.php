<?php

namespace App\Http\Controllers;

use App\Http\Requests\InvoiceStoreRequest;
use App\Models\Invoice;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;
use Exception;

class InvoiceController extends Controller
{
    /**
     * Registra un nuevo comprobante electrónico en zona exonerada.
     */
    public function store(InvoiceStoreRequest $request): JsonResponse
    {
        // Los datos ya vienen limpios y validados por el InvoiceStoreRequest
        $validated = $request->validated();

        try {
            // Iniciamos una transacción para asegurar que todo se guarde o nada se guarde
            $invoice = DB::transaction(function () use ($validated) {
                
                // 1. Resolver el correlativo de forma segura (Lógica simulada o desde tabla de series)
                // En producción bloquearías la fila: DB::table('series')->where(...)->lockForUpdate()
                $numeroCorrelativo = str_pad('1', 8, '0', STR_PAD_LEFT); 

                // 2. Obtener los datos del cliente para el Snapshot inmutable
                $customer = Customer::findOrFail($validated['customer_id']);

                // 3. Crear la cabecera del Comprobante (Invoice)
                $invoice = Invoice::create([
                    'customer_id'               => $customer->id,
                    'venta_id'                 => $validated['sale_id'],
                    'tipo_comprobante'         => $validated['tipo_comprobante'],
                    'serie'                    => strtoupper($validated['serie']),
                    'numero'                   => $numeroCorrelativo,
                    
                    // SNAPSHOT INMUTABLE (Regla de oro fiscal)
                    'cliente_tipo_documento'   => $customer->tipo_documento, // Ej: '6' (RUC) o '1' (DNI)
                    'cliente_numero_documento' => $customer->ruc_dni ?? $customer->document_number,
                    'cliente_denominacion'     => $customer->razon_social ?? $customer->name,
                    'cliente_direccion'        => $customer->direccion_fiscal ?? $customer->address,
                    
                    'moneda'                   => $validated['moneda'] ?? 'PEN',
                    'fecha_emision'            => now()->format('Y-m-d'),
                    'fecha_vencimiento'        => $validated['fecha_vencimiento'] ?? null,
                    'aplica_ley_amazonia'      => true, // Beneficio de exoneración activo
                    'estado_sunat'             => 'PENDIENTE'
                ]);

                // 4. Registrar los detalles (InvoiceItems) calculando montos exonerados
                $totalExoneradoAcumulado = 0;

                foreach ($validated['detalles'] as $item) {
                    $product = Product::findOrFail($item['product_id']);
                    
                    // Al estar exonerado en la Amazonía (SUNAT Tipo '20'):
                    // El valor unitario (sin IGV) es igual al precio unitario (con IGV)
                    $precioUnitario = $item['precio_unitario'];
                    $valorUnitario  = $precioUnitario; 
                    $cantidad       = $item['cantidad'];
                    
                    $subtotal       = $cantidad * $valorUnitario;
                    $totalLinea     = $subtotal; // Al no haber IGV, coinciden perfectamente

                    $totalExoneradoAcumulado += $totalLinea;

                    // Creamos el ítem usando la relación de Eloquent
                    $invoice->items()->create([
                        'producto_id'         => $product->id,
                        'codigo_producto'     => $product->codigo ?? $product->code,
                        'descripcion'         => $product->nombre ?? $product->name,
                        'unidad_medida'       => $product->unidad_medida ?? 'NIU', // NIU = Unidades
                        'cantidad'            => $cantidad,
                        'valor_unitario'      => $valorUnitario,
                        'precio_unitario'     => $precioUnitario,
                        'tipo_afectacion_igv' => '20', // Código oficial SUNAT: Exonerado - Op. Onerosa
                        'porcentaje_igv'      => 0.00,
                        'igv_linea'           => 0.00,
                        'subtotal'            => $subtotal,
                        'total'               => $totalLinea
                    ]);
                }

                // 5. Actualizar los totales calculados en la cabecera
                $invoice->update([
                    'total_op_gravada'   => 0.00,
                    'total_op_exonerada' => $totalExoneradoAcumulado, // El dinero se acumula en este casillero fiscal
                    'total_op_inafecta'  => 0.00,
                    'total_igv'          => 0.00,
                    'total_pagar'        => $totalExoneradoAcumulado
                ]);

                return $invoice;
            });

            // 6. [Opcional] Despachar un Job asíncrono para enviar el XML a SUNAT
            // EnviarComprobanteSunatJob::dispatch($invoice);

            return response()->json([
                'success' => true,
                'message' => 'Comprobante registrado exitosamente (Exonerado por Ley de Amazonía).',
                'data'    => $invoice->load('items') // Carga eager loading de los detalles guardados
            ], Response::HTTP_CREATED);

        } catch (Exception $e) {
            // Si ocurre algún error interno, la transacción hace rollback automático
            return response()->json([
                'success' => false,
                'message' => 'Error crítico al procesar la facturación electrónica.',
                'error'   => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}