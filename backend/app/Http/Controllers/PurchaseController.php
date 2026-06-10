<?php

namespace App\Http\Controllers;

use App\Http\Requests\PurchaseStoreRequest;
use App\Http\Requests\PurchaseUpdateRequest;
use App\Http\Resources\PurchaseCollection;
use App\Http\Resources\PurchaseResource;
use App\Models\Inventory;
use App\Models\InventoryMovement;
use App\Models\Product;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class PurchaseController extends Controller
{
    public function index(Request $request)
    {
        // Eager loading para traer al proveedor junto con la compra
        $purchases = Purchase::with(['supplier'])->orderBy('id', 'desc')->get();
        return new PurchaseCollection($purchases);
    }

    public function store(PurchaseStoreRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $subtotalAcumulado = 0;
            $igvAcumulado = 0;

            // 1. Crear la cabecera de la compra
            // Nota: Serie y número vienen directamente del comprobante físico del proveedor
            $serie = $request->input('serie');
            $numero = $request->input('numero');

            $purchase = Purchase::create([
                'supplier_id'      => $request->input('supplier_id'),
                'user_id'          => $request->input('user_id'), // Auditoría: Quién registró la compra
                'tipo_comprobante' => $request->input('tipo_comprobante'),
                'serie'            => $serie,
                'numero'           => $numero,
                'subtotal'         => 0, // Se actualizará al final
                'igv'              => 0,
                'total'            => 0,
                'metodo_pago'      => $request->input('metodo_pago'),
                'fecha_emision'    => $request->input('fecha_emision') ?? now(),
                'estado'           => true, // Activo / Procesado
            ]);

            foreach ($request->input('items') as $item) {
                $product = Product::findOrFail($item['product_id']);
                $cantidadComprada = $item['cantidad'];

                // Usamos el precio pactado en la compra; si no viene, usamos el precio_compra base del producto
                $precioCompra = $item['precio_compra'] ?? $product->precio_compra;
                $subtotalItem = $precioCompra * $cantidadComprada;

                // 2. Crear el detalle de la compra
                $purchaseDetail = $purchase->details()->create([
                    'product_id'    => $product->id,
                    'cantidad'      => $cantidadComprada,
                    'precio_compra' => $precioCompra,
                    'subtotal'      => $subtotalItem,
                ]);

                // 3. ENTRADA DE INVENTARIO: Crear el nuevo lote para este producto
                // 3. ENTRADA DE INVENTARIO: Crear el nuevo lote para este producto conforme a tu migración
                $inventory = Inventory::create([
                    'product_id'       => $product->id,
                    'proveedor_id'     => $purchase->supplier_id, // Usamos la columna real de tu tabla
                    'codigo_lote'      => "LOTE-{$serie}-{$numero}-P{$product->id}",
                    'cantidad_inicial' => $cantidadComprada,
                    'cantidad_actual'  => $cantidadComprada,
                    'precio_compra'    => $precioCompra,          // Nombre de columna real
                    'fecha_ingreso'    => $purchase->fecha_emision ?? now()->toDateString(), // Campo obligatorio
                    'estado'           => true,
                ]);

                // 4. REGISTRO EN KARDEX (Movimiento de Entrada)
                InventoryMovement::create([
                    'inventory_id'       => $inventory->id,
                    'purchase_detail_id' => $purchaseDetail->id, // Relación simétrica a sale_detail_id
                    'tipo'               => 'entrada',
                    'cantidad'           => $cantidadComprada,
                    'descripcion'        => "Compra {$purchase->tipo_comprobante} {$serie}-${numero} - Proveedor ID: {$purchase->supplier_id}",
                ]);

                // 5. Actualizar stock global del maestro de productos e incrementar acumuladores
                // Senior Tip: Opcionalmente puedes actualizar el 'precio_compra' base del producto aquí (Costo Promedio o Último Costo)
                $product->increment('stock_actual', $cantidadComprada);

                $subtotalAcumulado += $subtotalItem;
                if ($product->afecto_igv) {
                    $igvAcumulado += ($subtotalItem * 0.18);
                }
            }

            // 6. Actualizar totales de la cabecera de compra
            $purchase->update([
                'subtotal' => $subtotalAcumulado,
                'igv'      => $igvAcumulado,
                'total'    => $subtotalAcumulado + $igvAcumulado,
            ]);

            return new PurchaseResource($purchase->load(['details.product', 'supplier']));
        });
    }

    public function show(Request $request, Purchase $purchase)
    {
        return new PurchaseResource($purchase);
    }

    public function update(Request $request, Purchase $purchase)
    {
        // Cambiamos el estado a false (Anulada)
        $purchase->update([
            'estado' => $request->input('estado', false)
        ]);


        return new PurchaseResource($purchase);
    }

    public function destroy(Request $request, Purchase $purchase): Response
    {
        $purchase->delete();

        return response()->noContent();
    }
}
