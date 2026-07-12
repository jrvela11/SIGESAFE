import { DashboardLayout } from "../dashboard/DashboardLayout";
import { useMisEntregas } from "./useMisEntregas";
import {
  MapPin, CheckCircle, Package, Navigation, RefreshCw, AlertCircle, Search, X
} from "lucide-react";

export const MisEntregasView = () => {
  const md = useMisEntregas();

  return (
    <DashboardLayout>
      {/* Contenedor estricto para evitar el scroll infinito en toda la página */}
      <div className="max-w-md mx-auto flex flex-col h-[calc(90vh-100px)]">
        
        {/* ── SECCIÓN SUPERIOR (Fija, no hace scroll) ── */}
        <div className="shrink-0 space-y-4 mb-4 pt-1">
          <div className="bg-[#1C0F05] text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Package className="w-24 h-24" />
            </div>
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-black tracking-tight mb-1">Ruta de Hoy</h1>
                <p className="text-[#C0B4AA] text-sm font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C17B2A] animate-pulse"></span>
                  {md.entregasTotales.length} {md.entregasTotales.length === 1 ? 'pendiente' : 'pendientes'}
                </p>
              </div>
              <button 
                onClick={md.refrescar}
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors shrink-0"
              >
                <RefreshCw className={`w-5 h-5 text-white ${md.cargando ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#EDE8E1] p-3 shadow-sm">
            <div className="flex items-center gap-2 bg-[#FDFAF7] border border-[#EDE8E1] rounded-xl px-3 py-2 mb-3 focus-within:border-[#C17B2A] focus-within:ring-2 focus-within:ring-[#C17B2A]/15 transition-all">
              <Search className="w-4 h-4 text-[#B5A99E] shrink-0" />
              <input
                type="text"
                placeholder="Buscar dirección, track..."
                value={md.busqueda}
                onChange={(e) => md.setBusqueda(e.target.value)}
                className="flex-1 bg-transparent text-sm text-[#1C0F05] placeholder:text-[#C0B4AA] outline-none min-w-0"
              />
              {md.busqueda && (
                <button onClick={() => md.setBusqueda("")} className="text-[#B5A99E] hover:text-[#5A4A3C] shrink-0">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
              {md.estadosDisponibles.map((estado) => (
                <button
                  key={estado}
                  onClick={() => md.setFiltroEstado(estado)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    md.filtroEstado === estado
                      ? "bg-[#1C0F05] text-white"
                      : "bg-[#F7F5F2] text-[#7A6E65] border border-[#EDE8E1] hover:bg-[#EDE8E1]"
                  }`}
                >
                  {estado}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECCIÓN INFERIOR (Solo esta parte hace scroll) ── */}
        {/* 'min-h-0' evita que el contenedor colapse o estire la pantalla completa */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-4 custom-scrollbar pb-12 pr-1">
          {md.cargando ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#EDE8E1] p-4 animate-pulse">
                <div className="h-4 bg-[#F0EBE4] rounded w-1/3 mb-4" />
                <div className="h-6 bg-[#F0EBE4] rounded w-full mb-2" />
                <div className="h-4 bg-[#F0EBE4] rounded w-2/3 mb-6" />
                <div className="h-12 bg-[#F0EBE4] rounded-xl w-full" />
              </div>
            ))
          ) : md.entregasTotales.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#EDE8E1] p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-[#EDFBF3] rounded-full flex items-center justify-center mb-4 shrink-0">
                <CheckCircle className="w-8 h-8 text-[#0D6E3F]" />
              </div>
              <h3 className="text-lg font-black text-[#1C0F05]">¡Ruta Completada!</h3>
              <p className="text-sm text-[#8B7D72] mt-2">No tienes entregas asignadas para el día de hoy.</p>
            </div>
          ) : md.entregasFiltradas.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#EDE8E1] p-8 text-center">
              <p className="text-sm font-bold text-[#8B7D72]">No se encontraron paquetes con esos filtros.</p>
            </div>
          ) : (
            md.entregasFiltradas.map((envio) => (
              <div key={envio.id} className="bg-white rounded-2xl border border-[#EDE8E1] p-5 shadow-sm relative overflow-hidden shrink-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF3E7] text-[#C17B2A] rounded-full text-xs font-bold mb-4 border border-[#F0D9B5]">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {envio.estado_actual}
                </div>

                <div className="mb-6">
                  <p className="text-[10px] font-bold text-[#A8978B] uppercase tracking-wider mb-1">Dirección de Entrega</p>
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-5 h-5 text-[#1C0F05] shrink-0 mt-0.5" />
                    <h2 className="text-lg font-bold text-[#1C0F05] leading-snug break-words">
                      {envio.direccion_destino}
                    </h2>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between border-t border-[#F5F0EB] pt-3">
                    <div>
                      <p className="text-[10px] text-[#A8978B] uppercase tracking-wider font-bold">Venta</p>
                      <p className="font-semibold text-[#5A4A3C]">#{envio.sale_id}</p>
                    </div>
                    {envio.numero_seguimiento && (
                      <div className="text-right">
                        <p className="text-[10px] text-[#A8978B] uppercase tracking-wider font-bold">Track</p>
                        <p className="font-mono font-medium text-[#C17B2A] text-sm">{envio.numero_seguimiento}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(envio.direccion_destino)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#F7F5F2] hover:bg-[#EDE8E1] text-[#5A4A3C] font-bold py-3.5 rounded-xl transition-colors w-full"
                  >
                    <Navigation className="w-5 h-5" />
                    <span>Ver en Mapa</span>
                  </a>

                  <button
                    onClick={() => md.iniciarConfirmacion(envio)}
                    disabled={md.procesandoId === envio.id}
                    className="flex items-center justify-center gap-2 bg-[#0D6E3F] hover:bg-[#0A5A33] text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-[#0D6E3F]/30 disabled:opacity-70 active:scale-95 w-full"
                  >
                    {md.procesandoId === envio.id ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Entregado</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── MODAL DE CONFIRMACIÓN BONITO ── */}
      {md.envioAConfirmar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1C0F05]/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative">
            <div className="w-14 h-14 bg-[#EDFBF3] rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm absolute -top-7 left-1/2 -translate-x-1/2">
              <CheckCircle className="w-7 h-7 text-[#0D6E3F]" />
            </div>
            
            <div className="mt-8 text-center">
              <h3 className="text-xl font-black text-[#1C0F05] mb-2">Confirmar Entrega</h3>
              <p className="text-sm text-[#5A4A3C] font-medium leading-relaxed">
                ¿Estás seguro que deseas marcar este paquete como entregado?
              </p>
              
              <div className="bg-[#FDF3E7] p-3 rounded-xl mt-4 text-left border border-[#F0D9B5]">
                <p className="text-[10px] text-[#A8978B] uppercase tracking-wider font-bold mb-0.5">Dirección:</p>
                <p className="text-[13px] font-bold text-[#C17B2A] leading-snug">
                  {md.envioAConfirmar.direccion_destino}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={md.cancelarConfirmacion}
                disabled={md.procesandoId !== null}
                className="flex-1 py-3 bg-[#F7F5F2] hover:bg-[#EDE8E1] text-[#5A4A3C] font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={md.confirmarEntrega}
                disabled={md.procesandoId !== null}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#0D6E3F] hover:bg-[#0A5A33] text-white font-bold rounded-xl shadow-md shadow-[#0D6E3F]/30 transition-all disabled:opacity-70 active:scale-95"
              >
                {md.procesandoId !== null ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Sí, Entregado"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};