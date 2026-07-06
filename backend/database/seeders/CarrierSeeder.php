<?php

namespace Database\Seeders;

use App\Models\Carrier;
use Illuminate\Database\Seeder;

class CarrierSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Crear agencias principales obligatorias
        Carrier::create([
            'nombre' => 'Shalom Empresarial',
            'ruc_dni' => '20504886671',
            'telefono' => '01 500 7878',
            'estado' => true,
        ]);

        Carrier::create([
            'nombre' => 'Olva Courier',
            'ruc_dni' => '20100686814',
            'telefono' => '01 714 0909',
            'estado' => true,
        ]);

        Carrier::create([
            'nombre' => 'Marvisur',
            'ruc_dni' => '20100123456',
            'telefono' => '054 282828',
            'estado' => true,
        ]);

        // 2. Generar 7 transportistas aleatorios extra usando el Factory
        Carrier::factory(7)->create();
    }
}
