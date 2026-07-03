'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  FileDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Mock data for purchases
const initialPurchases = [
  {
    id: 1,
    proveedor: 'Café Sierra Verde',
    producto: 'Café Grano Arábica',
    cantidad: 50,
    unidad: 'kg',
    precioUnitario: 12.50,
    total: 625.00,
    fechaCompra: '2024-04-25',
    fechaEntrega: '2024-05-02',
    estado: 'entregado',
  },
  {
    id: 2,
    proveedor: 'Cacao Puro Peru',
    producto: 'Cacao en Grano Premium',
    cantidad: 30,
    unidad: 'kg',
    precioUnitario: 18.00,
    total: 540.00,
    fechaCompra: '2024-04-24',
    fechaEntrega: '2024-05-03',
    estado: 'en_transito',
  },
  {
    id: 3,
    proveedor: 'Café Sierra Verde',
    producto: 'Café Grano Robusta',
    cantidad: 40,
    unidad: 'kg',
    precioUnitario: 8.50,
    total: 340.00,
    fechaCompra: '2024-04-23',
    fechaEntrega: '2024-04-28',
    estado: 'entregado',
  },
  {
    id: 4,
    proveedor: 'Distribuidora Andes',
    producto: 'Empaques Biodegradables',
    cantidad: 1000,
    unidad: 'unidad',
    precioUnitario: 0.35,
    total: 350.00,
    fechaCompra: '2024-04-22',
    fechaEntrega: '2024-04-26',
    estado: 'pendiente',
  },
  {
    id: 5,
    proveedor: 'Cacao Puro Peru',
    producto: 'Cacao en Polvo',
    cantidad: 20,
    unidad: 'kg',
    precioUnitario: 22.00,
    total: 440.00,
    fechaCompra: '2024-04-21',
    fechaEntrega: '2024-04-29',
    estado: 'entregado',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'entregado':
      return 'bg-green-100 text-green-700 border-0';
    case 'en_transito':
      return 'bg-blue-100 text-blue-700 border-0';
    case 'pendiente':
      return 'bg-yellow-100 text-yellow-700 border-0';
    case 'cancelado':
      return 'bg-red-100 text-red-700 border-0';
    default:
      return 'bg-gray-100 text-gray-700 border-0';
  }
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    entregado: 'Entregado',
    en_transito: 'En Tránsito',
    pendiente: 'Pendiente',
    cancelado: 'Cancelado',
  };
  return labels[status] || status;
};

export default function ComprasPage() {
  const [purchases, setPurchases] = useState(initialPurchases);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredPurchases = purchases.filter(
    (purchase) =>
      purchase.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.producto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCompras = purchases.reduce((sum, p) => sum + p.total, 0);
  const comprasPendientes = purchases.filter((p) => p.estado === 'pendiente').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Compras</h1>
          <p className="text-gray-500 mt-2">
            Gestiona las compras a proveedores de café y cacao
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#8B5A2B] hover:bg-[#6B4423] text-white gap-2">
              <Plus className="w-4 h-4" />
              Nueva Compra
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Nueva Compra</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-slate-800">
                  Proveedor
                </label>
                <Input
                  placeholder="Nombre del proveedor"
                  className="mt-1 border-gray-200"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-800">
                  Producto
                </label>
                <Input
                  placeholder="Nombre del producto"
                  className="mt-1 border-gray-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-800">
                    Cantidad
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    className="mt-1 border-gray-200"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-800">
                    Unidad
                  </label>
                  <Input
                    placeholder="kg, unidad, etc"
                    className="mt-1 border-gray-200"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-800">
                  Precio Unitario
                </label>
                <Input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  className="mt-1 border-gray-200"
                />
              </div>
              <div className="pt-4 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button className="flex-1 bg-[#8B5A2B] hover:bg-[#6B4423] text-white">
                  Guardar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Total Invertido</p>
              <p className="text-3xl font-bold text-slate-800">
                S/ {totalCompras.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-500">Este mes</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Compras Pendientes</p>
              <p className="text-3xl font-bold text-[#C19A6B]">
                {comprasPendientes}
              </p>
              <p className="text-xs text-gray-500">Requieren seguimiento</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Total de Órdenes</p>
              <p className="text-3xl font-bold text-slate-800">
                {purchases.length}
              </p>
              <p className="text-xs text-gray-500">Órdenes registradas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por proveedor o producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200"
              />
            </div>
            <Button
              variant="outline"
              className="gap-2 border-gray-200"
            >
              <FileDown className="w-4 h-4" />
              Exportar
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Purchases Table */}
      <Card className="bg-white border-gray-200">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 hover:bg-transparent">
                  <TableHead className="text-slate-800 font-semibold">
                    Proveedor
                  </TableHead>
                  <TableHead className="text-slate-800 font-semibold">
                    Producto
                  </TableHead>
                  <TableHead className="text-slate-800 font-semibold text-right">
                    Cantidad
                  </TableHead>
                  <TableHead className="text-slate-800 font-semibold text-right">
                    P. Unitario
                  </TableHead>
                  <TableHead className="text-slate-800 font-semibold text-right">
                    Total
                  </TableHead>
                  <TableHead className="text-slate-800 font-semibold">
                    Fecha
                  </TableHead>
                  <TableHead className="text-slate-800 font-semibold">
                    Estado
                  </TableHead>
                  <TableHead className="text-slate-800 font-semibold text-center">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchases.map((purchase) => (
                  <TableRow
                    key={purchase.id}
                    className="border-gray-100 hover:bg-gray-50"
                  >
                    <TableCell className="text-slate-800 font-medium">
                      {purchase.proveedor}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {purchase.producto}
                    </TableCell>
                    <TableCell className="text-right text-slate-800">
                      {purchase.cantidad} {purchase.unidad}
                    </TableCell>
                    <TableCell className="text-right text-slate-800">
                      S/ {purchase.precioUnitario.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-slate-800">
                      S/ {purchase.total.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(purchase.fechaCompra).toLocaleDateString('es-PE')}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(purchase.estado)}>
                        {getStatusLabel(purchase.estado)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="inline-flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Edit className="w-4 h-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer text-red-600">
                            <Trash2 className="w-4 h-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredPurchases.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No se encontraron compras</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
