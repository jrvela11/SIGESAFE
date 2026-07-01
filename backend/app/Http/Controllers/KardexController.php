<?php

namespace App\Http\Controllers;

use App\Models\InventoryMovement;
use Illuminate\Http\Request;

class KardexController extends Controller
{
    public function index(Request $request)
    {
        // Traemos todos los movimientos con su producto asociado, ordenados del más antiguo al más nuevo
        $movements = InventoryMovement::with(['inventory.product'])
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($mov) {
                return [
                    'id' => $mov->id,
                    'product_id' => $mov->inventory->product_id ?? null,
                    'producto' => $mov->inventory->product->nombre ?? 'Producto Desconocido',
                    'tipo' => $mov->tipo,
                    'cantidad' => (float) $mov->cantidad,
                    'descripcion' => $mov->descripcion,
                    'fecha' => $mov->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $movements
        ]);
    }
}