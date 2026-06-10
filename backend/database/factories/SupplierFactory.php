<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SupplierFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'tipo_documento' => fake()->regexify('[A-Za-z0-9]{20}'),
            'numero_documento' => fake()->regexify('[A-Za-z0-9]{20}'),
            'razon_social' => fake()->regexify('[A-Za-z0-9]{255}'),
            'contacto' => fake()->regexify('[A-Za-z0-9]{255}'),
            'telefono' => fake()->regexify('[A-Za-z0-9]{20}'),
            'direccion' => fake()->regexify('[A-Za-z0-9]{255}'),
            'region' => fake()->regexify('[A-Za-z0-9]{100}'),
            'departamento' => fake()->regexify('[A-Za-z0-9]{100}'),
            'provincia' => fake()->regexify('[A-Za-z0-9]{100}'),
            'distrito' => fake()->regexify('[A-Za-z0-9]{100}'),
            'estado' => fake()->boolean(),
        ];
    }
}
