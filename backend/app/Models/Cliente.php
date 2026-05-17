<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cliente extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'clientes';

    protected $fillable = [
        'tipo_documento',
        'numero_documento',
        'nombre',
        'apellido',
        'email',
        'telefono',
        'direccion',
        'distrito',
        'provincia',
        'departamento',
        'estado',
    ];

    protected $casts = [
        'estado' => 'boolean',
    ];

    public function getNombreCompletoAttribute(): string
    {
        return trim($this->nombre . ' ' . $this->apellido);
    }

    public function ventas() {
    return $this->hasMany(Venta::class, 'cliente_id');
}
}