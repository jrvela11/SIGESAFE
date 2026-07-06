import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export interface Envio {
  id: number;
  sale_id: number;
  carrier_id: number;
  tipo_envio: "bus" | "shalom" | "olva";
  numero_seguimiento: string | null;
  repartidor_nombre: string | null;
  direccion_destino: string;
  costo_envio: number;
  fecha_estimada_llegada: string | null;
  estado_actual: string;
  tracking_metadata: any | null;
  estado: boolean;
  // Relación opcional si el backend la devuelve
  carrier?: { id: number; nombre: string }; 
}

export const useEnvios = () => {
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [transportistas, setTransportistas] = useState<{id: number, nombre: string}[]>([]); // Para el select
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<"activos" | "inactivos">("activos");
  const [busqueda, setBusqueda] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [envioAEditar, setEnvioAEditar] = useState<Envio | null>(null);

  const [formData, setFormData] = useState({
    sale_id: "",
    carrier_id: "",
    tipo_envio: "bus",
    numero_seguimiento: "",
    repartidor_nombre: "",
    direccion_destino: "",
    costo_envio: "",
    fecha_estimada_llegada: "",
    estado_actual: "Preparando",
    estado: true,
  });

  const [errores, setErrores] = useState<Record<string, string>>({});
  
  const POR_PAGINA = 10;
  const [pagina, setPagina] = useState(1);

  // --- CARGAR DATOS ---
  const fetchDatos = async () => {
    try {
      setCargando(true);
      // Cargar envíos
      const resEnvios = await fetch("/api/shipments", { headers: { Accept: "application/json" } });
      // Cargar transportistas (para el select del formulario)
      const resCarriers = await fetch("/api/carriers", { headers: { Accept: "application/json" } });
      
      if (resEnvios.ok) {
        const json = await resEnvios.json();
        setEnvios(json.data || json);
      }
      if (resCarriers.ok) {
        const jsonC = await resCarriers.json();
        setTransportistas(jsonC.data || jsonC);
      }
    } catch (error) {
      toast.error("Error al cargar los envíos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  // --- MANEJO DEL MODAL ---
  const abrirModalCrear = () => {
    setEnvioAEditar(null);
    setFormData({
      sale_id: "", carrier_id: "", tipo_envio: "bus", numero_seguimiento: "",
      repartidor_nombre: "", direccion_destino: "", costo_envio: "", 
      fecha_estimada_llegada: "", estado_actual: "Preparando", estado: true,
    });
    setErrores({});
    setIsModalOpen(true);
  };

  const abrirModalEditar = (envio: Envio) => {
    setEnvioAEditar(envio);
    setFormData({
      sale_id: envio.sale_id.toString(),
      carrier_id: envio.carrier_id.toString(),
      tipo_envio: envio.tipo_envio,
      numero_seguimiento: envio.numero_seguimiento || "",
      repartidor_nombre: envio.repartidor_nombre || "",
      direccion_destino: envio.direccion_destino || "",
      costo_envio: envio.costo_envio.toString(),
      fecha_estimada_llegada: envio.fecha_estimada_llegada || "",
      estado_actual: envio.estado_actual || "Preparando",
      estado: envio.estado,
    });
    setErrores({});
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setEnvioAEditar(null);
    setErrores({});
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrores(prev => ({ ...prev, [field]: "" }));
  };

  // --- GUARDAR O ACTUALIZAR ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setErrores({});

    const url = envioAEditar ? `/api/shipments/${envioAEditar.id}` : "/api/shipments";
    const method = envioAEditar ? "PUT" : "POST";

    // Convertir datos al formato esperado por el backend
    const payload = {
      ...formData,
      sale_id: parseInt(formData.sale_id),
      carrier_id: parseInt(formData.carrier_id),
      costo_envio: parseFloat(formData.costo_envio) || 0,
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 422) {
          const data = await response.json();
          const validacionErrores: Record<string, string> = {};
          if (data.errors) {
            Object.keys(data.errors).forEach((key) => {
              validacionErrores[key] = data.errors[key][0];
            });
          }
          setErrores(validacionErrores);
          toast.error("Por favor, revisa los campos marcados en rojo.");
          return;
        }
        throw new Error("Error en el servidor");
      }

      toast.success(envioAEditar ? "Envío actualizado correctamente" : "Envío registrado y en preparación");
      await fetchDatos();
      cerrarModal();
    } catch (error) {
      toast.error("Hubo un problema de conexión al guardar el envío.");
    } finally {
      setGuardando(false);
    }
  };

  // --- ESTADOS LÓGICOS ---
  const cambiarEstado = async (envio: Envio, nuevoEstado: boolean) => {
    try {
      const payload = { ...envio, estado: nuevoEstado };
      const response = await fetch(`/api/shipments/${envio.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(nuevoEstado ? "Envío reactivado" : "Envío anulado/suspendido");
        await fetchDatos();
      } else {
        toast.error("No se pudo cambiar el estado del envío.");
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor.");
    }
  };

  const handleDesactivar = (id: number, track: string | null) => {
    if (window.confirm(`¿Estás seguro de anular el envío con seguimiento "${track || 'Sin código'}"?`)) {
      const envio = envios.find((p) => p.id === id);
      if (envio) cambiarEstado(envio, false);
    }
  };

  const handleReactivar = (id: number) => {
    const envio = envios.find((p) => p.id === id);
    if (envio) cambiarEstado(envio, true);
  };

  // --- FILTROS Y PAGINACIÓN ---
  const enviosFiltrados = useMemo(() => {
    return envios.filter((e) => {
      const coincideEstado = filtroEstado === "activos" ? e.estado : !e.estado;
      const texto = busqueda.toLowerCase();
      const coincideBusqueda =
        (e.numero_seguimiento && e.numero_seguimiento.toLowerCase().includes(texto)) ||
        e.direccion_destino.toLowerCase().includes(texto) ||
        e.estado_actual.toLowerCase().includes(texto);
      return coincideEstado && coincideBusqueda;
    });
  }, [envios, busqueda, filtroEstado]);

  const totalEnvios = envios.length;
  const enviosEnTransito = envios.filter(e => e.estado && e.estado_actual !== 'Entregado').length;
  const costoTotal = envios.filter(e => e.estado).reduce((acc, curr) => acc + Number(curr.costo_envio), 0);

  const totalPaginas = Math.ceil(enviosFiltrados.length / POR_PAGINA) || 1;
  const paginaAjustada = Math.min(pagina, totalPaginas);

  const enviosPaginados = useMemo(() => {
    const inicio = (paginaAjustada - 1) * POR_PAGINA;
    return enviosFiltrados.slice(inicio, inicio + POR_PAGINA);
  }, [enviosFiltrados, paginaAjustada]);

  useEffect(() => {
    if (pagina !== paginaAjustada) setPagina(paginaAjustada);
  }, [paginaAjustada, pagina]);

  return {
    enviosPaginados, enviosFiltrados, cargando, filtroEstado, setFiltroEstado, transportistas,
    busqueda, setBusqueda, isModalOpen, guardando, envioAEditar, formData,
    handleChange, handleSubmit, handleDesactivar, handleReactivar, abrirModalCrear, abrirModalEditar, cerrarModal,
    errores, totalEnvios, enviosEnTransito, costoTotal,
    pagina, setPagina, totalPaginas, paginaAjustada,
  };
};