import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import type { Producto } from "../productos/useProductos";

export interface MovimientoKardex {
  id: number;
  product_id: number;
  producto: string;
  tipo: "entrada" | "salida";
  cantidad: number;
  descripcion: string;
  fecha: string;
  saldoAcumulado?: number; 
}

export const useKardex = () => {
  const [movimientos, setMovimientos] = useState<MovimientoKardex[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  
  const [productoSeleccionado, setProductoSeleccionado] = useState<string>("");
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setCargando(true);
        const [resMovs, resProds] = await Promise.all([
          fetch("/api/kardex", { headers: { Accept: "application/json" } }),
          fetch("/api/products", { headers: { Accept: "application/json" } })
        ]);

        if (resMovs.ok && resProds.ok) {
          const jsonMovs = await resMovs.json();
          const jsonProds = await resProds.json();
          // Agregamos el fallback || [] por si la data viene vacía
          setMovimientos(jsonMovs.data || []);
          setProductos(jsonProds.data || []);
        } else {
          toast.error("Error en la respuesta del servidor.");
        }
      } catch (error) {
        toast.error("Error de red al cargar el Kardex.");
      } finally {
        setCargando(false);
      }
    };
    fetchData();
  }, []);

  // Filtrar movimientos por producto y calcular el Saldo Acumulado (Running Balance)
  const kardexCalculado = useMemo(() => {
    if (!productoSeleccionado) return [];

    let saldo = 0;
    const movimientosFiltrados = movimientos
      // PROTECCIÓN: Verificamos que product_id exista antes de convertir a String
      .filter(m => m.product_id && String(m.product_id) === productoSeleccionado)
      .map(m => {
        if (m.tipo === "entrada") saldo += m.cantidad;
        if (m.tipo === "salida") saldo -= m.cantidad;
        return { ...m, saldoAcumulado: saldo };
      });

    // Invertimos el array para que el movimiento más reciente (y el saldo actual) salga arriba en la tabla
    return movimientosFiltrados.reverse();
  }, [movimientos, productoSeleccionado]);

  // KPIs
  const kpis = useMemo(() => {
    if (!productoSeleccionado) return { entradas: 0, salidas: 0, stock: 0 };
    let ent = 0, sal = 0;
    
    kardexCalculado.forEach(m => {
      if (m.tipo === "entrada") ent += m.cantidad;
      if (m.tipo === "salida") sal += m.cantidad;
    });

    return { entradas: ent, salidas: sal, stock: ent - sal };
  }, [kardexCalculado, productoSeleccionado]);

  // Paginación
  const totalPaginas = Math.ceil(kardexCalculado.length / itemsPorPagina) || 1;
  const paginaAjustada = Math.min(paginaActual, totalPaginas);
  const kardexPaginado = kardexCalculado.slice(
    (paginaAjustada - 1) * itemsPorPagina, 
    paginaAjustada * itemsPorPagina
  );

  useEffect(() => {
    setPaginaActual(1);
  }, [productoSeleccionado]);

  return {
    cargando,
    productos,
    productoSeleccionado,
    setProductoSeleccionado,
    kardexPaginado,
    kardexTotales: kardexCalculado,
    paginaActual,
    setPaginaActual,
    totalPaginas,
    kpis
  };
};