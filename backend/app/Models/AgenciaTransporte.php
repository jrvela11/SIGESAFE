<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AgenciaTransporte extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'agencias_transporte';

    protected $fillable = [
        'nombre',
        'ruc_dni',
        'telefono',
        'estado',
    ];

    protected $casts = [
        'estado' => 'boolean',
    ];
}