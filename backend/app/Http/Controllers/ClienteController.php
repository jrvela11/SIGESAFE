<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Http\Requests\StoreClienteRequest;
use App\Http\Requests\UpdateClienteRequest;
use App\Http\Resources\ClienteResource;
use Illuminate\Http\JsonResponse;
use App\Services\GeocodingService;

class ClienteController extends Controller
{
    public function index(): JsonResponse
    {
        $clientes = Cliente::withTrashed()->orderBy('id', 'desc')->get();
        return response()->json([
            'success' => true,
            'data'    => ClienteResource::collection($clientes),
        ]);
    }

    public function store(StoreClienteRequest $request): JsonResponse
    {
        $cliente = Cliente::create($request->validated());
        return response()->json([
            'success' => true,
            'message' => 'Cliente creado con éxito.',
            'data'    => new ClienteResource($cliente),
        ], 201);
    }

    public function show(Cliente $cliente): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => new ClienteResource($cliente),
        ]);
    }

    public function update(UpdateClienteRequest $request, Cliente $cliente): JsonResponse
    {
        $cliente->update($request->validated());
        return response()->json([
            'success' => true,
            'message' => 'Cliente actualizado con éxito.',
            'data'    => new ClienteResource($cliente),
        ]);
    }

    public function destroy(Cliente $cliente): JsonResponse
    {
        $cliente->estado = false;
        $cliente->save();
        $cliente->delete(); // soft delete

        return response()->json([
            'success' => true,
            'message' => 'Cliente desactivado correctamente.',
        ]);
    }

    public function restaurar(int $id): JsonResponse
    {
        $cliente = Cliente::withTrashed()->findOrFail($id);
        $cliente->restore();
        $cliente->estado = true;
        $cliente->save();

        return response()->json([
            'success' => true,
            'message' => 'Cliente reactivado con éxito.',
        ]);
    }

    public function mapa(): JsonResponse
    {
        $clientes = Cliente::where('estado', true)
            ->where(function ($q) {
                $q->whereNotNull('departamento')
                ->orWhereNotNull('provincia')
                ->orWhereNotNull('distrito');
            })
            ->get(['id', 'nombre', 'apellido', 'direccion', 'distrito', 'provincia', 'departamento']);

        $geocoding = app(GeocodingService::class);

        $data = $clientes->map(function ($cliente) use ($geocoding) {
            $direccion = collect([
                $cliente->distrito,
                $cliente->provincia,
                $cliente->departamento,
            ])->filter()->implode(', ');

            $coords = null;
            if (!empty($direccion)) {
                $coords = $geocoding->obtenerCoordenadas($direccion);
            }

            return [
                'id'              => $cliente->id,
                'nombre_completo' => $cliente->nombre_completo,
                'direccion'       => $cliente->direccion,
                'distrito'        => $cliente->distrito,
                'provincia'       => $cliente->provincia,
                'departamento'    => $cliente->departamento,
                'latitud'         => $coords ? $coords['latitud'] : null,
                'longitud'        => $coords ? $coords['longitud'] : null,
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => $data,
        ]);
    }

    public function ubicacion(Cliente $cliente): JsonResponse
    {
        $direccion = collect([
            $cliente->distrito,
            $cliente->provincia,
            $cliente->departamento,
        ])->filter()->implode(', ');

        if (empty($direccion)) {
            return response()->json(['success' => false, 'message' => 'El cliente no tiene datos de ubicación.']);
        }

        $coords = app(GeocodingService::class)->obtenerCoordenadas($direccion);

        if ($coords) {
            return response()->json([
                'success' => true,
                'data' => [
                    'latitud'  => $coords['latitud'],
                    'longitud' => $coords['longitud'],
                    'cliente'  => [
                        'id'              => $cliente->id,
                        'nombre_completo' => $cliente->nombre_completo,
                        'direccion'       => $cliente->direccion,
                        'distrito'        => $cliente->distrito,
                        'provincia'       => $cliente->provincia,
                        'departamento'    => $cliente->departamento,
                    ]
                ]
            ]);
        }

        return response()->json(['success' => false, 'message' => 'No se pudo geolocalizar la ubicación.']);
    }

    public function agrupados(): \Illuminate\Http\JsonResponse
    {
        // Traemos todos los clientes con su conteo de ventas
        $clientes = Cliente::withCount('ventas')
            ->where('estado', true)
            ->whereNotNull('departamento')
            ->get();

        // Agrupar por departamento
        $agrupados = $clientes->groupBy('departamento')->map(function ($items, $dep) {
            return [
                'departamento' => $dep,
                'cantidad' => $items->count(),
                'detalles' => $items->map(function($i) {
                    return [
                        'id' => $i->id,
                        'nombre' => $i->nombre_completo ?? trim($i->nombre . ' ' . $i->apellido),
                        'transacciones' => $i->ventas_count ?? 0,
                        'direccion' => $i->direccion
                    ];
                })->sortByDesc('transacciones')->values()->toArray(),
            ];
        })->values();

        $geocoding = app(\App\Services\GeocodingService::class);
        $resultado = [];

        foreach ($agrupados as $grupo) {
            $coords = $geocoding->obtenerCoordenadas($grupo['departamento'] . ', Perú');
            $resultado[] = [
                'departamento' => $grupo['departamento'],
                'cantidad'     => $grupo['cantidad'],
                'detalles'     => $grupo['detalles'],
                'latitud'      => $coords ? $coords['latitud'] : null,
                'longitud'     => $coords ? $coords['longitud'] : null,
            ];
        }

        return response()->json([
            'success' => true,
            'data'    => $resultado,
        ]);
    }
}