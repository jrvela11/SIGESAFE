<?php

namespace Database\Factories;

use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;

class PurchaseFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'supplier_id' => Supplier::factory(),
            'tipo_comprobante' => fake()->regexify('[A-Za-z0-9]{50}'),
            'serie' => fake()->regexify('[A-Za-z0-9]{20}'),
            'numero' => fake()->regexify('[A-Za-z0-9]{50}'),
            'fecha_emision' => fake()->date(),
            'subtotal' => fake()->randomFloat(2, 0, 99999999.99),
            'igv' => fake()->randomFloat(2, 0, 99999999.99),
            'total' => fake()->randomFloat(2, 0, 99999999.99),
            'estado' => fake()->boolean(),
        ];
    }
}
