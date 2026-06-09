<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Proveedor;
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'proveedor_id' => null,
            'codigo_lote' => fake()->regexify('[A-Za-z0-9]{100}'),
            'cantidad_inicial' => fake()->randomFloat(2, 0, 99999999.99),
            'cantidad_actual' => fake()->randomFloat(2, 0, 99999999.99),
            'precio_compra' => fake()->randomFloat(2, 0, 99999999.99),
            'fecha_ingreso' => fake()->date(),
            'estado' => fake()->boolean(),
        ];
    }
}
