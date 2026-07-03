<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Sale;
use Illuminate\Database\Eloquent\Factories\Factory;

class SaleDetailFactory extends Factory
{
    public function definition(): array
    {
        return [
            'sale_id' => Sale::factory(),
            'product_id' => Product::factory(),
            'cantidad' => fake()->randomFloat(2, 1, 50),
            'precio_unitario' => fake()->randomFloat(2, 10, 200),
            'descuento' => fake()->randomFloat(2, 0, 20),
            'subtotal' => fake()->randomFloat(2, 10, 1000),
            'estado' => true,
        ];
    }
}