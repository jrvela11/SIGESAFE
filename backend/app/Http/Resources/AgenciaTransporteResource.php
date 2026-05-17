<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AgenciaTransporteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'       => $this->id,
            'nombre'   => $this->nombre,
            'ruc_dni'  => $this->ruc_dni,
            'telefono' => $this->telefono,
            'estado'   => $this->estado,
        ];
    }
}