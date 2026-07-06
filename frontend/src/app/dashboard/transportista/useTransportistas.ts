import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export interface Transportista {
  id: number;
  nombre: string;
  ruc_dni: string | null;
  telefono: string | null;
  estado: boolean;
}

export const useTransportistas = () => {
  const [transportistas, setTransportistas] = useState<Transportista[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<"activos" | "inactivos">("activos");
  const [busqueda, setBusqueda] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [transportistaAEditar, setTransportistaAEditar] = useState<Transportista | null>(null);

  const [formData, setFormData] = useState({
    nombre: "",
    ruc_dni: "",
    telefono: "",
    estado: true,
  });

  const [errores, setErrores] = useState<Record<string, string>>({});
  
  const POR_PAGINA = 10;
  const [pagina, setPagina] = useState(1);

  // --- CARGAR DATOS ---
  const fetchTransportistas = async () => {
    try {
      setCargando(true);
      const response = await fetch("/api/carriers", { headers: { Accept: "application/json" } });
      if (response.ok) {
        const json = await response.json();
        setTransportistas(json.data || json);
      }
    } catch (error) {
      toast.error("Error al cargar los transportistas.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchTransportistas();
  }, []);

  // --- MANEJO DEL MODAL ---
  const abrirModalCrear = () => {
    setTransportistaAEditar(null);
    setFormData({
      nombre: "", ruc_dni: "", telefono: "", estado: true,
    });
    setErrores({});
    setIsModalOpen(true);
  };

  const abrirModalEditar = (transportista: Transportista) => {
    setTransportistaAEditar(transportista);
    setFormData({
      nombre: transportista.nombre || "",
      ruc_dni: transportista.ruc_dni || "",
      telefono: transportista.telefono || "",
      estado: transportista.estado,
    });
    setErrores({});
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setTransportistaAEditar(null);
    setErrores({});
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrores(prev => ({ ...prev, [field]: "" }));
  };

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const soloNumeros = e.target.value.replace(/\D/g, "");
    if (soloNumeros.length <= 15) setFormData({ ...formData, telefono: soloNumeros });
    setErrores(prev => ({ ...prev, telefono: "" }));
  };

  const handleDocumentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const soloNumeros = e.target.value.replace(/\D/g, "");
    if (soloNumeros.length <= 20) setFormData({ ...formData, ruc_dni: soloNumeros });
    setErrores(prev => ({ ...prev, ruc_dni: "" }));
  };

  // --- GUARDAR O ACTUALIZAR ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setErrores({});

    const url = transportistaAEditar ? `/api/carriers/${transportistaAEditar.id}` : "/api/carriers";
    const method = transportistaAEditar ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData),
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

      toast.success(transportistaAEditar ? "Transportista actualizado correctamente" : "Transportista registrado correctamente");
      await fetchTransportistas();
      cerrarModal();
    } catch (error) {
      toast.error("Hubo un problema de conexión al guardar.");
    } finally {
      setGuardando(false);
    }
  };

  // --- ESTADOS LÓGICOS ---
  const cambiarEstado = async (transportista: Transportista, nuevoEstado: boolean) => {
    try {
      const payload = { ...transportista, estado: nuevoEstado };
      const response = await fetch(`/api/carriers/${transportista.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(nuevoEstado ? "Transportista reactivado" : "Transportista suspendido");
        await fetchTransportistas();
      } else {
        toast.error("No se pudo cambiar el estado del transportista.");
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor.");
    }
  };

  const handleDesactivar = (id: number, nombre: string) => {
    if (window.confirm(`¿Estás seguro de suspender al transportista "${nombre}"?`)) {
      const transportista = transportistas.find((p) => p.id === id);
      if (transportista) cambiarEstado(transportista, false);
    }
  };

  const handleReactivar = (id: number) => {
    const transportista = transportistas.find((p) => p.id === id);
    if (transportista) cambiarEstado(transportista, true);
  };

  // --- FILTROS Y PAGINACIÓN ---
  const transportistasFiltrados = useMemo(() => {
    return transportistas.filter((t) => {
      const coincideEstado = filtroEstado === "activos" ? t.estado : !t.estado;
      const texto = busqueda.toLowerCase();
      const coincideBusqueda =
        t.nombre.toLowerCase().includes(texto) ||
        (t.ruc_dni && t.ruc_dni.includes(texto));
      return coincideEstado && coincideBusqueda;
    });
  }, [transportistas, busqueda, filtroEstado]);

  const totalTransportistas = transportistas.length;
  const transportistasActivos = transportistas.filter(t => t.estado).length;
  const transportistasConTelefono = transportistas.filter(t => t.telefono).length;

  const totalPaginas = Math.ceil(transportistasFiltrados.length / POR_PAGINA) || 1;
  const paginaAjustada = Math.min(pagina, totalPaginas);

  const transportistasPaginados = useMemo(() => {
    const inicio = (paginaAjustada - 1) * POR_PAGINA;
    return transportistasFiltrados.slice(inicio, inicio + POR_PAGINA);
  }, [transportistasFiltrados, paginaAjustada]);

  useEffect(() => {
    if (pagina !== paginaAjustada) setPagina(paginaAjustada);
  }, [paginaAjustada, pagina]);

  return {
    transportistasPaginados, transportistasFiltrados, cargando, filtroEstado, setFiltroEstado,
    busqueda, setBusqueda, isModalOpen, guardando, transportistaAEditar, formData,
    handleChange, handleTelefonoChange, handleDocumentoChange, handleSubmit,
    handleDesactivar, handleReactivar, abrirModalCrear, abrirModalEditar, cerrarModal,
    errores, totalTransportistas, transportistasActivos, transportistasConTelefono,
    pagina, setPagina, totalPaginas, paginaAjustada,
  };
};