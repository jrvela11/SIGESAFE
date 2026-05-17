<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ConsultaDocumentoController extends Controller
{
    public function consultar(Request $request)
    {
        $request->validate([
            'tipo_documento' => 'required|in:DNI,RUC',
            'numero_documento' => 'required|string',
        ]);

        $tipo = strtolower($request->tipo_documento);
        $numero = $request->numero_documento;
        $token = config('services.decolecta.token');   // Asegúrate de tener esta clave en services.php

        if (empty($token)) {
            return response()->json([
                'success' => false,
                'message' => 'Token de Decolecta no configurado.',
            ]);
        }

        // Construir URL según tipo
        $url = $tipo === 'dni'
            ? "https://api.decolecta.com/v1/reniec/dni?numero={$numero}"
            : "https://api.decolecta.com/v1/sunat/ruc?numero={$numero}";

        try {
            $response = Http::withToken($token)
                ->timeout(10)
                ->get($url);

            Log::info('Decolecta API response', [
                'url'    => $url,
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);

            if ($response->successful()) {
                $data = $response->json();

                if ($tipo === 'dni') {
                $resultado = [
                    'nombre'    => $data['first_name'] ?? '',
                    'apellido'  => trim(($data['first_last_name'] ?? '') . ' ' . ($data['second_last_name'] ?? '')),
                    'direccion' => '',
                ];
            } else { // RUC
                $resultado = [
                    'nombre'       => $data['razon_social'] ?? '',
                    'apellido'     => '',
                    'direccion'    => $data['direccion'] ?? '',
                    'distrito'     => $data['distrito'] ?? '',
                    'provincia'    => $data['provincia'] ?? '',
                    'departamento' => $data['departamento'] ?? '',
                ];
            }

                return response()->json([
                    'success' => true,
                    'data'    => $resultado,
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Documento no encontrado o error en la consulta.',
            ]);
        } catch (\Exception $e) {
            Log::error('Error consulta Decolecta: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al comunicarse con la API.',
            ]);
        }
    }
}