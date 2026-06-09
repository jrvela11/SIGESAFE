<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SaleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_id' => $this->customer_id,
            'user_id' => $this->user_id,
            'tipo_venta' => $this->tipo_venta,
            'tipo_comprobante' => $this->tipo_comprobante,
            'serie' => $this->serie,
            'correlativo' => $this->correlativo,
            'subtotal' => $this->subtotal,
            'igv' => $this->igv,
            'total' => $this->total,
            'metodo_pago' => $this->metodo_pago,
            'estado_pago' => $this->estado_pago,
            'fecha_venta' => $this->fecha_venta,
            'estado' => $this->estado,
        ];
    }
}
