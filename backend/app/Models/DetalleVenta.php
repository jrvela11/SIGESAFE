<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DetalleVenta extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'detalle_ventas';

    protected $fillable = [
        'venta_id', 'producto_id', 'cantidad', 
        'precio_unitario', 'descuento', 'subtotal', 'estado'
    ];

    protected $casts = [
        'cantidad' => 'float',
        'precio_unitario' => 'float',
        'descuento' => 'float',
        'subtotal' => 'float',
        'estado' => 'boolean',
    ];

    public function venta() {
        return $this->belongsTo(Venta::class);
    }

    public function producto() {
        return $this->belongsTo(Producto::class);
    }
}