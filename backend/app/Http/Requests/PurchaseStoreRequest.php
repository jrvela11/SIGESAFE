<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PurchaseStoreRequest extends FormRequest
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
            'supplier_id'      => ['required', 'exists:suppliers,id'],
            'tipo_comprobante' => ['required', 'string', 'max:50'],
            'serie'            => ['nullable', 'string', 'max:20'],
            'numero'           => ['required', 'string', 'max:50'],
            'metodo_pago'      => ['required', 'string'],
            'fecha_emision'    => ['nullable', 'date'],

            // Validar la estructura del payload transaccional (El array de items)
            'items'                  => ['required', 'array', 'min:1'],
            'items.*.product_id'     => ['required', 'exists:products,id'],
            'items.*.cantidad'       => ['required', 'numeric', 'gt:0'],
            'items.*.precio_compra'  => ['nullable', 'numeric', 'gte:0'],
        ];
    }
}
