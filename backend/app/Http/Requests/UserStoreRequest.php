<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @bodyParam name string required Nombre completo del usuario o personal de la cooperativa. Example: Dante Ryuu
 * @bodyParam email string required Correo electrónico institucional para el acceso al sistema. Example: dryuu@sigesafe.edu.pe
 * @bodyParam password string required Contraseña de autenticación en texto plano (será encriptada en el backend). Example: password123
 * @bodyParam role string required Rol del usuario dentro del sistema (ej. administrador, vendedor, acopiador). Example: vendedor
 * @bodyParam is_active boolean required Define si el usuario tiene acceso permitido al panel administrativo. Example: true
 */
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
            // Nombre completo del usuario o personal de la cooperativa. @example Dante Ryuu
            'name' => ['required', 'string'],

            // Correo electrónico institucional para el acceso al sistema. @example dryuu@sigesafe.edu.pe
            'email' => ['required', 'email', 'unique:users,email'],

            // Contraseña de autenticación en texto plano (será encriptada en el backend). @example password123
            'password' => ['required', 'string'],

            // Rol del usuario dentro del sistema (ej. administrador, vendedor, acopiador). @example vendedor
            'role' => ['required', 'string', 'max:50'],

            // Define si el usuario tiene acceso permitido al panel administrativo. @example true
            'is_active' => ['required', 'boolean'],
        ];
    }
}
