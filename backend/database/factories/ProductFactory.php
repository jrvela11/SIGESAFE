<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'category_id' => Category::factory(),
            'sku' => fake()->word(),
            'codigo_barras' => fake()->regexify('[A-Za-z0-9]{50}'),
            'nombre' => fake()->word(),
            'descripcion' => fake()->text(),
            'precio_compra' => fake()->randomFloat(2, 0, 99999999.99),
            'precio_minorista' => fake()->randomFloat(2, 0, 99999999.99),
            'precio_mayorista' => fake()->randomFloat(2, 0, 99999999.99),
            'afecto_igv' => fake()->boolean(),
            'unidad_medida' => fake()->word(),
            'stock_actual' => fake()->randomFloat(2, 0, 99999999.99),
            'stock_minimo' => fake()->randomFloat(2, 0, 99999999.99),
            'imagen_url' => fake()->word(),
            'estado' => fake()->boolean(),
        ];
    }
}
