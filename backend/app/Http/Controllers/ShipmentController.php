<?php

namespace App\Http\Controllers;

use App\Http\Requests\ShipmentStoreRequest;
use App\Http\Requests\ShipmentUpdateRequest;
use App\Http\Resources\ShipmentCollection;
use App\Http\Resources\ShipmentResource;
use App\Models\Shipment;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class ShipmentController extends Controller
{
    public function index(Request $request)
    {
        $shipments = Shipment::all();

        return new ShipmentCollection($shipments);
    }

    public function store(ShipmentStoreRequest $request)
    {
        // Usamos una transacción para garantizar la atomicidad del proceso
        $shipment = DB::transaction(function () use ($request) {

            // 1. Creamos el envío con los datos ya validados
            $shipment = Shipment::create($request->validated());

            // 2. Registramos el hito inicial en el historial mediante la relación hasMany
            $shipment->history()->create([
                'estado'          => $request->input('estado_actual'), // Toma el estado inicial que viene de React (ej: 'preparando')
                'ubicacion'       => 'Oficina de Origen / Almacén Central',
                'descripcion'     => 'El envío ha sido registrado en el sistema y se encuentra en preparación.',
                'estado_registro' => true,
            ]);

            return $shipment;
        });

        // 3. Retornamos el recurso tal como lo tenías, Laravel se encarga del código HTTP 201 de forma nativa
        return new ShipmentResource($shipment);
    }

    public function show(Request $request, Shipment $shipment)
    {
        return new ShipmentResource($shipment);
    }

    public function update(ShipmentUpdateRequest $request, Shipment $shipment)
    {
        $shipment->update($request->validated());

        return new ShipmentResource($shipment);
    }

    public function destroy(Request $request, Shipment $shipment): Response
    {
        $shipment->delete();

        return response()->noContent();
    }
}
