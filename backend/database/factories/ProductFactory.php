<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'category_id' => Category::factory(),
            // Garantizamos que sea único y parezca un código real
            'sku' => fake()->unique()->bothify('PROD-####-????'),
            'codigo_barras' => fake()->unique()->ean13(),
            'nombre' => fake()->words(3, true),
            'descripcion' => fake()->sentence(),
            // Precios y stocks realistas
            'precio_compra' => fake()->randomFloat(2, 10, 100),
            'precio_minorista' => fake()->randomFloat(2, 120, 200),
            'precio_mayorista' => fake()->randomFloat(2, 105, 115),
            'afecto_igv' => fake()->boolean(80),
            'unidad_medida' => fake()->randomElement(['Kilos', 'Litros', 'Sacos', 'Unidades']),
            'stock_actual' => fake()->randomFloat(2, 20, 500),
            'stock_minimo' => fake()->randomFloat(2, 5, 20),
            'imagen_url' => null,
            'estado' => fake()->boolean(90),
        ];
    }
}