<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SaleFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'customer_id' => Customer::factory(),
            'user_id' => User::factory(),
            'tipo_venta' => fake()->randomElement(["minorista","mayorista"]),
            'tipo_comprobante' => fake()->regexify('[A-Za-z0-9]{50}'),
            'serie' => fake()->regexify('[A-Za-z0-9]{4}'),
            'correlativo' => fake()->regexify('[A-Za-z0-9]{10}'),
            'subtotal' => fake()->randomFloat(2, 0, 99999999.99),
            'igv' => fake()->randomFloat(2, 0, 99999999.99),
            'total' => fake()->randomFloat(2, 0, 99999999.99),
            'metodo_pago' => fake()->word(),
            'estado_pago' => fake()->word(),
            'fecha_venta' => fake()->dateTime(),
            'estado' => fake()->boolean(),
        ];
    }
}
