<?php

namespace App\Http\Controllers;

use App\Models\Inventario;
use App\Models\Producto;
use App\Http\Requests\StoreInventarioRequest;
use App\Http\Resources\InventarioResource;
use Illuminate\Support\Facades\DB;

class InventarioController extends Controller
{
    public function index()
    {
        $inventarios = Inventario::with(['producto', 'proveedor'])
            ->where('estado', true)
            ->orderBy('fecha_ingreso', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => InventarioResource::collection($inventarios)
        ], 200);
    }

    public function store(StoreInventarioRequest $request)
    {
        try {
            DB::beginTransaction();

            $datos = $request->validated();
            
            $datos['cantidad_actual'] = $datos['cantidad_inicial'];

            $inventario = Inventario::create($datos);

            $producto = Producto::lockForUpdate()->findOrFail($datos['producto_id']);

            $producto->stock_actual += $datos['cantidad_inicial'];
            $producto->precio_compra = $datos['precio_compra']; 
            $producto->save();

            DB::commit();

            $inventario->load(['producto', 'proveedor']);

            return response()->json([
                'success' => true,
                'message' => 'Lote ingresado al almacén y stock actualizado.',
                'data' => new InventarioResource($inventario)
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al ingresar inventario: ' . $e->getMessage()
            ], 422);
        }
    }

    public function destroy(Inventario $inventario)
    {
        if ($inventario->cantidad_actual < $inventario->cantidad_inicial) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar un lote que ya tiene ventas registradas.'
            ], 403);
        }

        try {
            DB::beginTransaction();

            $producto = Producto::lockForUpdate()->find($inventario->producto_id);
            if ($producto) {
                $producto->stock_actual -= $inventario->cantidad_actual;
                $producto->save();
            }

            $inventario->update(['estado' => false]);
            $inventario->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Lote retirado y stock del catálogo ajustado.'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al retirar el lote.'
            ], 422);
        }
    }
}