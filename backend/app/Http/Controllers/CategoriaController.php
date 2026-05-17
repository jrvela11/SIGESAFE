<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Categoria;
use App\Http\Requests\StoreCategoriaRequest;
use App\Http\Requests\UpdateCategoriaRequest;
use App\Http\Resources\CategoriaResource;

class CategoriaController extends Controller
{
    public function index()
    {
        $categorias = Categoria::withTrashed()->orderBy('id_categoria', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => CategoriaResource::collection($categorias)
        ], 200);
    }

    public function store(StoreCategoriaRequest $request)
    {
        $validated = $request->validated();

        $categoria = Categoria::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Categoría creada correctamente',
            'data' => new CategoriaResource($categoria)
        ], 201);
    }

    public function show(Categoria $categoria)
    {
        return response()->json([
            'success' => true,
            'data' => new CategoriaResource($categoria)
        ], 200);
    }

    public function update(UpdateCategoriaRequest $request, Categoria $categoria)
    {
        $validated = $request->validated();

        $categoria->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Categoría actualizada con éxito',
            'data' => new CategoriaResource($categoria)
        ], 200);
    }

    public function destroy(Categoria $categoria)
    {
        $categoria->update(['estado' => false]);
        $categoria->delete(); 

        return response()->json([
            'success' => true,
            'message' => 'Categoría desactivada y ocultada'
        ], 200);
    }

    // --- NUEVA FUNCIÓN PARA RESTAURAR ---
    public function restaurar(int $id)
    {
        $categoria = Categoria::withTrashed()->findOrFail($id);
        
        $categoria->restore(); // Quita el deleted_at
        $categoria->update(['estado' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Categoría reactivada con éxito'
        ], 200);
    }
}