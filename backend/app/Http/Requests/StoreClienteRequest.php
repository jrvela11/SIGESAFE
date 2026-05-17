<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreClienteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tipo_documento' => 'nullable|in:DNI,RUC,CE,Pasaporte',
            'numero_documento' => [
                'nullable',
                'string',
                'max:20',
                function ($attribute, $value, $fail) {
                    $tipo = $this->input('tipo_documento');
                    if ($tipo === 'DNI' && (!preg_match('/^\d{8}$/', $value))) {
                        $fail('El DNI debe tener 8 dígitos.');
                    }
                    if ($tipo === 'RUC' && (!preg_match('/^\d{11}$/', $value))) {
                        $fail('El RUC debe tener 11 dígitos.');
                    }
                },
            ],
            'nombre' => 'required|string|max:100',
            'apellido' => 'nullable|string|max:100',
            'email' => 'nullable|email|unique:clientes,email',
            'telefono' => [
                'nullable',
                'string',
                'max:9',
                function ($attribute, $value, $fail) {
                    if ($value && (!preg_match('/^9\d{8}$/', $value))) {
                        $fail('El celular debe tener 9 dígitos y empezar con 9.');
                    }
                },
            ],
            'direccion' => 'nullable|string|max:255',
            'estado' => 'boolean',
            'distrito'      => 'nullable|string|max:100',
            'provincia'     => 'nullable|string|max:100',
            'departamento'  => 'nullable|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre o razón social es obligatorio.',
            'email.unique' => 'Este correo ya está registrado en otro cliente.',
        ];
    }
}