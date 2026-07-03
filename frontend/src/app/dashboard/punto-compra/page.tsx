'use client'

import { useState } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Search, Trash2, ChevronDown, Package, TrendingDown, Clock, Eye } from 'lucide-react'
import { KPICard } from '@/components/kpi-card'

const suppliers = [
  { id: 1, name: 'Finca La Esperanza', city: 'Armenia', product: 'Café Arábica', price: 5.50, stock: 100 },
  { id: 2, name: 'Plantaciones Cacao Fino', city: 'Pereira', product: 'Cacao 70%', price: 8.00, stock: 60 },
  { id: 3, name: 'Hacienda Villa Rica', city: 'Manizales', product: 'Café Robusta', price: 4.50, stock: 150 },
  { id: 4, name: 'Cooperativa Cacao Puro', city: 'Montería', product: 'Cacao Blanco', price: 10.00, stock: 40 },
  { id: 5, name: 'Café Montaña Alta', city: 'Nariño', product: 'Mezcla Especial', price: 6.50, stock: 80 },
]

const purchaseData = [
  { date: 'Lun', purchases: 8, amount: 4200 },
  { date: 'Mar', purchases: 12, amount: 6300 },
  { date: 'Mié', purchases: 10, amount: 5100 },
  { date: 'Jue', purchases: 15, amount: 7800 },
  { date: 'Vie', purchases: 18, amount: 9400 },
  { date: 'Sáb', purchases: 14, amount: 7200 },
  { date: 'Dom', purchases: 6, amount: 3100 },
]

const supplierDistribution = [
  { name: 'Finca La Esperanza', value: 3200 },
  { name: 'Plantaciones Cacao Fino', value: 2800 },
  { name: 'Hacienda Villa Rica', value: 3500 },
  { name: 'Cooperativa Cacao Puro', value: 2100 },
]

const COLORS = ['#C19A6B', '#8B5A2B', '#A0826D', '#D4A373']

interface PurchaseItem {
  id: number
  supplierName: string
  product: string
  unitPrice: number
  quantity: number
}

export default function PurchasePointPage() {
  const [cart, setCart] = useState<PurchaseItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPayment, setSelectedPayment] = useState('Transferencia')
  const [showConfirmation, setShowConfirmation] = useState(false)

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addToCart = (supplier: (typeof suppliers)[0]) => {
    const existingItem = cart.find((item) => item.id === supplier.id)
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === supplier.id ? { ...item, quantity: item.quantity + 10 } : item
        )
      )
    } else {
      setCart([
        ...cart,
        {
          id: supplier.id,
          supplierName: supplier.name,
          product: supplier.product,
          unitPrice: supplier.price,
          quantity: 10,
        },
      ])
    }
  }

  const removeFromCart = (supplierId: number) => {
    setCart(cart.filter((item) => item.id !== supplierId))
  }

  const updateQuantity = (supplierId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(supplierId)
    } else {
      setCart(
        cart.map((item) =>
          item.id === supplierId ? { ...item, quantity } : item
        )
      )
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const discount = subtotal * 0.05
  const total = subtotal - discount

  const handleConfirmPurchase = () => {
    setShowConfirmation(true)
    setTimeout(() => {
      setCart([])
      setShowConfirmation(false)
    }, 3000)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Punto de Compra</h1>
          <p className="text-slate-600 mt-1">Registra compras a proveedores</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Invertido"
          value="$45,320.00"
          trend="+18%"
          icon={<TrendingDown className="w-5 h-5" />}
        />
        <KPICard
          title="Compras Este Mes"
          value="98"
          trend="+22%"
          icon={<Package className="w-5 h-5" />}
        />
        <KPICard
          title="Promedio por Compra"
          value="$462.45"
          trend="+12%"
          icon={<Clock className="w-5 h-5" />}
        />
        <KPICard
          title="Proveedores Activos"
          value="12"
          trend="+3%"
          icon={<Eye className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle>Proveedores Disponibles</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Buscar proveedor o producto..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredSuppliers.map((supplier) => (
                  <div
                    key={supplier.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-slate-900 text-sm">{supplier.name}</h3>
                        <p className="text-xs text-slate-600">{supplier.city}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-700">{supplier.product}</p>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-lg font-bold text-amber-700">${supplier.price.toFixed(2)}/kg</p>
                          <p className="text-xs text-slate-500">Disponible: {supplier.stock}kg</p>
                        </div>
                        <Button
                          onClick={() => addToCart(supplier)}
                          size="sm"
                          className="bg-amber-700 hover:bg-amber-800"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-base">Compras por Día</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={purchaseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#8B5A2B" name="Inversión ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-base">Distribución por Proveedor</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={supplierDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name.split(' ')[0]} $${(value / 1000).toFixed(1)}k`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {supplierDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="border-0 shadow-sm sticky top-6">
            <CardHeader className="bg-amber-700 text-white border-b">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Orden de Compra
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {cart.length === 0 ? (
                <p className="text-slate-500 text-center py-8">Orden vacía</p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="border-b pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{item.product}</p>
                          <p className="text-xs text-slate-600">{item.supplierName}</p>
                          <p className="text-xs text-slate-600">${item.unitPrice.toFixed(2)}/kg</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 5)}
                          className="bg-slate-200 px-2 py-1 rounded text-sm"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-12 text-center border rounded text-sm"
                        />
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 5)}
                          className="bg-slate-200 px-2 py-1 rounded text-sm"
                        >
                          +
                        </button>
                        <span className="ml-auto font-semibold text-slate-900 text-sm">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t mt-4 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal:</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-700">
                  <span className="text-slate-600">Descuento (5%):</span>
                  <span className="font-semibold">-${discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold bg-amber-50 p-3 rounded">
                  <span>Total:</span>
                  <span className="text-amber-700">${total.toFixed(2)}</span>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Forma de Pago</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {selectedPayment}
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <DropdownMenuItem onClick={() => setSelectedPayment('Transferencia')}>
                        Transferencia Bancaria
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedPayment('Efectivo')}>
                        Efectivo
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedPayment('Cheque')}>
                        Cheque
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedPayment('Crédito')}>
                        Crédito
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Button
                  onClick={handleConfirmPurchase}
                  disabled={cart.length === 0}
                  className="w-full bg-amber-700 hover:bg-amber-800 h-10"
                >
                  Confirmar Orden
                </Button>

                {showConfirmation && (
                  <div className="bg-green-50 border border-green-300 rounded p-3 text-center">
                    <p className="text-green-700 font-semibold">¡Orden confirmada!</p>
                    <p className="text-sm text-green-600">Se notificó al proveedor</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
