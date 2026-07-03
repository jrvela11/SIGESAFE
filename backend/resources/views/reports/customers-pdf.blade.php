<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte General de Clientes</title>
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
            border-bottom: 2px solid #4a5568;
            padding-bottom: 10px;
        }
        .header h2 {
            margin: 0;
            color: #2d3748;
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
            background-color: #4a5568;
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
        .text-center { text-align: center; }
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
        <h2>Reporte General de Clientes</h2>
        <p>Listado de Clientes Activos al: {{ now()->format('d/m/Y H:i:s') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 18%;">Documento</th>
                <th style="width: 32%;">Nombres y Apellidos / Razón Social</th>
                <th style="width: 25%;">Correo Electrónico</th>
                <th style="width: 12%;">Teléfono</th>
                <th style="width: 13%;">Región (Dpto)</th>
            </tr>
        </thead>
        <tbody>
            @forelse($records as $record)
                <tr>
                    <td>
                        <strong>{{ strtoupper($record->tipo_documento ?? 'DOC') }}:</strong><br>
                        {{ $record->numero_documento }}
                    </td>
                    <td>
                        <span style="font-size: 10.5px; font-weight: bold;">
                            {{ trim(($record->apellido ?? '') . ' ' . $record->nombre) }}
                        </span>
                        @if($record->direccion)
                            <br><span style="color:#718096; font-size:8px;">{{ $record->direccion }}</span>
                        @endif
                    </td>
                    <td>{{ $record->email ?? '---' }}</td>
                    <td>{{ $record->telefono ?? '---' }}</td>
                    <td>
                        {{ $record->departamento ?? '---' }}
                        @if($record->distrito)
                            <br><span style="color:#718096; font-size:8px;">{{ $record->distrito }}</span>
                        @endif
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" style="text-align: center; color: #a0aec0; padding: 20px;">
                        No hay clientes registrados o activos en el sistema.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Módulo de Administración de Clientes - Página {{ '{PAGE_NUM} de {PAGE_COUNT}' }}
    </div>

</body>
</html>