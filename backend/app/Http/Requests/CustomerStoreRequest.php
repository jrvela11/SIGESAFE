<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @bodyParam tipo_documento string Tipo de documento de identidad oficial (DNI o RUC). Example: RUC
 * @bodyParam numero_documento string Número único identificador del cliente. Example: 20601234567
 * @bodyParam nombre string required Razón social o nombres del cliente. Example: Corporación de Café Amazonas S.A.C.
 * @bodyParam apellido string Apellidos completos (Aplica si es persona natural). Example: null
 * @bodyParam email string Correo electrónico corporativo o personal. Example: compras@cafeamazonas.com
 * @bodyParam telefono string Número telefónico de contacto. Example: 945678912
 * @bodyParam direccion string Dirección física fiscal o domiciliaria. Example: Av. Héroes del Cenepa Nro. 450
 * @bodyParam distrito string Distrito de ubicación de la operación. Example: Bagua
 * @bodyParam provincia string Provincia correspondiente. Example: Bagua
 * @bodyParam departamento string Departamento de origen. Example: Amazonas
 * @bodyParam estado boolean required Define si el cliente está apto para transacciones comerciales. Example: true
 */
class CustomerStoreRequest extends FormRequest
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
            // Tipo de documento de identidad oficial (DNI o RUC). @status optional @example RUC
            'tipo_documento' => ['nullable', 'string', 'max:20'],

            // Número único identificador del cliente. @status optional @example 20601234567
            'numero_documento' => ['nullable', 'string', 'max:20'],

            // Razón social o nombres del cliente. @example Corporación de Café Amazonas S.A.C.
            'nombre' => ['required', 'string', 'max:100'],

            // Apellidos completos (Aplica si es persona natural). @status optional @example null
            'apellido' => ['nullable', 'string', 'max:100'],

            // Correo electrónico corporativo o personal. @status optional @example compras@cafeamazonas.com
            'email' => ['nullable', 'email', 'unique:customers,email'],

            // Número telefónico de contacto. @status optional @example 945678912
            'telefono' => ['nullable', 'string', 'max:20'],

            // Dirección física fiscal o domiciliaria. @status optional @example Av. Héroes del Cenepa Nro. 450
            'direccion' => ['nullable', 'string'],

            // Distrito de ubicación de la operación. @status optional @example Bagua
            'distrito' => ['nullable', 'string', 'max:100'],

            // Provincia correspondiente. @status optional @example Bagua
            'provincia' => ['nullable', 'string', 'max:100'],

            // Departamento de origen. @status optional @example Amazonas
            'departamento' => ['nullable', 'string', 'max:100'],

            // Define si el cliente está apto para transacciones comerciales. @example true
            'estado' => ['required', 'boolean'],
        ];
    }
}
