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
            $response = Http::withHeaders(['User-Agent' => 'CafetalERP/1.0'])
                ->timeout(5)
                ->get('https://nominatim.openstreetmap.org/search', [
                    'q'      => $query,
                    'format' => 'json',
                    'limit'  => 1,
                ]);

            if ($response->successful() && count($response->json()) > 0) {
                $data = $response->json()[0];
                return [
                    'latitud'  => (float) $data['lat'],
                    'longitud' => (float) $data['lon'],
                ];
            }
        } catch (\Exception $e) {
            Log::error('Geocoding error: ' . $e->getMessage());
        }

        return null;
    }

    
}