<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeocodingService
{
    public function obtenerCoordenadas(string $direccion): ?array
    {
        $query = trim($direccion);
        if (empty($query)) return null;

        try {
            $response = Http::withHeaders([
                'User-Agent' => 'CafetalERP/1.0',
                'Accept' => 'application/json'
            ])
                ->timeout(5)
                ->get('https://nominatim.openstreetmap.org/search', [
                    'q'      => $query,
                    'format' => 'json',
                    'limit'  => 1,
                ]);

            $json = $response->json();


            if ($response->successful() && is_array($json) && count($json) > 0 && isset($json[0]['lat'])) {
                return [
                    'latitud'  => (float) $json[0]['lat'],
                    'longitud' => (float) $json[0]['lon'],
                ];
            }
        } catch (\Exception $e) {
            Log::error('Geocoding error: ' . $e->getMessage());
        }

        return null; // Si falla, devuelve null silenciosamente sin romper el servidor
    }
}