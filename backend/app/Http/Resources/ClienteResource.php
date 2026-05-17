<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClienteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'nombre'           => $this->nombre,
            'apellido'         => $this->apellido,
            'nombre_completo'  => $this->nombre_completo,
            'email'            => $this->email,
            'telefono'         => $this->telefono,
            'direccion'        => $this->direccion,
            'distrito'         => $this->distrito,
            'provincia'        => $this->provincia,
            'departamento'     => $this->departamento,
            'estado'           => $this->estado,
        ];
    }
}