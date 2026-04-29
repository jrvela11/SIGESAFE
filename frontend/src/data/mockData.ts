export const metrics = [
  {
    id: 1,
    title: 'Ventas Hoy',
    value: '$12,450',
    change: '+5.2%',
    icon: 'TrendingUp',
    bgColor: 'bg-white',
    textColor: 'text-green-600',
    borderColor: 'border-gray-200'
  },
  {
    id: 2,
    title: 'Compras',
    value: '245 kg',
    change: '+2.1%',
    icon: 'Package',
    bgColor: 'bg-white',
    textColor: 'text-green-600',
    borderColor: 'border-gray-200'
  },
  {
    id: 3,
    title: 'Alertas de Inventario',
    value: '8 Alertas',
    change: '-3.5%',
    icon: 'AlertCircle',
    bgColor: 'bg-white',
    textColor: 'text-red-600',
    borderColor: 'border-gray-200'
  },
  {
    id: 4,
    title: 'Nuevos Clientes',
    value: '32',
    change: '+12.3%',
    icon: 'Users',
    bgColor: 'bg-white',
    textColor: 'text-green-600',
    borderColor: 'border-gray-200'
  }
];

export const chartData = [
  {
    month: 'Enero',
    trazabilidad: 4000,
    compras: 2400
  },
  {
    month: 'Febrero',
    trazabilidad: 3000,
    compras: 1398
  },
  {
    month: 'Marzo',
    trazabilidad: 2000,
    compras: 9800
  },
  {
    month: 'Abril',
    trazabilidad: 2780,
    compras: 3908
  },
  {
    month: 'Mayo',
    trazabilidad: 1890,
    compras: 4800
  },
  {
    month: 'Junio',
    trazabilidad: 2390,
    compras: 3800
  },
  {
    month: 'Julio',
    trazabilidad: 3490,
    compras: 4300
  }
];

export const transactions = [
  {
    id: 1,
    description: 'Compra de Café Arábica',
    amount: '$2,400',
    status: 'Completado',
    statusColor: 'bg-green-100 text-green-800',
    date: '2024-04-28',
    supplier: 'Proveedor A'
  },
  {
    id: 2,
    description: 'Venta a Distribuidor B',
    amount: '$1,850',
    status: 'Pendiente',
    statusColor: 'bg-yellow-100 text-yellow-800',
    date: '2024-04-28',
    supplier: 'Distribuidor B'
  },
  {
    id: 3,
    description: 'Importación de Cacao',
    amount: '$3,200',
    status: 'Completado',
    statusColor: 'bg-green-100 text-green-800',
    date: '2024-04-27',
    supplier: 'Proveedor C'
  },
  {
    id: 4,
    description: 'Venta a Tienda Minorista',
    amount: '$950',
    status: 'Cancelado',
    statusColor: 'bg-red-100 text-red-800',
    date: '2024-04-27',
    supplier: 'Tienda X'
  },
  {
    id: 5,
    description: 'Compra de Café Robusta',
    amount: '$1,600',
    status: 'Completado',
    statusColor: 'bg-green-100 text-green-800',
    date: '2024-04-26',
    supplier: 'Proveedor D'
  }
];

export const navItems = [
  { id: 1, label: 'Dashboard', icon: 'LayoutDashboard', href: '#' },
  { id: 2, label: 'Inventario', icon: 'Package', href: '#' },
  { id: 3, label: 'Proveedores', icon: 'Truck', href: '#' },
  { id: 4, label: 'Ventas', icon: 'ShoppingCart', href: '#' },
  { id: 5, label: 'Trazabilidad', icon: 'Map', href: '#' },
  { id: 6, label: 'Reportes', icon: 'BarChart3', href: '#' },
  { id: 7, label: 'Configuración', icon: 'Settings', href: '#' },
  { id: 8, label: 'Ayuda', icon: 'HelpCircle', href: '#' }
];
