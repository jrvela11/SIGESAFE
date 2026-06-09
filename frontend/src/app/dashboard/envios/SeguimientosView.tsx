import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import api from "../../../lib/api";
import { DashboardLayout } from "../dashboard/DashboardLayout";
import type { Envio, HistorialItem } from "../envios/useEnvios";
import {
  Plus, Search, X, History, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Package, Building2, Truck, CheckCircle2, Clock,
  MapPin, AlertCircle, User
} from "lucide-react";

// ─── Tipos e Interfaces ───────────────────────────────────────────────────────

type FormSeguimiento = {
  estado: string;
  ubicacion: string;
  descripcion: string;
};

const FORM_VACÍO: FormSeguimiento = {
  estado: "preparando",
  ubicacion: "",
  descripcion: "",
};

// Límite de envíos por página
const POR_PAGINA = 8;

const ESTADO_CONFIG: Record<string, { label: string; cls: string; bg: string; icon: React.ReactNode }> = {
  preparando:  { label: "Preparando",  cls: "text-stone-700 border-stone-200", bg: "bg-stone-100",     icon: <Package className="w-4 h-4" /> },
  en_agencia:  { label: "En agencia",  cls: "text-blue-700 border-blue-200",   bg: "bg-blue-50",       icon: <Building2 className="w-4 h-4" /> },
  en_transito: { label: "En tránsito", cls: "text-amber-700 border-amber-200", bg: "bg-amber-50",      icon: <Truck className="w-4 h-4" /> },
  entregado:   { label: "Entregado",   cls: "text-emerald-700 border-emerald-200", bg: "bg-emerald-50", icon: <CheckCircle2 className="w-4 h-4" /> },
};

// ─── Hook Custom ──────────────────────────────────────────────────────────────
export const useSeguimientos = () => {
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [cargando, setCargando] = useState(true);

  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);

  // Estado para el acordeón (Envío expandido)
  const [expandidoId, setExpandidoId] = useState<number | null>(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [envioSeleccionado, setEnvioSeleccionado] = useState<Envio | null>(null);
  const [formData, setFormData] = useState<FormSeguimiento>(FORM_VACÍO);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const fetchEnvios = useCallback(async () => {
    try {
      setCargando(true);
      const res = await api.get("/envios");
      if (res.data.success) setEnvios(res.data.data);
    } catch {
      toast.error("Error al cargar los seguimientos.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { fetchEnvios(); }, [fetchEnvios]);
  useEffect(() => { setPagina(1); }, [filtroEstado, busqueda]);

  // Filtrado agrupado por Envío
  const enviosFiltrados = useMemo(() => {
    return envios.filter(e => {
      const matchEstado = filtroEstado === "todos" || e.estado_actual === filtroEstado;
      const t = busqueda.toLowerCase();
      const matchBusqueda =
        e.cliente_nombre.toLowerCase().includes(t) ||
        e.direccion_destino.toLowerCase().includes(t) ||
        (e.numero_seguimiento ?? "").toLowerCase().includes(t) ||
        String(e.id) === t;
      return matchEstado && matchBusqueda;
    });
  }, [envios, filtroEstado, busqueda]);

  const totalPaginas = Math.max(1, Math.ceil(enviosFiltrados.length / POR_PAGINA));
  const paginaAjustada = Math.min(pagina, totalPaginas);
  const enviosPaginados = enviosFiltrados.slice((paginaAjustada - 1) * POR_PAGINA, paginaAjustada * POR_PAGINA);

  const stats = useMemo(() => ({
    total: envios.length,
    preparando:  envios.filter(e => e.estado_actual === "preparando").length,
    en_agencia:  envios.filter(e => e.estado_actual === "en_agencia").length,
    en_transito: envios.filter(e => e.estado_actual === "en_transito").length,
    entregado:   envios.filter(e => e.estado_actual === "entregado").length,
  }), [envios]);

  // Expandir Acordeón y buscar historial si no lo tiene
  const toggleExpand = async (envio: Envio) => {
    if (expandidoId === envio.id) {
      setExpandidoId(null); // Lo cierra si ya estaba abierto
      return;
    }
    
    setExpandidoId(envio.id);
    
    // Si no tiene el historial completo cargado, lo pide a la API
    if (!envio.historial || envio.historial.length === 0) {
      try {
        setCargandoDetalle(true);
        const res = await api.get(`/envios/${envio.id}`);
        if (res.data.success) {
          // Actualiza solo ese envío en la lista
          setEnvios(prev => prev.map(e => e.id === envio.id ? res.data.data : e));
        }
      } catch {
        toast.error("No se pudo cargar el historial completo.");
      } finally {
        setCargandoDetalle(false);
      }
    }
  };

  const abrirModalAgregar = (envio: Envio) => {
    setFormData(FORM_VACÍO); 
    setErrores({}); 
    setEnvioSeleccionado(envio); 
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false); setEnvioSeleccionado(null); setFormData(FORM_VACÍO); setErrores({});
  };

  const handleChange = (field: keyof FormSeguimiento, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errores[field]) setErrores(prev => ({ ...prev, [field]: "" }));
  };

  const validar = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.estado.trim()) e.estado = "Selecciona un estado.";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar() || !envioSeleccionado) return;

    try {
      setGuardando(true);
      const res = await api.post(`/envios/${envioSeleccionado.id}/seguimiento`, {
        estado: formData.estado,
        ubicacion: formData.ubicacion || null,
        descripcion: formData.descripcion || null,
      });
      if (res.data.success) {
        toast.success("Evento agregado correctamente.");
        cerrarModal();
        
        // Actualizar el historial del envío específico sin recargar todo
        const resRefresh = await api.get(`/envios/${envioSeleccionado.id}`);
        if (resRefresh.data.success) {
            setEnvios(prev => prev.map(env => env.id === envioSeleccionado.id ? resRefresh.data.data : env));
        }
      }
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const e: Record<string, string> = {};
        Object.entries(err.response.data.errors as Record<string, string[]>).forEach(([k, v]) => { e[k] = v[0]; });
        setErrores(e);
      } else {
        toast.error("Error al registrar el seguimiento.");
      }
    } finally {
      setGuardando(false);
    }
  };

  return {
    envios, cargando, enviosFiltrados, enviosPaginados, stats,
    filtroEstado, setFiltroEstado, busqueda, setBusqueda, pagina, setPagina, totalPaginas, paginaAjustada,
    expandidoId, toggleExpand, cargandoDetalle,
    isModalOpen, envioSeleccionado, formData, errores, guardando, abrirModalAgregar, cerrarModal, handleChange, handleSubmit,
  };
};

// ─── Helpers UI ───────────────────────────────────────────────────────────────
const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-800 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-700/15 placeholder:text-stone-300";
const inputErrCls = "border-red-300 focus:border-red-500 focus:ring-red-500/15";

const Label: React.FC<{ children: React.ReactNode; req?: boolean }> = ({ children, req }) => (
  <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
    {children}{req && <span className="text-amber-600 ml-0.5">*</span>}
  </p>
);

const EstadoBadge: React.FC<{ estado: string }> = ({ estado }) => {
  const cfg = ESTADO_CONFIG[estado] ?? ESTADO_CONFIG.preparando;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider border shadow-sm ${cfg.bg} ${cfg.cls}`}>
      {cfg.icon}{cfg.label}
    </span>
  );
};

// ─── Componente Principal (Vista Agrupada en Acordeón) ────────────────────────
export const SeguimientosView: React.FC = () => {
  const seg = useSeguimientos();

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12 max-w-5xl mx-auto h-full">
        
        {/* ── Banner Principal Unificado ── */}
        <div className="relative bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 rounded-3xl p-6 sm:p-8 text-white overflow-hidden shadow-md shadow-amber-900/10">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 20% 40%, rgba(255,255,255,0.3) 2px, transparent 2px), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 1.5px, transparent 1.5px)`,
            backgroundSize: "80px 80px, 120px 120px",
          }} />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20 shadow-sm">
                <History className="w-7 h-7 text-amber-100" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white">Trazabilidad de Envíos</h1>
            </div>
            <p className="text-amber-100/90 text-sm font-medium ml-1 max-w-lg">
              Consulta el estado actual de los despachos y despliega el historial cronológico agrupado de cada paquete.
            </p>
          </div>
        </div>

        {/* ── Filtros y Buscador Avanzado ── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex overflow-x-auto custom-scrollbar p-1.5 bg-white rounded-2xl border border-stone-200 w-full md:w-auto shadow-sm">
            <button onClick={() => seg.setFiltroEstado("todos")} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${seg.filtroEstado === "todos" ? "bg-amber-50 text-amber-800 shadow-sm border border-amber-100/50" : "text-stone-500 hover:bg-stone-50 border border-transparent"}`}>
              Todos <span className={`px-1.5 py-0.5 rounded-md ${seg.filtroEstado === "todos" ? "bg-amber-200/50" : "bg-stone-100"}`}>{seg.stats.total}</span>
            </button>
            {Object.entries(ESTADO_CONFIG).map(([key, config]) => (
              <button key={key} onClick={() => seg.setFiltroEstado(key)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${seg.filtroEstado === key ? "bg-amber-50 text-amber-800 shadow-sm border border-amber-100/50" : "text-stone-500 hover:bg-stone-50 border border-transparent"}`}>
                {config.label}
                <span className={`px-1.5 py-0.5 rounded-md ${seg.filtroEstado === key ? "bg-amber-200/50" : "bg-stone-100"}`}>{seg.stats[key as keyof typeof seg.stats]}</span>
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input type="text" placeholder="Buscar cliente, destino, tracking..." value={seg.busqueda} onChange={e => seg.setBusqueda(e.target.value)} className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-200 rounded-2xl text-sm font-medium outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 shadow-sm transition-all" />
          </div>
        </div>

        {/* ==========================================
            LISTA DE ACORDEONES (AGRUPADOS POR ENVÍO)
            ========================================== */}
        <div className="space-y-3">
          {seg.cargando ? (
            <div className="p-12 text-center text-stone-400 bg-white rounded-3xl border border-stone-200 shadow-sm">
              <span className="w-8 h-8 border-4 border-stone-200 border-t-amber-500 rounded-full animate-spin inline-block mb-3"></span>
              <p className="font-medium text-sm">Cargando envíos...</p>
            </div>
          ) : seg.enviosPaginados.length === 0 ? (
            <div className="p-12 text-center text-stone-400 bg-white rounded-3xl border border-stone-200 shadow-sm">
              <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-50" /> 
              <p className="font-bold text-stone-600">No se encontraron envíos.</p>
              <p className="text-sm mt-1">Prueba cambiando los filtros de búsqueda.</p>
            </div>
          ) : (
            seg.enviosPaginados.map((envio: Envio) => {
              const isExpanded = seg.expandidoId === envio.id;
              const cfg = ESTADO_CONFIG[envio.estado_actual] ?? ESTADO_CONFIG.preparando;

              return (
                <div key={envio.id} className={`bg-white rounded-3xl border transition-all duration-300 shadow-sm overflow-hidden ${isExpanded ? 'border-amber-300 ring-4 ring-amber-50' : 'border-stone-200 hover:border-amber-200'}`}>
                  
                  {/* CABECERA DE LA TARJETA (Clickeable) */}
                  <div 
                    onClick={() => seg.toggleExpand(envio)}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${cfg.bg} ${cfg.cls}`}>
                        {cfg.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black text-amber-800 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md">
                            ENVÍO #{envio.id}
                          </span>
                          {envio.numero_seguimiento && (
                            <span className="text-[10px] font-mono font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                              TRK: {envio.numero_seguimiento}
                            </span>
                          )}
                        </div>
                        <h3 className="font-black text-stone-800 text-base">{envio.cliente_nombre}</h3>
                        <p className="text-xs font-medium text-stone-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {envio.direccion_destino}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 sm:gap-6 self-start sm:self-auto w-full sm:w-auto">
                      <div className="flex-1 sm:text-right hidden sm:block">
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Estado Actual</p>
                        <EstadoBadge estado={envio.estado_actual} />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0 ml-auto sm:ml-0 text-stone-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* CUERPO EXPANDIDO (Línea de Tiempo) */}
                  {isExpanded && (
                    <div className="border-t border-stone-100 bg-stone-50/40 p-5 sm:p-6 animate-in slide-in-from-top-2 duration-300">
                      
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-[11px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                          <History className="w-4 h-4 text-amber-600" /> Historial de Ruta
                        </h4>
                        {envio.estado_actual !== "entregado" && (
                          <button
                            onClick={() => seg.abrirModalAgregar(envio)}
                            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-900 px-3 py-1.5 rounded-lg text-xs font-black shadow-sm transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" /> Nuevo Evento
                          </button>
                        )}
                      </div>

                      {seg.cargandoDetalle ? (
                        <div className="py-6 text-center text-stone-400">
                          <span className="w-6 h-6 border-2 border-stone-300 border-t-amber-500 rounded-full animate-spin inline-block mb-2"></span>
                          <p className="text-xs font-medium">Cargando historial...</p>
                        </div>
                      ) : (!envio.historial || envio.historial.length === 0) ? (
                        <div className="py-8 text-center text-stone-400 bg-white rounded-2xl border border-stone-200 border-dashed">
                          <Clock className="w-6 h-6 mx-auto mb-2 opacity-30" />
                          <p className="text-[12px] font-medium">Sin eventos registrados aún.</p>
                        </div>
                      ) : (
                        <div className="relative pl-3">
                          {/* Línea conectora del timeline */}
                          <div className="absolute top-2 bottom-2 left-[15px] w-[2px] bg-stone-200 rounded-full" />
                          
                          <div className="space-y-6">
                            {[...(envio.historial)].reverse().map((h, i) => {
                              const hCfg = ESTADO_CONFIG[h.estado] ?? ESTADO_CONFIG.preparando;
                              const esUltimo = i === 0;
                              return (
                                <div key={h.id} className="relative z-10 flex gap-4 items-start">
                                  {/* Punto del timeline */}
                                  <div className={`w-3.5 h-3.5 rounded-full shrink-0 mt-1 flex items-center justify-center ${esUltimo ? 'bg-amber-500 ring-4 ring-amber-100' : 'bg-stone-300'}`} />
                                  
                                  <div className="flex-1 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                      <p className={`text-[13px] font-black flex items-center gap-1.5 ${esUltimo ? 'text-stone-900' : 'text-stone-600'}`}>
                                        {hCfg.icon} {hCfg.label}
                                      </p>
                                      <p className="text-[11px] font-bold text-stone-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> 
                                        {new Date(h.fecha).toLocaleString("es-PE", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                                      </p>
                                    </div>
                                    
                                    {h.ubicacion && (
                                      <div className="flex items-center gap-1.5 mt-2 text-stone-600 font-bold text-xs">
                                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                                        <span>{h.ubicacion}</span>
                                      </div>
                                    )}

                                    {h.descripcion && (
                                      <div className="mt-2.5 bg-stone-50 px-3 py-2.5 rounded-xl border border-stone-100 text-[12px] font-medium text-stone-600 leading-relaxed">
                                        {h.descripcion}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
          
        {/* Paginación */}
        {seg.totalPaginas > 1 && (
            <div className="pt-4 flex justify-center gap-2">
              <button onClick={() => seg.setPagina(p => Math.max(1, p - 1))} disabled={seg.paginaAjustada === 1} className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-50 disabled:opacity-40 shadow-sm"><ChevronLeft className="w-5 h-5" /></button>
              <span className="flex items-center text-sm font-bold text-stone-500 px-4 bg-white rounded-xl border border-stone-200 shadow-sm">Página {seg.paginaAjustada} de {seg.totalPaginas}</span>
              <button onClick={() => seg.setPagina(p => Math.min(seg.totalPaginas, p + 1))} disabled={seg.paginaAjustada === seg.totalPaginas} className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-50 disabled:opacity-40 shadow-sm"><ChevronRight className="w-5 h-5" /></button>
            </div>
        )}

      </div>

      {/* ════════════════════════════════════════════════════════
          MODAL: AGREGAR EVENTO MANUAL
      ═══════════════════════════════════════════════════════════ */}
      {seg.isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={seg.cerrarModal} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col border border-stone-200/60 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="shrink-0 flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-stone-50/50">
              <div>
                <h3 className="text-lg font-black text-stone-900">Registrar Actividad</h3>
                {seg.envioSeleccionado && (
                  <p className="text-[11px] font-bold text-stone-500 uppercase tracking-widest mt-1">
                    Envío #{seg.envioSeleccionado.id}
                  </p>
                )}
              </div>
              <button onClick={seg.cerrarModal} className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form id="formSeguimiento" onSubmit={seg.handleSubmit} className="px-6 py-6 space-y-5">
              <div>
                <Label req>Fase Logística (Estado)</Label>
                <select
                  value={seg.formData.estado}
                  onChange={e => seg.handleChange("estado", e.target.value)}
                  className={`${inputCls} cursor-pointer ${seg.errores.estado ? inputErrCls : ""}`}
                >
                  <option value="preparando">Preparando pedido en almacén</option>
                  <option value="en_agencia">Despachado a Agencia / Conductor</option>
                  <option value="en_transito">En ruta hacia el destino</option>
                  <option value="entregado">Entregado conforme al cliente</option>
                </select>
                {seg.errores.estado && <p className="text-red-500 text-[11px] mt-1 font-medium">{seg.errores.estado}</p>}
              </div>

              <div>
                <Label>Punto de Control / Ubicación actual</Label>
                <input
                  type="text"
                  placeholder="Ej: Agencia Bagua Grande, o En ruta"
                  value={seg.formData.ubicacion}
                  onChange={e => seg.handleChange("ubicacion", e.target.value)}
                  className={inputCls}
                />
              </div>

              <div>
                <Label>Detalles adicionales y Observaciones</Label>
                <textarea
                  rows={3}
                  placeholder="Detalla novedades del despacho para auditoría interna..."
                  value={seg.formData.descripcion}
                  onChange={e => seg.handleChange("descripcion", e.target.value)}
                  className={inputCls + " resize-none"}
                />
              </div>
            </form>

            <div className="flex gap-3 px-6 py-5 border-t border-stone-100 bg-stone-50/50">
              <button type="button" onClick={seg.cerrarModal} className="flex-1 py-3 rounded-xl bg-white border border-stone-200 font-bold text-sm text-stone-600 hover:bg-stone-100 transition-colors">
                Cancelar
              </button>
              <button
                form="formSeguimiento"
                type="submit"
                disabled={seg.guardando}
                className="flex-[1.5] py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-black text-sm disabled:opacity-60 transition-colors shadow-md"
              >
                {seg.guardando ? "Procesando..." : "Guardar Registro"}
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};