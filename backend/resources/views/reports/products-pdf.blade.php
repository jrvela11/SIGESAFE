<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte de Inventario de Productos</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            font-size: 10px;
            line-height: 1.4;
        }
        .header {
            text-align: center;
            margin-bottom: 25px;
            border-bottom: 2px solid #2b6cb0;
            padding-bottom: 10px;
        }
        .header h2 {
            margin: 0;
            color: #2b6cb0;
            font-size: 18px;
            text-transform: uppercase;
        }
        .header p {
            margin: 5px 0 0 0;
            color: #718096;
            font-size: 11px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th {
            background-color: #2b6cb0;
            color: #ffffff;
            text-align: left;
            padding: 6px;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 9px;
        }
        td {
            padding: 6px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: middle;
        }
        tr:nth-child(even) {
            background-color: #f7fafc;
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .badge-danger {
            color: #c53030;
            font-weight: bold;
            background-color: #fff5f5;
            padding: 2px 4px;
            border-radius: 3px;
        }
        .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            font-size: 8px;
            color: #a0aec0;
            border-top: 1px solid #e2e8f0;
            padding-top: 5px;
        }
    </style>
</head>
<body>

    <div class="header">
        <h2>Reporte General de Inventario</h2>
        <p>Stock Actual de Productos al: {{ now()->format('d/m/Y H:i:s') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 12%;">SKU / Cód.</th>
                <th style="width: 35%;">Descripción del Producto</th>
                <th style="width: 15%;">Categoría</th>
                <th style="width: 10%;" class="text-right">P. Minorista</th>
                <th style="width: 10%;" class="text-right">P. Mayorista</th>
                <th style="width: 8%;" class="text-center">U.M.</th>
                <th style="width: 10%;" class="text-right">Stock</th>
            </tr>
        </thead>
        <tbody>
            @forelse($records as $record)
                <tr>
                    <td>
                        <strong>{{ $record->sku }}</strong>
                        @if($record->codigo_barras)
                            <br><span style="color:#718096; font-size:8px;">{{ $record->codigo_barras }}</span>
                        @endif
                    </td>
                    <td>
                        <span style="font-size: 11px; font-weight: bold;">{{ $record->nombre }}</span>
                        @if($record->afecto_igv)
                            <span style="color: #4a5568; font-size: 7.5px;">(Inc. IGV)</span>
                        @endif
                    </td>
                    <td>{{ $record->category->name ?? 'Sin Categoría' }}</td>
                    <td class="text-right">S/ {{ number_format($record->precio_minorista, 2) }}</td>
                    <td class="text-right">S/ {{ number_format($record->precio_mayorista, 2) }}</td>
                    <td class="text-center">{{ strtoupper($record->unidad_medida) }}</td>
                    <td class="text-right">
                        {{-- 💡 Bonus: Si el stock actual es menor o igual al mínimo, le ponemos una alerta visual --}}
                        @if($record->stock_actual <= $record->stock_minimo)
                            <span class="badge-danger">{{ number_format($record->stock_actual, 2) }} ⚠️</span>
                        @else
                            {{ number_format($record->stock_actual, 2) }}
                        @endif
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="7" style="text-align: center; color: #a0aec0; padding: 20px;">
                        No hay productos registrados en el inventario.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Módulo de Logística e Inventario - Página {{ '{PAGE_NUM} de {PAGE_COUNT}' }}
    </div>

</body>
</html>