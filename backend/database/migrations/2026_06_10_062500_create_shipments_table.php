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
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->string('sale_id');
            $table->string('carrier_id');
            $table->enum('tipo_envio', ["bus","shalom","olva"]);
            $table->string('numero_seguimiento', 100)->nullable();
            $table->string('repartidor_nombre', 255)->nullable();
            $table->text('direccion_destino');
            $table->decimal('costo_envio', 10, 2)->default(0.00);
            $table->date('fecha_estimada_llegada')->nullable();
            $table->string('estado_actual', 50)->default('preparando');
            $table->json('tracking_metadata')->nullable();
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
        Schema::dropIfExists('shipments');
    }
};
