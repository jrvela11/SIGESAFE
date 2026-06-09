'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  TrendingUp,
  Package,
  Tag,
  Users,
  GitBranch,
  UserCheck,
  UserCog,
  Bell,
  Search,
  LogOut,
  Store,
  Inbox,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    name: 'Compras',
    href: '/dashboard/compras',
    icon: <ShoppingCart className="w-5 h-5" />,
  },
  {
    name: 'Ventas',
    href: '/dashboard/ventas',
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    name: 'Inventario',
    href: '/dashboard/inventario',
    icon: <Package className="w-5 h-5" />,
  },
  {
    name: 'Categorías',
    href: '/dashboard/categorias',
    icon: <Tag className="w-5 h-5" />,
  },
  {
    name: 'Clientes',
    href: '/dashboard/clientes',
    icon: <Users className="w-5 h-5" />,
  },
  {
    name: 'Trazabilidad',
    href: '/dashboard/trazabilidad',
    icon: <GitBranch className="w-5 h-5" />,
  },
  {
    name: 'Usuarios',
    href: '/dashboard/usuarios',
    icon: <UserCheck className="w-5 h-5" />,
  },
  {
    name: 'Empleados',
    href: '/dashboard/empleados',
    icon: <UserCog className="w-5 h-5" />,
  },
  {
    name: 'Punto de Venta',
    href: '/dashboard/punto-venta',
    icon: <Store className="w-5 h-5" />,
  },
  {
    name: 'Punto de Compra',
    href: '/dashboard/punto-compra',
    icon: <Inbox className="w-5 h-5" />,
  },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-[#8B5A2B]">
            ☕ Café & Cacao
          </h1>
          <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-[#C19A6B] text-white'
                      : 'text-slate-800 hover:bg-gray-100'
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 border-gray-200 text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white">
          <div className="h-16 px-8 flex items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar..."
                  className="pl-10 bg-gray-50 border-gray-200 text-slate-800"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-slate-800" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#C19A6B] rounded-full"></span>
              </button>

              {/* User Avatar */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Perfil</DropdownMenuItem>
                  <DropdownMenuItem>Configuración</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-white">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
