<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UsersTableSeeder::class,
            ClientesTableSeeder::class,
            CategoriasTableSeeder::class,
            ProveedoresTableSeeder::class,
            ProductosTableSeeder::class,
            EmpleadosTableSeeder::class,
            InventariosTableSeeder::class,
            VentasTableSeeder::class,
            DetalleVentasTableSeeder::class,
        ]);
    }
}