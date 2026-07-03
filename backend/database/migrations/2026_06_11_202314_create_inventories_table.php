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
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id');
            $table->foreignId('proveedor_id' )->nullable();
            $table->string('codigo_lote', 100);
            $table->decimal('cantidad_inicial', 10, 2);
            $table->decimal('cantidad_actual', 10, 2);
            $table->decimal('precio_compra', 10, 2);
            $table->date('fecha_ingreso');
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
        Schema::dropIfExists('inventories');
    }
};
