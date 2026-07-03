<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'supplier_id' => $this->supplier_id,
            'tipo_comprobante' => $this->tipo_comprobante,
            'serie' => $this->serie,
            'numero' => $this->numero,
            'fecha_emision' => $this->fecha_emision,
            'subtotal' => $this->subtotal,
            'igv' => $this->igv,
            'total' => $this->total,
            'estado' => $this->estado,
        ];
    }
}
