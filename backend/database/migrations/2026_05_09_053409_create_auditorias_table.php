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
        Schema::create('auditorias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null'); // Quién hizo la acción
            
            $table->string('accion'); // Crear, Editar, Eliminar, Restaurar
            $table->string('nombre_tabla'); // Ej: ventas, clientes, inventarios
            $table->unsignedBigInteger('registro_id'); // El ID del registro afectado
            
            $table->json('valores_antiguos')->nullable(); // Cómo estaban los datos ANTES
            $table->json('valores_nuevos')->nullable(); // Cómo quedaron los datos DESPUÉS
            $table->string('direccion_ip')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auditorias');
    }
};
