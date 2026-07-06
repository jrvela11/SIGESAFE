<?php

namespace Database\Factories;

use App\Models\ShipmentHistory;
use App\Models\Shipment;
use Illuminate\Database\Eloquent\Factories\Factory;

class ShipmentHistoryFactory extends Factory
{
    protected $model = ShipmentHistory::class;

    public function definition(): array
    {
        return [
            'shipment_id' => Shipment::factory(),
            'estado' => fake()->randomElement(['Preparando', 'En Tránsito', 'En Reparto', 'Entregado']),
            'ubicacion' => fake()->city(),
            'descripcion' => fake()->sentence(),
            'estado_registro' => true,
        ];
    }
}
