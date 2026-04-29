<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventario extends Model
{
    protected $table = 'inventarios';
    protected $primaryKey = 'id_inventario';
    
    protected $fillable = [
        'id_producto',
        'stock_actual',
        'punto_reorden',
        'ubicacion_bodega'
    ];
}
