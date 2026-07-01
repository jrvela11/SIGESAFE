<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Customer;
use App\Models\Product;

class ReportController extends Controller
{
    public function exportPdf(Request $request)
    {
        $type = $request->query('type'); 

        switch ($type) {
            case 'customers':
               
                $data = Customer::where('estado', true)->orderBy('apellido', 'asc')->get();
                $view = 'reports.customers-pdf';
                $filename = 'reporte-clientes-';
                break;

            case 'products':
              
                $data = Product::with('category')->where('estado', true)->orderBy('nombre', 'asc')->get();
                $view = 'reports.products-pdf';
                $filename = 'reporte-productos-';
                break;

            default:
                return response()->json([
                    'success' => false,
                    'message' => 'Tipo de reporte no válido o no especificado.'
                ], 400);
        }

       
        $pdf = Pdf::loadView($view, ['records' => $data]);
        
        
        $pdf->setPaper('a4', 'portrait');

        
        return response($pdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $filename . now()->format('Y-m-d') . '.pdf"',
        ]);
    }
}