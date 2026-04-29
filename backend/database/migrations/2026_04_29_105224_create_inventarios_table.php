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
        Schema::create('inventarios', function (Blueprint $table) {
            $table->id('id_inventario');
            $table->unsignedBigInteger('id_producto')->unique();
            $table->foreign('id_producto')->references('id_producto')->on('productos')->onDelete('cascade');
            $table->decimal('stock_actual', 10, 2)->default(0);
            $table->decimal('punto_reorden', 10, 2)->default(5.00);
            $table->string('ubicacion_bodega', 50)->nullable();
            $table->timestamps();
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventarios');
    }
};
