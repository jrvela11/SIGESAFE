<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Venta extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'ventas';

    protected $fillable = [
        'cliente_id', 'user_id', 'tipo_venta', 'tipo_comprobante', 
        'serie', 'correlativo', 'subtotal', 'igv', 'total', 
        'metodo_pago', 'estado_pago', 'fecha_venta', 'estado'
    ];

    protected $casts = [
        'subtotal' => 'float',
        'igv' => 'float',
        'total' => 'float',
        'fecha_venta' => 'datetime',
        'estado' => 'boolean',
    ];

    public function cliente() {
        return $this->belongsTo(Cliente::class);
    }

    public function vendedor() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function detalles() {
        return $this->hasMany(DetalleVenta::class, 'venta_id');
    }
}