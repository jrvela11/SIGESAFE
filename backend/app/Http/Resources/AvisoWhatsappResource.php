<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AvisoWhatsappResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'envio_id'        => $this->envio_id,
            'numero_telefono' => $this->numero_telefono,
            'tipo_mensaje'    => $this->tipo_mensaje,
            'estado_envio'    => $this->estado_envio,
        ];
    }
}