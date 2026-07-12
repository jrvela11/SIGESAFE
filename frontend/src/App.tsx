import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner"; 
import { DashboardView } from "./app/dashboard/dashboard/DashboardView";
import { ClientesView } from "./app/dashboard/clientes/ClientesView"; 
import { CategoriasView } from "./app/dashboard/categorias/CategoriasView";
import { UsuariosView } from "./app/dashboard/usuarios/UsuariosView";
import { EmpleadosView } from "./app/dashboard/empleados/EmpleadosView";
import { ProductosView } from "./app/dashboard/productos/ProductosView";
import { PuntoVentaView } from "./app/dashboard/punto-venta/PuntoVentaView";
import { VentasView } from "./app/dashboard/ventas/VentasView";
import { ProveedoresView } from "./app/dashboard/proveedores/ProveedoresView";
import { AjustesView } from "./app/dashboard/configuracion/AjustesView";
import { DashboardMapaView } from "./app/dashboard/dashboard/DashboardMapaView";
import { EnviosView } from "./app/dashboard/envios/EnviosView";
import { ComprasView } from "./app/dashboard/compras/ComprasView";
import { PuntoCompraView } from "./app/dashboard/punto-compra/PuntoCompraView";
import { KardexView } from "./app/dashboard/kardex/KardexView";
import { ReportesView } from "./app/dashboard/reportes/ReportesView";
import { TransportistasView } from "./app/dashboard/transportista/TransportistasView";
import { MisEntregasView } from "./app/dashboard/entregas/MisEntregasView";
import { RastreoView } from "./app/dashboard/rastreo/RastreoView";
import { LoginView } from "./app/Auth/LoginView";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RoleProtectedRoute } from "./components/RoleProtectedRoute";


export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50">
        <Toaster richColors position="bottom-right" />

        <Routes>
          {/* Ruta Pública */}
          <Route path="/login" element={<LoginView />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 1. PRIMER FILTRO: El usuario debe estar Autenticado */}
          <Route element={<ProtectedRoute />}>
            
            {/* ─── RUTAS PARA ADMINISTRADORES ─── */}
            <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/usuarios" element={<UsuariosView />} />
              <Route path="/empleados" element={<EmpleadosView />} />
              <Route path="/ajustes" element={<AjustesView />} />
              <Route path="/reportes" element={<ReportesView />} />
              <Route path="/kardex" element={<KardexView />} />
            </Route>

            {/* ─── RUTAS PARA ADMINISTRACIÓN GENERAL (Admin, Ventas y Compras) ─── */}
            <Route element={<RoleProtectedRoute allowedRoles={["admin", "vendedor", "comprador"]} />}>
              <Route path="/dashboard" element={<DashboardView />} />
              <Route path="/productos" element={<ProductosView />} />
              <Route path="/categorias" element={<CategoriasView />} />
            </Route>

            {/* ─── RUTAS DE VENTAS (Admin y Vendedores) ─── */}
            <Route element={<RoleProtectedRoute allowedRoles={["admin", "vendedor"]} />}>
              <Route path="/punto-venta" element={<PuntoVentaView />} />
              <Route path="/ventas" element={<VentasView />} />
              <Route path="/clientes" element={<ClientesView />} />
              <Route path="/envios" element={<EnviosView />} />
              <Route path="/rastreo" element={<RastreoView />} />
              <Route path="/transportistas" element={<TransportistasView />} />
              <Route path="/mapa" element={<DashboardMapaView />} />
            </Route>

            {/* ─── RUTAS DE COMPRAS Y ABASTECIMIENTO (Admin y Compradores) ─── */}
            <Route element={<RoleProtectedRoute allowedRoles={["admin", "comprador"]} />}>
              <Route path="/punto-compra" element={<PuntoCompraView />} />
              <Route path="/compras" element={<ComprasView />} />
              <Route path="/proveedores" element={<ProveedoresView />} />
            </Route>

            {/* ─── RUTAS DE LOGÍSTICA DE CAMPO (Admin y Motorizados) ─── */}
            <Route element={<RoleProtectedRoute allowedRoles={["admin", "motorizado"]} />}>
              <Route path="/entregas" element={<MisEntregasView />} />
            </Route>

          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}