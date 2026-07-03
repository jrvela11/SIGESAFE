<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Shipment extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'sale_id',
        'carrier_id',
        'tipo_envio',
        'numero_seguimiento',
        'repartidor_nombre',
        'direccion_destino',
        'costo_envio',
        'fecha_estimada_llegada',
        'estado_actual',
        'tracking_metadata',
        'estado',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'id' => 'integer',
            'costo_envio' => 'decimal:2',
            'fecha_estimada_llegada' => 'date',
            'tracking_metadata' => 'array',
            'estado' => 'boolean',
        ];
    }

    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }

    /**
     * Obtener la agencia de transporte asignada a este envío.
     */
    public function carrier(): BelongsTo
    {
        return $this->belongsTo(Carrier::class);
    }

    public function history(): HasMany
    {
        // Pasamos el modelo ShipmentHistory y especificamos la llave foránea 'shipment_id'
        return $this->hasMany(ShipmentHistory::class, 'shipment_id', 'id');
    }
}
