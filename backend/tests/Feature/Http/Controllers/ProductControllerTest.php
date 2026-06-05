<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\ProductController
 */
final class ProductControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_behaves_as_expected(): void
    {
        $products = Product::factory()->count(3)->create();

        $response = $this->get(route('products.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ProductController::class,
            'store',
            \App\Http\Requests\ProductStoreRequest::class
        );
    }

    #[Test]
    public function store_saves(): void
    {
        $category = Category::factory()->create();
        $sku = fake()->word();
        $nombre = fake()->word();
        $precio_compra = fake()->numberBetween(100, 500000) / 100;
        $precio_minorista = fake()->numberBetween(500, 900000) / 100;
        $precio_mayorista = fake()->numberBetween(400, 800000) / 100;
        $afecto_igv = fake()->boolean();
        $unidad_medida = fake()->word();
        $stock_actual = fake()->numberBetween(1000, 500000) / 100;
        $stock_minimo = fake()->numberBetween(100, 10000) / 100;
        $estado = fake()->boolean();

        $response = $this->post(route('products.store'), [
            'category_id' => $category->id,
            'sku' => $sku,
            'nombre' => $nombre,
            'precio_compra' => $precio_compra,
            'precio_minorista' => $precio_minorista,
            'precio_mayorista' => $precio_mayorista,
            'afecto_igv' => $afecto_igv,
            'unidad_medida' => $unidad_medida,
            'stock_actual' => $stock_actual,
            'stock_minimo' => $stock_minimo,
            'estado' => $estado,
        ]);

        $products = Product::query()
            ->where('category_id', $category->id)
            ->where('sku', $sku)
            ->where('nombre', $nombre)
            ->where('precio_compra', $precio_compra)
            ->where('precio_minorista', $precio_minorista)
            ->where('precio_mayorista', $precio_mayorista)
            ->where('afecto_igv', $afecto_igv)
            ->where('unidad_medida', $unidad_medida)
            ->where('stock_actual', $stock_actual)
            ->where('stock_minimo', $stock_minimo)
            ->where('estado', $estado)
            ->get();
        $this->assertCount(1, $products);
        $product = $products->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    #[Test]
    public function show_behaves_as_expected(): void
    {
        $product = Product::factory()->create();

        $response = $this->get(route('products.show', $product));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ProductController::class,
            'update',
            \App\Http\Requests\ProductUpdateRequest::class
        );
    }

    #[Test]
    public function update_behaves_as_expected(): void
    {
        $product = Product::factory()->create();
        $category = Category::factory()->create();
        $sku = fake()->word();
        $nombre = fake()->word();
        $precio_compra = fake()->numberBetween(100, 500000) / 100;
        $precio_minorista = fake()->numberBetween(500, 900000) / 100;
        $precio_mayorista = fake()->numberBetween(400, 800000) / 100;
        $afecto_igv = fake()->boolean();
        $unidad_medida = fake()->word();
        $stock_actual = fake()->numberBetween(1000, 500000) / 100;
        $stock_minimo = fake()->numberBetween(100, 10000) / 100;
        $estado = fake()->boolean();

        $response = $this->put(route('products.update', $product), [
            'category_id' => $category->id,
            'sku' => $sku,
            'nombre' => $nombre,
            'precio_compra' => $precio_compra,
            'precio_minorista' => $precio_minorista,
            'precio_mayorista' => $precio_mayorista,
            'afecto_igv' => $afecto_igv,
            'unidad_medida' => $unidad_medida,
            'stock_actual' => $stock_actual,
            'stock_minimo' => $stock_minimo,
            'estado' => $estado,
        ]);

        $product->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($category->id, $product->category_id);
        $this->assertEquals($sku, $product->sku);
        $this->assertEquals($nombre, $product->nombre);
        $this->assertEquals($precio_compra, $product->precio_compra);
        $this->assertEquals($precio_minorista, $product->precio_minorista);
        $this->assertEquals($precio_mayorista, $product->precio_mayorista);
        $this->assertEquals($afecto_igv, $product->afecto_igv);
        $this->assertEquals($unidad_medida, $product->unidad_medida);
        $this->assertEquals($stock_actual, $product->stock_actual);
        $this->assertEquals($stock_minimo, $product->stock_minimo);
        $this->assertEquals($estado, $product->estado);
    }


    #[Test]
    public function destroy_deletes_and_responds_with(): void
    {
        $product = Product::factory()->create();

        $response = $this->delete(route('products.destroy', $product));

        $response->assertNoContent();

        $this->assertSoftDeleted($product);
    }
}
