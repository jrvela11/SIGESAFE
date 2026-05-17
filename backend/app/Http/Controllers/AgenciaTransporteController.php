<?php

namespace App\Http\Controllers;

use App\Models\AgenciaTransporte;
use App\Http\Requests\StoreAgenciaTransporteRequest;
use App\Http\Requests\UpdateAgenciaTransporteRequest;
use App\Http\Resources\AgenciaTransporteResource;
use Illuminate\Http\JsonResponse;

class AgenciaTransporteController extends Controller
{
    public function index(): JsonResponse
    {
        $agencias = AgenciaTransporte::orderBy('nombre')->get();
        return response()->json([
            'success' => true,
            'data'    => AgenciaTransporteResource::collection($agencias),
        ]);
    }

    public function store(StoreAgenciaTransporteRequest $request): JsonResponse
    {
        $agencia = AgenciaTransporte::create($request->validated());
        return response()->json([
            'success' => true,
            'message' => 'Agencia registrada.',
            'data'    => new AgenciaTransporteResource($agencia),
        ], 201);
    }

    public function show(AgenciaTransporte $agencia): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => new AgenciaTransporteResource($agencia),
        ]);
    }

    public function update(UpdateAgenciaTransporteRequest $request, AgenciaTransporte $agencia): JsonResponse
    {
        $agencia->update($request->validated());
        return response()->json([
            'success' => true,
            'message' => 'Agencia actualizada.',
            'data'    => new AgenciaTransporteResource($agencia),
        ]);
    }

    public function destroy(AgenciaTransporte $agencia): JsonResponse
    {
        $agencia->estado = false;
        $agencia->save();
        $agencia->delete(); // soft delete
        return response()->json([
            'success' => true,
            'message' => 'Agencia desactivada.',
        ]);
    }
}