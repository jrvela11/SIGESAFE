<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{
    use HasFactory;

    // Forzamos el nombre de la tabla en inglés configurado en la migración
    protected $table = 'invoices';

    // Permitimos la asignación masiva de todos los campos por seguridad transaccional
    protected $guarded = [];

    // Mutadores de casteo para asegurar precisión numérica y tipado estricto
    protected $casts = [
        'total_op_gravada'    => 'decimal:2',
        'total_op_exonerada'  => 'decimal:2',
        'total_op_inafecta'   => 'decimal:2',
        'total_igv'           => 'decimal:2',
        'total_descuentos'    => 'decimal:2',
        'total_pagar'         => 'decimal:2',
        'fecha_emision'       => 'date:Y-m-d',
        'fecha_vencimiento'   => 'date:Y-m-d',
        'aplica_ley_amazonia' => 'boolean',
    ];

    /**
     * Relación: Un comprobante tiene muchos detalles/ítems.
     */
    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class, 'invoice_id');
    }

    /**
     * Relación: Un comprobante pertenece a un cliente (Customer).
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'cliente_id');
    }

    /**
     * Relación: Un comprobante pertenece a una venta (Sale).
     */
    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class, 'venta_id');
    }
}
