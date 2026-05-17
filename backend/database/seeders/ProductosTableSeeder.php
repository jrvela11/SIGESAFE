<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Producto;
use App\Models\Categoria;

class ProductosTableSeeder extends Seeder
{
    public function run(): void
    {
        // Obtenemos categorías por nombre
        $catCafeTost = Categoria::where('nombre_categoria', 'Café Tostado')->first();
        $catCafeGran = Categoria::where('nombre_categoria', 'Café en Grano')->first();
        $catCacaoPol = Categoria::where('nombre_categoria', 'Cacao en Polvo')->first();
        $catChoco    = Categoria::where('nombre_categoria', 'Chocolates')->first();
        $catSemillas = Categoria::where('nombre_categoria', 'Semillas y Plantones')->first();
        $catFertil   = Categoria::where('nombre_categoria', 'Fertilizantes')->first();
        $catHerram   = Categoria::where('nombre_categoria', 'Herramientas')->first();
        $catAcces    = Categoria::where('nombre_categoria', 'Accesorios')->first();
        $catBebidas  = Categoria::where('nombre_categoria', 'Bebidas Frías')->first();
        $catSnacks   = Categoria::where('nombre_categoria', 'Snacks de Cacao')->first();
        $catMateria  = Categoria::where('nombre_categoria', 'Materia Prima')->first();
        $catMaquin   = Categoria::where('nombre_categoria', 'Maquinaria')->first();

        $productos = [
            ['categoria_id' => $catCafeTost->id_categoria, 'sku' => 'CAFT-001', 'codigo_barras' => '7750001000011', 'nombre' => 'Café Tostado Molido 250g', 'descripcion' => 'Café arábica tostado medio', 'precio_compra' => 8.00, 'precio_minorista' => 15.00, 'precio_mayorista' => 12.00, 'unidad_medida' => 'paquete', 'stock_actual' => 200, 'stock_minimo' => 20],
            ['categoria_id' => $catCafeTost->id_categoria, 'sku' => 'CAFT-002', 'codigo_barras' => '7750001000028', 'nombre' => 'Café Tostado en Grano 500g', 'descripcion' => 'Café de altura, tueste oscuro', 'precio_compra' => 12.00, 'precio_minorista' => 22.00, 'precio_mayorista' => 18.00, 'unidad_medida' => 'bolsa', 'stock_actual' => 150, 'stock_minimo' => 15],
            ['categoria_id' => $catCafeGran->id_categoria, 'sku' => 'CAFG-001', 'codigo_barras' => '7750002000015', 'nombre' => 'Café Pergamino 1kg', 'descripcion' => 'Café sin tostar, listo para procesar', 'precio_compra' => 10.00, 'precio_minorista' => 18.00, 'precio_mayorista' => 14.00, 'unidad_medida' => 'kg', 'stock_actual' => 300, 'stock_minimo' => 30],
            ['categoria_id' => $catCacaoPol->id_categoria, 'sku' => 'CACP-001', 'codigo_barras' => '7750003000012', 'nombre' => 'Cacao en Polvo 200g', 'descripcion' => 'Cacao orgánico peruano', 'precio_compra' => 6.00, 'precio_minorista' => 12.00, 'precio_mayorista' => 9.00, 'unidad_medida' => 'paquete', 'stock_actual' => 250, 'stock_minimo' => 25],
            ['categoria_id' => $catCacaoPol->id_categoria, 'sku' => 'CACP-002', 'codigo_barras' => '7750003000029', 'nombre' => 'Cacao en Polvo 500g', 'descripcion' => 'Ideal para repostería', 'precio_compra' => 11.00, 'precio_minorista' => 20.00, 'precio_mayorista' => 16.00, 'unidad_medida' => 'bolsa', 'stock_actual' => 180, 'stock_minimo' => 18],
            ['categoria_id' => $catChoco->id_categoria, 'sku' => 'CHOC-001', 'codigo_barras' => '7750004000019', 'nombre' => 'Tableta Chocolate 70% Cacao 100g', 'descripcion' => 'Chocolate oscuro premium', 'precio_compra' => 5.00, 'precio_minorista' => 10.00, 'precio_mayorista' => 8.00, 'unidad_medida' => 'unidad', 'stock_actual' => 400, 'stock_minimo' => 40],
            ['categoria_id' => $catSemillas->id_categoria, 'sku' => 'SEMI-001', 'codigo_barras' => '7750005000016', 'nombre' => 'Semillas de Café Arábica (1kg)', 'descripcion' => 'Variedad resistente a roya', 'precio_compra' => 20.00, 'precio_minorista' => 35.00, 'precio_mayorista' => 28.00, 'unidad_medida' => 'kg', 'stock_actual' => 50, 'stock_minimo' => 5],
            ['categoria_id' => $catSemillas->id_categoria, 'sku' => 'SEMI-002', 'codigo_barras' => '7750005000023', 'nombre' => 'Plantones de Cacao Criollo (x50)', 'descripcion' => 'Plantas injertadas de alta productividad', 'precio_compra' => 150.00, 'precio_minorista' => 250.00, 'precio_mayorista' => 200.00, 'unidad_medida' => 'lote', 'stock_actual' => 10, 'stock_minimo' => 2],
            ['categoria_id' => $catFertil->id_categoria, 'sku' => 'FERT-001', 'codigo_barras' => '7750006000013', 'nombre' => 'Fertilizante Orgánico 20kg', 'descripcion' => 'Compost de pulpa de café', 'precio_compra' => 15.00, 'precio_minorista' => 28.00, 'precio_mayorista' => 22.00, 'unidad_medida' => 'saco', 'stock_actual' => 80, 'stock_minimo' => 10],
            ['categoria_id' => $catHerram->id_categoria, 'sku' => 'HERR-001', 'codigo_barras' => '7750007000010', 'nombre' => 'Machete de Cosecha', 'descripcion' => 'Acero inoxidable, mango ergonómico', 'precio_compra' => 12.00, 'precio_minorista' => 22.00, 'precio_mayorista' => 18.00, 'unidad_medida' => 'unidad', 'stock_actual' => 60, 'stock_minimo' => 6],
            ['categoria_id' => $catAcces->id_categoria, 'sku' => 'ACCE-001', 'codigo_barras' => '7750008000017', 'nombre' => 'Taza Térmica Cafetal', 'descripcion' => 'Acero inoxidable, 350ml', 'precio_compra' => 10.00, 'precio_minorista' => 18.00, 'precio_mayorista' => 14.00, 'unidad_medida' => 'unidad', 'stock_actual' => 120, 'stock_minimo' => 12],
            ['categoria_id' => $catBebidas->id_categoria, 'sku' => 'BEBF-001', 'codigo_barras' => '7750009000014', 'nombre' => 'Cold Brew Café 330ml', 'descripcion' => 'Café extraído en frío', 'precio_compra' => 4.00, 'precio_minorista' => 8.00, 'precio_mayorista' => 6.50, 'unidad_medida' => 'botella', 'stock_actual' => 300, 'stock_minimo' => 30],
            ['categoria_id' => $catSnacks->id_categoria, 'sku' => 'SNCK-001', 'codigo_barras' => '7750010000011', 'nombre' => 'Nibs de Cacao 150g', 'descripcion' => 'Trozos de cacao tostado', 'precio_compra' => 7.00, 'precio_minorista' => 14.00, 'precio_mayorista' => 11.00, 'unidad_medida' => 'paquete', 'stock_actual' => 170, 'stock_minimo' => 17],
        ];

        foreach ($productos as $p) {
            Producto::create($p);
        }
    }
}