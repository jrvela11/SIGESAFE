<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string'],
            // AQUÍ: Restringimos estrictamente a los 4 roles definidos
            'role' => ['required', 'string', 'in:admin,vendedor,comprador,motorizado'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}