<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DecolectaService
{
    protected string $baseUrl;
    protected string $token;

    public function __construct()
    {
        $this->baseUrl = config('services.decolecta.base_url');
        $this->token   = config('services.decolecta.token');
    }

    /**
     * Consulta un documento y devuelve los datos mapeados.
     */
    public function consultar(string $tipo, string $numero): ?array
    {
        $endpoint = $this->obtenerEndpoint($tipo, $numero);
        if (!$endpoint) {
            Log::warning("Tipo de documento no soportado: {$tipo}");
            return null;
        }

        try {
            $response = Http::withToken($this->token)
                ->timeout(10)
                ->get($endpoint);

            Log::debug('Decolecta API response', [
                'url'    => $endpoint,
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);

            if ($response->successful()) {
                return $this->mapearRespuesta($tipo, $response->json());
            }

            Log::error('Decolecta API falló', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
        } catch (\Exception $e) {
            Log::error('Excepción consulta Decolecta: ' . $e->getMessage());
        }

        return null;
    }

    /**
     * Construye la URL según el tipo de documento.
     */
    protected function obtenerEndpoint(string $tipo, string $numero): ?string
    {
        $numero = trim($numero);

        return match ($tipo) {
            'dni' => "{$this->baseUrl}/reniec/dni?numero={$numero}",
            'ruc' => "{$this->baseUrl}/sunat/ruc?numero={$numero}",
            default => null,
        };
    }

    /**
     * Mapea la respuesta cruda de la API al formato que espera el frontend.
     */
    protected function mapearRespuesta(string $tipo, array $data): array
    {
        if ($tipo === 'dni') {
            return [
                'nombre'    => $data['nombres'] ?? $data['nombre'] ?? '',
                'apellido'  => trim(($data['apellidoPaterno'] ?? '') . ' ' . ($data['apellidoMaterno'] ?? '')),
                'direccion' => $data['direccion'] ?? '',
            ];
        }

        // RUC
        return [
            'nombre'    => $data['razonSocial'] ?? $data['nombre'] ?? '',
            'apellido'  => '',
            'direccion' => $data['direccion'] ?? '',
        ];
    }
}