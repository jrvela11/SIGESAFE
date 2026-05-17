<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'categoria_id' => $this->categoria_id,
            
            'categoria_nombre' => $this->categoria ? $this->categoria->nombre_categoria : 'Sin categoría',
            
            'sku' => $this->sku,
            'codigo_barras' => $this->codigo_barras,
            'nombre' => $this->nombre,
            'descripcion' => $this->descripcion,
            
            'precio_compra' => $this->precio_compra,
            'precio_minorista' => $this->precio_minorista,
            'precio_mayorista' => $this->precio_mayorista,
            'afecto_igv' => $this->afecto_igv,
            
            'unidad_medida' => $this->unidad_medida,
            'stock_actual' => $this->stock_actual,
            'stock_minimo' => $this->stock_minimo,
            
            'imagen_url' => $this->imagen_url,
            'estado' => $this->estado,
            'created_at' => $this->created_at,
        ];
    }
}