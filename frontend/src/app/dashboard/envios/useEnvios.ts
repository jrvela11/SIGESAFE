import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import api from "../../../lib/api";

// ─── Tipos ────────────────────────────────────────────────────────────────────

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

const POR_PAGINA = 10;

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useEnvios = () => {
  // ── Datos principales ──────────────────────────────────────────────────────
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [agencias, setAgencias] = useState<Agencia[]>([]);
  const [cargando, setCargando] = useState(true);

  // ── Filtros ────────────────────────────────────────────────────────────────
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);

  // ── Modal: crear/editar envío ──────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [envioAEditar, setEnvioAEditar] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormEnvio>(FORM_ENVIO_VACÍO);
  const [errores, setErrores] = useState<Record<string, string>>({});

  // ── Modal: cambio de estado ────────────────────────────────────────────────
  const [isEstadoModalOpen, setIsEstadoModalOpen] = useState(false);
  const [envioEstado, setEnvioEstado] = useState<Envio | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState<string>("");
  const [ubicacionSeguimiento, setUbicacionSeguimiento] = useState("");
  const [descripcionSeguimiento, setDescripcionSeguimiento] = useState("");
  const [guardandoEstado, setGuardandoEstado] = useState(false);

  // ── Modal: agencias ────────────────────────────────────────────────────────
  const [isAgenciaModalOpen, setIsAgenciaModalOpen] = useState(false);
  const [agenciaAEditar, setAgenciaAEditar] = useState<number | null>(null);
  const [formAgencia, setFormAgencia] = useState<FormAgencia>({ nombre: "", ruc_dni: "", telefono: "" });
  const [guardandoAgencia, setGuardandoAgencia] = useState(false);

  // ── Modal: historial ───────────────────────────────────────────────────────
  const [isHistorialOpen, setIsHistorialOpen] = useState(false);
  const [envioHistorial, setEnvioHistorial] = useState<Envio | null>(null);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);

  // ─── Fetch datos ──────────────────────────────────────────────────────────
  const fetchDatos = useCallback(async () => {
    try {
      setCargando(true);
      const [resEnvios, resAgencias] = await Promise.all([
        api.get("/envios"),
        api.get("/agencias-transporte"),
      ]);
      if (resEnvios.data.success) setEnvios(resEnvios.data.data);
      if (resAgencias.data.success)
        setAgencias(resAgencias.data.data.filter((a: Agencia) => a.estado));
    } catch {
      toast.error("Error al cargar los datos.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    fetchDatos();
  }, [fetchDatos]);

  // Resetear paginación al filtrar
  useEffect(() => {
    setPagina(1);
  }, [filtroEstado, busqueda]);

  // ─── Validaciones ──────────────────────────────────────────────────────────
  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};
    if (!formData.venta_id) nuevosErrores.venta_id = "El ID de venta es obligatorio.";
    if (!formData.direccion_destino.trim()) nuevosErrores.direccion_destino = "La dirección es obligatoria.";
    if (formData.tipo_envio === "interregional" && !formData.agencia_transporte_id)
      nuevosErrores.agencia_transporte_id = "Seleccione una agencia para envío interregional.";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // ─── CRUD Envíos ──────────────────────────────────────────────────────────
  const handleSubmitEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    // Preparar payload limpio
    const payload: Record<string, unknown> = {
      ...formData,
      venta_id: Number(formData.venta_id),
      costo_envio: Number(formData.costo_envio) || 0,
      agencia_transporte_id: formData.agencia_transporte_id
        ? Number(formData.agencia_transporte_id)
        : null,
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
        toast.success(response.data.message || "Envío guardado correctamente.");
        cerrarModalEnvio();
        fetchDatos();
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { errors?: Record<string, string[]> } } };
      if (err.response?.data?.errors) {
        const backendErrors = err.response.data.errors;
        const nuevosErrores: Record<string, string> = {};
        Object.entries(backendErrors).forEach(([key, msgs]) => {
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

  const abrirModalCrearEnvio = () => {
    setEnvioAEditar(null);
    setFormData(FORM_ENVIO_VACÍO);
    setErrores({});
    setIsModalOpen(true);
  };

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

  const cerrarModalEnvio = () => {
    setIsModalOpen(false);
    setEnvioAEditar(null);
    setFormData(FORM_ENVIO_VACÍO);
    setErrores({});
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errores[field]) setErrores(prev => ({ ...prev, [field]: "" }));
  };

  // ─── Cambio de estado ─────────────────────────────────────────────────────
  const abrirModalEstado = (envio: Envio) => {
    setEnvioEstado(envio);
    setNuevoEstado(envio.estado_actual);
    setUbicacionSeguimiento("");
    setDescripcionSeguimiento("");
    setIsEstadoModalOpen(true);
  };

  const cerrarModalEstado = () => {
    setIsEstadoModalOpen(false);
    setEnvioEstado(null);
  };

  const handleCambiarEstado = async () => {
    if (!envioEstado || !nuevoEstado) return;
    try {
      setGuardandoEstado(true);
      await api.put(`/envios/${envioEstado.id}/estado`, {
        estado_actual: nuevoEstado,
        ubicacion: ubicacionSeguimiento || null,
        descripcion: descripcionSeguimiento || null,
      });
      toast.success("Estado actualizado correctamente.");
      cerrarModalEstado();
      fetchDatos();
    } catch {
      toast.error("Error al cambiar el estado.");
    } finally {
      setGuardandoEstado(false);
    }
  };

  // ─── Agencias ─────────────────────────────────────────────────────────────
  const abrirModalCrearAgencia = () => {
    setAgenciaAEditar(null);
    setFormAgencia({ nombre: "", ruc_dni: "", telefono: "" });
    setIsAgenciaModalOpen(true);
  };

  const abrirModalEditarAgencia = (agencia: Agencia) => {
    setAgenciaAEditar(agencia.id);
    setFormAgencia({
      nombre: agencia.nombre,
      ruc_dni: agencia.ruc_dni ?? "",
      telefono: agencia.telefono ?? "",
    });
    setIsAgenciaModalOpen(true);
  };

  const cerrarModalAgencia = () => {
    setIsAgenciaModalOpen(false);
    setAgenciaAEditar(null);
    setFormAgencia({ nombre: "", ruc_dni: "", telefono: "" });
  };

  const handleSubmitAgencia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAgencia.nombre.trim()) {
      toast.error("El nombre de la agencia es obligatorio.");
      return;
    }
    try {
      setGuardandoAgencia(true);
      const response = agenciaAEditar
        ? await api.put(`/agencias-transporte/${agenciaAEditar}`, formAgencia)
        : await api.post("/agencias-transporte", formAgencia);
      if (response.data.success) {
        toast.success(response.data.message || "Agencia guardada.");
        cerrarModalAgencia();
        fetchDatos();
      }
    } catch {
      toast.error("Error al guardar la agencia.");
    } finally {
      setGuardandoAgencia(false);
    }
  };

  // ─── Historial ────────────────────────────────────────────────────────────
  const abrirHistorial = async (envio: Envio) => {
    // Si ya tiene historial cargado, mostrarlo directamente
    if (envio.historial && envio.historial.length >= 0) {
      setEnvioHistorial(envio);
      setIsHistorialOpen(true);
      return;
    }
    // Si no, hacer fetch del envío individual con historial
    try {
      setCargandoHistorial(true);
      setIsHistorialOpen(true);
      const res = await api.get(`/envios/${envio.id}`);
      if (res.data.success) setEnvioHistorial(res.data.data);
    } catch {
      toast.error("Error al cargar el historial.");
    } finally {
      setCargandoHistorial(false);
    }
  };

  const cerrarHistorial = () => {
    setIsHistorialOpen(false);
    setEnvioHistorial(null);
  };

  // ─── Filtros y paginación ─────────────────────────────────────────────────
  const enviosFiltrados = envios
    .filter(e => filtroEstado === "todos" || e.estado_actual === filtroEstado)
    .filter(e => {
      const t = busqueda.toLowerCase();
      return (
        e.cliente_nombre.toLowerCase().includes(t) ||
        (e.numero_seguimiento ?? "").toLowerCase().includes(t) ||
        e.direccion_destino.toLowerCase().includes(t)
      );
    });

  const totalPaginas = Math.max(1, Math.ceil(enviosFiltrados.length / POR_PAGINA));
  const paginaAjustada = Math.min(pagina, totalPaginas);
  const enviosPaginados = enviosFiltrados.slice(
    (paginaAjustada - 1) * POR_PAGINA,
    paginaAjustada * POR_PAGINA
  );

  // ─── Estadísticas rápidas ─────────────────────────────────────────────────
  const stats = {
    total: envios.length,
    preparando: envios.filter(e => e.estado_actual === "preparando").length,
    en_agencia: envios.filter(e => e.estado_actual === "en_agencia").length,
    en_transito: envios.filter(e => e.estado_actual === "en_transito").length,
    entregado: envios.filter(e => e.estado_actual === "entregado").length,
  };

  return {
    // Datos
    envios,
    agencias,
    cargando,
    stats,

    // Filtros / paginación
    filtroEstado,
    setFiltroEstado,
    busqueda,
    setBusqueda,
    pagina,
    setPagina,
    totalPaginas,
    paginaAjustada,
    enviosPaginados,
    enviosFiltrados,

    // Modal envío
    isModalOpen,
    guardando,
    envioAEditar,
    formData,
    errores,
    handleSubmitEnvio,
    abrirModalCrearEnvio,
    abrirModalEditarEnvio,
    cerrarModalEnvio,
    handleChange,

    // Modal estado
    isEstadoModalOpen,
    envioEstado,
    nuevoEstado,
    setNuevoEstado,
    ubicacionSeguimiento,
    setUbicacionSeguimiento,
    descripcionSeguimiento,
    setDescripcionSeguimiento,
    guardandoEstado,
    abrirModalEstado,
    cerrarModalEstado,
    handleCambiarEstado,

    // Modal agencias
    isAgenciaModalOpen,
    agenciaAEditar,
    formAgencia,
    setFormAgencia,
    guardandoAgencia,
    abrirModalCrearAgencia,
    abrirModalEditarAgencia,
    cerrarModalAgencia,
    handleSubmitAgencia,

    // Modal historial
    isHistorialOpen,
    envioHistorial,
    cargandoHistorial,
    abrirHistorial,
    cerrarHistorial,

    // Utilitarios
    fetchDatos,
  };
};
