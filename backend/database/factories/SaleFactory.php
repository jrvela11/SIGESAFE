<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SaleFactory extends Factory
{
    public function definition(): array
    {
        $tipoComprobante = fake()->randomElement(["Boleta", "Factura"]);
        $serie = $tipoComprobante === 'Factura' ? fake()->bothify('F00#') : fake()->bothify('B00#');

        return [
            'customer_id' => Customer::factory(),
            'user_id' => User::factory(),
            'tipo_venta' => fake()->randomElement(["minorista","mayorista"]),
            'tipo_comprobante' => $tipoComprobante,
            'serie' => $serie,
            'correlativo' => fake()->unique()->numerify('######'),
            'subtotal' => fake()->randomFloat(2, 50, 1000),
            'igv' => fake()->randomFloat(2, 9, 180),
            'total' => fake()->randomFloat(2, 59, 1180),
            'metodo_pago' => fake()->randomElement(['Efectivo', 'Tarjeta', 'Yape', 'Plin']),
            'estado_pago' => fake()->randomElement(['Pagado', 'Pendiente']),
            'fecha_venta' => fake()->dateTimeThisYear(),
            'estado' => fake()->boolean(95),
        ];
    }
}