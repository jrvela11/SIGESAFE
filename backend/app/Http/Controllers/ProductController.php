<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductStoreRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Http\Resources\ProductCollection;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::all();

        return new ProductCollection($products);
    }

    public function store(ProductStoreRequest $request)
    {
        // 1. Obtenemos todos los datos validados
        $data = $request->validated();

        // 2. Procesamos la imagen si existe
        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('products', 'public');
            $data['imagen_url'] = $path; // Guardamos la ruta en el campo de la DB
        }

        // 3. Eliminamos el campo 'imagen' del array, ya que no existe en la tabla products
        unset($data['imagen']);

        // 4. Creamos el producto
        $product = Product::create($data);

        return new ProductResource($product);
    }

    public function show(Request $request, Product $product)
    {
        return new ProductResource($product);
    }

    public function update(ProductUpdateRequest $request, Product $product)
    {
        $data = $request->validated();

        if ($request->hasFile('imagen')) {
            // 1. Eliminar la imagen anterior si existe
            if ($product->imagen_url) {
                Storage::disk('public')->delete($product->imagen_url);
            }

            // 2. Guardar la nueva
            $data['imagen_url'] = $request->file('imagen')->store('products', 'public');
        }

        // 3. Limpiar el array de la clave 'imagen' antes de actualizar
        unset($data['imagen']);

        $product->update($data);

        return new ProductResource($product);
    }

    public function destroy(Request $request, Product $product): Response
    {
        $product->delete();

        return response()->noContent();
    }
}
