<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ShipmentStoreRequest extends FormRequest
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
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            // 1. Forzamos enteros y verificamos la integridad referencial
            'sale_id' => ['required', 'integer', 'exists:sales,id'],
            'carrier_id' => ['required', 'integer', 'exists:carriers,id'],

            'tipo_envio' => ['required', 'in:bus,shalom,olva'],
            'numero_seguimiento' => ['nullable', 'string', 'max:100'],
            'repartidor_nombre' => ['nullable', 'string', 'max:255'],
            'direccion_destino' => ['required', 'string'],

            // 2. Controlamos valores monetarios coherentes (no negativos)
            'costo_envio' => ['required', 'numeric', 'min:0', 'max:99999999.99'],

            'fecha_estimada_llegada' => ['nullable', 'date'],
            'estado_actual' => ['required', 'string', 'max:50'],

            // 3. Cambiamos a array para estructurar los metadatos desde React o los Tests
            'tracking_metadata' => ['nullable', 'array'],

            'estado' => ['required', 'boolean'],
        ];
    }
}
