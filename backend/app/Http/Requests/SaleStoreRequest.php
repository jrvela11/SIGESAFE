<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @bodyParam customer_id int ID único del cliente registrado. Example: 1
 * @bodyParam user_id int required ID del vendedor/usuario que procesa la operación. Example: 2
 * @bodyParam tipo_venta string required Canal de distribución o tarifa a aplicar al precio del producto. Example: mayorista
 * @bodyParam tipo_comprobante string required Comprobante emitido según SUNAT (BOLETA, FACTURA, TICKET). Example: FACTURA
 * @bodyParam serie string required Identificador del terminal o punto de venta física. Example: F001
 * @bodyParam metodo_pago string required Canal financiero de recepción del dinero (Efectivo, Depósito, Yape). Example: Depósito
 * @bodyParam estado_pago string required Control de flujo de caja de la venta (pagado, pendiente). Example: pagado
 * @bodyParam items object[] required Estructura indexada del carrito de compras (Despacho de café/cacao).
 * @bodyParam items[].product_id int required ID del producto agrícola en almacén. Example: 1
 * @bodyParam items[].cantidad number required Volumen físico o cantidad de sacos/quintales/kilos a despachar. Example: 15.50
 * @bodyParam items[].descuento number Deducción monetaria directa aplicable al ítem. Example: 0.00
 */
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
            // ID único del cliente registrado. Obligatorio si es Factura ('01')
            'customer_id'      => [
                $this->input('tipo_comprobante') === '01' ? 'required' : 'nullable',
                'integer',
                'exists:customers,id'
            ],

            // ID del vendedor/usuario que procesa la operación. @example 2
            'user_id'          => ['required', 'integer', 'exists:users,id'],

            // Canal de distribución o tarifa a aplicar al precio del producto. @example mayorista
            'tipo_venta'       => ['required', 'string', 'in:minorista,mayorista'],

            // 🚀 CAMBIO FISCAL: Códigos oficiales SUNAT ('01' = Factura, '03' = Boleta)
            'tipo_comprobante' => ['required', 'string', 'in:01,03'],

            // Identificador del terminal o punto de venta física. @example F001 o B001
            'serie'            => ['required', 'string', 'max:4'],

            // Canal financiero de recepción del dinero. @example Depósito
            'metodo_pago'      => ['required', 'string', 'max:255'],

            // Control de flujo de caja de la venta (pagado, pendiente). @example pagado
            'estado_pago'      => ['required', 'string', 'max:255'],

            // Estructura indexada del carrito de compras.
            'items'              => ['required', 'array', 'min:1'],

            // ID del producto agrícola en almacén. @example 1
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],

            // Volumen físico o cantidad de sacos/quintales/kilos a despachar. @example 15.50
            'items.*.cantidad'   => ['required', 'numeric', 'min:0.01'],

            // Deducción monetaria directa aplicable al ítem. @status optional @example 0.00
            'items.*.descuento'  => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
