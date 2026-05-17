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
        Schema::create('agencias_transporte', function (Blueprint $table) {
            $table->id();
            $table->string('nombre'); // Ej: MovilBus, GH Bus, Repartidor Propio
            $table->string('ruc_dni', 20)->nullable();
            $table->string('telefono', 20)->nullable();
            
            $table->boolean('estado')->default(true);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agencias_transporte');
    }
};
