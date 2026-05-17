<?php

namespace App\Http\Controllers;

use App\Models\Configuracion;
use App\Http\Requests\UpdateConfiguracionRequest;
use App\Http\Resources\ConfiguracionResource;
use Illuminate\Http\JsonResponse;

class ConfiguracionController extends Controller
{
    /**
     * Lista todas las configuraciones editables.
     */
    public function index(): JsonResponse
    {
        $configs = Configuracion::whereIn('clave', [
            'nombre_empresa',
            'ruc_empresa',
            'direccion_empresa',
            'telefono_empresa',
            'correo_empresa',
            'igv',
        ])->get();

        return response()->json([
            'success' => true,
            'data'    => ConfiguracionResource::collection($configs),
        ]);
    }

    /**
     * Actualiza múltiples configuraciones a la vez.
     */
    public function update(UpdateConfiguracionRequest $request): JsonResponse
    {
        $settings = $request->input('settings', []);

        foreach ($settings as $setting) {
            Configuracion::where('clave', $setting['clave'])
                ->update(['valor' => $setting['valor'] ?? '']);
        }

        // Devolvemos los datos actualizados
        $configs = Configuracion::whereIn('clave', array_column($settings, 'clave'))->get();

        return response()->json([
            'success' => true,
            'message' => 'Configuraciones actualizadas exitosamente.',
            'data'    => ConfiguracionResource::collection($configs),
        ]);
    }
}