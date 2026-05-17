<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ventas', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('cliente_id')->nullable()->constrained('clientes')->onDelete('set null');
            $table->foreignId('user_id')->constrained('users')->onDelete('restrict'); 
            
            $table->enum('tipo_venta', ['minorista', 'mayorista']);
            
            // Estructura SUNAT
            $table->string('tipo_comprobante');
            $table->string('serie', 4); 
            $table->string('correlativo', 10); 
            
            // Finanzas
            $table->decimal('subtotal', 10, 2); 
            $table->decimal('igv', 10, 2)->default(0); 
            $table->decimal('total', 10, 2);
            
            // Pagos
            $table->string('metodo_pago')->default('Efectivo'); 
            $table->string('estado_pago')->default('pagado'); 
            $table->dateTime('fecha_venta');
            
            $table->boolean('estado')->default(true);
            $table->softDeletes();
            $table->timestamps();
            
            // Evitar comprobantes duplicados en la misma serie
            $table->unique(['tipo_comprobante', 'serie', 'correlativo']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ventas');
    }
};