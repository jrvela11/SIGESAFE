import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Store, ShoppingCart, Scale, Truck,
  Package, Tags, Route, Users, Shield,
  History, Settings, LogOut, Coffee, Menu, X, Search,
  ChevronDown, Layers, Map
} from "lucide-react";

const MENU_GROUPS = [
  {
    title: "Principal",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      { name: "Mapa", icon: Map, path: "/mapa" },
    ],
  },
  {
    title: "Operaciones",
    items: [
      { name: "Punto de Venta", icon: Store, path: "/punto-venta" },
      { name: "Ventas", icon: ShoppingCart, path: "/ventas" },
      { name: "Punto de Compra", icon: Scale, path: "/punto-compra" },
      { name: "Compras", icon: Truck, path: "/compras" },
      { name: "Kardex", icon: Layers, path: "/kardex" },
      { name: "Envios", icon: Route, path: "/envios" },
      { name: "Rastreo", icon: Route, path: "/rastreo" },
      { name: "Entregas", icon: Package, path: "/entregas" },
      { name: "Transportistas", icon: Truck, path: "/transportistas" },
    ],
  },
  {
    title: "Catálogo",
    items: [
      { name: "Productos", icon: Package, path: "/productos" },
      { name: "Categorías", icon: Tags, path: "/categorias" },
    ],
  },
  {
    title: "Personas",
    items: [
      { name: "Clientes", icon: Users, path: "/clientes" },
      { name: "Proveedores", icon: Truck, path: "/proveedores" },
      { name: "Usuarios", icon: Shield, path: "/usuarios" },
    ],
  },
  {
    title: "Sistema",
    items: [
      { name: "Reportes", icon: Search, path: "/reportes" },
      { name: "Auditoría", icon: History, path: "/auditoria" },
      { name: "Ajustes", icon: Settings, path: "/ajustes" },
    ],
  },
];

interface LayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Inicializar grupos expandidos (abrir el que contiene la ruta actual)
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      MENU_GROUPS.map((g) => [g.title, g.items.some((i) => location.pathname.includes(i.path))])
    )
  );

  const toggleGroup = (title: string) =>
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));

  // Breadcrumb dinámico
  const activeGroup = MENU_GROUPS.find((g) => g.items.some((i) => location.pathname.includes(i.path)));
  const activeItem = activeGroup?.items.find((i) => location.pathname.includes(i.path));

  return (
    <div className="min-h-screen bg-[#F7F5F2] flex font-sans overflow-hidden">
      
      {/* Overlay móvil */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-[#1C0F05]/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[248px] bg-[#1C0F05] flex flex-col transition-transform duration-300 md:static ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="h-[3px] shrink-0 bg-gradient-to-r from-[#5C2D0A] via-[#C17B2A] to-[#3D1F0A]" />

        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.07] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#C17B2A] rounded-lg flex items-center justify-center">
              <Coffee className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[#F5ECD7] font-black text-sm leading-tight">San Felipe</p>
              <p className="text-white/30 text-[8.5px] font-bold uppercase tracking-[1.5px]">Panel de gestión</p>
            </div>
          </div>
          <button className="md:hidden p-1.5 text-white/40" onClick={() => setIsSidebarOpen(false)}><X className="w-4 h-4" /></button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 py-3 px-2.5 flex flex-col gap-0.5 overflow-y-auto custom-scrollbar">
          {MENU_GROUPS.map((group) => (
            <div key={group.title}>
              <button
                onClick={() => toggleGroup(group.title)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[9.5px] font-black uppercase tracking-[1.3px] text-white/25 hover:text-white/50"
              >
                <span>{group.title}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${expanded[group.title] ? "rotate-180" : ""}`} />
              </button>
              
              <div className="overflow-hidden transition-all duration-200" style={{ maxHeight: expanded[group.title] ? `${group.items.length * 40}px` : "0px" }}>
                <div className="space-y-0.5 pb-1">
                  {group.items.map((item) => {
                    const isActive = location.pathname.includes(item.path);
                    return (
                      <Link key={item.name} to={item.path} onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[12px] font-medium transition-all ${isActive ? "bg-[#C17B2A]/20 text-[#E8A84E] font-semibold" : "text-white/40 hover:text-white/70"}`}>
                        <item.icon className={`w-3.5 h-3.5 ${isActive ? "text-[#C17B2A]" : "text-white/25"}`} />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-[56px] bg-white border-b border-[#EDE8E1] flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 text-[#5A4A3C]" onClick={() => setIsSidebarOpen(true)}><Menu className="w-5 h-5" /></button>
            <span className="font-bold text-[#1C0F05]">{activeItem?.name || "Dashboard"}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C17B2A] to-[#8B5010] text-white flex items-center justify-center text-[11px] font-black">A</div>
        </header>

        <main className="flex-1 overflow-y-auto p-7">
          <div className="mx-auto max-w-7xl w-full">{children}</div>
        </main>
      </div>
    </div>
  );
};