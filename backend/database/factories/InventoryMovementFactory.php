<?php

namespace Database\Factories;

use App\Models\Inventory;
use App\Models\SaleDetail;
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryMovementFactory extends Factory
{
    public function definition(): array
    {
        return [
            'inventory_id' => Inventory::factory(),
            'sale_detail_id' => SaleDetail::factory(),
            'tipo' => fake()->randomElement(["entrada","salida"]),
            'cantidad' => fake()->randomFloat(2, 1, 100),
            'descripcion' => fake()->sentence(),
            'created_at' => fake()->dateTimeThisMonth(),
        ];
    }
}