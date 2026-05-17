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
        Schema::create('historial_seguimientos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('envio_id')->constrained('envios')->onDelete('cascade');
            
            $table->string('estado'); // Ej: "Salió de agencia en Bagua Grande"
            $table->string('ubicacion')->nullable(); // Ej: "En ruta a Chiclayo"
            $table->text('descripcion')->nullable();
            
            $table->boolean('estado_registro')->default(true);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historial_seguimientos');
    }
};
