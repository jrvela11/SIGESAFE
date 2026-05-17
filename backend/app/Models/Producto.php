<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Producto extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'productos';

    protected $fillable = [
        'categoria_id',
        'sku',
        'codigo_barras',
        'nombre',
        'descripcion',
        'precio_compra',
        'precio_minorista',
        'precio_mayorista',
        'afecto_igv',
        'unidad_medida',
        'stock_actual',
        'stock_minimo',
        'imagen_url',
        'estado'
    ];

    protected $casts = [
        'precio_compra' => 'float',
        'precio_minorista' => 'float',
        'precio_mayorista' => 'float',
        'stock_actual' => 'float',
        'stock_minimo' => 'float',
        'afecto_igv' => 'boolean',
        'estado' => 'boolean',
    ];

    // LA MAGIA DE ELOQUENT: Un Producto "pertenece a" una Categoría
    // (Le pasamos 'categoria_id' y 'id_categoria' porque no usaste el 'id' por defecto de Laravel)
    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'categoria_id', 'id_categoria');
    }
}