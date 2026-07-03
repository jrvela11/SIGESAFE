<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryMovement extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'inventory_id',
        'sale_detail_id',
        'purchase_detail_id',
        'tipo',
        'cantidad',
        'descripcion',
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
            'inventory_id' => 'integer',
            'sale_detail_id' => 'integer',
            'cantidad' => 'decimal:2',
            'created_at' => 'timestamp',
        ];
    }

    public function inventory(): BelongsTo
    {
        return $this->belongsTo(Inventory::class);
    }

    public function saleDetail(): BelongsTo
    {
        return $this->belongsTo(SaleDetail::class);
    }
}
