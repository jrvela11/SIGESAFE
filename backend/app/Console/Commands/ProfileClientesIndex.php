<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Cliente;
use Illuminate\Support\Benchmark;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ProfileClientesIndex extends Command
{
    protected $signature = 'profile:clientes';
    protected $description = 'Ejecuta el profiling de la lista de clientes con 5 tamaños de entrada';

    public function handle()
    {
        // Tamaños de prueba estipulados
        $escenarios = [100, 200, 300, 400, 500];

        $this->info("=== INICIANDO VALIDACIÓN EMPÍRICA (index) ===");

        foreach ($escenarios as $n) {
            $this->warn("\nPreparando entorno para n = {$n} clientes...");
            
            // 1. Desactivar llaves foráneas, limpiar tabla y rellenar con la Factory
            Schema::disableForeignKeyConstraints();
            DB::table('clientes')->truncate();
            Schema::enableForeignKeyConstraints();

            Cliente::factory()->count($n)->create();

            // 2. Forzar la recolección de basura para limpiar mediciones anteriores
            gc_collect_cycles();
            $memoriaAntes = memory_get_usage();

            // 3. Medir el tiempo exacto de ejecución simulando la petición del controlador
            $tiempoMs = Benchmark::measure(function () {
                // Ejecutamos exactamente la lógica de tu función index()
                $clientes = Cliente::withTrashed()->orderBy('id', 'desc')->get();
                
                // Simulamos la transformación del API Resource y serialización básica
                \App\Http\Resources\ClienteResource::collection($clientes)->resolve();
            });

            $memoriaDespues = memory_get_usage();
            $memoriaConsumida = ($memoriaDespues - $memoriaAntes) / 1024 / 1024; // Convertir a MB

            // 4. Imprimir resultados en consola formalmente
            $this->line("-> Tamaño de Entrada (n): " . number_format($n));
            $this->line("-> Tiempo de CPU: " . number_format($tiempoMs, 2) . " ms");
            $this->line("-> Consumo Estimado de Memoria RAM: " . number_format($memoriaConsumida, 2) . " MB");
        }

        $this->info("\n=== PROFILING FINALIZADO ===");
    }
}