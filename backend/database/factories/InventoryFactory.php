<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'proveedor_id' => null,
            'codigo_lote' => fake()->unique()->bothify('LOTE-####-????'),
            'cantidad_inicial' => fake()->randomFloat(2, 100, 500),
            'cantidad_actual' => fake()->randomFloat(2, 10, 500),
            'precio_compra' => fake()->randomFloat(2, 10, 100),
            'fecha_ingreso' => fake()->date(),
            'estado' => fake()->boolean(90),
        ];
    }
}