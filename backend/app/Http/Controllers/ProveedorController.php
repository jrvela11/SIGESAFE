<?php

namespace App\Http\Controllers;

use App\Models\Proveedor;
use App\Http\Requests\StoreProveedorRequest;
use App\Http\Requests\UpdateProveedorRequest;
use App\Http\Resources\ProveedorResource;
use Illuminate\Http\JsonResponse;
use App\Services\GeocodingService;

class ProveedorController extends Controller
{
    public function index(): JsonResponse
    {
        $proveedores = Proveedor::withTrashed()->orderBy('id', 'desc')->get();

        return response()->json([
            'success' => true,
            'data'    => ProveedorResource::collection($proveedores),
        ]);
    }

    public function store(StoreProveedorRequest $request): JsonResponse
    {
        $proveedor = Proveedor::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Proveedor creado con éxito.',
            'data'    => new ProveedorResource($proveedor),
        ], 201);
    }

    public function show(Proveedor $proveedor): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => new ProveedorResource($proveedor),
        ]);
    }

    public function update(UpdateProveedorRequest $request, Proveedor $proveedor): JsonResponse
    {
        $proveedor->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Proveedor actualizado con éxito.',
            'data'    => new ProveedorResource($proveedor),
        ]);
    }

    public function destroy(Proveedor $proveedor): JsonResponse
    {
        $proveedor->estado = false;
        $proveedor->save();
        $proveedor->delete();

        return response()->json([
            'success' => true,
            'message' => 'Proveedor desactivado correctamente.',
        ]);
    }

    public function restaurar(int $id): JsonResponse
    {
        $proveedor = Proveedor::withTrashed()->findOrFail($id);
        $proveedor->restore();
        $proveedor->estado = true;
        $proveedor->save();

        return response()->json([
            'success' => true,
            'message' => 'Proveedor reactivado con éxito.',
        ]);
    }

    public function mapa(): JsonResponse
    {
        $proveedores = Proveedor::where('estado', true)
            ->where(function ($q) {
                $q->whereNotNull('departamento')
                ->orWhereNotNull('provincia')
                ->orWhereNotNull('distrito');
            })
            ->get(['id', 'razon_social', 'contacto', 'direccion', 'distrito', 'provincia', 'departamento']);

        $geocoding = app(GeocodingService::class);

        $data = $proveedores->map(function ($proveedor) use ($geocoding) {
            $direccion = collect([
                $proveedor->distrito,
                $proveedor->provincia,
                $proveedor->departamento,
            ])->filter()->implode(', ');

            $coords = null;
            if (!empty($direccion)) {
                $coords = $geocoding->obtenerCoordenadas($direccion);
            }

            return [
                'id'              => $proveedor->id,
                'razon_social'    => $proveedor->razon_social,
                'contacto'        => $proveedor->contacto,
                'direccion'       => $proveedor->direccion,
                'distrito'        => $proveedor->distrito,
                'provincia'       => $proveedor->provincia,
                'departamento'    => $proveedor->departamento,
                'latitud'         => $coords ? $coords['latitud'] : null,
                'longitud'        => $coords ? $coords['longitud'] : null,
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => $data,
        ]);
    }

    public function ubicacion(Proveedor $proveedor): JsonResponse
    {
        $direccion = collect([
            $proveedor->distrito,
            $proveedor->provincia,
            $proveedor->departamento,
        ])->filter()->implode(', ');

        if (empty($direccion)) {
            return response()->json(['success' => false, 'message' => 'El proveedor no tiene datos de ubicación.']);
        }

        $coords = app(GeocodingService::class)->obtenerCoordenadas($direccion);

        if ($coords) {
            return response()->json([
                'success' => true,
                'data' => [
                    'latitud'  => $coords['latitud'],
                    'longitud' => $coords['longitud'],
                    'proveedor'=> [
                        'id'             => $proveedor->id,
                        'razon_social'   => $proveedor->razon_social,
                        'contacto'       => $proveedor->contacto,
                        'direccion'      => $proveedor->direccion,
                        'distrito'       => $proveedor->distrito,
                        'provincia'      => $proveedor->provincia,
                        'departamento'   => $proveedor->departamento,
                    ]
                ]
            ]);
        }

        return response()->json(['success' => false, 'message' => 'No se pudo geolocalizar la ubicación.']);
    }

    public function agrupados(): \Illuminate\Http\JsonResponse
    {
        // Traemos todos los proveedores con su conteo de compras
        $proveedores = Proveedor::withCount('inventarios') 
            ->where('estado', true)
            ->whereNotNull('departamento')
            ->get();

        $agrupados = $proveedores->groupBy('departamento')->map(function ($items, $dep) {
            return [
                'departamento' => $dep,
                'cantidad' => $items->count(),
                'detalles' => $items->map(function($i) {
                    return [
                        'id' => $i->id,
                        'nombre' => $i->razon_social,
                        'transacciones' => $i->compras_count ?? 0,
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