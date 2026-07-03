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
import { SeguimientosView } from "./app/dashboard/envios/SeguimientosView";
import { ComprasView } from "./app/dashboard/compras/ComprasView";
import { PuntoCompraView } from "./app/dashboard/punto-compra/PuntoCompraView";
import { KardexView } from "./app/kardex/KardexView";
import { ReportesView } from "./app/dashboard/reportes/ReportesView";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster richColors position="bottom-right" />

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardView />} />
        <Route path="/envios" element={<EnviosView />} />
        <Route path="/seguimientos" element={<SeguimientosView />} />
        <Route path="/clientes" element={<ClientesView />} />
        <Route path="/categorias" element={<CategoriasView />} />
        <Route path="/usuarios" element={<UsuariosView />} />
        <Route path="/empleados" element={<EmpleadosView />} />
        <Route path="/productos" element={<ProductosView />} />
        <Route path="/punto-venta" element={<PuntoVentaView />} />
        <Route path="/ventas" element={<VentasView />} />
        <Route path="/proveedores" element={<ProveedoresView />} />
        <Route path="/ajustes" element={<AjustesView />} />
        <Route path="/mapa" element={<DashboardMapaView />} />
        <Route path="/compras" element={<ComprasView />} />
        <Route path="/punto-compra" element={<PuntoCompraView />} />
        <Route path="/kardex" element={<KardexView />} />
        <Route path="/reportes" element={<ReportesView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      
      </Routes>
    </div>
  );
}
