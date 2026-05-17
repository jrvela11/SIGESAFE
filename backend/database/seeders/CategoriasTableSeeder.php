<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Categoria;

class CategoriasTableSeeder extends Seeder
{
    public function run(): void
    {
        $categorias = [
            ['nombre_categoria' => 'Café Tostado', 'descripcion' => 'Café listo para consumir'],
            ['nombre_categoria' => 'Café en Grano', 'descripcion' => 'Café verde o pergamino'],
            ['nombre_categoria' => 'Cacao en Polvo', 'descripcion' => 'Cacao procesado para repostería'],
            ['nombre_categoria' => 'Chocolates', 'descripcion' => 'Tabletas y bombones'],
            ['nombre_categoria' => 'Semillas y Plantones', 'descripcion' => 'Insumos para siembra'],
            ['nombre_categoria' => 'Fertilizantes', 'descripcion' => 'Abonos orgánicos y químicos'],
            ['nombre_categoria' => 'Herramientas', 'descripcion' => 'Equipos de labranza y cosecha'],
            ['nombre_categoria' => 'Accesorios', 'descripcion' => 'Tazas, molinillos, filtros'],
            ['nombre_categoria' => 'Bebidas Frías', 'descripcion' => 'Cold brew, café embotellado'],
            ['nombre_categoria' => 'Snacks de Cacao', 'descripcion' => 'Nibs, granolas, barras energéticas'],
            ['nombre_categoria' => 'Materia Prima', 'descripcion' => 'Café pergamino, cacao en baba'],
            ['nombre_categoria' => 'Maquinaria', 'descripcion' => 'Tostadoras, molinos, despulpadoras'],
        ];

        foreach ($categorias as $cat) {
            Categoria::create($cat);
        }
    }
}