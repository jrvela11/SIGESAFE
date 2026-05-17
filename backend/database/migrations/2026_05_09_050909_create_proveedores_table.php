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
        Schema::create('proveedores', function (Blueprint $table) {
            $table->id();
            $table->string('razon_social'); // Nombre del agricultor o empresa
            $table->string('ruc_dni', 20)->unique();
            $table->string('contacto')->nullable();
            $table->string('telefono', 20)->nullable();
            $table->string('direccion')->nullable();
            $table->string('region')->nullable(); // Ej: Amazonas, Cajamarca
            
            $table->boolean('estado')->default(true); // Para desactivar sin borrar
            $table->softDeletes(); // Borrado lógico
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proveedores');
    }
};
