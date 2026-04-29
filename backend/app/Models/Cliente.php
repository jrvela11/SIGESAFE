<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory;

    /**
     * La tabla asociada al modelo.
     * (Opcional: Laravel asume que la tabla se llama 'clientes' por el nombre del modelo)
     */
    protected $table = 'clientes';

    /**
     * Los atributos que se pueden asignar de forma masiva.
     * Deben coincidir con los que pusimos en la migración.
     */
    protected $fillable = [
        'nombre',
        'apellido',
        'email',
        'telefono',
        'direccion',
        'activo',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     * Útil para que 'activo' se trate como un booleano real en PHP.
     */
    protected $casts = [
        'activo' => 'boolean',
    ];
}
