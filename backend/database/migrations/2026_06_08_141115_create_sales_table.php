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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->nullable();
            $table->foreignId('user_id');
            $table->enum('tipo_venta', ["minorista","mayorista"]);
            $table->string('tipo_comprobante', 50);
            $table->string('serie', 4);
            $table->string('correlativo', 10);
            $table->decimal('subtotal', 10, 2);
            $table->decimal('igv', 10, 2)->default(0.00);
            $table->decimal('total', 10, 2);
            $table->string('metodo_pago')->default('Efectivo');
            $table->string('estado_pago')->default('pagado');
            $table->dateTime('fecha_venta');
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
        Schema::dropIfExists('sales');
    }
};
