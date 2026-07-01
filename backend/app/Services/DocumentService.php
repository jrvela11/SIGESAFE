<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DocumentService
{
    protected string $token;
    protected string $baseUrl;

    public function __construct()
    {
        $this->token = config('services.decolecta.token');
        $this->baseUrl = config('services.decolecta.base_url', 'https://api.decolecta.com/v1');

        if (empty($this->token)) {
            Log::warning('Token de api.decolecta.com no configurado en services.php');
        }
    }

    public function consultar(string $tipo, string $numero): ?array
    {
        $tipo = strtolower($tipo);
        $numero = trim($numero);

        $endpoint = $tipo === 'dni' ? 'reniec/dni' : 'sunat/ruc';

        try {
            $response = Http::withToken($this->token)
                ->timeout(10)
                ->get("{$this->baseUrl}/{$endpoint}", [
                    'numero' => $numero
                ]);
         
            if ($response->successful()) {
                $data = $response->json();

                // Si la API responde 200 pero viene con una estructura de error interna
                if (isset($data['success']) && !$data['success']) {
                    Log::warning("Decolecta no encontró el documento {$tipo}/{$numero}: " . ($data['message'] ?? ''));
                    return null;
                }

                return $this->mapearRespuesta($tipo, $data);
            }
        } catch (\Exception $e) {
            Log::error("Error consultando en Decolecta {$tipo}/{$numero}: " . $e->getMessage());
        }

        return null;
    }

    protected function mapearRespuesta(string $tipo, array $data): array
    {
        // 💡 Nota Senior: Decolecta suele envolver la data dentro de una llave 'data' o directo en la raíz.
        // Asumiendo que viene directo o normalizado, adaptamos el mapeo:
        $res = $data['data'] ?? $data;

        if ($tipo === 'dni') {
            return [
                // 💡 Mapeamos con las nuevas llaves que arrojó Decolecta:
                'nombre'       => $res['first_name'] ?? '',
                'apellido'     => trim(($res['first_last_name'] ?? '') . ' ' . ($res['second_last_name'] ?? '')),
                'direccion'    => $res['direccion'] ?? '',
                'distrito'     => $res['distrito'] ?? null,
                'provincia'    => $res['provincia'] ?? null,
                'departamento' => $res['departamento'] ?? null,
            ];
        }

        // RUC
        return [
            'razon_social'       => $res['razon_social'] ?? '',
            'direccion'    => $res['direccion'] !== '-' ? $res['direccion'] : '', // Limpia el guion si viene vacío
            'distrito'     => !empty($res['distrito']) ? $res['distrito'] : null,
            'provincia'    => !empty($res['provincia']) ? $res['provincia'] : null,
            'departamento' => !empty($res['departamento']) ? $res['departamento'] : null,

            // 💡 Bonus Senior: Agregamos estado y condición que son críticos para SUNAT
            'estado'       => $res['estado'] ?? null,    // "ACTIVO"
            'condicion'    => $res['condicion'] ?? null, // "HABIDO"
        ];
    }
}
