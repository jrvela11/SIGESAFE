<?php

namespace Database\Factories;

use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;

class PurchaseFactory extends Factory
{
    public function definition(): array
    {
        $tipoComprobante = fake()->randomElement(['Factura', 'Boleta', 'Guía de Remisión']);
        $serie = $tipoComprobante === 'Factura' ? fake()->bothify('F00#') : fake()->bothify('B00#');
        
        $subtotal = fake()->randomFloat(2, 50, 5000);
        $igv = $tipoComprobante === 'Factura' ? $subtotal * 0.18 : 0;

        return [
            'supplier_id' => Supplier::factory(),
            'tipo_comprobante' => $tipoComprobante,
            'serie' => $serie,
            'numero' => fake()->unique()->numerify('######'),
            'fecha_emision' => fake()->dateTimeThisYear(),
            'subtotal' => $subtotal,
            'igv' => $igv,
            'total' => $subtotal + $igv,
            'estado' => fake()->boolean(95),
        ];
    }
}
