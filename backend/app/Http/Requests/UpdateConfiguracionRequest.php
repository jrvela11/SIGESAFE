<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateConfiguracionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'settings'            => 'required|array',
            'settings.*.clave'    => 'required|string|exists:configuraciones,clave',
            'settings.*.valor'    => 'present|string|nullable',
        ];
    }

    public function messages(): array
    {
        return [
            'settings.*.clave.exists' => 'La configuración :input no existe.',
        ];
    }
}