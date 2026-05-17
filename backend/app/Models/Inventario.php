<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Inventario extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'inventarios';

    protected $fillable = [
        'producto_id',
        'proveedor_id',
        'codigo_lote',
        'cantidad_inicial',
        'cantidad_actual',
        'precio_compra',
        'fecha_ingreso',
        'estado'
    ];

    protected $casts = [
        'cantidad_inicial' => 'float',
        'cantidad_actual' => 'float',
        'precio_compra' => 'float',
        'fecha_ingreso' => 'date',
        'estado' => 'boolean',
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class); // Asegúrate de tener este modelo
    }
}