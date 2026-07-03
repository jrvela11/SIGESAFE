<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class KardexController extends Controller
{
    public function index(Request $request)
    {
        // Usamos joins directos de SQL para evitar errores de relaciones en los modelos
        $movements = DB::table('inventory_movements')
            ->join('inventories', 'inventory_movements.inventory_id', '=', 'inventories.id')
            ->join('products', 'inventories.product_id', '=', 'products.id')
            ->select(
                'inventory_movements.id',
                'products.id as product_id',
                'products.nombre as producto',
                'inventory_movements.tipo',
                'inventory_movements.cantidad',
                'inventory_movements.descripcion',
                'inventory_movements.created_at'
            )
            ->orderBy('inventory_movements.created_at', 'asc')
            ->get()
            ->map(function ($mov) {
                return [
                    'id' => $mov->id,
                    'product_id' => $mov->product_id,
                    'producto' => $mov->producto,
                    'tipo' => $mov->tipo,
                    'cantidad' => (float) $mov->cantidad,
                    'descripcion' => $mov->descripcion,
                    // Formateamos la fecha de forma segura
                    'fecha' => $mov->created_at ? date('Y-m-d H:i:s', strtotime($mov->created_at)) : 'Sin fecha',
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $movements
        ]);
    }
}