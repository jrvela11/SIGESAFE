import React from "react";
import { DashboardLayout } from "../dashboard/DashboardLayout";
import { useVentas } from "./useVentas";
import { 
  Search, FileText, TrendingUp, Calendar, CreditCard, 
  Eye, Ban, CheckCircle, AlertCircle 
} from "lucide-react";

export const VentasView = () => {
  const v = useVentas();

  const sol = (n: number) => new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(n);

  // Cálculos rápidos para los KPIs
  const ventasExitosas = v.ventas.filter(venta => venta.estado_pago === 'pagado');
  const totalIngresos = ventasExitosas.reduce((acc, venta) => acc + venta.totales.total, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Historial de Ventas</h1>
            <p className="text-sm text-stone-400 mt-0.5">Auditoría de comprobantes y flujos de ingreso</p>
          </div>
        </div>

        {/* KPIs Financieros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-stone-900 leading-none">{sol(totalIngresos)}</p>
              <p className="text-xs font-medium text-stone-400 mt-1">Ingresos Totales (Filtrados)</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-stone-200 p-5 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-stone-900 leading-none">{ventasExitosas.length}</p>
              <p className="text-xs font-medium text-stone-400 mt-1">Comprobantes Emitidos</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-5 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-stone-900 leading-tight">Efectivo / Transferencias</p>
              <p className="text-xs font-medium text-stone-400 mt-0.5">Métodos de cobro activos</p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input 
              type="text" 
              placeholder="Buscar por cliente, comprobante..." 
              value={v.busqueda}
              onChange={(e) => v.setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
            />
          </div>
          <div className="flex bg-stone-100 rounded-xl p-1 w-full sm:w-auto overflow-x-auto">
            {(['todos', 'pagado', 'anulado'] as const).map(estado => (
              <button 
                key={estado}
                onClick={() => v.setFiltroEstado(estado)}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${
                  v.filtroEstado === estado ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                {estado}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla de Resultados */}
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500">
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Fecha / Comprobante</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-right">Monto Total</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-center">Estado</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {v.cargando ? (
                  [1, 2, 3, 4].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 w-24 bg-stone-200 rounded mb-2" /><div className="h-3 w-16 bg-stone-100 rounded" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-40 bg-stone-200 rounded" /></td>
                      <td className="px-6 py-4 text-right"><div className="h-4 w-20 bg-stone-200 rounded ml-auto" /></td>
                      <td className="px-6 py-4"><div className="h-6 w-20 bg-stone-200 rounded-full mx-auto" /></td>
                      <td className="px-6 py-4"><div className="h-8 w-8 bg-stone-200 rounded-lg ml-auto" /></td>
                    </tr>
                  ))
                ) : v.ventas.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-stone-400">
                      <FileText className="w-10 h-10 mx-auto mb-3 text-stone-300" />
                      <p className="font-medium">No se encontraron ventas registradas.</p>
                    </td>
                  </tr>
                ) : (
                  v.ventas.map((venta) => (
                    <tr key={venta.id} className="hover:bg-stone-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${venta.comprobante.startsWith('B') ? 'bg-blue-50 text-blue-600' : venta.comprobante.startsWith('F') ? 'bg-purple-50 text-purple-600' : 'bg-stone-100 text-stone-600'}`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-stone-800">{venta.comprobante}</p>
                            <p className="text-[11px] text-stone-400 font-medium flex items-center mt-0.5">
                              <Calendar className="w-3 h-3 mr-1" /> {venta.fecha}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-stone-700">{venta.cliente}</p>
                        <p className="text-[11px] text-stone-400 mt-0.5">Vendedor: {venta.vendedor}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-black text-stone-800 text-base">{sol(venta.totales.total)}</p>
                        <p className="text-[10px] text-stone-400 font-medium uppercase">{venta.metodo_pago}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          venta.estado_pago === 'pagado' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                          'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {venta.estado_pago === 'pagado' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                          {venta.estado_pago.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                          <button 
                            className="p-2 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver detalle"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {venta.estado_pago === 'pagado' && (
                            <button 
                              className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Anular venta"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                        </div>
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