<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Empleado;
use App\Models\User;

class EmpleadosTableSeeder extends Seeder
{
    public function run(): void
    {
        // Buscamos usuarios por email para enlazar
        $users = User::all()->keyBy('email');

        $empleados = [
            ['user_email' => 'admin@cafetal.com', 'nombres' => 'Admin', 'apellidos' => 'Principal', 'tipo_documento' => 'DNI', 'numero_documento' => '12345678', 'telefono' => '900000001', 'cargo' => 'Administrador'],
            ['user_email' => 'maria.lopez@cafetal.com', 'nombres' => 'María', 'apellidos' => 'López', 'tipo_documento' => 'DNI', 'numero_documento' => '23456789', 'telefono' => '900000002', 'cargo' => 'Vendedora'],
            ['user_email' => 'carlos.garcia@cafetal.com', 'nombres' => 'Carlos', 'apellidos' => 'García', 'tipo_documento' => 'DNI', 'numero_documento' => '34567890', 'telefono' => '900000003', 'cargo' => 'Vendedor'],
            ['user_email' => 'ana.torres@cafetal.com', 'nombres' => 'Ana', 'apellidos' => 'Torres', 'tipo_documento' => 'DNI', 'numero_documento' => '45678901', 'telefono' => '900000004', 'cargo' => 'Vendedora'],
            ['user_email' => 'pedro.rios@cafetal.com', 'nombres' => 'Pedro', 'apellidos' => 'Ríos', 'tipo_documento' => 'DNI', 'numero_documento' => '56789012', 'telefono' => '900000005', 'cargo' => 'Vendedor'],
            ['user_email' => 'luisa.fernandez@cafetal.com', 'nombres' => 'Luisa', 'apellidos' => 'Fernández', 'tipo_documento' => 'DNI', 'numero_documento' => '67890123', 'telefono' => '900000006', 'cargo' => 'Jefa de Logística'],
            ['user_email' => 'jorge.diaz@cafetal.com', 'nombres' => 'Jorge', 'apellidos' => 'Díaz', 'tipo_documento' => 'CE', 'numero_documento' => '78901234', 'telefono' => '900000007', 'cargo' => 'Logística'],
            ['user_email' => 'diana.ruiz@cafetal.com', 'nombres' => 'Diana', 'apellidos' => 'Ruiz', 'tipo_documento' => 'DNI', 'numero_documento' => '89012345', 'telefono' => '900000008', 'cargo' => 'Vendedora'],
            ['user_email' => 'roberto.castro@cafetal.com', 'nombres' => 'Roberto', 'apellidos' => 'Castro', 'tipo_documento' => 'DNI', 'numero_documento' => '90123456', 'telefono' => '900000009', 'cargo' => 'Vendedor'],
            ['user_email' => 'sofia.mendoza@cafetal.com', 'nombres' => 'Sofía', 'apellidos' => 'Mendoza', 'tipo_documento' => 'DNI', 'numero_documento' => '01234567', 'telefono' => '900000010', 'cargo' => 'Logística'],
            ['user_email' => 'campo@cafetal.com', 'nombres' => 'Supervisor', 'apellidos' => 'Campo', 'tipo_documento' => 'DNI', 'numero_documento' => '11223344', 'telefono' => '900000011', 'cargo' => 'Supervisor de Campo'],
            ['user_email' => 'online@cafetal.com', 'nombres' => 'Ventas', 'apellidos' => 'Online', 'tipo_documento' => 'DNI', 'numero_documento' => '22334455', 'telefono' => '900000012', 'cargo' => 'Ventas Online'],
        ];

        foreach ($empleados as $e) {
            Empleado::create([
                'user_id' => $users[$e['user_email']]->id,
                'nombres' => $e['nombres'],
                'apellidos' => $e['apellidos'],
                'tipo_documento' => $e['tipo_documento'],
                'numero_documento' => $e['numero_documento'],
                'telefono' => $e['telefono'],
                'cargo' => $e['cargo'],
            ]);
        }
    }
}