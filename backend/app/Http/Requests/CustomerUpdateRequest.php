<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @bodyParam tipo_documento string Tipo de documento de identidad oficial. Example: DNI
 * @bodyParam numero_documento string Número único identificador del cliente. Example: 45678912
 * @bodyParam nombre string required Nombres del productor o cliente. Example: Juan Alberto
 * @bodyParam apellido string Apellidos del productor o cliente. Example: Fernandez Delgado
 * @bodyParam email string Correo electrónico de contacto. Example: juan.fernandez@gmail.com
 * @bodyParam telefono string Número telefónico o celular. Example: 961234567
 * @bodyParam direccion string Dirección física o nombre de la finca cafetalera. Example: Sector El Parco - Finca La Victoria
 * @bodyParam distrito string Distrito de residencia o acopio. Example: Cajaruro
 * @bodyParam provincia string Provincia correspondiente. Example: Utcubamba
 * @bodyParam departamento string Departamento de origen. Example: Amazonas
 * @bodyParam estado boolean required Estado operativo del cliente. Example: true
 */
class CustomerUpdateRequest extends FormRequest
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
        // Extraemos el ID del cliente de la ruta de forma segura para evitar colisiones en el UNIQUE
        $customerId = $this->route('customer')?->id ?? $this->route('customer');

        return [
            // Tipo de documento de identidad oficial. @status optional @example DNI
            'tipo_documento' => ['nullable', 'string', 'max:20'],

            // Número único identificador del cliente. @status optional @example 45678912
            'numero_documento' => ['nullable', 'string', 'max:20'],

            // Nombres del productor o cliente. @example Juan Alberto
            'nombre' => ['required', 'string', 'max:100'],

            // Apellidos del productor o cliente. @status optional @example Fernandez Delgado
            'apellido' => ['nullable', 'string', 'max:100'],

            // Correo electrónico de contacto. @status optional @example juan.fernandez@gmail.com
            'email' => ['nullable', 'email', 'unique:customers,email,' . $customerId],

            // Número telefónico o celular. @status optional @example 961234567
            'telefono' => ['nullable', 'string', 'max:20'],

            // Dirección física o nombre de la finca cafetalera. @status optional @example Sector El Parco - Finca La Victoria
            'direccion' => ['nullable', 'string'],

            // Distrito de residencia o acopio. @status optional @example Cajaruro
            'distrito' => ['nullable', 'string', 'max:100'],

            // Provincia correspondiente. @status optional @example Utcubamba
            'provincia' => ['nullable', 'string', 'max:100'],

            // Departamento de origen. @status optional @example Amazonas
            'departamento' => ['nullable', 'string', 'max:100'],

            // Estado operativo del cliente. @example true
            'estado' => ['required', 'boolean'],
        ];
    }
}
