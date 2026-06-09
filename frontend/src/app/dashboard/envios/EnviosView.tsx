import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import api from "../../../lib/api";
import { DashboardLayout } from "../dashboard/DashboardLayout";
import {
  Plus, Edit, Search, X, Truck, Package,
  History, CheckCircle2, Clock, MapPin, AlertCircle,
  Building2, ChevronLeft, ChevronRight, Play, Check, User
} from "lucide-react";

// ─── Tipos e Interfaces ───────────────────────────────────────────────────────

export interface Agencia {
  id: number;
  nombre: string;
  ruc_dni: string | null;
  telefono: string | null;
  estado: boolean;
}

export interface HistorialItem {
  id: number;
  envio_id: number;
  estado: string;
  ubicacion: string | null;
  descripcion: string | null;
  fecha: string;
}

export interface Envio {
  id: number;
  venta_id: number;
  cliente_nombre: string;
  direccion_destino: string;
  tipo_envio: "local" | "interregional";
  agencia: Agencia | null;
  numero_seguimiento: string | null;
  repartidor_nombre: string | null;
  costo_envio: number;
  fecha_estimada_llegada: string | null;
  estado_actual: "preparando" | "en_agencia" | "en_transito" | "entregado";
  estado: boolean;
  historial?: HistorialItem[];
}

export type EstadoEnvio = "preparando" | "en_agencia" | "en_transito" | "entregado";

type FormEnvio = {
  venta_id: string;
  agencia_transporte_id: string;
  tipo_envio: string;
  numero_seguimiento: string;
  repartidor_nombre: string;
  direccion_destino: string;
  costo_envio: number | string;
  fecha_estimada_llegada: string;
  estado_actual: string;
};

type FormAgencia = {
  nombre: string;
  ruc_dni: string;
  telefono: string;
};

const FORM_ENVIO_VACÍO: FormEnvio = {
  venta_id: "",
  agencia_transporte_id: "",
  tipo_envio: "local",
  numero_seguimiento: "",
  repartidor_nombre: "",
  direccion_destino: "",
  costo_envio: "",
  fecha_estimada_llegada: "",
  estado_actual: "preparando",
};

// LIMITE DE 8 POR PÁGINA PARA CUADRAR ALTURAS
const POR_PAGINA = 8;

// ─── Configuración Visual de Estados ─────────────────────────────────────────
const ESTADOS_FLUJO = ["preparando", "en_agencia", "en_transito", "entregado"];

const ESTADO_CONFIG: Record<string, { label: string; cls: string; icon: React.ReactNode; nextLabel: string; autoDesc: string }> = {
  preparando:  { label: "Preparando",  cls: "bg-stone-100 text-stone-700 border-stone-200", icon: <Package className="w-3.5 h-3.5" />, nextLabel: "A Agencia / Repartidor", autoDesc: "El paquete ha sido entregado al despachador/agencia." },
  en_agencia:  { label: "En agencia",  cls: "bg-blue-50 text-blue-700 border-blue-200",     icon: <Building2 className="w-3.5 h-3.5" />, nextLabel: "Poner en Tránsito", autoDesc: "El paquete se encuentra en ruta hacia su destino." },
  en_transito: { label: "En tránsito", cls: "bg-amber-50 text-amber-700 border-amber-200",  icon: <Truck className="w-3.5 h-3.5" />, nextLabel: "Marcar Entregado", autoDesc: "El paquete fue entregado exitosamente al cliente." },
  entregado:   { label: "Entregado",   cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <CheckCircle2 className="w-3.5 h-3.5" />, nextLabel: "", autoDesc: "" },
};

// ─── Hook Custom ──────────────────────────────────────────────────────────────

export const useEnvios = () => {
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [agencias, setAgencias] = useState<Agencia[]>([]);
  const [cargando, setCargando] = useState(true);

  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);

  const [envioSeleccionado, setEnvioSeleccionado] = useState<Envio | null>(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [envioAEditar, setEnvioAEditar] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormEnvio>(FORM_ENVIO_VACÍO);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const [isAgenciaModalOpen, setIsAgenciaModalOpen] = useState(false);
  const [agenciaAEditar, setAgenciaAEditar] = useState<number | null>(null);
  const [formAgencia, setFormAgencia] = useState<FormAgencia>({ nombre: "", ruc_dni: "", telefono: "" });
  const [guardandoAgencia, setGuardandoAgencia] = useState(false);

  const fetchDatos = useCallback(async () => {
    try {
      setCargando(true);
      const [resEnvios, resAgencias] = await Promise.all([
        api.get("/envios"),
        api.get("/agencias-transporte"),
      ]);
      if (resEnvios.data.success) setEnvios(resEnvios.data.data);
      if (resAgencias.data.success) setAgencias(resAgencias.data.data.filter((a: Agencia) => a.estado));
    } catch {
      toast.error("Error al cargar los datos.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { fetchDatos(); }, [fetchDatos]);
  useEffect(() => { setPagina(1); }, [filtroEstado, busqueda]);

  const seleccionarEnvio = async (envio: Envio) => {
    setEnvioSeleccionado(envio);
    if (!envio.historial || envio.historial.length === 0) {
      try {
        setCargandoDetalle(true);
        const res = await api.get(`/envios/${envio.id}`);
        if (res.data.success) {
          setEnvioSeleccionado(res.data.data);
          setEnvios(prev => prev.map(e => e.id === envio.id ? res.data.data : e));
        }
      } catch {
        toast.error("Error al cargar detalles del envío.");
      } finally {
        setCargandoDetalle(false);
      }
    }
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};
    if (!formData.venta_id) nuevosErrores.venta_id = "El ID de venta es obligatorio.";
    if (!formData.direccion_destino.trim()) nuevosErrores.direccion_destino = "La dirección es obligatoria.";
    if (formData.tipo_envio === "interregional" && !formData.agencia_transporte_id)
      nuevosErrores.agencia_transporte_id = "Seleccione una agencia para envío interregional.";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmitEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const payload = {
      ...formData,
      venta_id: Number(formData.venta_id),
      costo_envio: Number(formData.costo_envio) || 0,
      agencia_transporte_id: formData.agencia_transporte_id ? Number(formData.agencia_transporte_id) : null,
      numero_seguimiento: formData.numero_seguimiento || null,
      repartidor_nombre: formData.repartidor_nombre || null,
      fecha_estimada_llegada: formData.fecha_estimada_llegada || null,
    };

    try {
      setGuardando(true);
      const response = envioAEditar
        ? await api.put(`/envios/${envioAEditar}`, payload)
        : await api.post("/envios", payload);

      if (response.data.success) {
        toast.success(response.data.message || "Envío guardado.");
        cerrarModalEnvio();
        await fetchDatos();
        if (envioAEditar && envioSeleccionado?.id === envioAEditar) {
          seleccionarEnvio({ ...envioSeleccionado, ...payload, id: envioAEditar } as Envio);
        }
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const nuevosErrores: Record<string, string> = {};
        Object.entries(error.response.data.errors as Record<string, string[]>).forEach(([key, msgs]) => {
          nuevosErrores[key] = msgs[0];
        });
        setErrores(nuevosErrores);
      } else {
        toast.error("Error al procesar el envío.");
      }
    } finally {
      setGuardando(false);
    }
  };

  const avanzarEstadoRapido = async (envio: Envio) => {
    const idx = ESTADOS_FLUJO.indexOf(envio.estado_actual);
    if (idx === -1 || idx === ESTADOS_FLUJO.length - 1) return;
    
    const nuevoEstado = ESTADOS_FLUJO[idx + 1];
    const descAuto = ESTADO_CONFIG[envio.estado_actual].autoDesc;

    try {
      const toastId = toast.loading("Actualizando envío...");
      await api.put(`/envios/${envio.id}/estado`, {
        estado_actual: nuevoEstado,
        ubicacion: envio.tipo_envio === "local" ? "Ruta Local" : "Logística",
        descripcion: descAuto,
      });
      toast.success(`Marcado como ${ESTADO_CONFIG[nuevoEstado].label}`, { id: toastId });
      
      await fetchDatos(); 
      if (envioSeleccionado?.id === envio.id) {
         const res = await api.get(`/envios/${envio.id}`);
         if (res.data.success) setEnvioSeleccionado(res.data.data);
      }
    } catch {
      toast.error("Hubo un error al actualizar el estado.");
    }
  };

  const abrirModalCrearEnvio = () => { setEnvioAEditar(null); setFormData(FORM_ENVIO_VACÍO); setErrores({}); setIsModalOpen(true); };
  const abrirModalEditarEnvio = (envio: Envio) => {
    setEnvioAEditar(envio.id);
    setFormData({
      venta_id: String(envio.venta_id),
      agencia_transporte_id: envio.agencia?.id ? String(envio.agencia.id) : "",
      tipo_envio: envio.tipo_envio,
      numero_seguimiento: envio.numero_seguimiento ?? "",
      repartidor_nombre: envio.repartidor_nombre ?? "",
      direccion_destino: envio.direccion_destino,
      costo_envio: envio.costo_envio,
      fecha_estimada_llegada: envio.fecha_estimada_llegada ?? "",
      estado_actual: envio.estado_actual,
    });
    setErrores({});
    setIsModalOpen(true);
  };
  const cerrarModalEnvio = () => { setIsModalOpen(false); setEnvioAEditar(null); setFormData(FORM_ENVIO_VACÍO); setErrores({}); };
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errores[field]) setErrores(prev => ({ ...prev, [field]: "" }));
  };

  const abrirModalCrearAgencia = () => { setAgenciaAEditar(null); setFormAgencia({ nombre: "", ruc_dni: "", telefono: "" }); setIsAgenciaModalOpen(true); };
  const abrirModalEditarAgencia = (agencia: Agencia) => { setAgenciaAEditar(agencia.id); setFormAgencia({ nombre: agencia.nombre, ruc_dni: agencia.ruc_dni || "", telefono: agencia.telefono || "" }); setIsAgenciaModalOpen(true); };
  const cerrarModalAgencia = () => { setIsAgenciaModalOpen(false); setAgenciaAEditar(null); setFormAgencia({ nombre: "", ruc_dni: "", telefono: "" }); };
  const handleSubmitAgencia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAgencia.nombre.trim()) return toast.error("El nombre es obligatorio.");
    try {
      setGuardandoAgencia(true);
      const res = agenciaAEditar ? await api.put(`/agencias-transporte/${agenciaAEditar}`, formAgencia) : await api.post("/agencias-transporte", formAgencia);
      if (res.data.success) { toast.success("Agencia guardada."); cerrarModalAgencia(); fetchDatos(); }
    } catch { toast.error("Error al guardar la agencia."); } finally { setGuardandoAgencia(false); }
  };

  const enviosFiltrados = envios
    .filter(e => filtroEstado === "todos" || e.estado_actual === filtroEstado)
    .filter(e => {
      const t = busqueda.toLowerCase();
      return e.cliente_nombre.toLowerCase().includes(t) || (e.numero_seguimiento ?? "").toLowerCase().includes(t) || e.direccion_destino.toLowerCase().includes(t);
    });

  const totalPaginas = Math.max(1, Math.ceil(enviosFiltrados.length / POR_PAGINA));
  const paginaAjustada = Math.min(pagina, totalPaginas);
  const enviosPaginados = enviosFiltrados.slice((paginaAjustada - 1) * POR_PAGINA, paginaAjustada * POR_PAGINA);

  const stats = {
    total: envios.length,
    preparando: envios.filter(e => e.estado_actual === "preparando").length,
    en_agencia: envios.filter(e => e.estado_actual === "en_agencia").length,
    en_transito: envios.filter(e => e.estado_actual === "en_transito").length,
    entregado: envios.filter(e => e.estado_actual === "entregado").length,
  };

  return {
    envios, agencias, cargando, stats, filtroEstado, setFiltroEstado, busqueda, setBusqueda, pagina, setPagina,
    totalPaginas, paginaAjustada, enviosPaginados, enviosFiltrados,
    envioSeleccionado, setEnvioSeleccionado, seleccionarEnvio, cargandoDetalle,
    isModalOpen, guardando, envioAEditar, formData, errores, handleSubmitEnvio, abrirModalCrearEnvio, abrirModalEditarEnvio, cerrarModalEnvio, handleChange,
    isAgenciaModalOpen, agenciaAEditar, formAgencia, setFormAgencia, guardandoAgencia, abrirModalCrearAgencia, abrirModalEditarAgencia, cerrarModalAgencia, handleSubmitAgencia,
    avanzarEstadoRapido, fetchDatos,
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
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border shadow-sm ${cfg.cls}`}>
      {cfg.icon}{cfg.label}
    </span>
  );
};

// ─── Componente Principal (Vista) ─────────────────────────────────────────────
export const EnviosView: React.FC = () => {
  const env = useEnvios();

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5 pb-12 h-full">
        
        {/* ==========================================
            ENCABEZADO FULL-WIDTH (Arriba)
            ========================================== */}
        <div className="space-y-4">
          {/* ── Banner Principal ── */}
          <div className="relative bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 rounded-3xl p-6 text-white overflow-hidden shadow-md shadow-amber-900/10">
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20">
                    <Truck className="w-6 h-6 text-amber-100" />
                  </div>
                  <h1 className="text-2xl font-black tracking-tight">Logística y Envíos</h1>
                </div>
                <p className="text-amber-100/90 text-[13px] font-medium ml-1">Controla el flujo logístico de tus ventas.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={env.abrirModalCrearAgencia} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all border border-white/20">
                  <Building2 className="w-4 h-4" /> Agencias
                </button>
                <button onClick={env.abrirModalCrearEnvio} className="flex items-center gap-2 bg-white text-amber-900 hover:bg-amber-50 font-black text-sm px-5 py-2.5 rounded-xl transition-all shadow-md">
                  <Plus className="w-4 h-4" /> Nuevo Envío
                </button>
              </div>
            </div>
          </div>

          {/* ── Filtros y Buscador ── */}
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3">
            <div className="flex overflow-x-auto custom-scrollbar p-1.5 bg-white rounded-2xl border border-stone-200 w-full xl:w-auto shadow-sm">
              <button onClick={() => env.setFiltroEstado("todos")} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${env.filtroEstado === "todos" ? "bg-amber-50 text-amber-800 shadow-sm border border-amber-100/50" : "text-stone-500 hover:bg-stone-50 border border-transparent"}`}>
                Todos <span className={`px-1.5 py-0.5 rounded-md ${env.filtroEstado === "todos" ? "bg-amber-200/50" : "bg-stone-100"}`}>{env.stats.total}</span>
              </button>
              {Object.entries(ESTADO_CONFIG).map(([key, config]) => (
                <button key={key} onClick={() => env.setFiltroEstado(key)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${env.filtroEstado === key ? "bg-amber-50 text-amber-800 shadow-sm border border-amber-100/50" : "text-stone-500 hover:bg-stone-50 border border-transparent"}`}>
                  {config.label}
                  <span className={`px-1.5 py-0.5 rounded-md ${env.filtroEstado === key ? "bg-amber-200/50" : "bg-stone-100"}`}>{env.stats[key as keyof typeof env.stats]}</span>
                </button>
              ))}
            </div>

            <div className="relative w-full xl:w-80 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input type="text" placeholder="Buscar..." value={env.busqueda} onChange={e => env.setBusqueda(e.target.value)} className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-200 rounded-2xl text-sm font-medium outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 shadow-sm transition-all" />
            </div>
          </div>
        </div>

        {/* ==========================================
            GRILLA 50/50: TABLA (Izquierda) y DETALLE (Derecha)
            ========================================== */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
          
          {/* PANEL IZQUIERDO: Tabla (8 items máximo) */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm flex flex-col h-full">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50/70">
                    <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest text-stone-400">Detalle</th>
                    <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest text-stone-400">Logística</th>
                    <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest text-stone-400">Estado</th>
                    <th className="px-3 py-4 w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {env.cargando ? (
                    <tr><td colSpan={4} className="p-8 text-center text-stone-400">Cargando...</td></tr>
                  ) : env.enviosPaginados.length === 0 ? (
                    <tr><td colSpan={4} className="p-12 text-center text-stone-400"><AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" /> Sin resultados.</td></tr>
                  ) : (
                    env.enviosPaginados.map((envio: Envio) => (
                      <tr 
                        key={envio.id} 
                        onClick={() => env.seleccionarEnvio(envio)}
                        className={`cursor-pointer transition-colors group ${env.envioSeleccionado?.id === envio.id ? 'bg-amber-50/40' : 'hover:bg-stone-50'}`}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-1 h-10 rounded-full transition-colors ${env.envioSeleccionado?.id === envio.id ? 'bg-amber-500' : 'bg-transparent'}`} />
                            <div className="min-w-0">
                              <p className="font-extrabold text-stone-800 text-[13px] truncate">{envio.cliente_nombre}</p>
                              <p className="text-[11px] font-medium text-stone-500 mt-0.5 truncate">{envio.direccion_destino}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 min-w-0">
                          <p className="text-[12px] font-bold text-stone-700 truncate max-w-[100px]">
                            {envio.agencia?.nombre ?? envio.repartidor_nombre ?? "Sin asignar"}
                          </p>
                          <p className="text-[9px] text-stone-400 uppercase font-black tracking-wider mt-0.5">{envio.tipo_envio}</p>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <EstadoBadge estado={envio.estado_actual} />
                        </td>
                        <td className="px-3 py-4 text-right">
                          <ChevronRight className={`w-4 h-4 transition-transform ${env.envioSeleccionado?.id === envio.id ? 'text-amber-600 translate-x-1' : 'text-stone-300 group-hover:text-stone-500'}`} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Paginación de la Tabla */}
            {env.totalPaginas > 1 && (
               <div className="px-5 py-3 border-t border-stone-100 bg-stone-50/50 flex justify-center gap-2 shrink-0">
                  <button onClick={() => env.setPagina(p => Math.max(1, p - 1))} disabled={env.paginaAjustada === 1} className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-100 disabled:opacity-40 shadow-sm"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="flex items-center text-xs font-bold text-stone-500 px-3">{env.paginaAjustada} de {env.totalPaginas}</span>
                  <button onClick={() => env.setPagina(p => Math.min(env.totalPaginas, p + 1))} disabled={env.paginaAjustada === env.totalPaginas} className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-100 disabled:opacity-40 shadow-sm"><ChevronRight className="w-4 h-4" /></button>
               </div>
            )}
          </div>

          {/* PANEL DERECHO: Tarjeta de Inspección (Detalles) */}
          <div className="w-full sticky top-4 flex flex-col h-[calc(100vh-210px)]">
            {!env.envioSeleccionado ? (
              <div className="flex-1 bg-stone-50/50 border-2 border-stone-200/60 border-dashed rounded-[2rem] flex flex-col items-center justify-center text-stone-400 p-8 text-center shadow-sm">
                <div className="w-16 h-16 bg-white rounded-2xl border border-stone-100 shadow-sm flex items-center justify-center mb-4">
                  <Package className="w-8 h-8 text-stone-300" />
                </div>
                <p className="font-black text-stone-600 text-sm">Ningún envío seleccionado</p>
                <p className="text-[13px] mt-1.5 font-medium max-w-[250px]">Haz clic en un registro de la tabla para ver su tarjeta de inspección.</p>
              </div>
            ) : (
              <div className="flex-1 bg-stone-50/40 border border-stone-200 rounded-[2rem] shadow-lg flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                
                {/* Header Detalle (Color Sólido) */}
                <div className="px-6 py-6 bg-white border-b border-stone-100 relative shrink-0">
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-black text-stone-900 leading-none">Envío #{env.envioSeleccionado.id}</h2>
                        <span className="px-2 py-0.5 bg-stone-100 text-stone-500 rounded-md text-[10px] font-black uppercase tracking-widest">{env.envioSeleccionado.tipo_envio}</span>
                      </div>
                      {env.envioSeleccionado.numero_seguimiento ? (
                        <p className="text-[11px] font-bold text-stone-500 mt-2">
                          TRACKING: <span className="font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">{env.envioSeleccionado.numero_seguimiento}</span>
                        </p>
                      ) : (
                        <p className="text-[11px] font-medium text-stone-400 mt-2">Sin número de tracking</p>
                      )}
                    </div>
                    <EstadoBadge estado={env.envioSeleccionado.estado_actual} />
                  </div>
                </div>

                {/* Contenido scrolleable (Tarjetas internas) */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
                  
                  {/* Info Jerárquica: Destino */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200/60">
                    <h3 className="text-[11px] font-black text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-amber-600" /> Destinatario
                    </h3>
                    <p className="text-base font-black text-stone-800 leading-tight">{env.envioSeleccionado.cliente_nombre}</p>
                    <div className="flex items-start gap-1.5 mt-2 text-stone-500">
                      <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-stone-400" />
                      <p className="text-[13px] font-medium leading-snug">{env.envioSeleccionado.direccion_destino}</p>
                    </div>
                  </div>

                  {/* Info Jerárquica: Logística */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200/60">
                    <h3 className="text-[11px] font-black text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Truck className="w-3.5 h-3.5 text-amber-600" /> Logística Operativa
                    </h3>
                    <div className="flex justify-between items-center bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                      <div>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-0.5">Responsable</p>
                        <p className="text-[13px] font-black text-stone-800">
                          {env.envioSeleccionado.agencia?.nombre ?? env.envioSeleccionado.repartidor_nombre ?? "Por asignar"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-0.5">Costo</p>
                        <p className="text-[13px] font-black text-amber-700">S/ {Number(env.envioSeleccionado.costo_envio).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Info Jerárquica: Timeline */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200/60">
                    <h3 className="text-[11px] font-black text-stone-400 uppercase tracking-widest mb-5 flex items-center justify-between">
                      <span className="flex items-center gap-2"><History className="w-3.5 h-3.5 text-amber-600" /> Línea de tiempo</span>
                      {env.cargandoDetalle && <span className="w-3 h-3 border-2 border-stone-300 border-t-amber-500 rounded-full animate-spin"></span>}
                    </h3>
                    
                    {!env.cargandoDetalle && (!env.envioSeleccionado.historial || env.envioSeleccionado.historial.length === 0) ? (
                      <div className="text-center py-4 text-stone-400">
                        <Clock className="w-6 h-6 mx-auto mb-2 opacity-30" />
                        <p className="text-[12px] font-medium">Historial vacío.</p>
                      </div>
                    ) : (
                      <div className="relative pl-2">
                        {/* Línea conectora */}
                        <div className="absolute top-2 bottom-2 left-[13px] w-0.5 bg-stone-100 rounded-full" />
                        
                        <div className="space-y-6">
                          {[...(env.envioSeleccionado.historial || [])].reverse().map((h, i) => {
                            const cfg = ESTADO_CONFIG[h.estado] ?? ESTADO_CONFIG.preparando;
                            const esUltimo = i === 0;
                            return (
                              <div key={h.id} className="relative z-10 flex gap-4 items-start">
                                <div className={`w-3 h-3 rounded-full shrink-0 mt-1 flex items-center justify-center ${esUltimo ? 'bg-amber-500 ring-4 ring-amber-100' : 'bg-stone-300'}`} />
                                <div className="flex-1 pt-0.5">
                                  <p className={`text-[13px] font-black ${esUltimo ? 'text-stone-900' : 'text-stone-600'}`}>{cfg.label}</p>
                                  <p className="text-[10px] font-bold text-stone-400 mt-0.5">
                                    {new Date(h.fecha).toLocaleString("es-PE", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                                  </p>
                                  {h.descripcion && (
                                    <div className="mt-2.5 bg-stone-50 px-3 py-2.5 rounded-xl border border-stone-100 text-[11px] font-medium text-stone-500 leading-relaxed relative">
                                      <div className="absolute -top-1.5 left-3 w-3 h-3 bg-stone-50 border-t border-l border-stone-100 rotate-45"></div>
                                      <span className="relative z-10">{h.descripcion}</span>
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

                </div>

                {/* Acciones del panel (Sticky Footer) */}
                <div className="shrink-0 p-5 border-t border-stone-100 bg-white shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.05)]">
                  {env.envioSeleccionado.estado_actual !== "entregado" && (
                    <button
                      onClick={() => env.avanzarEstadoRapido(env.envioSeleccionado!)}
                      className="w-full mb-2.5 flex items-center justify-center gap-2 bg-stone-900 hover:bg-amber-700 text-white py-3.5 rounded-xl text-sm font-black transition-all shadow-md active:scale-[0.98] group"
                    >
                      <span>{ESTADO_CONFIG[env.envioSeleccionado.estado_actual].nextLabel}</span>
                      <Play className="w-3.5 h-3.5 fill-current group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                  <button
                    onClick={() => env.abrirModalEditarEnvio(env.envioSeleccionado!)}
                    className="w-full flex items-center justify-center gap-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-600 py-3 rounded-xl text-[13px] font-bold transition-all shadow-sm"
                  >
                    <Edit className="w-3.5 h-3.5" /> Modificar Datos
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          MODAL: CREAR/EDITAR ENVÍO
      ═══════════════════════════════════════════════════════════ */}
      {env.isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={env.cerrarModalEnvio} />
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
              <h2 className="text-xl font-black text-stone-900">{env.envioAEditar ? "Editar Envío" : "Registrar Nuevo Envío"}</h2>
              <button onClick={env.cerrarModalEnvio} className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-100"><X className="w-4 h-4" /></button>
            </div>
            <form id="formEnvio" onSubmit={env.handleSubmitEnvio} className="flex-1 overflow-y-auto px-6 py-6 space-y-5 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label req>ID de la Venta</Label>
                  <input type="number" min={1} value={env.formData.venta_id} onChange={e => env.handleChange("venta_id", e.target.value)} className={`${inputCls} ${env.errores.venta_id ? inputErrCls : ""}`} placeholder="Ej: 1045" />
                  {env.errores.venta_id && <p className="text-red-500 text-[11px] mt-1 font-medium">{env.errores.venta_id}</p>}
                </div>
                <div>
                  <Label req>Tipo de Envío</Label>
                  <select value={env.formData.tipo_envio} onChange={e => env.handleChange("tipo_envio", e.target.value)} className={inputCls}>
                    <option value="local">Entrega Local (Mototaxi)</option>
                    <option value="interregional">Envío Interregional (Agencia)</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Label req>Dirección de Entrega</Label>
                  <input type="text" value={env.formData.direccion_destino} onChange={e => env.handleChange("direccion_destino", e.target.value)} className={`${inputCls} ${env.errores.direccion_destino ? inputErrCls : ""}`} placeholder="Ej. Av. Los Pinos 123" />
                  {env.errores.direccion_destino && <p className="text-red-500 text-[11px] mt-1 font-medium">{env.errores.direccion_destino}</p>}
                </div>
                
                {env.formData.tipo_envio === "interregional" ? (
                  <div className="sm:col-span-2 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                    <Label req>Agencia de Transporte</Label>
                    <select value={env.formData.agencia_transporte_id} onChange={e => env.handleChange("agencia_transporte_id", e.target.value)} className={`${inputCls} ${env.errores.agencia_transporte_id ? inputErrCls : ""}`}>
                      <option value="">— Seleccionar agencia —</option>
                      {env.agencias.map((a: Agencia) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                    </select>
                  </div>
                ) : (
                  <div className="sm:col-span-2 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                    <Label>Nombre del Repartidor Local</Label>
                    <input type="text" value={env.formData.repartidor_nombre} onChange={e => env.handleChange("repartidor_nombre", e.target.value)} className={inputCls} placeholder="Ej. Juan Pérez" />
                  </div>
                )}

                <div><Label>N° de Seguimiento / Ticket</Label><input type="text" value={env.formData.numero_seguimiento} onChange={e => env.handleChange("numero_seguimiento", e.target.value)} className={inputCls} /></div>
                <div><Label>Costo Operativo (S/)</Label><input type="number" step="0.01" value={env.formData.costo_envio} onChange={e => env.handleChange("costo_envio", e.target.value)} className={inputCls} placeholder="0.00" /></div>
              </div>
            </form>
            <div className="px-6 py-5 border-t border-stone-100 bg-stone-50/50 flex gap-3">
              <button type="button" onClick={env.cerrarModalEnvio} className="flex-1 py-3 rounded-xl bg-white border border-stone-200 text-stone-600 font-bold hover:bg-stone-100 transition-colors">Cancelar</button>
              <button form="formEnvio" type="submit" disabled={env.guardando} className="flex-[2] py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-black shadow-lg shadow-amber-700/20 disabled:opacity-70 transition-all">
                {env.guardando ? "Procesando..." : env.envioAEditar ? "Guardar Cambios" : "Crear Envío"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          MODAL: AGENCIAS DE TRANSPORTE
      ═══════════════════════════════════════════════════════════ */}
      {env.isAgenciaModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={env.cerrarModalAgencia} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-stone-900">
                  {env.agenciaAEditar ? "Editar Agencia" : "Nueva Agencia"}
                </h3>
                <p className="text-[11px] text-stone-400 font-medium mt-0.5">Gestión de proveedores de transporte.</p>
              </div>
              <button onClick={env.cerrarModalAgencia} className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form id="formAgencia" onSubmit={env.handleSubmitAgencia} className="px-6 py-6 space-y-4">
              <div>
                <Label req>Nombre de la empresa/agencia</Label>
                <input
                  required
                  type="text"
                  placeholder="Ej: MovilBus, GH Bus..."
                  value={env.formAgencia.nombre}
                  onChange={e => env.setFormAgencia({ ...env.formAgencia, nombre: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>RUC / DNI</Label>
                  <input
                    type="text"
                    placeholder="20123456789"
                    value={env.formAgencia.ruc_dni}
                    onChange={e => env.setFormAgencia({ ...env.formAgencia, ruc_dni: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <input
                    type="text"
                    placeholder="900 000 000"
                    value={env.formAgencia.telefono}
                    onChange={e => env.setFormAgencia({ ...env.formAgencia, telefono: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </div>
            </form>
            <div className="flex gap-3 px-6 py-5 border-t border-stone-100 bg-stone-50/50">
              <button type="button" onClick={env.cerrarModalAgencia} className="flex-1 py-3 rounded-xl bg-white border border-stone-200 font-bold text-sm text-stone-600 hover:bg-stone-100 transition-colors">
                Cancelar
              </button>
              <button form="formAgencia" type="submit" disabled={env.guardandoAgencia} className="flex-1 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-black text-sm shadow-md disabled:opacity-60 transition-colors">
                {env.guardandoAgencia ? "Guardando..." : "Guardar Registro"}
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};