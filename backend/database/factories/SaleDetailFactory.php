<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Sale;
use Illuminate\Database\Eloquent\Factories\Factory;

class SaleDetailFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'sale_id' => Sale::factory(),
            'product_id' => Product::factory(),
            'cantidad' => fake()->randomFloat(2, 0, 99999999.99),
            'precio_unitario' => fake()->randomFloat(2, 0, 99999999.99),
            'descuento' => fake()->randomFloat(2, 0, 99999999.99),
            'subtotal' => fake()->randomFloat(2, 0, 99999999.99),
            'estado' => fake()->boolean(),
        ];
    }
}
