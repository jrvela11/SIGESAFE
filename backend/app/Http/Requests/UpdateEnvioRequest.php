<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEnvioRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'agencia_transporte_id'   => 'nullable|exists:agencias_transporte,id',
            'tipo_envio'              => 'required|in:local,interregional',
            'numero_seguimiento'      => 'nullable|string|max:50',
            'repartidor_nombre'       => 'nullable|string|max:100',
            'direccion_destino'       => 'required|string|max:255',
            'costo_envio'             => 'required|numeric|min:0',
            'fecha_estimada_llegada'  => 'nullable|date',
        ];
    }
}