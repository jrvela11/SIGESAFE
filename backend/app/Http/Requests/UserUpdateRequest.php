<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('user')?->id ?? $this->route('user');

        return [
            'name' => ['required', 'string'],
            'email' => ['required', 'email', 'unique:users,email,' . $userId],
            'password' => ['nullable', 'string'],
            // AQUÍ: Restringimos estrictamente a los 4 roles definidos
            'role' => ['required', 'string', 'in:admin,vendedor,comprador,motorizado'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}