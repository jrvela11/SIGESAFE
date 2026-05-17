<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Proveedor;

class ProveedoresTableSeeder extends Seeder
{
    public function run(): void
    {
        $proveedores = [
            [
                'razon_social' => 'Cooperativa Agraria Cafetalera Amazonas',
                'ruc_dni' => '20123456781',
                'contacto' => 'Luis Almendras',
                'telefono' => '987111222',
                'direccion' => 'Av. Principal 101, Bagua Grande',
                'region' => 'Amazonas',
            ],
            [
                'razon_social' => 'Agroexportaciones Cajamarca EIRL',
                'ruc_dni' => '20234567892',
                'contacto' => 'Rosa Medina',
                'telefono' => '912333444',
                'direccion' => 'Jr. Las Orquídeas 200, Jaén',
                'region' => 'Cajamarca',
            ],
            [
                'razon_social' => 'Insumos Agrícolas Verde SAC',
                'ruc_dni' => '20345678903',
                'contacto' => 'Carlos Paredes',
                'telefono' => '955666777',
                'direccion' => 'Av. Los Pinos 345, Jaén',
                'region' => 'Cajamarca',
            ],
            [
                'razon_social' => 'Juan Huamán Tello',
                'ruc_dni' => '10456789044',
                'contacto' => 'Juan Huamán',
                'telefono' => '933222111',
                'direccion' => 'Sector La Palma, Lonya Grande',
                'region' => 'Amazonas',
            ],
            [
                'razon_social' => 'Chocolates Finos del Perú SAC',
                'ruc_dni' => '20567890125',
                'contacto' => 'Ana Cacao',
                'telefono' => '977889900',
                'direccion' => 'Jr. Cacao 400, Cusco',
                'region' => 'Cusco',
            ],
            [
                'razon_social' => 'Ferretería La Chacra',
                'ruc_dni' => '20678901236',
                'contacto' => 'Pedro Acero',
                'telefono' => '966554433',
                'direccion' => 'Av. Herramientas 890, Satipo',
                'region' => 'Junín',
            ],
            [
                'razon_social' => 'Distribuidora Norteña EIRL',
                'ruc_dni' => '20789012347',
                'contacto' => 'María Paz',
                'telefono' => '901234567',
                'direccion' => 'Mz. B Lote 10, Piura',
                'region' => 'Piura',
            ],
            [
                'razon_social' => 'Agroexportadora Amazónica SAC',
                'ruc_dni' => '20890123458',
                'contacto' => 'Roberto Selva',
                'telefono' => '988776655',
                'direccion' => 'Ruta a la selva km 5, Pucallpa',
                'region' => 'Ucayali',
            ],
            [
                'razon_social' => 'Insumos Orgánicos Eco EIRL',
                'ruc_dni' => '20901234569',
                'contacto' => 'Sofía Verde',
                'telefono' => '922334455',
                'direccion' => 'Av. Ecológica 123, Huánuco',
                'region' => 'Huánuco',
            ],
            [
                'razon_social' => 'Maquinarias del Agro SAC',
                'ruc_dni' => '21012345670',
                'contacto' => 'Jorge Motor',
                'telefono' => '911223344',
                'direccion' => 'Parque Industrial 456, Chiclayo',
                'region' => 'Lambayeque',
            ],
            [
                'razon_social' => 'Cacaoteros Unidos de Tingo María',
                'ruc_dni' => '21123456781',
                'contacto' => 'Lucía Grano',
                'telefono' => '955443322',
                'direccion' => 'Av. Cacao 100, Tingo María',
                'region' => 'Huánuco',
            ],
            [
                'razon_social' => 'Emilio Sánchez Vásquez',
                'ruc_dni' => '10234567891',
                'contacto' => 'Emilio Sánchez',
                'telefono' => '999888777',
                'direccion' => 'Caserío Nuevo Horizonte, San Ignacio',
                'region' => 'Cajamarca',
            ],
        ];

        foreach ($proveedores as $p) {
            Proveedor::create($p);
        }
    }
}