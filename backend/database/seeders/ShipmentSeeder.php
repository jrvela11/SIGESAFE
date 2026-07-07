<?php

namespace Database\Seeders;

use App\Models\Carrier;
use App\Models\Sale;
use App\Models\Shipment;
use Illuminate\Database\Seeder;

class ShipmentSeeder extends Seeder
{
    public function run(): void
    {
        // Obtenemos todos los transportistas y ventas existentes
        $carriers = Carrier::all();
        $sales = Sale::all(); // Asegúrate de haber corrido un SaleSeeder antes de este

        // Si no hay ventas en la base de datos, no podemos crear envíos.
        if ($sales->isEmpty()) {
            $this->command->warn('No hay ventas registradas. Ejecuta el seeder de ventas primero.');
            return;
        }

        // Creamos 30 envíos aleatorios usando las ventas y transportistas que ya existen
        for ($i = 0; $i < 30; $i++) {
            
            $envio = Shipment::factory()->create([
                'sale_id' => $sales->random()->id,
                'carrier_id' => $carriers->random()->id,
            ]);

            // Creamos un historial inicial para este envío
            $envio->history()->create([
                'estado' => 'Preparando',
                'ubicacion' => 'Almacén Central',
                'descripcion' => 'El envío ha sido registrado en el sistema y se encuentra en preparación.',
                'estado_registro' => true,
            ]);

            // Si el estado actual simulado por el factory no es 'Preparando', 
            // agregamos un historial adicional para darle coherencia
            if ($envio->estado_actual !== 'Preparando') {
                $envio->history()->create([
                    'estado' => $envio->estado_actual,
                    'ubicacion' => fake()->city(),
                    'descripcion' => 'Actualización automática de estado.',
                    'estado_registro' => true,
                ]);
            }
        }
    }
}