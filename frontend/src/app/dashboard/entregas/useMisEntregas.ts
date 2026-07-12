import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export interface EnvioMotorizado {
  id: number;
  sale_id: number;
  numero_seguimiento: string | null;
  direccion_destino: string;
  estado_actual: string;
  estado: boolean;
}

export const useMisEntregas = () => {
  const [entregas, setEntregas] = useState<EnvioMotorizado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [procesandoId, setProcesandoId] = useState<number | null>(null);
  
  // Estado para controlar el modal de confirmación bonito
  const [envioAConfirmar, setEnvioAConfirmar] = useState<EnvioMotorizado | null>(null);

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("Todos");

  const getToken = () => localStorage.getItem("token");

  // --- CARGAR DATOS ---
  const fetchMisEntregas = async () => {
    try {
      setCargando(true);
      const response = await fetch("/api/shipments", { 
        headers: { 
          Accept: "application/json",
          Authorization: `Bearer ${getToken()}`
        } 
      });
      
      if (response.ok) {
        const json = await response.json();
        const data = json.data || json;
        
        // Filtramos: Activos, NO entregados, NO anulados, y NO "Preparando"
        const pendientes = data.filter((e: EnvioMotorizado) => 
          e.estado && 
          e.estado_actual !== 'Entregado' &&
          e.estado_actual !== 'Anulado' &&
          e.estado_actual !== 'Preparando' 
        );
        
        setEntregas(pendientes);
      }
    } catch (error) {
      toast.error("Error al cargar tus rutas de hoy.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchMisEntregas();
  }, []);

  // --- LÓGICA DE BÚSQUEDA Y ORDENAMIENTO ---
  const entregasFiltradas = useMemo(() => {
    const textoBusqueda = busqueda.toLowerCase().trim();

    const filtradas = entregas.filter((envio) => {
      const direccion = (envio.direccion_destino || "").toLowerCase();
      const track = (envio.numero_seguimiento || "").toLowerCase();
      const ventaId = envio.sale_id.toString();

      const coincideBusqueda = 
        direccion.includes(textoBusqueda) || track.includes(textoBusqueda) || ventaId.includes(textoBusqueda);
      const coincideEstado = filtroEstado === "Todos" || envio.estado_actual === filtroEstado;

      return coincideBusqueda && coincideEstado;
    });

    const prioridadEstado: Record<string, number> = {
      "En Reparto": 1,
      "En Agencia Destino": 2,
      "En Tránsito": 3,
      "Preparando": 4,
    };

    filtradas.sort((a, b) => (prioridadEstado[a.estado_actual] || 99) - (prioridadEstado[b.estado_actual] || 99));

    return filtradas;
  }, [entregas, busqueda, filtroEstado]);

  const estadosDisponibles = useMemo(() => {
    const estados = entregas.map(e => e.estado_actual);
    return ["Todos", ...Array.from(new Set(estados))];
  }, [entregas]);

  // --- ACCIONES DEL MODAL ---
  const iniciarConfirmacion = (envio: EnvioMotorizado) => {
    setEnvioAConfirmar(envio);
  };

  const cancelarConfirmacion = () => {
    setEnvioAConfirmar(null);
  };

  const confirmarEntrega = async () => {
    if (!envioAConfirmar) return;

    const envio = envioAConfirmar;
    setProcesandoId(envio.id);
    
    try {
      const payload = { ...envio, estado_actual: "Entregado" };
      
      const response = await fetch(`/api/shipments/${envio.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          Accept: "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("¡Entrega registrada con éxito!");
        setEntregas(prev => prev.filter(e => e.id !== envio.id));
      } else {
        toast.error("No se pudo registrar la entrega.");
      }
    } catch (error) {
      toast.error("Error de conexión. Revisa tus datos móviles.");
    } finally {
      setProcesandoId(null);
      setEnvioAConfirmar(null); // Cerramos el modal al terminar
    }
  };

  return {
    entregasTotales: entregas,
    entregasFiltradas,
    estadosDisponibles,
    busqueda,
    setBusqueda,
    filtroEstado,
    setFiltroEstado,
    cargando,
    procesandoId,
    envioAConfirmar,
    iniciarConfirmacion,
    cancelarConfirmacion,
    confirmarEntrega,
    refrescar: fetchMisEntregas
  };
};