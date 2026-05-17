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
        Schema::create('envios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('venta_id')->constrained('ventas')->onDelete('cascade');
            // nullable() porque si es un delivery local en moto, tal vez no use agencia
            $table->foreignId('agencia_transporte_id')->nullable()->constrained('agencias_transporte')->onDelete('restrict');
            
            $table->enum('tipo_envio', ['local', 'interregional']);
            $table->string('numero_seguimiento')->nullable(); // Ticket de la agencia
            $table->string('repartidor_nombre')->nullable(); // Nombre del mototaxista o chofer
            $table->string('direccion_destino');
            $table->decimal('costo_envio', 10, 2)->default(0);
            $table->date('fecha_estimada_llegada')->nullable();
            $table->string('estado_actual')->default('preparando'); // preparando, en_agencia, en_transito, entregado
            
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
        Schema::dropIfExists('envios');
    }
};
