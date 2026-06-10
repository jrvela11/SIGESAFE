<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'category_id',
        'sku',
        'codigo_barras',
        'nombre',
        'descripcion',
        'precio_compra',
        'precio_minorista',
        'precio_mayorista',
        'afecto_igv',
        'unidad_medida',
        'stock_actual',
        'stock_minimo',
        'imagen_url',
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
            'category_id' => 'integer',
            'precio_compra' => 'decimal:2',
            'precio_minorista' => 'decimal:2',
            'precio_mayorista' => 'decimal:2',
            'afecto_igv' => 'boolean',
            'stock_actual' => 'decimal:2',
            'stock_minimo' => 'decimal:2',
            'estado' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
