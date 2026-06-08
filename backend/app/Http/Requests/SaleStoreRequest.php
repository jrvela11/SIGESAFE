<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SaleStoreRequest extends FormRequest
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
            'customer_id'      => ['nullable', 'integer', 'exists:customers,id'],
            'user_id'          => ['required', 'integer', 'exists:users,id'],
            'tipo_venta'       => ['required', 'string', 'in:minorista,mayorista'],
            'tipo_comprobante' => ['required', 'string', 'max:50'],
            'serie'            => ['required', 'string', 'max:4'],
            'metodo_pago'      => ['required', 'string', 'max:255'],
            'estado_pago'      => ['required', 'string', 'max:255'],

            // 🚀 NUEVO: Validación estricta para la estructura del Carrito de Compras
            'items'              => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.cantidad'   => ['required', 'numeric', 'min:0.01'],
            'items.*.descuento'  => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
