<?php

namespace App\Http\Controllers;

use App\Models\Venta;
use App\Models\DetalleVenta;
use App\Models\Producto;
use App\Http\Requests\StoreVentaRequest;
use App\Http\Resources\VentaResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class VentaController extends Controller
{
    public function store(StoreVentaRequest $request)
    {
        try {
            // Iniciamos la transacción segura
            DB::beginTransaction();

            $datos = $request->validated();
            
            // 1. AUTO-GENERAR CORRELATIVO
            $ultimoComprobante = Venta::where('tipo_comprobante', $datos['tipo_comprobante'])
                                      ->where('serie', $datos['serie'])
                                      ->orderBy('correlativo', 'desc')
                                      ->first();
                                      
            $nuevoCorrelativo = $ultimoComprobante ? intval($ultimoComprobante->correlativo) + 1 : 1;
            // Formateamos a 8 ceros (Ej: 00000015) para cumplir con SUNAT
            $correlativoSunat = str_pad($nuevoCorrelativo, 8, '0', STR_PAD_LEFT);

            // 2. CREAR LA VENTA BASE (Con totales en 0 temporalmente)
            $venta = Venta::create([
                'cliente_id' => $datos['cliente_id'] ?? null,
                'user_id' => 1, // Cambiar por Auth::id() cuando tengas login
                'tipo_venta' => $datos['tipo_venta'],
                'tipo_comprobante' => $datos['tipo_comprobante'],
                'serie' => $datos['serie'],
                'correlativo' => $correlativoSunat,
                'subtotal' => 0,
                'igv' => 0,
                'total' => 0,
                'metodo_pago' => $datos['metodo_pago'],
                'fecha_venta' => now(),
            ]);

            $totalVenta = 0;
            $totalIgv = 0;

            // 3. PROCESAR DETALLES Y DESCONTAR STOCK
            foreach ($datos['detalles'] as $item) {
                $producto = Producto::lockForUpdate()->findOrFail($item['producto_id']);
                
                // Verificamos stock físico
                if ($producto->stock_actual < $item['cantidad']) {
                    throw new \Exception("Stock insuficiente para el producto: {$producto->nombre}. Stock actual: {$producto->stock_actual}");
                }

                // Descontar stock
                $producto->stock_actual -= $item['cantidad'];
                $producto->save();

                $descuento = $item['descuento'] ?? 0;
                $subtotalLinea = ($item['cantidad'] * $item['precio_unitario']) - $descuento;
                $totalVenta += $subtotalLinea;

                // Si el producto está afecto a IGV, calculamos (Subtotal = Base + IGV)
                // Fórmula SUNAT: Valor Venta = Total / 1.18
                if ($producto->afecto_igv) {
                    $baseImponible = $subtotalLinea / 1.18;
                    $igvLinea = $subtotalLinea - $baseImponible;
                    $totalIgv += $igvLinea;
                }

                DetalleVenta::create([
                    'venta_id' => $venta->id,
                    'producto_id' => $producto->id,
                    'cantidad' => $item['cantidad'],
                    'precio_unitario' => $item['precio_unitario'],
                    'descuento' => $descuento,
                    'subtotal' => $subtotalLinea,
                ]);
            }

            // 4. ACTUALIZAR TOTALES REALES DE LA VENTA
            $venta->update([
                'subtotal' => $totalVenta - $totalIgv,
                'igv' => $totalIgv,
                'total' => $totalVenta,
            ]);

            // Todo salió bien, guardamos los cambios en la BD
            DB::commit();

            // AQUÍ IRÁ LA LLAMADA A GREENTER EN EL FUTURO
            // $greenterService->emitir($venta);

            $venta->load(['cliente', 'vendedor', 'detalles.producto']);

            return response()->json([
                'success' => true,
                'message' => 'Venta registrada con éxito',
                'data' => new VentaResource($venta)
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la venta: ' . $e->getMessage()
            ], 422);
        }
    }

    public function index()
    {

        $ventas = Venta::with(['cliente', 'vendedor'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => VentaResource::collection($ventas)
        ], 200);
    }
}

