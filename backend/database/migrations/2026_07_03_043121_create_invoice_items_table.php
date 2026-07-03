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
        Schema::create('invoice_items', function (Blueprint $table) {
            $table->id();

            // Llaves foráneas con eliminación en cascada si se borra el borrador del comprobante
            $table->foreignId('invoice_id')->constrained('invoices')->cascadeOnDelete();
            $table->foreignId('producto_id')->nullable()->constrained('products')->nullOnDelete();

            // Snapshot del artículo vendido para congelar la información histórica
            $table->string('codigo_producto', 50)->nullable();
            $table->string('descripcion', 255);
            $table->string('unidad_medida', 20)->default('NIU'); // NIU = Unidades

            // Cuantificadores con 3 decimales para prever ventas fraccionadas
            $table->decimal('cantidad', 12, 3);

            // Al estar en zona exonerada, el valor unitario y precio unitario son iguales (IGV = 0)
            $table->decimal('valor_unitario', 12, 2);  // Precio Base
            $table->decimal('precio_unitario', 12, 2); // Precio Final con Impuestos

            // Configuración del Impuesto de SUNAT (Fijado en código '20' = Exonerado)
            $table->string('tipo_afectacion_igv', 2)->default('20'); // Catálogo 07 de SUNAT
            $table->decimal('porcentaje_igv', 5, 2)->default(0.00);  // 0% Tasa impositiva
            $table->decimal('igv_linea', 12, 2)->default(0.00);      // 0.00 de impuesto acumulado

            // Cálculos finales por cada ítem
            $table->decimal('subtotal', 12, 2); // cantidad * valor_unitario
            $table->decimal('total', 12, 2);    // subtotal + igv_linea

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_items');
    }
};
