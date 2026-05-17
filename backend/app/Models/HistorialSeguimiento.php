<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HistorialSeguimiento extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'historial_seguimientos';

    protected $fillable = [
        'envio_id',
        'estado',
        'ubicacion',
        'descripcion',
        'estado_registro',
    ];

    protected $casts = [
        'estado_registro' => 'boolean',
    ];

    public function envio()
    {
        return $this->belongsTo(Envio::class);
    }
}