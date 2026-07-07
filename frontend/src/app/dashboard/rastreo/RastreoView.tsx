import React from "react";
import { DashboardLayout } from "../dashboard/DashboardLayout";
import { useRastreo, ESTADOS_ENVIO } from "./useRastreo";
import {
  Search, X, Package, Truck, MapPin, CheckCircle, 
  ChevronRight, Activity, Clock, Navigation
} from "lucide-react";

export const RastreoView = () => {
  const pr = useRastreo();

  const getEstadoIcon = (estado: string, isActive: boolean, isPast: boolean) => {
    const colorClass = isPast || isActive ? "text-white" : "text-[#B5A99E]";
    switch (estado) {
      case "Preparando": return <Package className={`w-4 h-4 ${colorClass}`} />;
      case "En Tránsito": return <Truck className={`w-4 h-4 ${colorClass}`} />;
      case "En Agencia Destino": return <MapPin className={`w-4 h-4 ${colorClass}`} />;
      case "En Reparto": return <Navigation className={`w-4 h-4 ${colorClass}`} />;
      case "Entregado": return <CheckCircle className={`w-4 h-4 ${colorClass}`} />;
      default: return <Activity className={`w-4 h-4 ${colorClass}`} />;
    }
  };

  return (
    <DashboardLayout>
      <div className="pb-12 h-[calc(100vh-100px)] flex flex-col">
        
        {/* ── Page header ── */}
        <div className="shrink-0 mb-5">
          <h1 className="text-[20px] font-black text-[#1C0F05] tracking-tight leading-tight">
            Control Rápido de Envíos
          </h1>
          <p className="text-[12.5px] text-[#8B7D72] mt-1">
            Actualiza el estado de los despachos con un solo clic.
          </p>
        </div>

        {/* ── Contenedor Principal Split-Screen ── */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0">
          
          {/* ==========================================
              PANEL IZQUIERDO: LISTA DE ENVÍOS
          ========================================== */}
          <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-2xl border border-[#EDE8E1] shadow-sm flex flex-col overflow-hidden">
            
            {/* Cabecera del Panel Izquierdo (Buscador + Filtros) */}
            <div className="p-3.5 border-b border-[#F0EBE4] bg-[#FDFAF7] shrink-0">
              {/* Buscador */}
              <div className="flex items-center gap-2 bg-white border border-[#EDE8E1] rounded-lg px-3 py-2 focus-within:border-[#C17B2A] focus-within:ring-2 focus-within:ring-[#C17B2A]/15 transition-all">
                <Search className="w-3.5 h-3.5 text-[#B5A99E]" />
                <input
                  type="text"
                  placeholder="Buscar venta o track..."
                  value={pr.busqueda}
                  onChange={(e) => pr.setBusqueda(e.target.value)}
                  className="flex-1 bg-transparent text-[12px] text-[#1C0F05] placeholder:text-[#C0B4AA] outline-none"
                />
                {pr.busqueda && (
                  <button onClick={() => pr.setBusqueda("")} className="text-[#B5A99E] hover:text-[#5A4A3C]">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Filtros de Estado (Scroll Horizontal) */}
              <div className="flex bg-[#EDE8E1] rounded-lg p-1 gap-1 shrink-0 overflow-x-auto mt-2">
                {["Todos", ...ESTADOS_ENVIO].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => pr.setFiltroProgreso(tab)}
                    className={`px-3 py-1.5 rounded-md text-[10.5px] font-semibold whitespace-nowrap transition-all ${
                      pr.filtroProgreso === tab
                        ? "bg-white text-[#1C0F05] shadow-sm"
                        : "text-[#8B7D72] hover:text-[#4A3728]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista Scrollable */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
              {pr.cargando ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="p-3 rounded-xl border border-[#F0EBE4] animate-pulse">
                    <div className="h-3 bg-[#F0EBE4] rounded w-1/2 mb-2" />
                    <div className="h-4 bg-[#F0EBE4] rounded w-3/4" />
                  </div>
                ))
              ) : pr.enviosFiltrados.length === 0 ? (
                <div className="p-6 text-center text-[#9A8E82] text-xs">
                  {pr.filtroProgreso !== "Todos" 
                    ? `No hay envíos en estado "${pr.filtroProgreso}".` 
                    : "No se encontraron resultados."}
                </div>
              ) : (
                pr.enviosFiltrados.map((envio) => {
                  const isSelected = pr.envioSeleccionado?.id === envio.id;
                  return (
                    <button
                      key={envio.id}
                      onClick={() => pr.setEnvioSeleccionado(envio)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                        isSelected 
                          ? "bg-[#FDF3E7] border-[#C17B2A] shadow-sm" 
                          : "bg-white border-[#F0EBE4] hover:bg-[#FDFAF7] hover:border-[#DDD5CB]"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[11.5px] font-bold text-[#1C0F05]">Venta #{envio.sale_id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          envio.estado_actual === 'Entregado' ? 'bg-[#EDFBF3] text-[#0D6E3F]' : 'bg-white border border-[#EDE8E1] text-[#7A6E65]'
                        }`}>
                          {envio.estado_actual}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#8B7D72] flex items-center gap-1.5">
                        <Truck className="w-3 h-3 shrink-0" /> 
                        <span className="truncate">{envio.numero_seguimiento || 'Sin Track'} • {envio.tipo_envio.toUpperCase()}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>


          {/* ==========================================
              PANEL DERECHO: DETALLE Y ACCIONES
          ========================================== */}
          <div className="lg:col-span-8 xl:col-span-9 bg-white rounded-2xl border border-[#EDE8E1] shadow-sm flex flex-col overflow-hidden relative">
            
            {!pr.envioSeleccionado ? (
              <div className="flex-1 flex flex-col items-center justify-center text-[#9A8E82]">
                <Package className="w-12 h-12 mb-3 text-[#E0D8D0]" />
                <p className="text-sm font-medium">Selecciona un envío de la lista para gestionarlo</p>
              </div>
            ) : (
              <>
                {/* Header del Detalle */}
                <div className="p-6 border-b border-[#F0EBE4] bg-[#FDFAF7] shrink-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-black text-[#1C0F05] flex items-center gap-2">
                        Pedido de Venta #{pr.envioSeleccionado.sale_id}
                      </h2>
                      <div className="flex items-center gap-4 mt-2 text-[#7A6E65] text-sm">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Truck className="w-4 h-4 text-[#C17B2A]" /> 
                          {pr.envioSeleccionado.carrier?.nombre || 'Agencia'} ({pr.envioSeleccionado.tipo_envio})
                        </span>
                        {pr.envioSeleccionado.numero_seguimiento && (
                          <span className="flex items-center gap-1.5 font-mono text-[#C17B2A] bg-white px-2 py-0.5 rounded border border-[#EDE8E1]">
                            Track: {pr.envioSeleccionado.numero_seguimiento}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-[#A8978B] mb-1">Destino</p>
                      <p className="text-sm font-bold text-[#1C0F05] max-w-[250px] leading-tight">
                        {pr.envioSeleccionado.direccion_destino}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Línea de Tiempo y Botones de Acción */}
                <div className="flex-1 overflow-y-auto p-8 bg-white">
                  
                  <h3 className="text-[11px] uppercase font-black tracking-[1.5px] text-[#A8978B] mb-8">
                    Progreso del Envío
                  </h3>

                  {/* Stepper Visual */}
                  <div className="relative flex justify-between items-center mb-12 max-w-4xl mx-auto">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#F0EBE4] rounded-full z-0" />
                    
                    {ESTADOS_ENVIO.map((estado, index) => {
                      const currentIndex = ESTADOS_ENVIO.indexOf(pr.envioSeleccionado!.estado_actual);
                      const isPast = index < currentIndex;
                      const isActive = index === currentIndex;
                      
                      return (
                        <div key={estado} className="relative z-10 flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors duration-300 ${
                            isPast ? 'bg-[#0D6E3F]' : isActive ? 'bg-[#C17B2A] ring-4 ring-[#FDF3E7]' : 'bg-[#F0EBE4]'
                          }`}>
                            {getEstadoIcon(estado, isActive, isPast)}
                          </div>
                          <p className={`absolute -bottom-7 text-[10.5px] font-bold w-24 text-center ${
                            isActive ? 'text-[#C17B2A]' : isPast ? 'text-[#0D6E3F]' : 'text-[#A8978B]'
                          }`}>
                            {estado}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Botones de Actualización Rápida */}
                  <div className="mt-16 bg-[#FDFAF7] rounded-2xl border border-[#EDE8E1] p-6">
                    <p className="text-xs font-bold text-[#7A6E65] mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Registrar avance manual:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {ESTADOS_ENVIO.map((estado, index) => {
                        const currentIndex = ESTADOS_ENVIO.indexOf(pr.envioSeleccionado!.estado_actual);
                        const isPastOrCurrent = index <= currentIndex;
                        const isNext = index === currentIndex + 1;
                        
                        return (
                          <button
                            key={`btn-${estado}`}
                            onClick={() => pr.actualizarEstado(pr.envioSeleccionado!.id, estado)}
                            disabled={isPastOrCurrent || pr.actualizandoId === pr.envioSeleccionado!.id}
                            className={`relative overflow-hidden flex flex-col items-center justify-center py-4 px-2 rounded-xl text-[11px] font-bold transition-all ${
                              isPastOrCurrent 
                                ? "bg-white text-[#C0B4AA] border border-[#F0EBE4] cursor-not-allowed opacity-50" 
                                : isNext
                                  ? "bg-[#C17B2A] text-white shadow-md shadow-[#C17B2A]/20 hover:bg-[#A86522] hover:-translate-y-0.5"
                                  : "bg-white text-[#5A4A3C] border border-[#EDE8E1] hover:border-[#C17B2A] hover:text-[#C17B2A]"
                            }`}
                          >
                            {pr.actualizandoId === pr.envioSeleccionado!.id && isNext ? (
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mb-2" />
                            ) : (
                              <ChevronRight className={`w-4 h-4 mb-1.5 ${isNext ? 'animate-bounce-x' : ''}`} />
                            )}
                            <span className="text-center leading-tight">{estado}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </>
            )}

            {pr.cargando && pr.enviosFiltrados.length > 0 && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-50 flex items-center justify-center">
                <span className="w-8 h-8 border-4 border-[#C17B2A]/30 border-t-[#C17B2A] rounded-full animate-spin" />
              </div>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};