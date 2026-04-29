<?php

namespace Database\Seeders;

use App\Models\Cliente;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClienteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Creamos un array con los datos que queremos insertar
        $clientes = [
            [
                'nombre' => 'Juan',
                'apellido' => 'Pérez',
                'email' => 'juan.perez@email.com',
                'telefono' => '123456789',
                'direccion' => 'Av. Siempre Viva 123',
                'activo' => true,
            ],
            [
                'nombre' => 'María',
                'apellido' => 'García',
                'email' => 'm.garcia@email.com',
                'telefono' => '987654321',
                'direccion' => 'Calle Mayor 45',
                'activo' => true,
            ],
            [
                'nombre' => 'Luis',
                'apellido' => 'Rodríguez',
                'email' => 'luis.rod@email.com',
                'telefono' => '555000111',
                'direccion' => 'Plaza Central 10',
                'activo' => false,
            ],
        ];

        // Recorremos el array e insertamos cada cliente
        foreach ($clientes as $cliente) {
            Cliente::create($cliente);
        }
    }
}
