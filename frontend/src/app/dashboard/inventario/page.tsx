'use client'

import { useState } from 'react'
import {
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Download,
  AlertCircle,
  Package,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const KPICard = ({ label, value, unit = '', trend, color = 'bg-amber-50' }: any) => (
  <Card className={`${color} border-0`}>
    <CardContent className="pt-6">
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="text-3xl font-bold text-amber-900 mt-2">
        {value} <span className="text-lg text-slate-600">{unit}</span>
      </p>
      {trend && (
        <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs semana anterior
        </p>
      )}
    </CardContent>
  </Card>
)

const Badge = ({ status }: { status: string }) => {
  const styles: any = {
    'En Stock': 'bg-green-100 text-green-800',
    'Bajo Stock': 'bg-yellow-100 text-yellow-800',
    Agotado: 'bg-red-100 text-red-800',
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  )
}

export default function InventarioPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    cantidad: '',
    cantidadMinima: '',
    precio: '',
    ubicacion: '',
  })

  const inventarioData = [
    { id: 1, producto: 'Café Arábica Premium', categoria: 'Café', cantidad: 450, cantidadMinima: 200, precio: 15.50, ubicacion: 'A-1', estado: 'En Stock', proveedor: 'Finca Los Andes' },
    { id: 2, producto: 'Cacao Fermantado 70%', categoria: 'Cacao', cantidad: 120, cantidadMinima: 150, precio: 22.00, ubicacion: 'B-3', estado: 'Bajo Stock', proveedor: 'Cacao Premium' },
    { id: 3, producto: 'Café Robusta', categoria: 'Café', cantidad: 0, cantidadMinima: 100, precio: 8.50, ubicacion: 'A-2', estado: 'Agotado', proveedor: 'Finca Del Valle' },
    { id: 4, producto: 'Cacao Orgánico', categoria: 'Cacao', cantidad: 320, cantidadMinima: 200, precio: 28.00, ubicacion: 'B-1', estado: 'En Stock', proveedor: 'Orgánico Puro' },
    { id: 5, producto: 'Café Descafeinado', categoria: 'Café', cantidad: 85, cantidadMinima: 100, precio: 12.50, ubicacion: 'A-3', estado: 'Bajo Stock', proveedor: 'Finca Los Andes' },
    { id: 6, producto: 'Nibs de Cacao', categoria: 'Derivados', cantidad: 240, cantidadMinima: 150, precio: 18.75, ubicacion: 'C-1', estado: 'En Stock', proveedor: 'Cacao Premium' },
  ]

  const stockData = [
    { nombre: 'Café Arábica', actual: 450, minimo: 200 },
    { nombre: 'Cacao Fermentado', actual: 120, minimo: 150 },
    { nombre: 'Cacao Orgánico', actual: 320, minimo: 200 },
    { nombre: 'Nibs de Cacao', actual: 240, minimo: 150 },
  ]

  const estadoData = [
    { name: 'En Stock', value: 4, fill: '#22c55e' },
    { name: 'Bajo Stock', value: 2, fill: '#eab308' },
    { name: 'Agotado', value: 1, fill: '#ef4444' },
  ]

  const filteredData = inventarioData.filter(item =>
    item.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalValor = inventarioData.reduce((sum, item) => sum + (item.cantidad * item.precio), 0)
  const bajosStock = inventarioData.filter(item => item.estado === 'Bajo Stock' || item.estado === 'Agotado').length
  const totalProductos = inventarioData.length

  const handleAddProduct = () => {
    console.log('Agregar producto:', formData)
    setFormData({ nombre: '', categoria: '', cantidad: '', cantidadMinima: '', precio: '', ubicacion: '' })
    setOpenDialog(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-amber-900">Inventario</h1>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="bg-amber-700 hover:bg-amber-800 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-amber-900">Agregar Producto al Inventario</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Producto</label>
                <Input
                  placeholder="Ej: Café Arábica Premium"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                  <Input
                    placeholder="Ej: Café"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.cantidad}
                    onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cant. Mínima</label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={formData.cantidadMinima}
                    onChange={(e) => setFormData({ ...formData, cantidadMinima: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Precio Unitario</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ubicación</label>
                <Input
                  placeholder="Ej: A-1"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                />
              </div>
              <Button onClick={handleAddProduct} className="w-full bg-amber-700 hover:bg-amber-800 text-white">
                Guardar Producto
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard label="Total de Productos" value={totalProductos} color="bg-amber-50" />
        <KPICard label="Productos Bajo Stock" value={bajosStock} color="bg-yellow-50" />
        <KPICard label="Valor Total Inventario" value={`$${totalValor.toFixed(2)}`} color="bg-green-50" />
        <KPICard label="Ubicaciones Activas" value="8" color="bg-blue-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">Stock vs Cantidad Mínima</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="nombre" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Bar dataKey="actual" fill="#C19A6B" name="Stock Actual" />
                <Bar dataKey="minimo" fill="#D4A373" name="Cantidad Mínima" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">Estado del Inventario</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={estadoData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {estadoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-amber-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-amber-900">Productos en Inventario</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Buscar producto o categoría..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-amber-200">
                  <th className="text-left py-3 px-4 font-semibold text-amber-900">Producto</th>
                  <th className="text-left py-3 px-4 font-semibold text-amber-900">Categoría</th>
                  <th className="text-left py-3 px-4 font-semibold text-amber-900">Cantidad</th>
                  <th className="text-left py-3 px-4 font-semibold text-amber-900">Mín. Req.</th>
                  <th className="text-left py-3 px-4 font-semibold text-amber-900">Ubicación</th>
                  <th className="text-left py-3 px-4 font-semibold text-amber-900">Estado</th>
                  <th className="text-left py-3 px-4 font-semibold text-amber-900">Valor Unit.</th>
                  <th className="text-center py-3 px-4 font-semibold text-amber-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} className="border-b border-slate-200 hover:bg-amber-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-900">{item.producto}</td>
                    <td className="py-3 px-4 text-slate-600">{item.categoria}</td>
                    <td className="py-3 px-4 text-slate-600">{item.cantidad}</td>
                    <td className="py-3 px-4 text-slate-600">{item.cantidadMinima}</td>
                    <td className="py-3 px-4 text-slate-600">{item.ubicacion}</td>
                    <td className="py-3 px-4">
                      <Badge status={item.estado} />
                    </td>
                    <td className="py-3 px-4 text-slate-600">${item.precio.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
