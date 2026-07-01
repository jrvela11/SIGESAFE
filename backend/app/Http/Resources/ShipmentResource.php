<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShipmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sale_id' => $this->sale_id,
            'carrier_id' => $this->carrier_id,
            'tipo_envio' => $this->tipo_envio,
            'numero_seguimiento' => $this->numero_seguimiento,
            'repartidor_nombre' => $this->repartidor_nombre,
            'direccion_destino' => $this->direccion_destino,
            'costo_envio' => $this->costo_envio,
            'fecha_estimada_llegada' => $this->fecha_estimada_llegada,
            'estado_actual' => $this->estado_actual,
            'tracking_metadata' => $this->tracking_metadata,
            'estado' => $this->estado,
        ];
    }
}
