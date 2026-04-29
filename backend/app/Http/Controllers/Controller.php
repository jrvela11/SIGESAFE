<?php

namespace App\Http\Controllers;
use App\Models\Categoria;
use Illuminate\Http\Request;

abstract class Controller
{
    public function index()
    {
        $categorias = Categoria::all();
        return response()->json([
            'success' => true,
            'data' => $categorias
        ], 200);
    }

    // POST: Crear una nueva categoría
    public function store(Request $request)
    {
        // 1. Validamos los datos que llegan
        $request->validate([
            'nombre_categoria' => 'required|string|max:100',
            'descripcion' => 'nullable|string'
        ]);

        // 2. Guardamos en base de datos
        $categoria = Categoria::create([
            'nombre_categoria' => $request->nombre_categoria,
            'descripcion' => $request->descripcion
        ]);

        // 3. Devolvemos respuesta exitosa
        return response()->json([
            'success' => true,
            'message' => 'Categoría creada con éxito',
            'data' => $categoria
        ], 201);
    }
}
