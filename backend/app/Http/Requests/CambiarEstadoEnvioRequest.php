<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CambiarEstadoEnvioRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'estado_actual' => 'required|in:preparando,en_agencia,en_transito,entregado',
            'ubicacion'     => 'nullable|string|max:255',
            'descripcion'   => 'nullable|string',
        ];
    }
}