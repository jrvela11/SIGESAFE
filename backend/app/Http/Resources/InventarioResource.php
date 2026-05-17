<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventarioResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'producto' => $this->producto->nombre ?? 'N/A',
            'proveedor' => $this->proveedor->razon_social ?? 'N/A',
            'codigo_lote' => $this->codigo_lote,
            'cantidad_inicial' => $this->cantidad_inicial,
            'cantidad_actual' => $this->cantidad_actual,
            'precio_compra' => $this->precio_compra,
            'fecha_ingreso' => $this->fecha_ingreso->format('d/m/Y'),
            'estado' => $this->estado,
        ];
    }
}