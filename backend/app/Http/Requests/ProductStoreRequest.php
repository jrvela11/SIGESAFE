<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @bodyParam category_id int required ID de la categoría asociada (Café, Cacao, Insumos). Example: 1
 * @bodyParam sku string required Código SKU único de control de inventario. Example: CAF-ORGA-QQ
 * @bodyParam codigo_barras string Código de barras internacional o interno. Example: 7501055304721
 * @bodyParam nombre string required Nombre comercial del producto agrícola o derivado. Example: Café Orgánico Lavado Grano Seco
 * @bodyParam descripcion string Detalles del perfil de taza, humedad o certificación. Example: Café con 84 puntos en taza, humedad al 12%, certificación Orgánica y Fairtrade.
 * @bodyParam precio_compra number required Costo de compra por unidad de medida. Example: 450.00
 * @bodyParam precio_minorista number required Precio de venta para consumo regular o local. Example: 600.00
 * @bodyParam precio_mayorista number required Precio de venta por volumen o exportación. Example: 530.00
 * @bodyParam afecto_igv boolean required Especifica si el producto está grabado con el IGV (18%). Example: false
 * @bodyParam unidad_medida string required Unidad de despacho del almacén (Saco 69kg, Quintal QQ, Unidad). Example: Quintal
 * @bodyParam stock_actual number required Stock físico actual en los almacenes de acopio. Example: 120.50
 * @bodyParam stock_minimo number required Umbral de alerta de reposición mínima en almacén. Example: 10.00
 * @bodyParam imagen_url string Ruta de la imagen del producto guardada en el storage. Example: imagen.jpg
 * @bodyParam estado boolean required Estado de disponibilidad del producto en el catálogo. Example: true
 */
class ProductStoreRequest extends FormRequest
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
            // ID de la categoría asociada (Café, Cacao, Insumos). @example 1
            'category_id' => ['required', 'integer', 'exists:categories,id'],

            // Código SKU único de control de inventario. @example CAF-ORGA-QQ
            'sku' => ['required', 'string', 'unique:products,sku'],

            // Código de barras internacional o interno. @status optional @example 7501055304721
            'codigo_barras' => ['nullable', 'string', 'max:50'],

            // Nombre comercial del producto agrícola o derivado. @example Café Orgánico Lavado Grano Seco
            'nombre' => ['required', 'string'],

            // Detalles del perfil de taza, humedad o certificación. @status optional @example Café con 84 puntos en taza, humedad al 12%, certificación Orgánica y Fairtrade.
            'descripcion' => ['nullable', 'string'],

            // Costo de compra por unidad de medida. @example 450.00
            'precio_compra' => ['required', 'numeric', 'min:0'],

            // Precio de venta para consumo regular o local. @example 600.00
            'precio_minorista' => ['required', 'numeric', 'min:0'],

            // Precio de venta por volumen o exportación. @example 530.00
            'precio_mayorista' => ['required', 'numeric', 'min:0'],

            // Especifica si el producto está grabado con el IGV (18%). @example false
            'afecto_igv' => ['required', 'boolean'],

            // Unidad de despacho del almacén (Saco 69kg, Quintal QQ, Unidad). @example Quintal
            'unidad_medida' => ['required', 'string'],

            // Stock físico actual en los almacenes de acopio. @example 120.50
            'stock_actual' => ['required', 'numeric', 'min:0'],

            // Umbral de alerta de reposición mínima en almacén. @example 10.00
            'stock_minimo' => ['required', 'numeric', 'min:0'],

            // Ruta de la imagen del producto guardada en el storage. @status optional @example https://sigesafe.edu.pe/storage/products/cafe-lavado.jpg
            'imagen_url' => ['nullable', 'string'],

            // Estado de disponibilidad del producto en el catálogo. @example true
            'estado' => ['required', 'boolean'],
        ];
    }
}
