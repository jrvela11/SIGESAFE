<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HistorialSeguimientoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'envio_id'    => $this->envio_id,
            'estado'      => $this->estado,
            'ubicacion'   => $this->ubicacion,
            'descripcion' => $this->descripcion,
            'fecha'       => $this->created_at->toDateTimeString(),
        ];
    }
}