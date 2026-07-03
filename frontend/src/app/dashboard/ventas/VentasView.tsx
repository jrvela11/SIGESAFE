import React, { useState } from "react";
import { DashboardLayout } from "../dashboard/DashboardLayout";
import { useVentas, type VentaHistorial } from "./useVentas";
import { 
  Search, FileText, TrendingUp, Calendar, CreditCard, 
  Eye, CheckCircle, AlertCircle, X, ChevronLeft, ChevronRight, Receipt, DollarSign
} from "lucide-react";

export const VentasView = () => {
  const v = useVentas();
  const [ventaSeleccionada, setVentaSeleccionada] = useState<VentaHistorial | null>(null);

  const sol = (n: number) => new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(n);

  const ventaModalActualizada = ventaSeleccionada 
    ? v.ventasTotales.find(venta => venta.id === ventaSeleccionada.id) || ventaSeleccionada 
    : null;

  const Paginador = () => {
    if (v.totalPaginas <= 1) return null;
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => v.setPaginaActual(Math.max(1, v.paginaActual - 1))}
          disabled={v.paginaActual === 1}
          className="w-7 h-7 rounded-md bg-white border border-[#EDE8E1] flex items-center justify-center text-[#7A6E65] hover:bg-[#F7F5F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {Array.from({ length: v.totalPaginas }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => v.setPaginaActual(n)}
            className={`w-7 h-7 rounded-md text-[11.5px] font-bold transition-all ${
              v.paginaActual === n
                ? "bg-[#C17B2A] text-white border border-[#C17B2A]"
                : "bg-white text-[#5A4A3C] border border-[#EDE8E1] hover:bg-[#F7F5F2]"
            }`}
          >
            {n}
          </button>
        ))}

        <button
          onClick={() => v.setPaginaActual(Math.min(v.totalPaginas, v.paginaActual + 1))}
          disabled={v.paginaActual === v.totalPaginas}
          className="w-7 h-7 rounded-md bg-white border border-[#EDE8E1] flex items-center justify-center text-[#7A6E65] hover:bg-[#F7F5F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 pb-12 relative">
        
        {/* ── Page header ── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[20px] font-black text-[#1C0F05] tracking-tight leading-tight">
              Historial de Ventas
            </h1>
            <p className="text-[12.5px] text-[#8B7D72] mt-1">
              Auditoría de comprobantes, transacciones y flujos de ingreso de la cooperativa.
            </p>
          </div>
        </div>

        {/* ── KPIs Financieros ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-[#EDE8E1] p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#EDFBF3] flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-[#0D7A3E]" />
            </div>
            <div className="min-w-0">
              <p className="text-[22px] font-black text-[#1C0F05] leading-none truncate">{sol(v.kpis.totalIngresos)}</p>
              <p className="text-[11px] font-medium text-[#9A8E82] mt-1">Ingresos (Ventas cobradas)</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-[#EDE8E1] p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#E6F1FB] flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5 text-[#1A5FA0]" />
            </div>
            <div>
              <p className="text-[22px] font-black text-[#1C0F05] leading-none">{v.kpis.cantidadExitosas}</p>
              <p className="text-[11px] font-medium text-[#9A8E82] mt-1">Comprobantes exitosos</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#EDE8E1] p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#FDF3E7] flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-[#C17B2A]" />
            </div>
            <div>
              <p className="text-[14px] font-black text-[#1C0F05] leading-tight">Control de Caja</p>
              <p className="text-[11px] font-medium text-[#9A8E82] mt-0.5">Gestión de créditos y contado</p>
            </div>
          </div>
        </div>

        {/* ── Filtros ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-white border border-[#EDE8E1] rounded-lg px-3 py-2 focus-within:border-[#C17B2A] focus-within:ring-2 focus-within:ring-[#C17B2A]/15 transition-all w-full">
            <Search className="w-3.5 h-3.5 text-[#B5A99E] shrink-0" />
            <input 
              type="text" 
              placeholder="Buscar por cliente, comprobante..." 
              value={v.busqueda}
              onChange={(e) => v.setBusqueda(e.target.value)}
              className="flex-1 bg-transparent text-[12.5px] text-[#1C0F05] placeholder:text-[#C0B4AA] outline-none"
            />
            {v.busqueda && (
              <button onClick={() => v.setBusqueda("")} className="text-[#B5A99E] hover:text-[#5A4A3C] transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          
          <div className="flex bg-[#EDE8E1] rounded-lg p-1 gap-1 shrink-0 w-full sm:w-auto overflow-x-auto">
            {(['todos', 'pagado', 'pendiente', 'anulado'] as const).map(estado => (
              <button 
                key={estado}
                onClick={() => v.setFiltroEstado(estado)}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-[11.5px] font-semibold capitalize transition-all whitespace-nowrap ${
                  v.filtroEstado === estado 
                    ? 'bg-white text-[#1C0F05] shadow-sm' 
                    : 'text-[#8B7D72] hover:text-[#4A3728]'
                }`}
              >
                {estado}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tabla de Resultados (CON SCROLL INTERNO) ── */}
        <div className="bg-white rounded-xl border border-[#EDE8E1] shadow-sm flex flex-col overflow-hidden">
          
          {/* Contenedor del scroll (fija el alto máximo de la tabla) */}
          <div className="overflow-auto max-h-[300px]">
            <table className="w-full text-[12.5px] text-left relative">
              
              {/* Cabecera pegajosa (Sticky Header) */}
              <thead className="sticky top-0 z-10 shadow-[0_1px_0_#EDE8E1]">
                <tr>
                  <th className="px-5 py-3 font-bold text-[10px] uppercase tracking-[0.8px] text-[#A8978B] bg-[#FDFAF7]">Fecha / Comprobante</th>
                  <th className="px-5 py-3 font-bold text-[10px] uppercase tracking-[0.8px] text-[#A8978B] bg-[#FDFAF7]">Cliente</th>
                  <th className="px-5 py-3 font-bold text-[10px] uppercase tracking-[0.8px] text-[#A8978B] text-right bg-[#FDFAF7]">Monto Total</th>
                  <th className="px-5 py-3 font-bold text-[10px] uppercase tracking-[0.8px] text-[#A8978B] text-center bg-[#FDFAF7]">Estado</th>
                  <th className="px-5 py-3 font-bold text-[10px] uppercase tracking-[0.8px] text-[#A8978B] text-right bg-[#FDFAF7]">Acciones</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-[#F5F0EB]">
                {v.cargando ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-5 py-3.5"><div className="h-4 w-32 bg-[#F0EBE4] rounded mb-1.5" /><div className="h-3 w-20 bg-[#F0EBE4] rounded" /></td>
                      <td className="px-5 py-3.5"><div className="h-4 w-40 bg-[#F0EBE4] rounded mb-1.5" /><div className="h-3 w-24 bg-[#F0EBE4] rounded" /></td>
                      <td className="px-5 py-3.5 text-right"><div className="h-4 w-20 bg-[#F0EBE4] rounded ml-auto mb-1.5" /><div className="h-3 w-12 bg-[#F0EBE4] rounded ml-auto" /></td>
                      <td className="px-5 py-3.5"><div className="h-5 w-20 bg-[#F0EBE4] rounded-full mx-auto" /></td>
                      <td className="px-5 py-3.5"><div className="h-7 w-7 bg-[#F0EBE4] rounded-md ml-auto" /></td>
                    </tr>
                  ))
                ) : v.ventasPaginadas.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center text-[#9A8E82] text-sm">
                      <FileText className="w-10 h-10 mx-auto mb-3 text-[#C0B4AA]" />
                      <p className="font-semibold text-[#5A4A3C]">No se encontraron ventas.</p>
                      <p className="text-[12px] mt-1">Ajusta los filtros o realiza ventas en el Punto de Venta.</p>
                    </td>
                  </tr>
                ) : (
                  v.ventasPaginadas.map((venta) => (
                    <tr 
                      key={venta.id} 
                      onClick={() => setVentaSeleccionada(venta)}
                      className="hover:bg-[#FDFAF7] transition-colors group cursor-pointer"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                            venta.comprobante.includes('BOLETA') ? 'bg-[#E6F1FB] border-[#B5D4F4] text-[#1A5FA0]' : 
                            venta.comprobante.includes('FACTURA') ? 'bg-[#F1EFFE] border-[#D9D2F9] text-[#5B45C2]' : 
                            'bg-[#F7F5F2] border-[#EDE8E1] text-[#7A6E65]'
                          }`}>
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-[#1C0F05]">{venta.comprobante}</p>
                            <p className="text-[10px] text-[#9A8E82] font-semibold flex items-center mt-0.5">
                              <Calendar className="w-3 h-3 mr-1" /> {venta.fecha}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-semibold text-[#1C0F05]">{venta.cliente}</p>
                        <p className="text-[10.5px] text-[#9A8E82] mt-0.5">Vendedor: <span className="text-[#5A4A3C] font-medium">{venta.vendedor}</span></p>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <p className="font-black text-[#0D7A3E] text-[13.5px]">{sol(venta.totales.total)}</p>
                        <p className="text-[9.5px] text-[#9A8E82] font-bold uppercase mt-0.5">{venta.metodo_pago}</p>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-[0.5px] ${
                          venta.estado_pago === 'pagado' ? 'bg-[#EDFBF3] text-[#0D6E3F] border border-[#9FE1CB]' : 
                          venta.estado_pago === 'pendiente' ? 'bg-[#FEF3E6] text-[#944F0A] border border-[#F5D5A3]' :
                          'bg-[#FCEBEB] text-[#8B2020] border border-[#F7C1C1]'
                        }`}>
                          {venta.estado_pago === 'pagado' ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          {venta.estado_pago}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                          {venta.estado_pago === 'pendiente' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                v.handleRegistrarPago(venta.id);
                              }}
                              className="h-7 px-2.5 rounded-md flex items-center justify-center gap-1 text-[11px] font-bold bg-[#EDFBF3] text-[#0D6E3F] border border-[#9FE1CB] hover:bg-[#DDF7E7] transition-all shadow-sm"
                              title="Registrar cobro"
                            >
                              <DollarSign className="w-3 h-3" /> Pagar
                            </button>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation(); 
                              setVentaSeleccionada(venta);
                            }}
                            className="w-7 h-7 rounded-md flex items-center justify-center text-[#9A8E82] border border-transparent hover:text-[#1C0F05] hover:bg-[#F7F5F2] hover:border-[#EDE8E1] transition-all"
                            title="Ver detalle"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer de tabla (Paginador) */}
          <div className="px-5 py-2.5 bg-[#FDFAF7] border-t border-[#EDE8E1] flex items-center justify-between shrink-0">
            <span className="text-[11px] text-[#9A8E82]">
              {v.ventasTotales.length} venta{v.ventasTotales.length !== 1 ? "s" : ""}
            </span>
            <Paginador />
          </div>
        </div>

      </div>

      {/* ── MODAL DE DETALLES DE VENTA ── */}
      {ventaModalActualizada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C0F05]/55 backdrop-blur-sm" onClick={() => setVentaSeleccionada(null)}>
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-[#EDE8E1]"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="px-5 py-4 border-b border-[#F0EBE4] flex justify-between items-start bg-[#FDFAF7]">
              <div>
                <h3 className="text-[15px] font-black text-[#1C0F05]">Detalle de Transacción</h3>
                <p className="text-[11.5px] font-bold text-[#C17B2A] mt-0.5">{ventaModalActualizada.comprobante}</p>
              </div>
              <button 
                onClick={() => setVentaSeleccionada(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#7A6E65] hover:text-[#1C0F05] hover:bg-[#EDE8E1] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-4 text-[12.5px]">
                <div>
                  <p className="text-[#9A8E82] mb-1 text-[10px] uppercase tracking-[0.8px] font-bold">Cliente</p>
                  <p className="font-bold text-[#1C0F05]">{ventaModalActualizada.cliente}</p>
                </div>
                <div>
                  <p className="text-[#9A8E82] mb-1 text-[10px] uppercase tracking-[0.8px] font-bold">Fecha de Emisión</p>
                  <p className="font-semibold text-[#5A4A3C]">{ventaModalActualizada.fecha}</p>
                </div>
                <div>
                  <p className="text-[#9A8E82] mb-1 text-[10px] uppercase tracking-[0.8px] font-bold">Vendedor / Cajero</p>
                  <p className="font-semibold text-[#5A4A3C]">{ventaModalActualizada.vendedor}</p>
                </div>
                <div>
                  <p className="text-[#9A8E82] mb-1 text-[10px] uppercase tracking-[0.8px] font-bold">Estado</p>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-[0.5px] ${
                    ventaModalActualizada.estado_pago === 'pagado' ? 'bg-[#EDFBF3] text-[#0D6E3F] border border-[#9FE1CB]' : 
                    ventaModalActualizada.estado_pago === 'pendiente' ? 'bg-[#FEF3E6] text-[#944F0A] border border-[#F5D5A3]' :
                    'bg-[#FCEBEB] text-[#8B2020] border border-[#F7C1C1]'
                  }`}>
                    {ventaModalActualizada.estado_pago}
                  </span>
                </div>
              </div>

              <div className="border-t border-dashed border-[#DDD5CB] pt-5">
                <div className="space-y-2.5">
                  <div className="flex justify-between text-[12.5px]">
                    <span className="text-[#7A6E65] font-medium">Subtotal Gravado</span>
                    <span className="font-bold text-[#5A4A3C]">{sol(ventaModalActualizada.totales.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[12.5px]">
                    <span className="text-[#7A6E65] font-medium">IGV (18%)</span>
                    <span className="font-bold text-[#5A4A3C]">{sol(ventaModalActualizada.totales.igv)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-[#F0EBE4] mt-3">
                    <span className="text-[14px] font-black text-[#1C0F05] uppercase tracking-wide">Importe Total</span>
                    <span className="text-[20px] font-black text-[#0D7A3E]">{sol(ventaModalActualizada.totales.total)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#F7F5F2] border border-[#EDE8E1] p-3.5 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#C17B2A]" />
                  <span className="text-[11.5px] font-bold text-[#7A6E65]">Vía de ingreso</span>
                </div>
                <span className="text-[12.5px] font-black text-[#1C0F05] uppercase tracking-wide">{ventaModalActualizada.metodo_pago}</span>
              </div>

              {ventaModalActualizada.estado_pago === 'pendiente' && (
                <button
                  onClick={() => v.handleRegistrarPago(ventaModalActualizada.id)}
                  className="w-full mt-2 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-bold bg-[#0D7A3E] hover:bg-[#0B5E30] text-white transition-all shadow-sm"
                >
                  <DollarSign className="w-4 h-4" /> Registrar Cobro Completo
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};