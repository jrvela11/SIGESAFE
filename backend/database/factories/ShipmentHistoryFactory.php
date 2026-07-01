<?php

namespace Database\Factories;

use App\Models\Shipment;
use Illuminate\Database\Eloquent\Factories\Factory;

class ShipmentHistoryFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'shipment_id' => Shipment::factory(),
            'estado' => fake()->regexify('[A-Za-z0-9]{50}'),
            'ubicacion' => fake()->regexify('[A-Za-z0-9]{255}'),
            'descripcion' => fake()->text(),
            'estado_registro' => fake()->boolean(),
        ];
    }
}
