<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ShipmentFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'sale_id' => fake()->word(),
            'carrier_id' => fake()->word(),
            'tipo_envio' => fake()->randomElement(["bus", "shalom", "olva"]),
            'numero_seguimiento' => fake()->regexify('[A-Za-z0-9]{100}'),
            'repartidor_nombre' => fake()->regexify('[A-Za-z0-9]{255}'),
            'direccion_destino' => fake()->text(),
            'costo_envio' => $this->faker->randomFloat(2, 10, 150),
            'fecha_estimada_llegada' => fake()->date(),
            'estado_actual' => fake()->regexify('[A-Za-z0-9]{50}'),
            'tracking_metadata' => [
                'oficina_destino' => 'Agencia Principal',
                'clave_seguridad' => '1234'
            ],
            'estado' => fake()->boolean(),
        ];
    }
}
