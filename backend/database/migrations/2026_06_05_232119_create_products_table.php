<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id');
            $table->string('sku')->unique();
            $table->string('codigo_barras', 50)->nullable();
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->decimal('precio_compra', 10, 2)->default(0.00);
            $table->decimal('precio_minorista', 10, 2);
            $table->decimal('precio_mayorista', 10, 2);
            $table->boolean('afecto_igv')->default(true);
            $table->string('unidad_medida');
            $table->decimal('stock_actual', 10, 2)->default(0.00);
            $table->decimal('stock_minimo', 10, 2)->default(5.00);
            $table->string('imagen_url')->nullable();
            $table->boolean('estado')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
