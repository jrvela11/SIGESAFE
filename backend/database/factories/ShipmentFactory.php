<?php

namespace Database\Factories;

use App\Models\Shipment;
use App\Models\Carrier;
use App\Models\Sale; // Asegúrate de tener este modelo
use Illuminate\Database\Eloquent\Factories\Factory;

class ShipmentFactory extends Factory
{
    protected $model = Shipment::class;

    public function definition(): array
    {
        $estados = ['Preparando', 'En Tránsito', 'En Agencia Destino', 'En Reparto', 'Entregado'];

        return [
            // Asume que tienes un factory para Sale. Si no, puedes cambiarlo por un ID fijo temporal
            'sale_id' => Sale::factory(), 
            'carrier_id' => Carrier::factory(),
            'tipo_envio' => fake()->randomElement(['bus', 'shalom', 'olva']),
            
            // Simula un track number estilo OLVA-123456
            'numero_seguimiento' => strtoupper(fake()->lexify('????')) . '-' . fake()->numerify('######'),
            
            // 60% de probabilidad de tener un repartidor asignado
            'repartidor_nombre' => fake()->boolean(60) ? fake()->name() : null,
            
            'direccion_destino' => fake()->streetAddress() . ', ' . fake()->city(),
            'costo_envio' => fake()->randomFloat(2, 10, 150), // Entre S/ 10.00 y S/ 150.00
            
            // Fecha de llegada estimada entre hoy y 14 días en el futuro
            'fecha_estimada_llegada' => fake()->dateTimeBetween('now', '+14 days')->format('Y-m-d'),
            
            'estado_actual' => fake()->randomElement($estados),
            'tracking_metadata' => null, // Opcional: ['peso' => fake()->randomFloat(2, 1, 50)]
            'estado' => fake()->boolean(95), // 95% activos, 5% anulados
        ];
    }
}
