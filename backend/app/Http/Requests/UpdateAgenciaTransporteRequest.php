<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAgenciaTransporteRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'nombre'   => 'required|string|max:255',
            'ruc_dni'  => 'nullable|string|max:20',
            'telefono' => 'nullable|string|max:20',
        ];
    }
}