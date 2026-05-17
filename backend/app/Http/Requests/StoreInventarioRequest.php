<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInventarioRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'producto_id' => 'required|exists:productos,id',
            'proveedor_id' => 'required|exists:proveedores,id',
            'codigo_lote' => 'required|string|max:50|unique:inventarios,codigo_lote',
            'cantidad_inicial' => 'required|numeric|min:0.01',
            'precio_compra' => 'required|numeric|min:0',
            'fecha_ingreso' => 'required|date|before_or_equal:today',
        ];
    }
}