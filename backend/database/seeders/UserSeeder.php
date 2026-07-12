<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Usuario ADMINISTRADOR (Acceso a todo)
        User::factory()->create([
            'name' => 'Jhan Marco Admin',
            'email' => 'jhanmarco@gmail.com',
            'password' => Hash::make('1234'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // 2. Usuario VENDEDOR (Ventas, Clientes, Envíos)
        User::factory()->create([
            'name' => 'Vendedor Prueba',
            'email' => 'vendedor@gmail.com',
            'password' => Hash::make('1234'),
            'role' => 'vendedor',
            'is_active' => true,
        ]);

        // 3. Usuario COMPRADOR (Compras, Proveedores)
        User::factory()->create([
            'name' => 'Comprador Prueba',
            'email' => 'comprador@gmail.com',
            'password' => Hash::make('1234'),
            'role' => 'comprador',
            'is_active' => true,
        ]);

        // 4. Usuario MOTORIZADO (Solo vista de Mis Entregas)
        User::factory()->create([
            'name' => 'Repartidor Prueba',
            'email' => 'motorizado@gmail.com',
            'password' => Hash::make('1234'),
            'role' => 'motorizado',
            'is_active' => true,
        ]);

        // 5. Crear 8 usuarios aleatorios adicionales (para tener data en la tabla usuarios)
        User::factory()->count(2)->create();
    }
}