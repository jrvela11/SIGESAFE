<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Http\Requests\StoreProductoRequest;
use App\Http\Requests\UpdateProductoRequest;
use App\Http\Resources\ProductoResource;

class ProductoController extends Controller
{
    public function index()
    {
        // El 'with' llama a Eloquent para que traiga la categoría en la misma consulta (más rápido)
        $productos = Producto::with('categoria')->withTrashed()->orderBy('id', 'desc')->get();

        return response()->json([
            'success' => true,
            'data'    => ProductoResource::collection($productos)
        ], 200);
    }

    public function store(StoreProductoRequest $request)
    {
        $datos = $request->validated();

        $datos['stock_actual'] = 0; 
        $datos['precio_compra'] = 0; 

        if ($request->hasFile('imagen')) {
            $ruta = $request->file('imagen')->store('productos', 'public');
            $datos['imagen_url'] = '/storage/' . $ruta; 
        }

        $producto = Producto::create($datos);
        $producto->load('categoria');

        return response()->json([
            'success' => true,
            'message' => 'Producto registrado en el catálogo. Esperando ingreso de almacén.',
            'data'    => new ProductoResource($producto)
        ], 201);
    }

    public function show(Producto $producto)
    {
        $producto->load('categoria');

        return response()->json([
            'success' => true,
            'data'    => new ProductoResource($producto)
        ], 200);
    }

    public function update(UpdateProductoRequest $request, Producto $producto)
    {
        $producto->update($request->validated());
        
        $producto->load('categoria');

        return response()->json([
            'success' => true,
            'message' => 'Datos del producto actualizados',
            'data'    => new ProductoResource($producto)
        ], 200);
    }

    public function destroy(Producto $producto)
    {
        $producto->update(['estado' => false]);
        $producto->delete();

        return response()->json([
            'success' => true,
            'message' => 'Producto retirado del catálogo'
        ], 200);
    }

    public function restaurar(int $id)
    {
        $producto = Producto::withTrashed()->findOrFail($id);
        
        $producto->restore();
        $producto->update(['estado' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Producto reactivado con éxito'
        ], 200);
    }
}