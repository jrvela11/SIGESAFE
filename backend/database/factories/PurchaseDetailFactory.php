<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Purchase;
use Illuminate\Database\Eloquent\Factories\Factory;

class PurchaseDetailFactory extends Factory
{
    public function definition(): array
    {
        $cantidad = fake()->randomFloat(2, 1, 200);
        $precioCompra = fake()->randomFloat(2, 5, 150);

        return [
            'purchase_id' => Purchase::factory(),
            'product_id' => Product::factory(),
            'cantidad' => $cantidad,
            'precio_compra' => $precioCompra,
            'subtotal' => $cantidad * $precioCompra,
        ];
    }
}
