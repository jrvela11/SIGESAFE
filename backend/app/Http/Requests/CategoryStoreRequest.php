<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Get the validation rules that apply to the request.
 *
 * @bodyParam nombre string required Nombre de la categoría de la industria agrícola. Example: Café Especial de Altura
 * @bodyParam descripcion string Especificaciones del tipo de grano o derivados. Example: Variedades de café pergamino y derivados de cacao.
 * @bodyParam estado boolean required Define si la categoría está activa para el catálogo. Example: true
 */
class CategoryStoreRequest extends FormRequest
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
            'nombre'      => ['required', 'string', 'max:100'],
            'descripcion' => ['nullable', 'string'],
            'estado'      => ['required', 'boolean'],
        ];
    }
}
