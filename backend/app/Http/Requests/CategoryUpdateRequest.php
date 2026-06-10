<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @bodyParam nombre string required Nombre actualizado de la categoría agrícola. Example: Derivados de Cacao Fino de Aroma
 * @bodyParam descripcion string Especificaciones modificadas sobre el alcance o tipo de subproductos. Example: Coberturas de chocolate, pasta pura de cacao, bombones y subproductos para exportación.
 * @bodyParam estado boolean required Estado operativo actual del registro en el catálogo. Example: true
 */
class CategoryUpdateRequest extends FormRequest
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
            // Nombre actualizado de la categoría agrícola. @example Derivados de Cacao Fino de Aroma
            'nombre' => ['required', 'string', 'max:100'],

            // Descripción modificada sobre el alcance o tipo de subproductos. @status optional @example Coberturas de chocolate, pasta pura de cacao, bombones y subproductos para exportación.
            'descripcion' => ['nullable', 'string'],

            // Estado operativo actual del registro en el catálogo. @example true
            'estado' => ['required', 'boolean'],
        ];
    }
}
