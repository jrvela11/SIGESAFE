<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InvoiceStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Cambiar a true para permitir que cualquier usuario autenticado use este Request
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Relaciones con tus tablas existentes en inglés
            'cliente_id'       => 'required|exists:customers,id',
            'sale_id'           => 'required|exists:sales,id',

            // Validaciones del Comprobante Fiscal
            'tipo_comprobante' => 'required|string|in:01,03', // '01' = Factura, '03' = Boleta

            // La serie debe empezar con F o B seguido de exactamente 3 números (Ej: F001, B102)
            'serie'            => ['required', 'string', 'size:4', 'regex:/^[FB][0-9]{3}$/'],

            'moneda'           => 'nullable|string|size:3|in:PEN,USD',
            'fecha_vencimiento' => 'nullable|date|after_or_equal:today',

            // Validación de los ítems del detalle (Arreglo anidado)
            'detalles'                 => 'required|array|min:1',
            'detalles.*.product_id'    => 'required|exists:products,id',

            // Cantidad soporta hasta 3 decimales (Ej: 1.500 kg)
            'detalles.*.cantidad'       => 'required|numeric|min:0.001',

            // Precio unitario final cobrado en caja (Debe ser mayor o igual a cero)
            'detalles.*.precio_unitario' => 'required|numeric|min:0.00',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        // Traducimos los campos internos de los arreglos para que los mensajes de error sean amigables
        return [
            'customer_id'                => 'cliente',
            'sale_id'                    => 'venta',
            'tipo_comprobante'           => 'tipo de comprobante',
            'serie'                      => 'serie del comprobante',
            'detalles'                   => 'items del comprobante',
            'detalles.*.product_id'      => 'producto del detalle',
            'detalles.*.cantidad'        => 'cantidad del detalle',
            'detalles.*.precio_unitario' => 'precio unitario del detalle',
        ];
    }
}
