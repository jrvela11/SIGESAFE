<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AvisoWhatsapp extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'avisos_whatsapp';

    protected $fillable = [
        'envio_id',
        'numero_telefono',
        'tipo_mensaje',
        'estado_envio',
        'estado',
    ];

    protected $casts = [
        'estado' => 'boolean',
    ];
}