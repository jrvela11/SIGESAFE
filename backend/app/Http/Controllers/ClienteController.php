<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. Validar los datos que vienen del formulario
        $validated = $request->validate([
            'nombre'    => 'required|string|max:100',
            'apellido'  => 'nullable|string|max:100',
            'email'     => 'required|email|unique:clientes,email', // Valida que sea único en la tabla clientes
            'telefono'  => 'nullable|string|max:20',
            'direccion' => 'nullable|string',
            'activo'    => 'boolean',
        ]);

        // 2. Crear el cliente con los datos validados
        // (Usa Mass Assignment gracias al $fillable que pusimos en el Modelo)
        $cliente = Cliente::create($validated);

        // 3. Redirigir o devolver respuesta
        return response()->json([
            'message' => 'Cliente creado con éxito',
            'data'    => $cliente
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Cliente $cliente)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Cliente $cliente)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cliente $cliente)
    {
        //
    }
}
