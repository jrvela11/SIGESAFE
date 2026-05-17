<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cliente;

class ClientesTableSeeder extends Seeder
{
    public function run(): void
    {
        $clientes = [
            [
                'tipo_documento'   => 'DNI',
                'numero_documento' => '12345678',
                'nombre'           => 'Juan',
                'apellido'         => 'Pérez',
                'email'            => 'juan.perez@email.com',
                'telefono'         => '987654321',
                'direccion'        => 'Av. Café 123, Lima',
                'estado'           => true,
            ],
            [
                'tipo_documento'   => 'RUC',
                'numero_documento' => '20123456789',
                'nombre'           => 'Tienda Café Sur',
                'apellido'         => null,
                'email'            => 'ventas@cafesur.com',
                'telefono'         => '901234567',
                'direccion'        => 'Av. Principal 100, Puno',
                'estado'           => true,
            ],
            [
                'tipo_documento'   => 'DNI',
                'numero_documento' => '23456789',
                'nombre'           => 'María',
                'apellido'         => 'Gómez',
                'email'            => 'maria.gomez@email.com',
                'telefono'         => '912345678',
                'direccion'        => 'Jr. Cacao 456, Cusco',
                'estado'           => true,
            ],
            [
                'tipo_documento'   => 'DNI',
                'numero_documento' => '34567890',
                'nombre'           => 'Carlos',
                'apellido'         => 'Quispe',
                'email'            => 'carlos.quispe@email.com',
                'telefono'         => '998877665',
                'direccion'        => 'Av. Amazonas 789, San Martín',
                'estado'           => true,
            ],
            [
                'tipo_documento'   => 'DNI',
                'numero_documento' => '45678901',
                'nombre'           => 'Ana',
                'apellido'         => 'Rodríguez',
                'email'            => 'ana.rodriguez@email.com',
                'telefono'         => '955443322',
                'direccion'        => 'Calle Real 101, Jaén',
                'estado'           => true,
            ],
            [
                'tipo_documento'   => 'DNI',
                'numero_documento' => '56789012',
                'nombre'           => 'Pedro',
                'apellido'         => 'Castillo',
                'email'            => 'pedro.castillo@email.com',
                'telefono'         => '933221100',
                'direccion'        => 'Jr. Los Olivos 234, Piura',
                'estado'           => true,
            ],
            [
                'tipo_documento'   => 'DNI',
                'numero_documento' => '67890123',
                'nombre'           => 'Lucía',
                'apellido'         => 'Mendoza',
                'email'            => 'lucia.mendoza@email.com',
                'telefono'         => '911223344',
                'direccion'        => 'Av. Central 567, Cajamarca',
                'estado'           => true,
            ],
            [
                'tipo_documento'   => 'DNI',
                'numero_documento' => '78901234',
                'nombre'           => 'Roberto',
                'apellido'         => 'Huamán',
                'email'            => 'roberto.huaman@email.com',
                'telefono'         => '966554433',
                'direccion'        => 'Pasaje Las Flores 890, Amazonas',
                'estado'           => true,
            ],
            [
                'tipo_documento'   => 'DNI',
                'numero_documento' => '89012345',
                'nombre'           => 'Diana',
                'apellido'         => 'Vargas',
                'email'            => 'diana.vargas@email.com',
                'telefono'         => '944556677',
                'direccion'        => 'Av. Los Frutales 321, Junín',
                'estado'           => true,
            ],
            [
                'tipo_documento'   => 'DNI',
                'numero_documento' => '90123456',
                'nombre'           => 'Jorge',
                'apellido'         => 'Rojas',
                'email'            => 'jorge.rojas@email.com',
                'telefono'         => '922334455',
                'direccion'        => 'Calle Bolívar 654, Huánuco',
                'estado'           => true,
            ],
            [
                'tipo_documento'   => 'DNI',
                'numero_documento' => '01234567',
                'nombre'           => 'Sofía',
                'apellido'         => 'León',
                'email'            => 'sofia.leon@email.com',
                'telefono'         => '977889900',
                'direccion'        => 'Jr. Túpac Amaru 987, Ucayali',
                'estado'           => true,
            ],
            [
                'tipo_documento'   => 'DNI',
                'numero_documento' => '11223344',
                'nombre'           => 'Distribuidora Norte',
                'apellido'         => null,
                'email'            => 'norte@dist.com',
                'telefono'         => '988776655',
                'direccion'        => 'Mz. A Lote 5, Tumbes',
                'estado'           => true,
            ],
        ];

        foreach ($clientes as $c) {
            Cliente::create($c);
        }
    }
}