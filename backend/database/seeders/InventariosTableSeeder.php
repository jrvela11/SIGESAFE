<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Inventario;
use App\Models\Producto;
use App\Models\Proveedor;
use Carbon\Carbon;

class InventariosTableSeeder extends Seeder
{
    public function run(): void
    {
            $lotes = [
        ['sku' => 'CAFT-001', 'proveedor_razon' => 'Cooperativa Agraria Cafetalera Amazonas', 'codigo_lote' => 'LOTE-CAFT-001', 'cantidad_inicial' => 200, 'precio_compra' => 8.00, 'fecha' => '2026-04-20'],
        ['sku' => 'CAFT-001', 'proveedor_razon' => 'Agroexportaciones Cajamarca EIRL', 'codigo_lote' => 'LOTE-CAFT-002', 'cantidad_inicial' => 150, 'precio_compra' => 8.50, 'fecha' => '2026-05-02'],
        ['sku' => 'CAFG-001', 'proveedor_razon' => 'Juan Huamán Tello', 'codigo_lote' => 'LOTE-CAFG-001', 'cantidad_inicial' => 300, 'precio_compra' => 10.00, 'fecha' => '2026-04-15'],
        ['sku' => 'CACP-001', 'proveedor_razon' => 'Chocolates Finos del Perú SAC', 'codigo_lote' => 'LOTE-CACP-001', 'cantidad_inicial' => 250, 'precio_compra' => 6.00, 'fecha' => '2026-04-22'],
        ['sku' => 'CHOC-001', 'proveedor_razon' => 'Chocolates Finos del Perú SAC', 'codigo_lote' => 'LOTE-CHOC-001', 'cantidad_inicial' => 400, 'precio_compra' => 5.00, 'fecha' => '2026-04-18'],
        ['sku' => 'SEMI-001', 'proveedor_razon' => 'Juan Huamán Tello', 'codigo_lote' => 'LOTE-SEMI-001', 'cantidad_inicial' => 50, 'precio_compra' => 20.00, 'fecha' => '2026-03-01'],
        ['sku' => 'SEMI-002', 'proveedor_razon' => 'Agroexportadora Amazónica SAC', 'codigo_lote' => 'LOTE-SEMI-002', 'cantidad_inicial' => 10, 'precio_compra' => 150.00, 'fecha' => '2026-02-10'],
        ['sku' => 'FERT-001', 'proveedor_razon' => 'Insumos Orgánicos Eco EIRL', 'codigo_lote' => 'LOTE-FERT-001', 'cantidad_inicial' => 80, 'precio_compra' => 15.00, 'fecha' => '2026-04-25'],
        ['sku' => 'HERR-001', 'proveedor_razon' => 'Ferretería La Chacra', 'codigo_lote' => 'LOTE-HERR-001', 'cantidad_inicial' => 60, 'precio_compra' => 12.00, 'fecha' => '2026-05-05'],
        ['sku' => 'BEBF-001', 'proveedor_razon' => 'Distribuidora Norteña EIRL', 'codigo_lote' => 'LOTE-BEBF-001', 'cantidad_inicial' => 300, 'precio_compra' => 4.00, 'fecha' => '2026-05-01'],
        ['sku' => 'SNCK-001', 'proveedor_razon' => 'Cacaoteros Unidos de Tingo María', 'codigo_lote' => 'LOTE-SNCK-001', 'cantidad_inicial' => 170, 'precio_compra' => 7.00, 'fecha' => '2026-05-03'],
        ['sku' => 'ACCE-001', 'proveedor_razon' => 'Maquinarias del Agro SAC', 'codigo_lote' => 'LOTE-ACCE-001', 'cantidad_inicial' => 120, 'precio_compra' => 10.00, 'fecha' => '2026-04-28'],
    ];

        foreach ($lotes as $lote) {
            $producto = Producto::where('sku', $lote['sku'])->first();
            $proveedor = Proveedor::where('razon_social', $lote['proveedor_razon'])->first();

            Inventario::create([
                'producto_id' => $producto->id,
                'proveedor_id' => $proveedor->id,
                'codigo_lote' => $lote['codigo_lote'],
                'cantidad_inicial' => $lote['cantidad_inicial'],
                'cantidad_actual' => $lote['cantidad_inicial'], // al inicio igual
                'precio_compra' => $lote['precio_compra'],
                'fecha_ingreso' => Carbon::parse($lote['fecha']),
            ]);
        }
    }
}