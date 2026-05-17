<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DetalleVentaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'producto' => $this->producto->nombre ?? 'Producto Eliminado',
            'cantidad' => $this->cantidad,
            'precio_unitario' => $this->precio_unitario,
            'descuento' => $this->descuento,
            'subtotal' => $this->subtotal,
        ];
    }
}