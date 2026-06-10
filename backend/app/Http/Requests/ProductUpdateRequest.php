<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @bodyParam category_id int required ID de la categoría asociada. Example: 2
 * @bodyParam sku string required Código SKU único (ignora el ID del producto actual). Example: CACAO-CCN51-ST
 * @bodyParam codigo_barras string Código de barras opcional. Example: 7501055304851
 * @bodyParam nombre string required Nombre del producto agrícola. Example: Café Orgánico Tostado en Grano
 * @bodyParam descripcion string Descripción opcional del perfil. Example: Perfil de taza con notas a chocolate y frutos rojos, acidez media, origen Bagua Grande.
 * @bodyParam precio_compra number required Límites numéricos de compra. Example: 480.00
 * @bodyParam precio_minorista number required Límites numéricos minoristas. Example: 650.00
 * @bodyParam precio_mayorista number required Límites numéricos mayoristas. Example: 580.00
 * @bodyParam afecto_igv boolean required Indicador fiscal de IGV. Example: false
 * @bodyParam unidad_medida string required Unidad de empaque o venta. Example: Saco
 * @bodyParam stock_actual number required Control de stock actual. Example: 85.50
 * @bodyParam stock_minimo number required Alerta de stock mínimo. Example: 5.00
 * @bodyParam imagen file El nuevo archivo de imagen (si se desea reemplazar). Max: 2MB. Example: cafe-lavado.jpg
 * @bodyParam estado boolean required Estado del producto en el catálogo. Example: true
 */
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
        // Extraemos el ID del producto desde la ruta para evitar colisiones en el UNIQUE del SKU al actualizar
        $productId = $this->route('product')?->id ?? $this->route('product');

        return [
            'category_id' => ['required', 'integer', 'exists:categories,id'],

            // Ignoramos el ID del producto actual en la validación unique
            'sku' => ['required', 'string', 'unique:products,sku,' . $productId],

            // Código de barras opcional. @status optional @example 7501055304851
            'codigo_barras' => ['nullable', 'string', 'max:50'],

            // Nombre del producto agrícola. @example Café Orgánico Tostado en Grano
            'nombre' => ['required', 'string'],

            // Descripción opcional del perfil. @status optional @example Perfil de taza con notas a chocolate y frutos rojos, acidez media, origen Bagua Grande.
            'descripcion' => ['nullable', 'string'],

            // Límites numéricos de compra. @example 480.00
            'precio_compra' => ['required', 'numeric', 'between:-99999999.99,99999999.99'],

            // Límites numéricos minoristas. @example 650.00
            'precio_minorista' => ['required', 'numeric', 'between:-99999999.99,99999999.99'],

            // Límites numéricos mayoristas. @example 580.00
            'precio_mayorista' => ['required', 'numeric', 'between:-99999999.99,99999999.99'],

            // Indicador fiscal de IGV. @example false
            'afecto_igv' => ['required', 'boolean'],

            // Unidad de empaque o venta. @example Saco
            'unidad_medida' => ['required', 'string'],

            // Control de stock actual. @example 85.50
            'stock_actual' => ['required', 'numeric', 'between:-99999999.99,99999999.99'],

            // Alerta de stock mínimo. @example 5.00
            'stock_minimo' => ['required', 'numeric', 'between:-99999999.99,99999999.99'],

            // URL opcional de la imagen. @status optional @example https://sigesafe.edu.pe/storage/products/cafe-tostado.jpg
            'imagen'     => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:2048'],

            // Estado del producto en el catálogo. @example true
            'estado' => ['required', 'boolean'],
        ];
    }
}
