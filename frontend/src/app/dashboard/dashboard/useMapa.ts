import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export interface ClienteMapa {
  id: number;
  nombre: string;
  direccion: string | null;
  distrito: string | null;
  provincia: string | null;
  departamento: string | null;
  latitud: number | null;
  longitud: number | null;
}

export interface GrupoRegion {
  departamento: string;
  cantidad: number;
  latitud: number;
  longitud: number;
  detalles: ClienteMapa[];
}

export type ModoVista = "agrupado" | "individual";

export const useMapa = () => {
  const [modoVista, setModoVista] = useState<ModoVista>("agrupado");
  const [clientes, setClientes] = useState<ClienteMapa[]>([]);
  const [cargando, setCargando] = useState(true);
  
  // Control del mapa
  const [centro, setCentro] = useState<[number, number] | null>(null);
  const [zoom, setZoom] = useState<number | null>(null);
  
  // Filtros - Individual
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const POR_PAGINA = 8;

  // Filtros - Agrupado
  const [paginaRegiones, setPaginaRegiones] = useState(1);
  const REGIONES_POR_PAGINA = 6;

  // Modal
  const [modalInfo, setModalData] = useState<{
    titulo: string;
    data: ClienteMapa[];
  } | null>(null);

  // Carga principal desde el endpoint estándar de clientes
  const fetchDatos = async () => {
    setCargando(true);
    try {
      // Usamos el endpoint estándar del CustomerController
      const response = await fetch("/api/customers", { headers: { Accept: "application/json" } });
      if (response.ok) {
        const json = await response.json();
        const data = json.data || json;
        
        const clientesMapeados = data.map((c: any) => ({
          id: c.id,
          nombre: `${c.nombre} ${c.apellido || ""}`.trim(),
          direccion: c.direccion,
          distrito: c.distrito,
          provincia: c.provincia,
          departamento: c.departamento,
          latitud: c.latitud,
          longitud: c.longitud,
        }));
        setClientes(clientesMapeados);
      }
    } catch (err) {
      toast.error("Error al cargar la ubicación de los clientes");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  const centrarEnMapa = (lat: number, lon: number, zoomLevel = 14) => {
    setCentro([lat, lon]);
    setZoom(zoomLevel);
  };

  // --- LÓGICA DE PAGINACIÓN: INDIVIDUAL ---
  const clientesFiltrados = useMemo(() => {
    return clientes
      .filter((c) => c.nombre.toLowerCase().includes(busqueda.toLowerCase()))
      .sort((a, b) => {
        const aValido = a.latitud !== null && a.longitud !== null ? 1 : 0;
        const bValido = b.latitud !== null && b.longitud !== null ? 1 : 0;
        
        if (aValido !== bValido) {
          return bValido - aValido; 
        }
        
        return a.nombre.localeCompare(b.nombre);
      });
  }, [clientes, busqueda]);

  const totalPaginas = Math.ceil(clientesFiltrados.length / POR_PAGINA) || 1;
  const paginaAjustada = Math.min(pagina, totalPaginas);
  
  const clientesPaginados = useMemo(() => {
    return clientesFiltrados.slice((paginaAjustada - 1) * POR_PAGINA, paginaAjustada * POR_PAGINA);
  }, [clientesFiltrados, paginaAjustada]);

  // --- LÓGICA DE AGRUPACIÓN (Hecha en el Frontend para evitar requerir nuevos endpoints) ---
  const gruposRegiones = useMemo(() => {
    const grupos: Record<string, GrupoRegion> = {};
    
    clientes.forEach(c => {
      if (c.latitud && c.longitud && c.departamento) {
        const dep = c.departamento.toUpperCase();
        if (!grupos[dep]) {
          grupos[dep] = {
            departamento: dep,
            cantidad: 0,
            latitud: c.latitud, // Usamos la latitud del primer cliente como centro de la región
            longitud: c.longitud,
            detalles: []
          };
        }
        grupos[dep].cantidad += 1;
        grupos[dep].detalles.push(c);
      }
    });
    
    return Object.values(grupos).sort((a, b) => b.cantidad - a.cantidad);
  }, [clientes]);

  const totalPaginasRegiones = Math.ceil(gruposRegiones.length / REGIONES_POR_PAGINA) || 1;
  const paginaRegionesAjustada = Math.min(paginaRegiones, totalPaginasRegiones);
  
  const regionesPaginadas = useMemo(() => {
    return gruposRegiones.slice((paginaRegionesAjustada - 1) * REGIONES_POR_PAGINA, paginaRegionesAjustada * REGIONES_POR_PAGINA);
  }, [gruposRegiones, paginaRegionesAjustada]);

  // Resetear paginación al buscar
  useEffect(() => { setPagina(1); }, [busqueda]);

  return {
    modoVista, setModoVista, clientes, gruposRegiones, cargando,
    centro, setCentro, zoom, setZoom, busqueda, setBusqueda,
    pagina, setPagina, totalPaginas, paginaAjustada, clientesPaginados,
    paginaRegiones, setPaginaRegiones, totalPaginasRegiones, paginaRegionesAjustada, regionesPaginadas,
    modalInfo, setModalData, centrarEnMapa
  };
};