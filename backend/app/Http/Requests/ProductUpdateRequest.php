<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductUpdateRequest extends FormRequest
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
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'sku' => ['required', 'string', 'unique:products,sku'],
            'codigo_barras' => ['nullable', 'string', 'max:50'],
            'nombre' => ['required', 'string'],
            'descripcion' => ['nullable', 'string'],
            'precio_compra' => ['required', 'numeric', 'between:-99999999.99,99999999.99'],
            'precio_minorista' => ['required', 'numeric', 'between:-99999999.99,99999999.99'],
            'precio_mayorista' => ['required', 'numeric', 'between:-99999999.99,99999999.99'],
            'afecto_igv' => ['required'],
            'unidad_medida' => ['required', 'string'],
            'stock_actual' => ['required', 'numeric', 'between:-99999999.99,99999999.99'],
            'stock_minimo' => ['required', 'numeric', 'between:-99999999.99,99999999.99'],
            'imagen_url' => ['nullable', 'string'],
            'estado' => ['required'],
        ];
    }
}
