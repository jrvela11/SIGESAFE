<?php

namespace Database\Factories;

use App\Models\Inventory;
use App\Models\SaleDetail;
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryMovementFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'inventory_id' => Inventory::factory(),
            'sale_detail_id' => SaleDetail::factory(),
            'tipo' => fake()->randomElement(["entrada","salida"]),
            'cantidad' => fake()->randomFloat(2, 0, 99999999.99),
            'descripcion' => fake()->word(),
            'created_at' => fake()->dateTime(),
        ];
    }
}
