<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmpleadoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id, // Puede ser null
            'nombres' => $this->nombres,
            'apellidos' => $this->apellidos,
            'nombre_completo' => $this->nombres . ' ' . $this->apellidos, // Facilitamos la vida al Frontend
            'tipo_documento' => $this->tipo_documento,
            'numero_documento' => $this->numero_documento,
            'telefono' => $this->telefono,
            'cargo' => $this->cargo,
            'estado' => $this->estado,
            
            'email_sistema'  => $this->user ? $this->user->email : 'Sin acceso al sistema',
            
            'created_at' => $this->created_at,
        ];
    }
}