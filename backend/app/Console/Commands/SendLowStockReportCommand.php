<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Product;
use App\Mail\LowStockReportMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendLowStockReportCommand extends Command
{
    // El nombre con el que ejecutarás el comando en la terminal
    protected $signature = 'report:low-stock';

    protected $description = 'Envía un reporte por correo al dueño con los productos de bajo stock';

    public function handle()
    {
        // 1. Definir qué consideras "bajo stock" (ejemplo: menos de 5 unidades)
        $lowStockProducts = Product::where('stock_actual', '<=', 5)->get();

        if ($lowStockProducts->isEmpty()) {
            $this->info('No hay productos con bajo stock hoy.');
            return Command::SUCCESS;
        }

        // 2. Obtener el correo del dueño (puedes jalarlo de un config o del primer admin)
        $ownerEmail = config('mail.owner_email') ?? 'smithdelgado111@gmail.com';

        try {
            // 3. Enviar el correo pasando la colección de productos
            Mail::to($ownerEmail)->send(new LowStockReportMail($lowStockProducts));

            $this->info('Reporte de bajo stock enviado correctamente.');
            return Command::SUCCESS;
        } catch (\Exception $e) {
            Log::error('Error enviando reporte de stock: ' . $e->getMessage());
            $this->error('Falló el envío del reporte.');
            return Command::FAILURE;
        }
    }
}
