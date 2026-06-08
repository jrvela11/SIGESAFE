<?php

namespace App\Http\Controllers;

use App\Http\Requests\SaleStoreRequest;
use App\Http\Resources\SaleCollection;
use App\Http\Resources\SaleResource;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleDetail;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\HttpException;

class SaleController extends Controller
{
    public function index(Request $request)
    {
        $sales = Sale::all();

        return new SaleCollection($sales);
    }

    public function store(SaleStoreRequest $request)
    {
        return DB::transaction(function () use ($request) {

            $subtotalAcumulado = 0;
            $igvAcumulado = 0;
            $tipoVenta = $request->input('tipo_venta'); // 'minorista' o 'mayorista'
            $detallesParaInsertar = [];

            // 1. Procesamos los ítems del carrito
            foreach ($request->input('items') as $item) {
                $product = Product::findOrFail($item['product_id']);

                // 🛑 Regla de negocio: Verificar inventario usando tu columna 'stock_actual'
                if ($product->stock_actual < $item['cantidad']) {
                    throw new HttpException(422, "Stock insuficiente para el producto: {$product->nombre}");
                }

                // 🚀 ASIGNACIÓN DINÁMICA DE PRECIO SEGÚN EL TIPO DE VENTA
                $precioUnitario = ($tipoVenta === 'mayorista')
                    ? $product->precio_mayorista
                    : $product->precio_minorista;

                $descuento = $item['descuento'] ?? 0;

                // Matemática por ítem
                $subtotalItem = ($precioUnitario * $item['cantidad']) - $descuento;
                $subtotalAcumulado += $subtotalItem;

                // 🇵🇪 CÁLCULO TRADICIONAL DE IMPUESTOS (IGV 18%)
                // Si el producto está afecto, acumulamos su porción de IGV
                if ($product->afecto_igv) {
                    $igvAcumulado += $subtotalItem * 0.18;
                }

                // Reducimos el inventario usando tu columna 'stock_actual'
                $product->decrement('stock_actual', $item['cantidad']);

                $detallesParaInsertar[] = [
                    'product_id'      => $product->id,
                    'cantidad'        => $item['cantidad'],
                    'precio_unitario' => $precioUnitario,
                    'descuento'       => $descuento,
                    'subtotal'        => $subtotalItem,
                    'estado'          => true,
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ];
            }

            // Total global es la suma del subtotal neto más los impuestos correspondientes
            $totalCalculado = $subtotalAcumulado + $igvAcumulado;

            // Generación de Correlativo secuencial automático
            $ultimoCorrelativo = Sale::where('serie', $request->input('serie'))
                ->latest('id')
                ->value('correlativo');

            $nuevoCorrelativo = $ultimoCorrelativo
                ? str_pad((int)$ultimoCorrelativo + 1, 10, '0', STR_PAD_LEFT)
                : '0000000001';

            // Persistencia de la Venta
            $sale = Sale::create([
                'customer_id'      => $request->input('customer_id'),
                'user_id'          => $request->input('user_id'),
                'tipo_venta'       => $tipoVenta,
                'tipo_comprobante' => $request->input('tipo_comprobante'),
                'serie'            => $request->input('serie'),
                'correlativo'      => $nuevoCorrelativo,
                'subtotal'         => $subtotalAcumulado,
                'igv'              => $igvAcumulado,
                'total'            => $totalCalculado,
                'metodo_pago'      => $request->input('metodo_pago'),
                'estado_pago'      => $request->input('estado_pago'),
                'fecha_venta'      => now()->format('Y-m-d H:i:s'),
                'estado'           => true,
            ]);

            // Inserción masiva indexada de los detalles
            foreach ($detallesParaInsertar as &$detalle) {
                $detalle['sale_id'] = $sale->id;
            }

            SaleDetail::insert($detallesParaInsertar);

            return new SaleResource($sale->load(['customer', 'user', 'details.product']));
        });
    }

    public function show(Request $request, Sale $sale)
    {
        return new SaleResource($sale);
    }

    public function destroy(Request $request, Sale $sale)
    {
        $sale->delete();

        return response()->noContent();
    }
}
