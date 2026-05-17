import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import api from "../../../lib/api";
import type { Envio, HistorialItem } from "../envios/useEnvios";

// ─── Tipos extendidos ─────────────────────────────────────────────────────────

export interface SeguimientoEnriquecido extends HistorialItem {
  envio_id: number;
  cliente_nombre: string;
  direccion_destino: string;
  tipo_envio: "local" | "interregional";
  numero_seguimiento: string | null;
  estado_actual_envio: string;
}

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

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useSeguimientos = () => {
  // ── Datos ──────────────────────────────────────────────────────────────────
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [cargando, setCargando] = useState(true);

  // ── Filtros ────────────────────────────────────────────────────────────────
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [filtroEnvioId, setFiltroEnvioId] = useState<string>("todos");
  const [pagina, setPagina] = useState(1);
  const POR_PAGINA = 15;

  // ── Modal: agregar seguimiento ─────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [envioSeleccionado, setEnvioSeleccionado] = useState<Envio | null>(null);
  const [formData, setFormData] = useState<FormSeguimiento>(FORM_VACÍO);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});

  // ── Panel de detalle ───────────────────────────────────────────────────────
  const [envioDetalle, setEnvioDetalle] = useState<Envio | null>(null);
  const [isDetalleOpen, setIsDetalleOpen] = useState(false);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  // ─── Fetch ────────────────────────────────────────────────────────────────
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

  useEffect(() => {
    fetchEnvios();
  }, [fetchEnvios]);

  // Resetear página al filtrar
  useEffect(() => {
    setPagina(1);
  }, [filtroEstado, busqueda, filtroEnvioId]);

  // ─── Aplanar historial de todos los envíos ────────────────────────────────
  const todosLosSeguimientos = useMemo<SeguimientoEnriquecido[]>(() => {
    const items: SeguimientoEnriquecido[] = [];
    envios.forEach(envio => {
      (envio.historial ?? []).forEach(h => {
        items.push({
          ...h,
          envio_id: envio.id,
          cliente_nombre: envio.cliente_nombre,
          direccion_destino: envio.direccion_destino,
          tipo_envio: envio.tipo_envio,
          numero_seguimiento: envio.numero_seguimiento,
          estado_actual_envio: envio.estado_actual,
        });
      });
    });
    // Más reciente primero
    return items.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [envios]);

  // ─── Filtros sobre seguimientos ───────────────────────────────────────────
  const seguimientosFiltrados = useMemo(() => {
    return todosLosSeguimientos.filter(s => {
      const matchEstado = filtroEstado === "todos" || s.estado === filtroEstado;
      const matchEnvio  = filtroEnvioId === "todos" || String(s.envio_id) === filtroEnvioId;
      const t = busqueda.toLowerCase();
      const matchBusqueda =
        s.cliente_nombre.toLowerCase().includes(t) ||
        s.direccion_destino.toLowerCase().includes(t) ||
        (s.ubicacion ?? "").toLowerCase().includes(t) ||
        (s.descripcion ?? "").toLowerCase().includes(t) ||
        (s.numero_seguimiento ?? "").toLowerCase().includes(t);
      return matchEstado && matchEnvio && matchBusqueda;
    });
  }, [todosLosSeguimientos, filtroEstado, filtroEnvioId, busqueda]);

  const totalPaginas = Math.max(1, Math.ceil(seguimientosFiltrados.length / POR_PAGINA));
  const paginaAjustada = Math.min(pagina, totalPaginas);
  const seguimientosPaginados = seguimientosFiltrados.slice(
    (paginaAjustada - 1) * POR_PAGINA,
    paginaAjustada * POR_PAGINA
  );

  // ─── Estadísticas ─────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total: todosLosSeguimientos.length,
    hoy: todosLosSeguimientos.filter(s => {
      const hoy = new Date().toDateString();
      return new Date(s.fecha).toDateString() === hoy;
    }).length,
    preparando:  todosLosSeguimientos.filter(s => s.estado === "preparando").length,
    en_agencia:  todosLosSeguimientos.filter(s => s.estado === "en_agencia").length,
    en_transito: todosLosSeguimientos.filter(s => s.estado === "en_transito").length,
    entregado:   todosLosSeguimientos.filter(s => s.estado === "entregado").length,
  }), [todosLosSeguimientos]);

  // ─── Modal: agregar seguimiento ───────────────────────────────────────────
  const abrirModalAgregar = (envio?: Envio) => {
    setFormData(FORM_VACÍO);
    setErrores({});
    setEnvioSeleccionado(envio ?? null);
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setEnvioSeleccionado(null);
    setFormData(FORM_VACÍO);
    setErrores({});
  };

  const handleChange = (field: keyof FormSeguimiento, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errores[field]) setErrores(prev => ({ ...prev, [field]: "" }));
  };

  const validar = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.estado.trim()) e.estado = "Selecciona un estado.";
    if (!envioSeleccionado && filtroEnvioId === "todos") e.envio = "Selecciona un envío.";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;

    // Resolver el envío objetivo
    const idEnvio = envioSeleccionado?.id ?? Number(filtroEnvioId);
    if (!idEnvio) {
      toast.error("Selecciona un envío antes de guardar.");
      return;
    }

    try {
      setGuardando(true);
      const res = await api.post(`/envios/${idEnvio}/seguimiento`, {
        estado: formData.estado,
        ubicacion: formData.ubicacion || null,
        descripcion: formData.descripcion || null,
      });
      if (res.data.success) {
        toast.success("Seguimiento registrado correctamente.");
        cerrarModal();
        fetchEnvios();
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { errors?: Record<string, string[]> } } };
      if (error.response?.data?.errors) {
        const be = error.response.data.errors;
        const e: Record<string, string> = {};
        Object.entries(be).forEach(([k, v]) => { e[k] = v[0]; });
        setErrores(e);
      } else {
        toast.error("Error al registrar el seguimiento.");
      }
    } finally {
      setGuardando(false);
    }
  };

  // ─── Detalle de envío ─────────────────────────────────────────────────────
  const abrirDetalle = async (envio: Envio) => {
    setEnvioDetalle(envio);
    setIsDetalleOpen(true);
    // Si necesitamos historial fresco, lo pedimos
    try {
      setCargandoDetalle(true);
      const res = await api.get(`/envios/${envio.id}`);
      if (res.data.success) setEnvioDetalle(res.data.data);
    } catch {
      // Silencioso: ya tenemos datos básicos
    } finally {
      setCargandoDetalle(false);
    }
  };

  const cerrarDetalle = () => {
    setIsDetalleOpen(false);
    setEnvioDetalle(null);
  };

  // ─── Lista de envíos únicos para el selector ──────────────────────────────
  const enviosDisponibles = useMemo(
    () => envios.filter(e => e.estado_actual !== "entregado"),
    [envios]
  );

  return {
    // Datos
    envios,
    cargando,
    todosLosSeguimientos,
    seguimientosFiltrados,
    seguimientosPaginados,
    stats,
    enviosDisponibles,

    // Filtros / paginación
    filtroEstado,
    setFiltroEstado,
    filtroEnvioId,
    setFiltroEnvioId,
    busqueda,
    setBusqueda,
    pagina,
    setPagina,
    totalPaginas,
    paginaAjustada,

    // Modal agregar seguimiento
    isModalOpen,
    envioSeleccionado,
    setEnvioSeleccionado,
    formData,
    errores,
    guardando,
    abrirModalAgregar,
    cerrarModal,
    handleChange,
    handleSubmit,

    // Detalle
    isDetalleOpen,
    envioDetalle,
    cargandoDetalle,
    abrirDetalle,
    cerrarDetalle,

    // Utilidades
    fetchEnvios,
  };
};
