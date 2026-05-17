import { useState, useEffect } from "react";
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

  const ventasFiltradas = ventas.filter((v) => {
    const coincideBusqueda = 
      v.comprobante.toLowerCase().includes(busqueda.toLowerCase()) ||
      v.cliente.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideEstado = filtroEstado === "todos" || v.estado_pago === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  return {
    ventas: ventasFiltradas,
    cargando,
    busqueda,
    setBusqueda,
    filtroEstado,
    setFiltroEstado,
    fetchVentas
  };
};