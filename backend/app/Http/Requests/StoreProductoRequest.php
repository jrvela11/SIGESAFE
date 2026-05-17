<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductoRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            // Validamos que el ID exista en la columna 'id_categoria' de la tabla 'categorias'
            'categoria_id'     => 'required|exists:categorias,id_categoria',
            'sku'              => 'required|string|max:50|unique:productos,sku',
            'codigo_barras'    => 'nullable|string|max:50',
            'nombre'           => 'required|string|max:255',
            'descripcion'      => 'nullable|string',
            
            // Los precios y stock deben ser números positivos
            'precio_compra'    => 'required|numeric|min:0',
            'precio_minorista' => 'required|numeric|min:0',
            'precio_mayorista' => 'required|numeric|min:0',
            'afecto_igv'       => 'boolean',
            
            'unidad_medida'    => 'required|string|max:50',
            'stock_actual'     => 'required|numeric|min:0',
            'stock_minimo'     => 'required|numeric|min:0',
            
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'estado'           => 'boolean',
        ];
    }
}