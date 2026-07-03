<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvoiceItem extends Model
{
    use HasFactory;

    // Forzamos el nombre de la tabla en inglés configurado en la migración
    protected $table = 'invoice_items';

    // Permitimos la asignación masiva
    protected $guarded = [];

    // Casteamos 'cantidad' a 3 decimales y los precios/totales a 2 decimales
    protected $casts = [
        'cantidad'        => 'decimal:3',
        'valor_unitario'  => 'decimal:2',
        'precio_unitario' => 'decimal:2',
        'porcentaje_igv'  => 'decimal:2',
        'igv_linea'       => 'decimal:2',
        'subtotal'        => 'decimal:2',
        'total'           => 'decimal:2',
    ];

    /**
     * Relación Inversa: Cada línea del detalle pertenece a un único comprobante (Invoice).
     */
    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class, 'invoice_id');
    }

    /**
     * Relación: Un detalle de comprobante puede estar asociado opcionalmente a un producto (Product).
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'producto_id');
    }
}
