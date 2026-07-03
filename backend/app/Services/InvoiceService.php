<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Exception;

class InvoiceService
{
    /**
     * Procesa y registra un comprobante electrónico completo (Boleta o Factura).
     *
     * @param array $data Datos estructurados de la cabecera y sus ítems
     * @return Invoice
     * @throws Exception
     */
    public function generate(array $data): Invoice
    {


        $serie = strtoupper($data['serie']);
        $tipoComprobante = $data['tipo_comprobante'];

        // 1. Resolver el correlativo fiscal de 8 dígitos de forma dinámica
        $ultimoNumero = Invoice::where('tipo_comprobante', $tipoComprobante)
            ->where('serie', $serie)
            ->latest('id')
            ->value('numero') ?? '00000000';

        $numeroCorrelativo = str_pad((int)$ultimoNumero + 1, 8, '0', STR_PAD_LEFT);

        // 2. Obtener los datos del cliente para el Snapshot inmutable
        $customer = Customer::findOrFail($data['customer_id']);

        $tipoDocFiscal = match ($customer->tipo_documento) {
            'DNI'   => '1',
            'RUC'   => '6',
            'CE'    => '4', // 🚀 Cambia "CE" por el código "4" que mide 1 carácter
            default => $customer->tipo_documento // Por si ya guardas '1' o '6'
        };

        $denominacion = $customer->razon_social
            ?? trim(($customer->nombre ?? '') . ' ' . ($customer->apellido ?? ''))
            ?? 'CLIENTE GENÉRICO';

        // 3. Crear la cabecera del Comprobante (Invoice)
        $invoice = Invoice::create([
            'cliente_id'               => $customer->id,
            'venta_id'                 => $data['sale_id'] ?? null, // Opcional por si es manual
            'tipo_comprobante'         => $tipoComprobante,
            'serie'                    => $serie,
            'numero'                   => $numeroCorrelativo,

            // SNAPSHOT INMUTABLE (Regla fiscal SUNAT)
            'cliente_tipo_documento'   => substr($tipoDocFiscal, 0, 1),
            'cliente_numero_documento' => $customer->ruc_dni ?? $customer->numero_documento,
            'cliente_denominacion'     => $denominacion,
            'cliente_direccion'        => $customer->direccion_fiscal ?? $customer->address,

            'moneda'                   => $data['moneda'] ?? 'PEN',
            'fecha_emision'            => now()->format('Y-m-d'),
            'fecha_vencimiento'        => $data['fecha_vencimiento'] ?? null,
            'aplica_ley_amazonia'      => true,
            'estado_sunat'             => 'PENDIENTE'
        ]);

        // 4. Registrar los detalles (InvoiceItems) calculando montos exonerados (Ley de Amazonía)
        $totalExoneradoAcumulado = 0;

        foreach ($data['detalles'] as $item) {
            $product = Product::findOrFail($item['product_id']);

            // Al estar exonerado en la Amazonía (SUNAT Tipo '20'): Valor = Precio
            $precioUnitario = $item['precio_unitario'];
            $valorUnitario  = $precioUnitario;
            $cantidad       = $item['cantidad'];

            $subtotal       = $cantidad * $valorUnitario;
            $totalLinea     = $subtotal;

            $totalExoneradoAcumulado += $totalLinea;

            // Creamos el ítem usando la relación del modelo
            $invoice->items()->create([
                'producto_id'         => $product->id,
                'codigo_producto'     => $product->codigo ?? $product->code,
                'descripcion'         => $product->nombre ?? $product->name,
                'unidad_medida'       => 'NIU',
                'cantidad'            => $cantidad,
                'valor_unitario'      => $valorUnitario,
                'precio_unitario'     => $precioUnitario,
                'tipo_afectacion_igv' => '20', // Exonerado - Op. Onerosa
                'porcentaje_igv'      => 0.00,
                'igv_linea'           => 0.00,
                'subtotal'            => $subtotal,
                'total'               => $totalLinea
            ]);
        }

        // 5. Actualizar los totales calculados en la cabecera
        $invoice->update([
            'total_op_gravada'   => 0.00,
            'total_op_exonerada' => $totalExoneradoAcumulado,
            'total_op_inafecta'  => 0.00,
            'total_igv'          => 0.00,
            'total_pagar'        => $totalExoneradoAcumulado
        ]);

        return $invoice;
    }
}
