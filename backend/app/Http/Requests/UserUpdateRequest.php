<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @bodyParam name string required Nombre completo actualizado del usuario. Example: Dante Ryuu
 * @bodyParam email string required Correo electrónico institucional (ignora el ID actual para permitir guardar sin cambiar el email). Example: dryuu@sigesafe.edu.pe
 * @bodyParam password string Nueva contraseña de acceso (dejar opcional/nullable suele ser la mejor práctica en actualizaciones). Example: nuevaContrasena123
 * @bodyParam role string required Rol del usuario dentro del sistema. Example: administrador
 * @bodyParam is_active boolean required Estado de habilitación del usuario en el panel. Example: true
 */
class UserUpdateRequest extends FormRequest
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
        // Extraemos el ID del usuario desde la ruta para evitar colisiones en el UNIQUE del email al actualizar
        $userId = $this->route('user')?->id ?? $this->route('user');

        return [
            // Nombre completo actualizado del usuario. @example Dante Ryuu
            'name' => ['required', 'string'],

            // Correo electrónico institucional (ignora el ID actual para permitir guardar sin cambiar el email). @example dryuu@sigesafe.edu.pe
            'email' => ['required', 'email', 'unique:users,email,' . $userId],

            // Nueva contraseña de acceso (dejar opcional/nullable suele ser la mejor práctica en actualizaciones). @status optional @example nuevaContrasena123
            'password' => ['nullable', 'string'],

            // Rol del usuario dentro del sistema. @example administrador
            'role' => ['required', 'string', 'max:50'],

            // Estado de habilitación del usuario en el panel. @example true
            'is_active' => ['required', 'boolean'],
        ];
    }
}
