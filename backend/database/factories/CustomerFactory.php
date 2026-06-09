<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CustomerFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'tipo_documento' => fake()->regexify('[A-Za-z0-9]{20}'),
            'numero_documento' => fake()->regexify('[A-Za-z0-9]{20}'),
            'nombre' => fake()->regexify('[A-Za-z0-9]{100}'),
            'apellido' => fake()->regexify('[A-Za-z0-9]{100}'),
            'email' => fake()->safeEmail(),
            'telefono' => fake()->regexify('[A-Za-z0-9]{20}'),
            'direccion' => fake()->text(),
            'distrito' => fake()->regexify('[A-Za-z0-9]{100}'),
            'provincia' => fake()->regexify('[A-Za-z0-9]{100}'),
            'departamento' => fake()->regexify('[A-Za-z0-9]{100}'),
            'estado' => fake()->boolean(),
        ];
    }
}
