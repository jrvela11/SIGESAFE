<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DetalleVenta;
use App\Models\Venta;
use App\Models\Producto;

class DetalleVentasTableSeeder extends Seeder
{
    public function run(): void
    {
        $ventas = Venta::all();
        $productos = Producto::all();

        foreach ($ventas as $venta) {
            // Cada venta tendrá entre 1 y 3 productos
            $numItems = rand(1, 3);
            $productosSeleccionados = $productos->random($numItems);

            foreach ($productosSeleccionados as $producto) {
                $cantidad = rand(1, 5);
                $precioUnitario = $venta->tipo_venta === 'mayorista'
                    ? $producto->precio_mayorista
                    : $producto->precio_minorista;
                $descuento = 0;
                $subtotal = $cantidad * $precioUnitario - $descuento;

                DetalleVenta::create([
                    'venta_id' => $venta->id,
                    'producto_id' => $producto->id,
                    'cantidad' => $cantidad,
                    'precio_unitario' => $precioUnitario,
                    'descuento' => $descuento,
                    'subtotal' => $subtotal,
                ]);
            }
        }
    }
}