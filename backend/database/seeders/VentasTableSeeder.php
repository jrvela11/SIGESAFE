<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Venta;
use App\Models\Cliente;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class VentasTableSeeder extends Seeder
{
    public function run(): void
    {
        $clientes = Cliente::all();
        $vendedores = User::where('role', 'vendedor')->get();

        // Si no hay clientes, crea uno temporal
        if ($clientes->isEmpty()) {
            $this->command->warn('No hay clientes, creando cliente de ejemplo...');
            $cliente = Cliente::create([
                'nombre' => 'Cliente',
                'apellido' => 'Ejemplo',
                'email' => 'cliente@ejemplo.com',
                'telefono' => '000000000',
                'direccion' => 'Sin dirección',
            ]);
            $clientes = collect([$cliente]);
        }

        // Si no hay vendedores, crea uno temporal
        if ($vendedores->isEmpty()) {
            $this->command->warn('No hay vendedores, creando vendedor de ejemplo...');
            $vendedor = User::create([
                'name' => 'Vendedor Ejemplo',
                'email' => 'vendedor@cafetal.com',
                'password' => Hash::make('password'),
                'role' => 'vendedor',
                'is_active' => true,
            ]);
            $vendedores = collect([$vendedor]);
        }

        $fechaBase = Carbon::now()->subDays(30);

        for ($i = 0; $i < 10; $i++) {
            $cliente = $clientes->random();
            $vendedor = $vendedores->random();
            $tipo = (rand(0, 1) === 0) ? 'minorista' : 'mayorista';
            $subtotal = $tipo === 'minorista' ? rand(15, 50) : rand(100, 300);
            $igv = $subtotal * 0.18;
            $total = $subtotal + $igv;

            Venta::create([
                'cliente_id' => $cliente->id,
                'user_id' => $vendedor->id,
                'tipo_venta' => $tipo,
                'tipo_comprobante' => 'Factura',
                'serie' => 'F001',
                'correlativo' => str_pad(100 + $i, 10, '0', STR_PAD_LEFT),
                'subtotal' => $subtotal,
                'igv' => $igv,
                'total' => $total,
                'metodo_pago' => ['Efectivo', 'Tarjeta', 'Transferencia'][rand(0, 2)],
                'estado_pago' => 'pagado',
                'fecha_venta' => $fechaBase->copy()->addDays($i * 2),
                'estado' => true,
            ]);
        }
    }
}