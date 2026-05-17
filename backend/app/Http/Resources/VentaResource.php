<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VentaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'comprobante' => $this->tipo_comprobante . ' ' . $this->serie . '-' . $this->correlativo,
            'cliente' => $this->cliente ? $this->cliente->nombre_completo : 'Público General',
            'vendedor' => $this->vendedor->name ?? 'Sistema',
            'totales' => [
                'subtotal' => $this->subtotal,
                'igv' => $this->igv,
                'total' => $this->total,
            ],
            'metodo_pago' => $this->metodo_pago,
            'estado_pago' => $this->estado_pago,
            'fecha' => $this->fecha_venta->format('d/m/Y H:i'),
            // Cargamos los detalles si vienen en la consulta
            'detalles' => DetalleVentaResource::collection($this->whenLoaded('detalles')),
        ];
    }
}