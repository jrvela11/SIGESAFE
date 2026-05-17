<?php

//migrations/2026_04_29_141459_create_clientes_table.php
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
        Schema::create('clientes', function (Blueprint $table) {
            $table->id(); // ID autoincremental
            $table->string('nombre', 100);
            $table->string('apellido', 100)->nullable();
            $table->string('email')->nullable()->unique();
            $table->string('telefono', 20)->nullable();
            $table->text('direccion')->nullable();
            $table->boolean('activo')->default(true);
            $table->boolean('estado')->default(true);
            $table->softDeletes();
            $table->timestamps(); // Crea created_at y updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};
