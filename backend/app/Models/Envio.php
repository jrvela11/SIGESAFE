<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Envio extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'envios';

    protected $fillable = [
        'venta_id',
        'agencia_transporte_id',
        'tipo_envio',
        'numero_seguimiento',
        'repartidor_nombre',
        'direccion_destino',
        'costo_envio',
        'fecha_estimada_llegada',
        'estado_actual',
        'estado',
    ];

    protected $casts = [
        'costo_envio'          => 'float',
        'fecha_estimada_llegada'=> 'date',
        'estado'               => 'boolean',
    ];

    public function venta()
    {
        return $this->belongsTo(Venta::class);
    }

    public function agenciaTransporte()
    {
        return $this->belongsTo(AgenciaTransporte::class, 'agencia_transporte_id');
    }

    public function historial()
    {
        return $this->hasMany(HistorialSeguimiento::class, 'envio_id');
    }

    public function avisosWhatsapp()
    {
        return $this->hasMany(AvisoWhatsapp::class, 'envio_id');
    }

    public function cliente()
    {
        return $this->venta->cliente();
    }
}
