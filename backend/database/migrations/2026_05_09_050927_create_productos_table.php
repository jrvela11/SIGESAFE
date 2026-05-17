<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            
            // 1. Relaciones
            $table->unsignedBigInteger('categoria_id');
            $table->foreign('categoria_id')->references('id_categoria')->on('categorias')->onDelete('restrict');
            
            $table->string('sku')->unique(); 
            $table->string('codigo_barras', 50)->nullable(); 
            $table->string('nombre');
            $table->text('descripcion')->nullable(); 
            
            $table->decimal('precio_compra', 10, 2)->default(0); 
            $table->decimal('precio_minorista', 10, 2);
            $table->decimal('precio_mayorista', 10, 2);
            $table->boolean('afecto_igv')->default(true); 
            
            $table->string('unidad_medida'); 
            $table->decimal('stock_actual', 10, 2)->default(0); 
            $table->decimal('stock_minimo', 10, 2)->default(5); 
            
            $table->string('imagen_url')->nullable(); 
            
            $table->boolean('estado')->default(true);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};