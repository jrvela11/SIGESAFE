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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();

            // Relaciones referenciales (Nombres de tablas foráneas asumen 'clientes' y 'ventas')
            $table->foreignId('cliente_id')->nullable()->constrained('customers')->nullOnDelete();
            $table->foreignId('venta_id')->nullable()->constrained('sales')->nullOnDelete();

            // Identificación oficial del Comprobante Fiscal (SUNAT)
            $table->string('tipo_comprobante', 2); // '01' = Factura, '03' = Boleta
            $table->string('serie', 4);            // Ej: F001, B001
            $table->string('numero', 8);           // Correlativo de 8 dígitos (Ej: 00000001)

            // Snapshot del Receptor (Inmutabilidad obligatoria para auditorías fiscales)
            $table->string('cliente_tipo_documento', 1); // '6' = RUC, '1' = DNI
            $table->string('cliente_numero_documento', 15);
            $table->string('cliente_denominacion', 255); // Razón social o nombres completos
            $table->string('cliente_direccion', 255)->nullable();

            // Gestión de Totales (Configurado para Zona Exonerada - Ley de Amazonía)
            $table->decimal('total_op_gravada', 12, 2)->default(0.00);
            $table->decimal('total_op_exonerada', 12, 2)->default(0.00); // Aquí se acumulará el monto total de tu venta
            $table->decimal('total_op_inafecta', 12, 2)->default(0.00);
            $table->decimal('total_igv', 12, 2)->default(0.00);          // Siempre 0.00 por la exoneración
            $table->decimal('total_descuentos', 12, 2)->default(0.00);
            $table->decimal('total_pagar', 12, 2)->default(0.00);
            $table->string('moneda', 3)->default('PEN');                 // Soles por defecto

            // Fechas del documento
            $table->date('fecha_emision');
            $table->date('fecha_vencimiento')->nullable();

            // Flag de Control Fiscal para activar la impresión de leyendas obligatorias
            $table->boolean('aplica_ley_amazonia')->default(true); // Ley N° 27037

            // Control de Estados con el proveedor electrónico (SUNAT / OSE / PSE)
            $table->enum('estado_sunat', ['PENDIENTE', 'ACEPTADO', 'RECHAZADO', 'ANULADO'])->default('PENDIENTE');
            $table->string('codigo_respuesta_sunat', 10)->nullable();
            $table->text('descripcion_respuesta_sunat')->nullable();

            // Rutas de archivos digitales y firma hash
            $table->string('hash_cpe')->nullable(); // Hash de la firma digital
            $table->string('ruta_xml')->nullable();
            $table->string('ruta_cdr')->nullable(); // Constancia de Recepción de SUNAT

            $table->timestamps();

            // Restricción Única Compuesta: Evita duplicar numeraciones de un mismo comprobante fiscal
            $table->unique(['tipo_comprobante', 'serie', 'numero'], 'idx_invoice_unique');

            // Índice de optimización para búsquedas de reportes contables y diarios
            $table->index(['fecha_emision', 'estado_sunat'], 'idx_invoice_audit');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
