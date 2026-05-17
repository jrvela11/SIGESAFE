<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('proveedores', function (Blueprint $table) {
            // Si existe la columna ruc_dni, la eliminamos
            if (Schema::hasColumn('proveedores', 'ruc_dni')) {
                $table->dropColumn('ruc_dni');
            }

            $table->string('tipo_documento', 20)->nullable()->after('id');
            $table->string('numero_documento', 20)->nullable()->after('tipo_documento');
            $table->string('distrito', 100)->nullable()->after('region');
            $table->string('provincia', 100)->nullable()->after('distrito');
            $table->string('departamento', 100)->nullable()->after('provincia');

            $table->index(['tipo_documento', 'numero_documento']);
        });
    }

    public function down(): void
    {
        Schema::table('proveedores', function (Blueprint $table) {
            $table->dropIndex(['tipo_documento', 'numero_documento']);
            $table->dropColumn(['tipo_documento', 'numero_documento', 'distrito', 'provincia', 'departamento']);

            if (!Schema::hasColumn('proveedores', 'ruc_dni')) {
                $table->string('ruc_dni', 20)->unique()->after('razon_social');
            }
        });
    }
};