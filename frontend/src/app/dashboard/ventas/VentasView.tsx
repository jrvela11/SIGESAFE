import React, { useState, useMemo } from "react";
import { DashboardLayout } from "../dashboard/DashboardLayout";
import { useVentas, type VentaHistorial } from "./useVentas";
import { 
  Search, FileText, TrendingUp, Calendar, CreditCard, 
  Eye, Ban, CheckCircle, AlertCircle, X, ChevronLeft, ChevronRight
} from "lucide-react";

export const VentasView = () => {
  const v = useVentas();
  const [ventaSeleccionada, setVentaSeleccionada] = useState<VentaHistorial | null>(null);

  const sol = (n: number) => new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(n);

  // Cálculos de KPIs memoizados usando todas las ventas filtradas (no solo la página actual)
  const { totalIngresos, cantidadExitosas } = useMemo(() => {
    const ventasExitosas = v.ventasTotales.filter(venta => venta.estado_pago === 'pagado');
    return {
      totalIngresos: ventasExitosas.reduce((acc, venta) => acc + venta.totales.total, 0),
      cantidadExitosas: ventasExitosas.length
    };
  }, [v.ventasTotales]);

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12 relative">
        
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
              <p className="text-2xl font-extrabold text-stone-900 leading-none">{cantidadExitosas}</p>
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
                    <tr 
                      key={venta.id} 
                      onClick={() => setVentaSeleccionada(venta)}
                      className="hover:bg-stone-50/80 transition-colors group cursor-pointer"
                    >
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
                            onClick={(e) => {
                              e.stopPropagation(); // Evita doble render si la fila ya es clickable
                              setVentaSeleccionada(venta);
                            }}
                            className="p-2 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver detalle"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {venta.estado_pago === 'pagado' && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation(); // Evita abrir el modal al anular
                                // Lógica de anulación aquí
                              }}
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
          
          {/* Controles de Paginación */}
          {!v.cargando && v.totalPaginas > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-stone-50 border-t border-stone-200">
              <p className="text-sm text-stone-500">
                Página <span className="font-bold text-stone-800">{v.paginaActual}</span> de <span className="font-bold text-stone-800">{v.totalPaginas}</span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => v.setPaginaActual(p => Math.max(1, p - 1))}
                  disabled={v.paginaActual === 1}
                  className="p-2 rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => v.setPaginaActual(p => Math.min(v.totalPaginas, p + 1))}
                  disabled={v.paginaActual === v.totalPaginas}
                  className="p-2 rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Modal de Detalles de Venta */}
      {ventaSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm" onClick={() => setVentaSeleccionada(null)}>
          <div 
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} // Evita que el click dentro del modal lo cierre
          >
            {/* Header del modal */}
            <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <div>
                <h3 className="text-lg font-bold text-stone-900">Detalle de Venta</h3>
                <p className="text-xs text-stone-500">{ventaSeleccionada.comprobante}</p>
              </div>
              <button 
                onClick={() => setVentaSeleccionada(null)}
                className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-200 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-stone-400 mb-1 text-xs uppercase tracking-wider font-semibold">Cliente</p>
                  <p className="font-medium text-stone-900">{ventaSeleccionada.cliente}</p>
                </div>
                <div>
                  <p className="text-stone-400 mb-1 text-xs uppercase tracking-wider font-semibold">Fecha</p>
                  <p className="font-medium text-stone-900">{ventaSeleccionada.fecha}</p>
                </div>
                <div>
                  <p className="text-stone-400 mb-1 text-xs uppercase tracking-wider font-semibold">Vendedor</p>
                  <p className="font-medium text-stone-900">{ventaSeleccionada.vendedor}</p>
                </div>
                <div>
                  <p className="text-stone-400 mb-1 text-xs uppercase tracking-wider font-semibold">Estado</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                    ventaSeleccionada.estado_pago === 'pagado' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {ventaSeleccionada.estado_pago}
                  </span>
                </div>
              </div>

              <div className="border-t border-dashed border-stone-200 pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Subtotal</span>
                    <span className="font-medium text-stone-900">{sol(ventaSeleccionada.totales.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">IGV (18%)</span>
                    <span className="font-medium text-stone-900">{sol(ventaSeleccionada.totales.igv)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-stone-100">
                    <span className="text-base font-bold text-stone-900">Total</span>
                    <span className="text-xl font-black text-stone-900">{sol(ventaSeleccionada.totales.total)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium text-stone-600">Método de Pago</span>
                <span className="text-sm font-bold text-stone-900 uppercase">{ventaSeleccionada.metodo_pago}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};