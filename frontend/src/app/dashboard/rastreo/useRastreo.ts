import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export interface EnvioRastreo {
  id: number;
  sale_id: number;
  numero_seguimiento: string | null;
  direccion_destino: string;
  estado_actual: string;
  estado: boolean;
  tipo_envio: string;
  carrier?: { id: number; nombre: string };
}

export const ESTADOS_ENVIO = [
  "Preparando",
  "En Tránsito",
  "En Agencia Destino",
  "En Reparto",
  "Entregado"
];

export const useRastreo = () => {
  const [envios, setEnvios] = useState<EnvioRastreo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  // NUEVO: Filtro por estado de progreso
  const [filtroProgreso, setFiltroProgreso] = useState<string>("Todos"); 
  
  const [envioSeleccionado, setEnvioSeleccionado] = useState<EnvioRastreo | null>(null);
  const [actualizandoId, setActualizandoId] = useState<number | null>(null);

  const fetchEnvios = async () => {
    try {
      setCargando(true);
      const response = await fetch("/api/shipments", { headers: { Accept: "application/json" } });
      if (response.ok) {
        const json = await response.json();
        const data = json.data || json;
        // Solo traemos los activos.
        setEnvios(data.filter((e: EnvioRastreo) => e.estado));
        
        if (envioSeleccionado) {
          const actualizado = data.find((e: EnvioRastreo) => e.id === envioSeleccionado.id);
          if (actualizado) setEnvioSeleccionado(actualizado);
        }
      }
    } catch (error) {
      toast.error("Error al cargar los envíos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchEnvios();
  }, []);

  // --- FILTRO DE BÚSQUEDA Y ESTADO ---
  const enviosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase();
    return envios.filter(e => {
      // 1. Filtro por texto
      const coincideBusqueda = 
        (e.numero_seguimiento && e.numero_seguimiento.toLowerCase().includes(texto)) ||
        e.sale_id.toString().includes(texto) ||
        e.direccion_destino.toLowerCase().includes(texto);
      
      // 2. Filtro por estado (Todos o uno específico)
      const coincideProgreso = filtroProgreso === "Todos" || e.estado_actual === filtroProgreso;

      return coincideBusqueda && coincideProgreso;
    });
  }, [envios, busqueda, filtroProgreso]);

  const actualizarEstado = async (id: number, nuevoEstado: string) => {
    setActualizandoId(id);
    try {
      const envioOriginal = envios.find(e => e.id === id);
      if (!envioOriginal) return;

      const payload = { ...envioOriginal, estado_actual: nuevoEstado };

      const response = await fetch(`/api/shipments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(`Estado actualizado a: ${nuevoEstado}`);
        await fetchEnvios();
      } else {
        toast.error("No se pudo actualizar el estado.");
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor.");
    } finally {
      setActualizandoId(null);
    }
  };

  return {
    enviosFiltrados,
    cargando,
    busqueda,
    setBusqueda,
    filtroProgreso,
    setFiltroProgreso,
    envioSeleccionado,
    setEnvioSeleccionado,
    actualizarEstado,
    actualizandoId,
    refrescar: fetchEnvios
  };
};