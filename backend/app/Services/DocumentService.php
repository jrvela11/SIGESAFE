<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DocumentService
{
    protected string $token;
    protected string $baseUrl = 'https://api.apis.net.pe/v1';

    public function __construct()
    {
        $this->token = config('services.apis_net_pe.token');
        if (empty($this->token)) {
            Log::warning('Token de apis.net.pe no configurado');
        }
    }

    public function consultar(string $tipo, string $numero): ?array
    {
        $tipo = strtolower($tipo) === 'dni' ? 'dni' : 'ruc';
        $numero = trim($numero);

        try {
            $response = Http::withToken($this->token)
                ->timeout(10)
                ->get("{$this->baseUrl}/{$tipo}/{$numero}");

            if ($response->successful()) {
                $data = $response->json();
                return $this->mapearRespuesta($tipo, $data);
            }
        } catch (\Exception $e) {
            Log::error("Error consultando documento {$tipo}/{$numero}: " . $e->getMessage());
        }

        return null;
    }

    protected function mapearRespuesta(string $tipo, array $data): array
    {
        if ($tipo === 'dni') {
            return [
                'nombre'   => $data['nombres'] ?? '',
                'apellido' => ($data['apellidoPaterno'] ?? '') . ' ' . ($data['apellidoMaterno'] ?? ''),
                'direccion'=> $data['direccion'] ?? '',
            ];
        }

        // RUC
        return [
            'nombre'   => $data['razonSocial'] ?? '',
            'apellido' => '', // Para empresas no hay apellido
            'direccion'=> $data['direccion'] ?? '',
        ];
    }
}