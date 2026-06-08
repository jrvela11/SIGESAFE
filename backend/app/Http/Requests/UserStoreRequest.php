<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string'],
            'email' => ['required', 'email', 'unique:users,email'],
            'email_verified_at' => ['nullable'],
            'password' => ['required', 'string'],
            'role' => ['required', 'string', 'max:50'],
            'is_active' => ['required'],
            'remember_token' => ['nullable', 'string', 'max:100'],
        ];
    }
}
