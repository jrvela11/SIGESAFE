import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export interface VentaHistorial {
  id: number;
  comprobante: string;
  customer_id: number | null;
  cliente: string;
  vendedor: string;
  totales: {
    subtotal: number;
    igv: number;
    total: number;
  };
  metodo_pago: string;
  estado_pago: "pagado" | "pendiente" | "anulado";
  fecha: string;
}

export const useVentas = () => {
  const [ventas, setVentas] = useState<VentaHistorial[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"todos" | "pagado" | "pendiente" | "anulado">("todos");
  
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  const fetchVentas = async () => {
    try {
      setCargando(true);

      // Descargamos ventas, clientes y usuarios en paralelo para cruzar la información
      const [resSales, resCustomers, resUsers] = await Promise.all([
        fetch("/api/sales", { headers: { Accept: "application/json" } }),
        fetch("/api/customers", { headers: { Accept: "application/json" } }),
        fetch("/api/users", { headers: { Accept: "application/json" } })
      ]);

      if (resSales.ok && resCustomers.ok && resUsers.ok) {
        const jsonSales = await resSales.json();
        const jsonCustomers = await resCustomers.json();
        const jsonUsers = await resUsers.json();

        // Creamos diccionarios de búsqueda rápida indexados por ID
        const clientesMap = new Map(jsonCustomers.data.map((c: any) => [c.id, `${c.nombre} ${c.apellido || ''}`.trim()]));
        const usuariosMap = new Map(jsonUsers.data.map((u: any) => [u.id, u.name]));

        const formateadas: VentaHistorial[] = jsonSales.data.map((s: any) => {
          const estadoLimpio = s.estado_pago.toLowerCase();
          return {
            id: s.id,
            comprobante: `${s.tipo_comprobante} ${s.serie}-${s.correlativo}`,
            customer_id: s.customer_id,
            // Cruzamos el ID con el mapa de nombres reales obtenidos del frontend
            cliente: clientesMap.get(s.customer_id) || "Público en General",
            vendedor: usuariosMap.get(s.user_id) || `Usuario #${s.user_id}`,
            totales: {
              subtotal: Number(s.subtotal),
              igv: Number(s.igv),
              total: Number(s.total),
            },
            metodo_pago: s.metodo_pago,
            estado_pago: estadoLimpio === "pagado" || estadoLimpio === "pendiente" || estadoLimpio === "anulado" ? estadoLimpio : "pendiente",
            fecha: new Date(s.fecha_venta).toLocaleDateString("es-PE", { 
              year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
            }),
          };
        });
        
        setVentas(formateadas);
      }
    } catch (error) {
      toast.error("Error al sincronizar el historial de ventas.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroEstado]);

  // --- ACCIÓN: REGISTRAR PAGO PARA PENDIENTES ---
  const handleRegistrarPago = async (id: number) => {
    try {
      // Ahora solo enviamos el campo que queremos actualizar
      const payload = { estado_pago: "pagado" };

      const response = await fetch(`/api/sales/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success("Cobro registrado correctamente.");
        await fetchVentas(); // Recargamos la tabla
      } else {
        toast.error("No se pudo registrar el pago en el servidor.");
      }
    } catch (error) {
      toast.error("Error de conexión al procesar el cobro.");
    }
  };

  // Filtrado memoizado
  const ventasFiltradas = useMemo(() => {
    return ventas.filter((v) => {
      const texto = busqueda.toLowerCase();
      const coincideBusqueda = 
        v.comprobante.toLowerCase().includes(texto) ||
        v.cliente.toLowerCase().includes(texto);
      
      const coincideEstado = filtroEstado === "todos" || v.estado_pago === filtroEstado;

      return coincideBusqueda && coincideEstado;
    });
  }, [ventas, busqueda, filtroEstado]);

  const totalPaginas = Math.ceil(ventasFiltradas.length / itemsPorPagina) || 1;
  const paginaAjustada = Math.min(paginaActual, totalPaginas);
  
  const indiceUltimoItem = paginaAjustada * itemsPorPagina;
  const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
  const ventasPaginadas = ventasFiltradas.slice(indicePrimerItem, indiceUltimoItem);

  const kpis = useMemo(() => {
    const ventasExitosas = ventasFiltradas.filter(venta => venta.estado_pago === 'pagado');
    return {
      totalIngresos: ventasExitosas.reduce((acc, venta) => acc + venta.totales.total, 0),
      cantidadExitosas: ventasExitosas.length
    };
  }, [ventasFiltradas]);

  return {
    ventasPaginadas,
    ventasTotales: ventasFiltradas,
    cargando,
    busqueda,
    setBusqueda,
    filtroEstado,
    setFiltroEstado,
    fetchVentas,
    paginaActual,
    setPaginaActual,
    totalPaginas,
    kpis,
    handleRegistrarPago
  };
};