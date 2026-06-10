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
        Schema::disableForeignKeyConstraints();

        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('supplier_id')->constrained();
            $table->string('tipo_comprobante', 50);
            $table->string('serie', 20)->nullable();
            $table->string('numero', 50);
            $table->date('fecha_emision');
            $table->decimal('subtotal', 10, 2)->default(0.00);
            $table->decimal('igv', 10, 2)->default(0.00);
            $table->decimal('total', 10, 2)->default(0.00);
            $table->boolean('estado')->default(true)->index();
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchases');
    }
};
