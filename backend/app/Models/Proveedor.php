<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Proveedor extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'proveedores';

    protected $fillable = [
        'tipo_documento',
        'numero_documento',
        'razon_social',
        'contacto',
        'telefono',
        'direccion',
        'region',
        'distrito',
        'provincia',
        'departamento',
        'estado',
    ];

    protected $casts = [
        'estado' => 'boolean',
    ];

    // Accesor para nombre completo (razón social + contacto si es persona natural)
    public function getNombreCompletoAttribute(): string
    {
        return trim($this->razon_social . ($this->contacto ? ' (' . $this->contacto . ')' : ''));
    }

    // Asegúrate de tener esta importación arriba si no la tienes
    // use App\Models\Inventario;

    public function inventarios() {
        return $this->hasMany(Inventario::class, 'proveedor_id');
    }
}