<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EnvioResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $venta = $this->venta;
        $cliente = $venta ? $venta->cliente : null;

        return [
            'id'                     => $this->id,
            'venta_id'               => $this->venta_id,
            'cliente_nombre'         => $cliente ? $cliente->nombre_completo : 'Público',
            'direccion_destino'      => $this->direccion_destino,
            'tipo_envio'             => $this->tipo_envio,
            'agencia'                => $this->agenciaTransporte ? new AgenciaTransporteResource($this->agenciaTransporte) : null,
            'numero_seguimiento'     => $this->numero_seguimiento,
            'repartidor_nombre'      => $this->repartidor_nombre,
            'costo_envio'            => $this->costo_envio,
            'fecha_estimada_llegada' => $this->fecha_estimada_llegada?->toDateString(),
            'estado_actual'          => $this->estado_actual,
            'estado'                 => $this->estado,
            'historial'              => HistorialSeguimientoResource::collection($this->whenLoaded('historial')),
        ];
    }
}
