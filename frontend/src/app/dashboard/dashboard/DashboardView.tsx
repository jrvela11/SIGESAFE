import React from "react";
import { DashboardLayout } from "./DashboardLayout"; // Ajusta la ruta si es necesario
import { useDashboard } from "./useDashboard";
import { 
  TrendingUp, Users, Package, ShoppingCart, 
  RefreshCw, FileText, CreditCard 
} from "lucide-react";

export const DashboardView = () => {
  const d = useDashboard();

  const sol = (n: number) =>
    new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(n);

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        
        {/* ── Header y Botón Sincronizar ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-[20px] font-black text-[#1C0F05] tracking-tight leading-tight">
              Resumen Operativo
            </h1>
            <p className="text-[12.5px] text-[#8B7D72] mt-1">
              Métricas y rendimiento general del mes actual en SIGESAFE.
            </p>
          </div>
          <button 
            onClick={d.sincronizar}
            disabled={d.cargando}
            className="flex items-center gap-2 bg-[#F7F5F2] border border-[#EDE8E1] text-[#1C0F05] px-4 py-2 rounded-lg text-[12px] font-bold hover:bg-[#EDE8E1] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${d.cargando ? "animate-spin" : ""}`} />
            Sincronizar
          </button>
        </div>

        {/* ── Tarjetas KPI ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Ingresos por Ventas */}
          <div className="bg-white p-5 rounded-xl border border-[#EDE8E1] shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#EDFBF3] flex items-center justify-center text-[#0D7A3E]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-[#0D7A3E] bg-[#EDFBF3] px-2 py-0.5 rounded-full border border-[#9FE1CB]">
                Este Mes
              </span>
            </div>
            <div>
              <h3 className="text-[24px] font-black text-[#1C0F05] tracking-tighter">
                {d.cargando ? "..." : sol(d.kpis.ventasMes)}
              </h3>
              <p className="text-[11.5px] font-medium text-[#9A8E82] mt-0.5">Ingresos por Ventas</p>
            </div>
          </div>

          {/* Egresos por Compras */}
          <div className="bg-white p-5 rounded-xl border border-[#EDE8E1] shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#FCEBEB] flex items-center justify-center text-[#8B2020]">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-[#8B2020] bg-[#FCEBEB] px-2 py-0.5 rounded-full border border-[#F7C1C1]">
                Este Mes
              </span>
            </div>
            <div>
              <h3 className="text-[24px] font-black text-[#1C0F05] tracking-tighter">
                {d.cargando ? "..." : sol(d.kpis.comprasMes)}
              </h3>
              <p className="text-[11.5px] font-medium text-[#9A8E82] mt-0.5">Inversión en Compras</p>
            </div>
          </div>

          {/* Alertas de Stock */}
          <div className="bg-white p-5 rounded-xl border border-[#EDE8E1] shadow-sm flex flex-col justify-between border-b-4 border-b-[#C17B2A]">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#FDF3E7] flex items-center justify-center text-[#C17B2A]">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-[24px] font-black text-[#1C0F05] tracking-tighter">
                {d.cargando ? "..." : d.kpis.productosBajos}
              </h3>
              <p className="text-[11.5px] font-medium text-[#9A8E82] mt-0.5">Productos con Stock Bajo</p>
            </div>
          </div>

          {/* Clientes Activos */}
          <div className="bg-white p-5 rounded-xl border border-[#EDE8E1] shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#F7F5F2] flex items-center justify-center text-[#5A4A3C]">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-[24px] font-black text-[#1C0F05] tracking-tighter">
                {d.cargando ? "..." : d.kpis.clientesActivos}
              </h3>
              <p className="text-[11.5px] font-medium text-[#9A8E82] mt-0.5">Clientes Registrados</p>
            </div>
          </div>

        </div>

        {/* ── Actividad Reciente (Últimas Ventas) ── */}
        <div className="bg-white rounded-xl border border-[#EDE8E1] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#EDE8E1] bg-[#FDFAF7]">
            <h3 className="text-[14px] font-black text-[#1C0F05]">Últimas Transacciones (Ventas)</h3>
            <p className="text-[11px] text-[#9A8E82]">Monitoreo de la actividad de salida más reciente.</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] text-left">
              <thead>
                <tr className="bg-white border-b border-[#EDE8E1]">
                  <th className="px-5 py-3 font-bold text-[10px] uppercase tracking-[0.8px] text-[#A8978B]">Comprobante</th>
                  <th className="px-5 py-3 font-bold text-[10px] uppercase tracking-[0.8px] text-[#A8978B]">Fecha</th>
                  <th className="px-5 py-3 font-bold text-[10px] uppercase tracking-[0.8px] text-[#A8978B]">Estado</th>
                  <th className="px-5 py-3 font-bold text-[10px] uppercase tracking-[0.8px] text-[#A8978B] text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F0EB]">
                {d.cargando ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-[#9A8E82] text-[12px] font-bold animate-pulse">
                      Cargando datos...
                    </td>
                  </tr>
                ) : d.actividadReciente.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-[#C0B4AA]" />
                      <p className="text-[12px] font-semibold text-[#5A4A3C]">No hay transacciones recientes</p>
                    </td>
                  </tr>
                ) : (
                  d.actividadReciente.map((venta, idx) => (
                    <tr key={idx} className="hover:bg-[#FDFAF7] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-[#C17B2A]" />
                          <span className="font-bold text-[#1C0F05]">{venta.tipo_comprobante} {venta.serie}-{venta.correlativo}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[#5A4A3C]">
                        {new Date(venta.fecha_venta || venta.created_at).toLocaleDateString("es-PE")}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.5px] ${
                          venta.estado_pago === 'pagado' ? 'bg-[#EDFBF3] text-[#0D6E3F] border border-[#9FE1CB]' : 'bg-[#FEF3E6] text-[#944F0A] border border-[#F5D5A3]'
                        }`}>
                          {venta.estado_pago}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="font-black text-[#1C0F05]">{sol(venta.total)}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};