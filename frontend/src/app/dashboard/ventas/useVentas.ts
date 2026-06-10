import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import api from "../../../lib/api";

export interface VentaHistorial {
  id: number;
  comprobante: string;
  cliente: string;
  vendedor: string;
  totales: {
    subtotal: number;
    igv: number;
    total: number;
  };
  metodo_pago: string;
  estado_pago: string;
  fecha: string;
}

export const useVentas = () => {
  const [ventas, setVentas] = useState<VentaHistorial[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"todos" | "pagado" | "anulado">("todos");
  
  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  const fetchVentas = async () => {
    try {
      setCargando(true);
      const res = await api.get("/ventas");
      if (res.data.success) {
        setVentas(res.data.data);
      }
    } catch (error) {
      toast.error("Error al cargar el historial de ventas.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  // Resetear la página a 1 cuando los filtros cambien
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroEstado]);

  // Filtrado memoizado
  const ventasFiltradas = useMemo(() => {
    return ventas.filter((v) => {
      const coincideBusqueda = 
        v.comprobante.toLowerCase().includes(busqueda.toLowerCase()) ||
        v.cliente.toLowerCase().includes(busqueda.toLowerCase());
      
      const coincideEstado = filtroEstado === "todos" || v.estado_pago === filtroEstado;

      return coincideBusqueda && coincideEstado;
    });
  }, [ventas, busqueda, filtroEstado]);

  // Lógica de Paginación
  const indiceUltimoItem = paginaActual * itemsPorPagina;
  const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
  const ventasPaginadas = ventasFiltradas.slice(indicePrimerItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(ventasFiltradas.length / itemsPorPagina);

  return {
    ventas: ventasPaginadas, // Retornamos solo las ventas de la página actual
    ventasTotales: ventasFiltradas, // Útil para cálculos de KPIs globales
    cargando,
    busqueda,
    setBusqueda,
    filtroEstado,
    setFiltroEstado,
    fetchVentas,
    paginaActual,
    setPaginaActual,
    totalPaginas,
  };
};