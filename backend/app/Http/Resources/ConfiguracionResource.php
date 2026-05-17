<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConfiguracionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'clave'       => $this->clave,
            'valor'       => $this->valor,
            'descripcion' => $this->descripcion,
            'updated_at'  => $this->updated_at,
        ];
    }
}