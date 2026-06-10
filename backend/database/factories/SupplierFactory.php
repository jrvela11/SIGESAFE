<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SupplierFactory extends Factory
{
    public function definition(): array
    {
        $tipoDoc = fake()->randomElement(['RUC', 'DNI', 'RUC']); // Más probabilidad de RUC
        $numDoc = $tipoDoc === 'RUC' ? fake()->numerify('20#########') : fake()->numerify('########');

        return [
            'tipo_documento' => $tipoDoc,
            'numero_documento' => $numDoc,
            'razon_social' => $tipoDoc === 'RUC' ? fake()->company() : fake()->name(),
            'contacto' => fake()->name(),
            'telefono' => fake()->numerify('9########'),
            'direccion' => fake()->streetAddress(),
            'region' => fake()->randomElement(['Amazonas', 'Cajamarca', 'San Martín', 'Lambayeque', 'La Libertad']),
            'departamento' => fake()->state(),
            'provincia' => fake()->city(),
            'distrito' => fake()->citySuffix(),
            'estado' => fake()->boolean(90), // 90% activos
        ];
    }
}