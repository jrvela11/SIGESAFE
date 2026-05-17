<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use App\Http\Requests\StoreEmpleadoRequest;
use App\Http\Requests\UpdateEmpleadoRequest;
use App\Http\Resources\EmpleadoResource;

class EmpleadoController extends Controller
{
    public function index()
    {
        $empleados = Empleado::with('user')->withTrashed()->orderBy('id', 'desc')->get();

        return response()->json([
            'success' => true,
            'data'    => EmpleadoResource::collection($empleados)
        ], 200);
    }

    public function store(StoreEmpleadoRequest $request)
    {
        // Confianza total en el FormRequest
        $empleado = Empleado::create($request->validated());

        // Cargamos la relación para el Resource
        $empleado->load('user');

        return response()->json([
            'success' => true,
            'message' => 'Ficha de empleado registrada correctamente',
            'data'    => new EmpleadoResource($empleado)
        ], 201);
    }

    public function show(Empleado $empleado)
    {
        $empleado->load('user'); 
        
        return response()->json([
            'success' => true,
            'data'    => new EmpleadoResource($empleado)
        ], 200);
    }

    public function update(UpdateEmpleadoRequest $request, Empleado $empleado)
    {
        $empleado->update($request->validated());

        $empleado->load('user');

        return response()->json([
            'success' => true,
            'message' => 'Datos del empleado actualizados',
            'data'    => new EmpleadoResource($empleado)
        ], 200);
    }

    public function destroy(Empleado $empleado)
    {
        $empleado->update(['estado' => false]);
        $empleado->delete(); 

        return response()->json([
            'success' => true,
            'message' => 'Empleado desactivado del sistema'
        ], 200);
    }

    public function restaurar(int $id)
    {
        $empleado = Empleado::withTrashed()->findOrFail($id);
        
        $empleado->restore(); 
        $empleado->update(['estado' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Empleado reactivado con éxito'
        ], 200);
    }
}