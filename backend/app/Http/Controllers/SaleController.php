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
            $tipoVenta = $request->input('tipo_venta');

            // 1. Crear la cabecera de la venta primero para obtener el ID
            $serie = $request->input('serie');
            $ultimoCorrelativo = Sale::where('serie', $serie)->latest('id')->value('correlativo') ?? '0000000000';
            $nuevoCorrelativo = str_pad((int)$ultimoCorrelativo + 1, 10, '0', STR_PAD_LEFT);

            $sale = Sale::create([
                'customer_id'      => $request->input('customer_id'),
                'user_id'          => $request->input('user_id'),
                'tipo_venta'       => $tipoVenta,
                'tipo_comprobante' => $request->input('tipo_comprobante'),
                'serie'            => $serie,
                'correlativo'      => $nuevoCorrelativo,
                'subtotal'         => 0, // Se actualizará al final
                'igv'              => 0,
                'total'            => 0,
                'metodo_pago'      => $request->input('metodo_pago'),
                'estado_pago'      => $request->input('estado_pago'),
                'fecha_venta'      => now(),
            ]);

            foreach ($request->input('items') as $item) {
                $product = Product::findOrFail($item['product_id']);
                $cantidadRequerida = $item['cantidad'];

                if ($product->stock_actual < $cantidadRequerida) {
                    throw new \Exception("Stock insuficiente para: {$product->nombre}");
                }

                // 2. Crear el detalle de la venta (obtenemos el ID aquí)
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

                // 3. Lógica FIFO y registro en Kardex
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

                // 4. Actualizar stock global y acumuladores
                $product->decrement('stock_actual', $cantidadRequerida);
                $subtotalAcumulado += $subtotalItem;
                if ($product->afecto_igv) $igvAcumulado += ($subtotalItem * 0.18);
            }

            // 5. Actualizar totales de la cabecera
            $sale->update([
                'subtotal' => $subtotalAcumulado,
                'igv'      => $igvAcumulado,
                'total'    => $subtotalAcumulado + $igvAcumulado,
            ]);

            return new SaleResource($sale->load(['details.product']));
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
