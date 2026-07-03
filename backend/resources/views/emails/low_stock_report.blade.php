<!DOCTYPE html>
<html>
<head>
    <title>Reporte de Bajo Stock</title>
    <style>
        body { font-family: sans-serif; color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background-color: #f2f2f2; }
        .text-danger { color: #dc3545; font-weight: bold; }
    </style>
</head>
<body>
    <h2>Estimado Administrador,</h2>
    <p>A continuación se listan los productos que se encuentran en estado crítico de stock hoy:</p>

    <table>
        <thead>
            <tr>
                <th>Código/SKU</th>
                <th>Producto</th>
                <th>Stock Actual</th>
            </tr>
        </thead>
        <tbody>
            @foreach($products as $product)
                <tr>
                    <td>{{ $product->sku ?? $product->id }}</td>
                    <td>{{ $product->nombre }}</td>
                    <td class="text-danger">{{ $product->stock_actual }} unidades</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <p style="margin-top: 20px; font-size: 0.9em; color: #777;">Este es un reporte automático generado por el sistema.</p>
</body>
</html>