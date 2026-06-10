<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CarrierFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'nombre' => fake()->regexify('[A-Za-z0-9]{255}'),
            'ruc_dni' => fake()->regexify('[A-Za-z0-9]{20}'),
            'telefono' => fake()->regexify('[A-Za-z0-9]{20}'),
            'estado' => fake()->boolean(),
        ];
    }
}
