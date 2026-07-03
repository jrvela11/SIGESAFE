<?php

namespace App\Services;

use App\Models\Invoice;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class SunatBillingService
{
    protected string $url;
    protected string $token;

    public function __construct()
    {
        $this->url = config('services.apis_peru.url');
        $this->token = config('services.apis_peru.token');
    }

    /**
     * Envía el comprobante a ApisPerú adaptado a las reglas de la Amazonía.
     */
    public function enviar(Invoice $invoice): array
    {
        // 1. Estructurar el payload exacto requerido por ApisPerú
        $payload = [
            'ublVersion'     => '2.1',
            'tipoOperacion'  => '0101', // Venta interna ordinaria
            'tipoDoc'        => $invoice->tipo_comprobante, // '01' o '03'
            'serie'          => $invoice->serie,
            'correlativo'    => (string)(int)$invoice->numero, // Quita los ceros a la izquierda para el correlativo de ApisPerú
            'fechaEmision'   => now()->toIso8601String(),
            'formaPago'      => [
                'moneda' => $invoice->moneda ?? 'PEN',
                'tipo'   => 'Contado'
            ],
            'tipoMoneda'     => $invoice->moneda ?? 'PEN',
            'client' => [
                'tipoDoc' => $invoice->cliente_tipo_documento, // '1' (DNI), '6' (RUC)
                'numDoc'  => $invoice->cliente_numero_documento,
                'rznSocial'=> $invoice->cliente_denominacion,
                'address' => [
                    'direccion' => $invoice->cliente_direccion ?? '-'
                ]
            ],
            // Los datos de tu empresa emisora configurados
            'company' => [
                'ruc'             => 10759566314, // 🛠️ CAMBIA POR TU RUC REAL
                'razonSocial'     => 'Comercializadora san felipe', 
                'nombreComercial' => 'Cafe y cacao san felipe',
                'address'         => [
                    'direccion' => 'Peca'
                ]
            ],
            
            // 🚀 REGLAS DE ORO: AMAZONÍA EXONERADA
            'mtoOperGravadas'    => 0,
            'mtoOperExoneradas'  => (float)$invoice->total_op_exonerada, // El dinero va aquí
            'mtoIGV'             => 0,
            'valorVenta'         => (float)$invoice->total_op_exonerada,
            'totalImpuestos'     => 0,
            'subTotal'           => (float)$invoice->total_pagar,
            'mtoImpVenta'        => (float)$invoice->total_pagar,
            
            'details' => $this->mapItems($invoice),
            'legends' => [
                [
                    'code' => '2001',
                    'value'=> 'BIENES TRANSFERIDOS EN LA AMAZONÍA PARA SER CONSUMIDOS EN LA MISMA'
                ]
            ]
        ];

        try {
            // 2. Ejecutar petición HTTP POST con el Bearer Token
            $response = Http::withToken($this->token)
                ->timeout(15) // Timeout prudente para servicios de SUNAT
                ->post("{$this->url}/invoice/send", $payload);

            if ($response->failed()) {
                Log::error('ApisPerú Error de Red o Servidor: ' . $response->body());
                throw new Exception('Error de comunicación con la pasarela de facturación.');
            }

            $data = $response->json();

            // 3. Evaluar la respuesta devuelta por ApisPerú/SUNAT
            if (isset($data['sunatResponse']) && $data['sunatResponse']['success'] === true) {
                $cdr = $data['sunatResponse']['cdrResponse'] ?? [];
                return [
                    'invoice_accepted' => $cdr['accepted'] ?? false,
                    'description'      => $cdr['description'] ?? 'Aceptado por SUNAT',
                    'xml'              => $data['xml'] ?? null,
                    'hash'             => $data['hash'] ?? null,
                    'cdr_zip'          => $data['sunatResponse']['cdrZip'] ?? null,
                ];
            }

            // Manejo cuando ApisPerú o SUNAT detectan un rechazo explícito o error de validación
            $errorMsg = $data['sunatResponse']['error']['message'] ?? 'Error desconocido en validación SUNAT.';
            return [
                'invoice_accepted' => false,
                'description'      => 'Rechazado: ' . $errorMsg,
                'xml'              => null,
                'hash'             => null,
                'cdr_zip'          => null,
            ];

        } catch (Exception $e) {
            Log::critical('Excepción al conectar con ApisPerú: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Mapea los ítems locales al formato específico de ApisPerú
     */
    private function mapItems(Invoice $invoice): array
    {
        $mapped = [];
        foreach ($invoice->items as $item) {
            $mapped[] = [
                'codProducto'      => $item->codigo_producto,
                'unidad'           => $item->unidad_medida ?? 'NIU',
                'descripcion'      => $item->descripcion,
                'cantidad'         => (float)$item->cantidad,
                'mtoValorUnitario' => (float)$item->valor_unitario,
                'mtoPrecioUnitario'=> (float)$item->precio_unitario,
                'mtoValorVenta'    => (float)$item->subtotal,
                'mtoBaseIgv'       => (float)$item->subtotal,
                'porcentajeIgv'    => 0,
                'mtoIgv'           => 0,
                'tipAfeIgv'        => '20', // Código oficial SUNAT: Exonerado - Operación Onerosa
                'totalImpuestos'   => 0
            ];
        }
        return $mapped;
    }
}