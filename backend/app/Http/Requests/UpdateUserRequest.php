<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array {
        return [
            'name'        => 'required|string|max:255',
            'email'       => 'required|string|email|max:255|unique:users,email,' . $this->user->id,
            'password'    => 'nullable|string|min:8',
            'role'        => 'required|in:admin,vendedor,logistica,repartidor',
            'is_active'   => 'boolean',
            'empleado_id' => 'nullable|exists:empleados,id'
        ];
    }
}