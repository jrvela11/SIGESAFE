import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export interface CompraHistorial {
  id: number;
  comprobante: string;
  proveedor_id: number;
  proveedor: string;
  totales: {
    subtotal: number;
    igv: number;
    total: number;
  };
  fecha: string;
  estado: boolean;
}

export const useCompras = () => {
  const [compras, setCompras] = useState<CompraHistorial[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"todas" | "activas" | "anuladas">("todas");
  
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 6; // Ajustado a 6 para mantener el scroll estático

  const fetchCompras = async () => {
    try {
      setCargando(true);
      const [resPurchases, resSuppliers] = await Promise.all([
        fetch("/api/purchases", { headers: { Accept: "application/json" } }),
        fetch("/api/suppliers", { headers: { Accept: "application/json" } })
      ]);

      if (resPurchases.ok && resSuppliers.ok) {
        const jsonPurchases = await resPurchases.json();
        const jsonSuppliers = await resSuppliers.json();

        // Diccionario de proveedores para cruce rápido
        const proveedoresMap = new Map(jsonSuppliers.data.map((p: any) => [p.id, p.razon_social]));

        const formateadas: CompraHistorial[] = jsonPurchases.data.map((c: any) => ({
          id: c.id,
          comprobante: `${c.tipo_comprobante} ${c.serie ? c.serie + '-' : ''}${c.numero}`,
          proveedor_id: c.supplier_id,
          proveedor: c.supplier?.razon_social || proveedoresMap.get(c.supplier_id) || `Proveedor #${c.supplier_id}`,
          totales: {
            subtotal: Number(c.subtotal),
            igv: Number(c.igv),
            total: Number(c.total),
          },
          fecha: new Date(c.fecha_emision).toLocaleDateString("es-PE", { 
            year: 'numeric', month: 'short', day: 'numeric' 
          }),
          estado: c.estado,
        }));
        
        setCompras(formateadas);
      }
    } catch (error) {
      toast.error("Error al cargar el historial de compras.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchCompras();
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroEstado]);

  const handleAnularCompra = async (id: number) => {
    if (window.confirm("¿Está seguro de anular esta compra? Esto revertirá la transacción.")) {
      try {
        // Hacemos un PUT enviando el estado en false
        const payload = { estado: false };

        const response = await fetch(`/api/purchases/${id}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            Accept: "application/json" 
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          toast.success("Compra anulada y movida al historial de anuladas.");
          await fetchCompras();
        } else {
          toast.error("No se pudo anular la compra en el servidor.");
        }
      } catch (error) {
        toast.error("Error de conexión al anular la compra.");
      }
    }
  };

  const comprasFiltradas = useMemo(() => {
    return compras.filter((c) => {
      const texto = busqueda.toLowerCase();
      const coincideBusqueda = 
        c.comprobante.toLowerCase().includes(texto) ||
        c.proveedor.toLowerCase().includes(texto);
      
      const coincideEstado = 
        filtroEstado === "todas" ? true :
        filtroEstado === "activas" ? c.estado : !c.estado;

      return coincideBusqueda && coincideEstado;
    });
  }, [compras, busqueda, filtroEstado]);

  const totalPaginas = Math.ceil(comprasFiltradas.length / itemsPorPagina) || 1;
  const paginaAjustada = Math.min(paginaActual, totalPaginas);
  
  const indiceUltimoItem = paginaAjustada * itemsPorPagina;
  const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
  const comprasPaginadas = comprasFiltradas.slice(indicePrimerItem, indiceUltimoItem);

  const kpis = useMemo(() => {
    const comprasActivas = comprasFiltradas.filter(c => c.estado);
    return {
      totalInvertido: comprasActivas.reduce((acc, c) => acc + c.totales.total, 0),
      cantidadOrdenes: comprasActivas.length
    };
  }, [comprasFiltradas]);

  return {
    comprasPaginadas,
    comprasTotales: comprasFiltradas,
    cargando,
    busqueda,
    setBusqueda,
    filtroEstado,
    setFiltroEstado,
    paginaActual,
    setPaginaActual,
    totalPaginas,
    kpis,
    handleAnularCompra
  };
};