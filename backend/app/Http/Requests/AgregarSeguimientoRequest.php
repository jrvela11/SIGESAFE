<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AgregarSeguimientoRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'estado'       => 'required|string|max:50',
            'ubicacion'    => 'nullable|string|max:255',
            'descripcion'  => 'nullable|string',
        ];
    }
}