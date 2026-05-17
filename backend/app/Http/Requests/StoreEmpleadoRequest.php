<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmpleadoRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'user_id'          => 'nullable|exists:users,id',
            'nombres'          => 'required|string|max:100',
            'apellidos'        => 'required|string|max:100',
            'tipo_documento'   => 'required|in:DNI,CE,Pasaporte',
            'numero_documento' => [
                'required',
                'string',
                'max:20',
                'unique:empleados,numero_documento',
                function ($attribute, $value, $fail) {
                    $tipo = $this->input('tipo_documento');
                    if ($tipo === 'DNI' && !preg_match('/^\d{8}$/', $value)) {
                        $fail('El DNI debe tener 8 dígitos.');
                    }
                },
            ],
            'telefono'         => [
                'nullable',
                'string',
                'max:9',
                function ($attribute, $value, $fail) {
                    if ($value && !preg_match('/^9\d{8}$/', $value)) {
                        $fail('El celular debe tener 9 dígitos y empezar con 9.');
                    }
                },
            ],
            'cargo'            => 'required|string|max:100',
            'estado'           => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'nombres.required'           => 'El nombre es obligatorio.',
            'apellidos.required'         => 'Los apellidos son obligatorios.',
            'tipo_documento.required'    => 'El tipo de documento es obligatorio.',
            'numero_documento.required'  => 'El número de documento es obligatorio.',
            'numero_documento.unique'    => 'Este número de documento ya está registrado.',
            'cargo.required'             => 'El cargo es obligatorio.',
        ];
    }
}