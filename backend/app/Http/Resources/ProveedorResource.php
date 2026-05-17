<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProveedorResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'tipo_documento'   => $this->tipo_documento,
            'numero_documento' => $this->numero_documento,
            'razon_social'     => $this->razon_social,
            'nombre_completo'  => $this->nombre_completo,
            'contacto'         => $this->contacto,
            'telefono'         => $this->telefono,
            'direccion'        => $this->direccion,
            'region'           => $this->region,
            'distrito'         => $this->distrito,
            'provincia'        => $this->provincia,
            'departamento'     => $this->departamento,
            'estado'           => $this->estado,
            'created_at'       => $this->created_at,
        ];
    }
}