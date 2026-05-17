'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  MoreVertical,
  Search,
  Download,
  TrendingUp,
  Package,
  MapPin,
  Calendar,
} from 'lucide-react'
import { KPICard } from '../../../components/kpi-card'

const mockTrazabilidad = [
  {
    id: 1,
    lote: 'LT-2024-001',
    producto: 'Café Premium Arábica',
    proveedor: 'Finca El Paraíso',
    cantidad: 500,
    unidad: 'kg',
    fechaCompra: '2024-01-15',
    cliente: 'Café Deluxe S.A.',
    fechaVenta: '2024-01-20',
    estado: 'Entregado',
    ubicacion: 'Bogotá',
    temperatura: '18°C',
    humedad: '65%',
  },
  {
    id: 2,
    lote: 'LT-2024-002',
    producto: 'Cacao Fino de Aroma',
    proveedor: 'Cacao del Pacífico',
    cantidad: 300,
    unidad: 'kg',
    fechaCompra: '2024-01-18',
    cliente: 'Chocolate Artesanal',
    fechaVenta: '2024-01-25',
    estado: 'En Tránsito',
    ubicacion: 'Medellín',
    temperatura: '16°C',
    humedad: '60%',
  },
  {
    id: 3,
    lote: 'LT-2024-003',
    producto: 'Café Robusta',
    proveedor: 'Plantación San Jorge',
    cantidad: 750,
    unidad: 'kg',
    fechaCompra: '2024-01-20',
    cliente: 'Distribuidora Nacional',
    fechaVenta: '2024-02-01',
    estado: 'Entregado',
    ubicacion: 'Barranquilla',
    temperatura: '20°C',
    humedad: '70%',
  },
  {
    id: 4,
    lote: 'LT-2024-004',
    producto: 'Cacao Convencional',
    proveedor: 'Finca El Paraíso',
    cantidad: 200,
    unidad: 'kg',
    fechaCompra: '2024-01-22',
    cliente: 'Exportaciones Tropical',
    fechaVenta: null,
    estado: 'En Inventario',
    ubicacion: 'Cali',
    temperatura: '17°C',
    humedad: '62%',
  },
  {
    id: 5,
    lote: 'LT-2024-005',
    producto: 'Café Premium Arábica',
    proveedor: 'Cacao del Pacífico',
    cantidad: 400,
    unidad: 'kg',
    fechaCompra: '2024-01-25',
    cliente: 'Tienda Premium Coffee',
    fechaVenta: '2024-02-05',
    estado: 'Entregado',
    ubicacion: 'Bogotá',
    temperatura: '19°C',
    humedad: '64%',
  },
]

const flujoTrazabilidad = [
  { mes: 'Ene', compras: 2200, ventas: 1800, inventario: 400 },
  { mes: 'Feb', compras: 2500, ventas: 2000, inventario: 900 },
  { mes: 'Mar', compras: 3100, ventas: 2500, inventario: 1500 },
  { mes: 'Abr', compras: 2800, ventas: 2300, inventario: 1000 },
]

const estadoProductos = [
  { estado: 'Entregado', cantidad: 3 },
  { estado: 'En Tránsito', cantidad: 1 },
  { estado: 'En Inventario', cantidad: 1 },
]

export default function TrazabilidadPage() {
  const [registros, setRegistros] = useState(mockTrazabilidad)
  const [filtro, setFiltro] = useState('')

  const registrosFiltrados = registros.filter(
    (registro) =>
      registro.lote.toLowerCase().includes(filtro.toLowerCase()) ||
      registro.producto.toLowerCase().includes(filtro.toLowerCase()) ||
      registro.proveedor.toLowerCase().includes(filtro.toLowerCase()) ||
      registro.cliente.toLowerCase().includes(filtro.toLowerCase())
  )

  const totalRegistros = registros.length
  const productosEntregados = registros.filter(
    (r) => r.estado === 'Entregado'
  ).length
  const productosEnTransito = registros.filter(
    (r) => r.estado === 'En Tránsito'
  ).length
  const cantidadTotal = registros.reduce((sum, r) => sum + r.cantidad, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Trazabilidad</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          titulo="Registros Totales"
          valor={totalRegistros}
          subunidad="lotes rastreados"
          tendencia={12}
          icono={Package}
          color="bg-amber-50"
        />
        <KPICard
          titulo="Productos Entregados"
          valor={productosEntregados}
          subunidad="completados"
          tendencia={8}
          icono={MapPin}
          color="bg-amber-50"
        />
        <KPICard
          titulo="En Tránsito"
          valor={productosEnTransito}
          subunidad="en camino"
          tendencia={-2}
          icono={TrendingUp}
          color="bg-amber-50"
        />
        <KPICard
          titulo="Cantidad Total"
          valor={`${cantidadTotal}kg`}
          subunidad="rastreados"
          tendencia={5}
          icono={Calendar}
          color="bg-amber-50"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Flujo de Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={flujoTrazabilidad}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="compras"
                  stroke="#8B5A2B"
                  strokeWidth={2}
                  name="Compras (kg)"
                />
                <Line
                  type="monotone"
                  dataKey="ventas"
                  stroke="#C19A6B"
                  strokeWidth={2}
                  name="Ventas (kg)"
                />
                <Line
                  type="monotone"
                  dataKey="inventario"
                  stroke="#D4A373"
                  strokeWidth={2}
                  name="Inventario (kg)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado de Envíos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={estadoProductos}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="estado" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#8B5A2B" name="Cantidad de Lotes" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Registro de Trazabilidad</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar lote, producto o cliente..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-slate-700">Lote</TableHead>
                  <TableHead className="text-slate-700">Producto</TableHead>
                  <TableHead className="text-slate-700">Proveedor</TableHead>
                  <TableHead className="text-slate-700">Fecha Compra</TableHead>
                  <TableHead className="text-slate-700">Cliente</TableHead>
                  <TableHead className="text-slate-700">Fecha Venta</TableHead>
                  <TableHead className="text-slate-700">Estado</TableHead>
                  <TableHead className="text-slate-700">Condiciones</TableHead>
                  <TableHead className="text-right text-slate-700">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrosFiltrados.map((registro) => (
                  <TableRow key={registro.id} className="border-slate-200">
                    <TableCell className="font-medium text-slate-900">
                      {registro.lote}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {registro.producto}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {registro.proveedor}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {registro.fechaCompra}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {registro.cliente}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {registro.fechaVenta || '-'}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          registro.estado === 'Entregado'
                            ? 'bg-green-100 text-green-800'
                            : registro.estado === 'En Tránsito'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {registro.estado}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      <div className="space-y-1">
                        <div>🌡️ {registro.temperatura}</div>
                        <div>💧 {registro.humedad}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver detalles completos</DropdownMenuItem>
                          <DropdownMenuItem>Certificado de origen</DropdownMenuItem>
                          <DropdownMenuItem>Historial de envío</DropdownMenuItem>
                          <DropdownMenuItem>Descargar reporte</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
