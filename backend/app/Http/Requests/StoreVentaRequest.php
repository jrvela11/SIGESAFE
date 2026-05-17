<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVentaRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'cliente_id' => 'nullable|exists:clientes,id',
            'tipo_venta' => 'required|in:minorista,mayorista',
            'tipo_comprobante' => 'required|in:Factura,Boleta,Nota de Venta',
            'serie' => 'required|string|size:4', 
            'metodo_pago' => 'required|string',
            
            // Validamos que envíen al menos un producto
            'detalles' => 'required|array|min:1',
            'detalles.*.producto_id' => 'required|exists:productos,id',
            'detalles.*.cantidad' => 'required|numeric|min:0.01',
            'detalles.*.precio_unitario' => 'required|numeric|min:0',
            'detalles.*.descuento' => 'nullable|numeric|min:0',
        ];
    }
}