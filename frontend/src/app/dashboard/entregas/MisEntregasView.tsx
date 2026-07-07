import { DashboardLayout } from "../dashboard/DashboardLayout";
import { useMisEntregas } from "./useMisEntregas";
import {
  MapPin, CheckCircle, Package, Navigation, RefreshCw, AlertCircle, Search, X
} from "lucide-react";

export const MisEntregasView = () => {
  const md = useMisEntregas();

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto pb-24 flex flex-col h-[calc(100vh-80px)]">
        
        {/* ── SECCIÓN SUPERIOR (Fija) ── */}
        <div className="shrink-0 space-y-4 mb-4">
          
          {/* Encabezado Móvil */}
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
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <RefreshCw className={`w-5 h-5 text-white ${md.cargando ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Barra de Búsqueda y Filtros */}
          <div className="bg-white rounded-2xl border border-[#EDE8E1] p-3 shadow-sm">
            
            {/* Buscador */}
            <div className="flex items-center gap-2 bg-[#FDFAF7] border border-[#EDE8E1] rounded-xl px-3 py-2 mb-3 focus-within:border-[#C17B2A] focus-within:ring-2 focus-within:ring-[#C17B2A]/15 transition-all">
              <Search className="w-4 h-4 text-[#B5A99E] shrink-0" />
              <input
                type="text"
                placeholder="Buscar dirección, track..."
                value={md.busqueda}
                onChange={(e) => md.setBusqueda(e.target.value)}
                className="flex-1 bg-transparent text-sm text-[#1C0F05] placeholder:text-[#C0B4AA] outline-none"
              />
              {md.busqueda && (
                <button onClick={() => md.setBusqueda("")} className="text-[#B5A99E] hover:text-[#5A4A3C]">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Píldoras de Filtro (Scroll Horizontal) */}
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

        {/* ── SECCIÓN INFERIOR (Lista con Scroll) ── */}
        <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pb-10">
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
              <div className="w-16 h-16 bg-[#EDFBF3] rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-[#0D6E3F]" />
              </div>
              <h3 className="text-lg font-black text-[#1C0F05]">¡Ruta Completada!</h3>
              <p className="text-sm text-[#8B7D72] mt-2">
                No tienes entregas asignadas para el día de hoy.
              </p>
            </div>
          ) : md.entregasFiltradas.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#EDE8E1] p-8 text-center">
              <p className="text-sm font-bold text-[#8B7D72]">
                No se encontraron paquetes con esos filtros.
              </p>
            </div>
          ) : (
            md.entregasFiltradas.map((envio) => (
              <div key={envio.id} className="bg-white rounded-2xl border border-[#EDE8E1] p-5 shadow-sm relative overflow-hidden">
                
                {/* Etiqueta de Estado */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF3E7] text-[#C17B2A] rounded-full text-xs font-bold mb-4 border border-[#F0D9B5]">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {envio.estado_actual}
                </div>

                {/* Destino y Datos */}
                <div className="mb-6">
                  <p className="text-[10px] font-bold text-[#A8978B] uppercase tracking-wider mb-1">Dirección de Entrega</p>
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-5 h-5 text-[#1C0F05] shrink-0 mt-0.5" />
                    <h2 className="text-lg font-bold text-[#1C0F05] leading-snug">
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

                {/* Botones de Acción */}
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
                    onClick={() => md.marcarComoEntregado(envio)}
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
    </DashboardLayout>
  );
};