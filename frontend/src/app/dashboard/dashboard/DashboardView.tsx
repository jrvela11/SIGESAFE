import React from "react";
import { DashboardLayout } from "./DashboardLayout"; 
import { useDashboard } from "./useDashboard";
import { 
  TrendingUp, Users, Package, RefreshCw, 
  FileText, Activity, AlertTriangle, Truck
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from 'recharts';

export const DashboardView = () => {
  const d = useDashboard();

  const sol = (n: number) =>
    new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(n || 0);

  // Tooltip minimalista
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2.5 border border-[#EDE8E1] rounded shadow-sm text-[11px]">
          <p className="font-bold text-[#1C0F05] mb-1.5">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="font-medium flex items-center gap-1.5" style={{ color: entry.color || entry.payload.color }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color || entry.payload.color }} />
              {entry.name}: {entry.name === 'Ingresos' || entry.name === 'Egresos' ? sol(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 pb-10">
        
        {/* ── HEADER ULTRA COMPACTO ── */}
        <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-[#EDE8E1] shadow-sm">
          <div>
            <h1 className="text-[16px] font-black text-[#1C0F05] leading-none">Resumen Operativo</h1>
            <p className="text-[11px] text-[#8B7D72] mt-1">Métricas clave en tiempo real.</p>
          </div>
          <button 
            onClick={d.sincronizar}
            disabled={d.cargando}
            className="flex items-center gap-1.5 bg-[#F7F5F2] border border-[#EDE8E1] text-[#1C0F05] px-3 py-1.5 rounded text-[11px] font-bold hover:bg-[#EDE8E1] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${d.cargando ? "animate-spin" : ""}`} />
            Sincronizar
          </button>
        </div>

        {/* ── KPIs (Tarjetas reducidas y directas) ── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          
          <div className="bg-white p-3.5 rounded-lg border border-[#EDE8E1] shadow-sm flex flex-col justify-between gap-3">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-[#7A6E65] uppercase tracking-wider">Ingresos (Mes)</span>
              <TrendingUp className="w-3.5 h-3.5 text-[#0D7A3E]" />
            </div>
            <div>
              <h3 className="text-[17px] font-black text-[#1C0F05] leading-none truncate">{d.cargando ? "..." : sol(d.kpis.ventasMes)}</h3>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-[#EDE8E1] shadow-sm flex flex-col justify-between gap-3 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#FDF3E7] rounded-full blur-xl opacity-60" />
            <div className="flex justify-between items-center relative z-10">
              <span className="text-[9px] font-bold text-[#7A6E65] uppercase tracking-wider">Margen Neto</span>
              <Activity className="w-3.5 h-3.5 text-[#C17B2A]" />
            </div>
            <div className="relative z-10">
              <h3 className={`text-[17px] font-black leading-none truncate ${d.kpis.margenOperativo >= 0 ? "text-[#1C0F05]" : "text-[#8B2020]"}`}>
                {d.cargando ? "..." : sol(d.kpis.margenOperativo)}
              </h3>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-[#EDE8E1] shadow-sm flex flex-col justify-between gap-3">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-[#7A6E65] uppercase tracking-wider">Despachos</span>
              <Truck className="w-3.5 h-3.5 text-[#5B45C2]" />
            </div>
            <div>
              <h3 className="text-[17px] font-black text-[#1C0F05] leading-none">
                {d.cargando ? "..." : d.kpis.enviosEnRuta} <span className="text-[10px] text-[#9A8E82] font-medium">en ruta</span>
              </h3>
            </div>
          </div>

          <div className={`bg-white p-3.5 rounded-lg border shadow-sm flex flex-col justify-between gap-3 ${d.kpis.productosBajos > 0 ? "border-[#F7C1C1] border-l-4 border-l-[#8B2020]" : "border-[#EDE8E1]"}`}>
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-[#7A6E65] uppercase tracking-wider">Stock Bajo</span>
              {d.kpis.productosBajos > 0 ? <AlertTriangle className="w-3.5 h-3.5 text-[#8B2020]" /> : <Package className="w-3.5 h-3.5 text-[#5A4A3C]" />}
            </div>
            <div>
              <h3 className={`text-[17px] font-black leading-none ${d.kpis.productosBajos > 0 ? "text-[#8B2020]" : "text-[#1C0F05]"}`}>
                {d.cargando ? "..." : d.kpis.productosBajos} <span className="text-[10px] text-[#9A8E82] font-medium">ítems</span>
              </h3>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-[#EDE8E1] shadow-sm flex flex-col justify-between gap-3">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-[#7A6E65] uppercase tracking-wider">Cartera</span>
              <Users className="w-3.5 h-3.5 text-[#1A5FA0]" />
            </div>
            <div>
              <h3 className="text-[17px] font-black text-[#1C0F05] leading-none">
                {d.cargando ? "..." : d.kpis.clientesActivos} <span className="text-[10px] text-[#9A8E82] font-medium">activos</span>
              </h3>
            </div>
          </div>
        </div>

        {/* ── ZONA DE GRÁFICOS (Alturas estrictas para evitar colapsos) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Gráfico Financiero */}
          <div className="lg:col-span-2 bg-white p-4 rounded-lg border border-[#EDE8E1] shadow-sm flex flex-col h-[280px]">
            <div className="mb-2 shrink-0">
              <h3 className="text-[12px] font-black text-[#1C0F05]">Balance Financiero (6 meses)</h3>
            </div>
            
            <div className="flex-1 w-full min-h-0"> {/* min-h-0 es clave en flexbox */}
              {d.cargando ? (
                <div className="w-full h-full bg-[#F7F5F2] rounded animate-pulse" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={d.datosGrafico} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#F0EBE4" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9A8E82', fontSize: 10 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9A8E82', fontSize: 10 }} tickFormatter={(value) => `S/${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#FDFAF7' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                    <Bar dataKey="Ingresos" fill="#C17B2A" radius={[2, 2, 0, 0]} barSize={10} />
                    <Bar dataKey="Egresos" fill="#1C0F05" radius={[2, 2, 0, 0]} barSize={10} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Gráfico Circular Logístico */}
          <div className="bg-white p-4 rounded-lg border border-[#EDE8E1] shadow-sm flex flex-col h-[280px]">
            <div className="mb-0 shrink-0 text-center">
              <h3 className="text-[12px] font-black text-[#1C0F05]">Estado Logístico</h3>
            </div>
            
            <div className="flex-1 w-full min-h-0 relative flex items-center justify-center">
              {d.cargando ? (
                <div className="w-24 h-24 rounded-full bg-[#F7F5F2] animate-pulse" />
              ) : d.estadoEnviosGrafico.reduce((a, b) => a + b.value, 0) === 0 ? (
                <p className="text-[11px] text-[#9A8E82]">Sin despachos.</p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={d.estadoEnviosGrafico}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {d.estadoEnviosGrafico.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend iconType="circle" verticalAlign="bottom" wrapperStyle={{ fontSize: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Total en el centro absolutamente posicionado */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
                    <span className="text-[18px] font-black text-[#1C0F05] leading-none">
                      {d.estadoEnviosGrafico.reduce((a, b) => a + b.value, 0)}
                    </span>
                    <span className="text-[8px] text-[#9A8E82] uppercase font-bold mt-0.5">Total</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── ZONA DE TABLAS (Alturas controladas) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Transacciones Recientes */}
          <div className="bg-white rounded-lg border border-[#EDE8E1] shadow-sm flex flex-col h-[240px]">
            <div className="px-3 py-2.5 border-b border-[#EDE8E1] bg-[#FDFAF7] shrink-0">
              <h3 className="text-[11.5px] font-black text-[#1C0F05] uppercase tracking-wider">Transacciones Recientes</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-[11px] text-left">
                <tbody className="divide-y divide-[#F5F0EB]">
                  {d.cargando ? (
                    <tr><td className="px-3 py-4 text-center text-[#9A8E82]">Cargando...</td></tr>
                  ) : d.actividadReciente.length === 0 ? (
                    <tr><td className="px-3 py-4 text-center text-[#9A8E82]">Sin transacciones.</td></tr>
                  ) : (
                    d.actividadReciente.map((venta, idx) => (
                      <tr key={idx} className="hover:bg-[#FDFAF7]">
                        <td className="px-3 py-2.5">
                          <p className="font-bold text-[#1C0F05]">{venta.tipo_comprobante} {venta.serie}-{venta.correlativo}</p>
                          <p className="text-[9px] text-[#9A8E82] mt-0.5">{new Date(venta.fecha_venta || venta.created_at).toLocaleDateString("es-PE")}</p>
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <span className="font-black text-[#1C0F05] block">{sol(venta.total)}</span>
                          <span className={`text-[8.5px] font-bold uppercase mt-0.5 block ${venta.estado_pago === 'pagado' ? 'text-[#0D7A3E]' : 'text-[#944F0A]'}`}>
                            {venta.estado_pago}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Insumos Críticos */}
          <div className="bg-white rounded-lg border border-[#EDE8E1] shadow-sm flex flex-col h-[240px]">
            <div className="px-3 py-2.5 border-b border-[#EDE8E1] bg-[#FDFAF7] flex justify-between items-center shrink-0">
              <h3 className="text-[11.5px] font-black text-[#1C0F05] uppercase tracking-wider">Insumos Críticos</h3>
              <span className="bg-[#FCEBEB] text-[#8B2020] text-[8.5px] font-bold px-1.5 py-0.5 rounded border border-[#F7C1C1]">Por Agotar</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-[11px] text-left">
                <tbody className="divide-y divide-[#F5F0EB]">
                  {d.cargando ? (
                    <tr><td className="px-3 py-4 text-center text-[#9A8E82]">Cargando...</td></tr>
                  ) : d.productosBajosLista.length === 0 ? (
                    <tr><td className="px-3 py-4 text-center text-[#9A8E82]">Stock óptimo.</td></tr>
                  ) : (
                    d.productosBajosLista.map((prod, idx) => (
                      <tr key={idx} className="hover:bg-[#FDFAF7]">
                        <td className="px-3 py-2.5">
                          <p className="font-bold text-[#1C0F05] truncate max-w-[200px]" title={prod.nombre_producto}>{prod.nombre_producto}</p>
                          <p className="text-[9px] text-[#9A8E82] mt-0.5">Cód: {prod.codigo_producto || 'S/C'}</p>
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <span className="font-black text-[#8B2020] block">{prod.stock_actual} ud.</span>
                          <span className="text-[8.5px] font-bold text-[#9A8E82] mt-0.5 block">
                            Min: {prod.stock_minimo || 20}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};
