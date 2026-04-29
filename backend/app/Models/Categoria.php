<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    protected $table = 'categorias';
    protected $primaryKey = 'id_categoria'; // Especificamos la llave primaria
    
    protected $fillable = [
        'nombre_categoria',
        'descripcion'
    ];
}
