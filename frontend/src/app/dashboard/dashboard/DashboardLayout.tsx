import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Store, ShoppingCart, Scale, Truck, 
  Package, Tags, Route, Users, Briefcase, Shield, 
  History, Settings, LogOut, Coffee, Menu, X
} from "lucide-react";

const MENU_GROUPS = [
  {
    title: "Principal",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      { name: "Mapa", icon: Route, path: "/mapa" },
    ]
  },
  {
    title: "Operaciones",
    items: [
      { name: "Punto de Venta", icon: Store, path: "/punto-venta" },
      { name: "Ventas", icon: ShoppingCart, path: "/ventas" },
      { name: "Envios", icon: Truck, path: "/envios" },
      { name: "Seguimientos", icon: Route, path: "/seguimientos" },
      { name: "Punto de Compra", icon: Scale, path: "/punto-compra" }, 
      { name: "Compras", icon: Truck, path: "/compras" },
    ]
  },
  {
    title: "Catálogo y Logística",
    items: [
      { name: "Productos", icon: Package, path: "/productos" },
      { name: "Categorías", icon: Tags, path: "/categorias" },
      { name: "Trazabilidad", icon: Route, path: "/trazabilidad" },
    ]
  },
  {
    title: "Personas",
    items: [
      { name: "Clientes", icon: Users, path: "/clientes" },
      { name: "Proveedores", icon: Truck, path: "/proveedores" },
      { name: "Empleados", icon: Briefcase, path: "/empleados" },
      { name: "Usuarios", icon: Shield, path: "/usuarios" },
    ]
  },
  {
    title: "Sistema",
    items: [
      { name: "Auditoría", icon: History, path: "/auditoria" },
      { name: "Ajustes", icon: Settings, path: "/ajustes" },
    ]
  }
];

interface LayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // OPTIMIZACIÓN MÓVIL 1: Bloquear el scroll del fondo cuando el menú está abierto
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-stone-50 flex font-sans overflow-hidden">
      
      {/* OVERLAY OSCURO PARA MÓVILES */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR (Menú Lateral) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-[280px] md:w-64 bg-white border-r border-amber-100 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.05)] transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo / Título de la Empresa */}
        <div className="h-[72px] flex items-center justify-between px-5 md:px-6 border-b border-amber-100 shrink-0">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-amber-900 rounded-xl flex items-center justify-center mr-3 shadow-sm shrink-0">
              <Coffee className="w-6 h-6 text-amber-50" />
            </div>
            <div className="min-w-0">
              <h2 className="text-amber-950 font-black text-lg leading-tight truncate">Café & Cacao</h2>
              <span className="text-amber-700/70 text-[11px] font-bold uppercase tracking-wider block truncate">ERP Administrativo</span>
            </div>
          </div>
          {/* Botón para cerrar el menú solo visible en móvil */}
          <button 
            className="md:hidden p-2 text-stone-400 hover:text-amber-900 hover:bg-amber-50 rounded-xl transition-colors shrink-0"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links del menú con Scroll */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
          {MENU_GROUPS.map((group, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <h3 className="px-3 text-[10px] font-black uppercase tracking-widest text-amber-900/40 mb-3">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname.includes(item.path);
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      // OPTIMIZACIÓN MÓVIL 2: py-3 en lugar de py-2.5 para mejor área táctil
                      className={`flex items-center px-3 py-3 md:py-2.5 rounded-xl transition-all duration-200 ${
                        isActive 
                          ? "bg-amber-50 text-amber-900 font-bold shadow-sm border border-amber-100/50"
                          : "text-stone-500 font-medium hover:bg-stone-50 hover:text-amber-800"
                      }`}
                    >
                      <item.icon className={`w-5 h-5 mr-3 shrink-0 transition-colors ${isActive ? 'text-amber-600' : 'text-stone-400'}`} />
                      <span className="text-sm truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Botón de Salir en la base */}
        <div className="p-4 border-t border-stone-100 bg-white shrink-0">
          <button className="flex items-center justify-center w-full px-4 py-3 md:py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors border border-transparent hover:border-red-100">
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden w-full">
        
        {/* Header Superior */}
        <header className="h-[72px] bg-white/80 backdrop-blur-md border-b border-stone-200 flex items-center justify-between px-4 md:px-8 shrink-0 z-10 sticky top-0">
          
          <div className="flex items-center gap-3 min-w-0">
            {/* Botón Hamburguesa */}
            <button 
              className="md:hidden p-2 text-stone-600 hover:text-amber-900 hover:bg-amber-50 rounded-xl transition-colors shrink-0"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Título Responsive */}
            <h1 className="text-lg md:text-xl font-black text-stone-800 truncate">
              {location.pathname === "/dashboard" ? "Resumen General" : 
               location.pathname.split("/")[1].charAt(0).toUpperCase() + location.pathname.split("/")[1].slice(1).replace("-", " ")}
            </h1>
          </div>
          
          <div className="flex items-center gap-4 shrink-0 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-stone-800 leading-tight">Administrador</p>
              <p className="text-[11px] font-bold text-stone-400">Sede Principal</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 text-white flex items-center justify-center font-black shadow-md border-2 border-white cursor-pointer hover:shadow-lg transition-all hover:-translate-y-0.5 shrink-0">
              A
            </div>
          </div>
        </header>

        {/* Contenedor de la vista principal */}
        {/* OPTIMIZACIÓN MÓVIL 3: overflow-x-hidden para evitar que tablas rompan la pantalla en celular */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 relative w-full bg-stone-50/50">
          <div className="mx-auto max-w-7xl w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};