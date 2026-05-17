<?php

//migrations/2026_05_14_000000_add_documento_fields_to_clientes_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clientes', function (Blueprint $table) {
            $table->string('tipo_documento', 20)->nullable()->after('id');
            $table->string('numero_documento', 20)->nullable()->after('tipo_documento');

            // Índice para búsquedas rápidas (no unique porque puede haber clientes sin documento)
            $table->index(['tipo_documento', 'numero_documento']);
        });

        // Si la columna 'activo' existe y no se usa, la eliminamos
        if (Schema::hasColumn('clientes', 'activo')) {
            Schema::table('clientes', function (Blueprint $table) {
                $table->dropColumn('activo');
            });
        }
    }

    public function down(): void
    {
        Schema::table('clientes', function (Blueprint $table) {
            $table->dropIndex(['tipo_documento', 'numero_documento']);
            $table->dropColumn(['tipo_documento', 'numero_documento']);
        });

        if (!Schema::hasColumn('clientes', 'activo')) {
            Schema::table('clientes', function (Blueprint $table) {
                $table->boolean('activo')->default(true)->after('telefono');
            });
        }
    }
};