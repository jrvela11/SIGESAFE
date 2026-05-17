<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UsersTableSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['name' => 'Admin Principal', 'email' => 'admin@cafetal.com', 'role' => 'admin'],
            ['name' => 'María López', 'email' => 'maria.lopez@cafetal.com', 'role' => 'vendedor'],
            ['name' => 'Carlos García', 'email' => 'carlos.garcia@cafetal.com', 'role' => 'vendedor'],
            ['name' => 'Ana Torres', 'email' => 'ana.torres@cafetal.com', 'role' => 'vendedor'],
            ['name' => 'Pedro Ríos', 'email' => 'pedro.rios@cafetal.com', 'role' => 'vendedor'],
            ['name' => 'Luisa Fernández', 'email' => 'luisa.fernandez@cafetal.com', 'role' => 'logistica'],
            ['name' => 'Jorge Díaz', 'email' => 'jorge.diaz@cafetal.com', 'role' => 'logistica'],
            ['name' => 'Diana Ruiz', 'email' => 'diana.ruiz@cafetal.com', 'role' => 'vendedor'],
            ['name' => 'Roberto Castro', 'email' => 'roberto.castro@cafetal.com', 'role' => 'vendedor'],
            ['name' => 'Sofía Mendoza', 'email' => 'sofia.mendoza@cafetal.com', 'role' => 'logistica'],
            ['name' => 'Supervisor Campo', 'email' => 'campo@cafetal.com', 'role' => 'admin'],
            ['name' => 'Ventas Online', 'email' => 'online@cafetal.com', 'role' => 'vendedor'],
        ];

        foreach ($users as $user) {
            User::create([
                'name' => $user['name'],
                'email' => $user['email'],
                'password' => Hash::make('password'),
                'role' => $user['role'],
                'is_active' => true,
            ]);
        }
    }
}