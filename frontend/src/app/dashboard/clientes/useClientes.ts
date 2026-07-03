import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export interface Cliente {
  id: number;
  tipo_documento: string | null;
  numero_documento: string | null;
  nombre: string;
  apellido: string | null;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  distrito: string | null;
  provincia: string | null;
  departamento: string | null;
  estado: boolean;
  latitud?: number | null;
  longitud?: number | null;
}

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<"activos" | "inactivos">("activos");
  const [busqueda, setBusqueda] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [consultandoDoc, setConsultandoDoc] = useState(false);
  const [clienteAEditar, setClienteAEditar] = useState<Cliente | null>(null);

  const [formData, setFormData] = useState({
    tipo_documento: "",
    numero_documento: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    distrito: "",
    provincia: "",
    departamento: "",
    estado: true,
  });

  const [errores, setErrores] = useState<Record<string, string>>({});
  
  const POR_PAGINA = 10;
  const [pagina, setPagina] = useState(1);

  // --- CARGAR DATOS ---
  const fetchClientes = async () => {
    try {
      setCargando(true);
      const response = await fetch("/api/customers", { headers: { Accept: "application/json" } });
      if (response.ok) {
        const json = await response.json();
        // Dependiendo de cómo devuelva CustomerCollection (generalmente json.data)
        setClientes(json.data || json);
      }
    } catch (error) {
      toast.error("Error al cargar clientes.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // --- MANEJO DEL MODAL ---
  const abrirModalCrear = () => {
    setClienteAEditar(null);
    setFormData({
      tipo_documento: "", numero_documento: "", nombre: "", apellido: "",
      email: "", telefono: "", direccion: "", distrito: "", provincia: "", departamento: "", estado: true,
    });
    setErrores({});
    setIsModalOpen(true);
  };

  const abrirModalEditar = (cliente: Cliente) => {
    setClienteAEditar(cliente);
    setFormData({
      tipo_documento: cliente.tipo_documento || "",
      numero_documento: cliente.numero_documento || "",
      nombre: cliente.nombre || "",
      apellido: cliente.apellido || "",
      email: cliente.email || "",
      telefono: cliente.telefono || "",
      direccion: cliente.direccion || "",
      distrito: cliente.distrito || "",
      provincia: cliente.provincia || "",
      departamento: cliente.departamento || "",
      estado: cliente.estado,
    });
    setErrores({});
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setClienteAEditar(null);
    setErrores({});
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrores(prev => ({ ...prev, [field]: "" }));
  };

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const soloNumeros = e.target.value.replace(/\D/g, "");
    if (soloNumeros.length <= 9) setFormData({ ...formData, telefono: soloNumeros });
    setErrores(prev => ({ ...prev, telefono: "" }));
  };

  const handleNumeroDocumentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (formData.tipo_documento === "DNI") {
      const soloNumeros = value.replace(/\D/g, "").slice(0, 8);
      setFormData({ ...formData, numero_documento: soloNumeros });
    } else if (formData.tipo_documento === "RUC") {
      const soloNumeros = value.replace(/\D/g, "").slice(0, 11);
      setFormData({ ...formData, numero_documento: soloNumeros });
    } else {
      setFormData({ ...formData, numero_documento: value.toUpperCase().slice(0, 20) });
    }
    setErrores(prev => ({ ...prev, numero_documento: "" }));
  };

  // --- CONSULTAR DOCUMENTO (API Externa) ---
  const buscarDocumento = async () => {
    if (!formData.tipo_documento || !formData.numero_documento) {
      toast.warning("Seleccione el tipo y escriba el número de documento");
      return;
    }
    
    const tipo = formData.tipo_documento.toLowerCase();
    if (tipo !== "dni" && tipo !== "ruc") return;

    setConsultandoDoc(true);
    try {
      const response = await fetch(`/api/customers/verify-document?tipo=${tipo}&numero=${formData.numero_documento}`, {
        headers: { Accept: "application/json" }
      });
      
      const res = await response.json();
      
      if (res.success && res.data) {
        setFormData(prev => ({
          ...prev,
          nombre: res.data.nombre || prev.nombre,
          apellido: res.data.apellido || prev.apellido,
          direccion: res.data.direccion || prev.direccion,
        }));
        toast.success("Datos obtenidos correctamente");
      } else {
        toast.error(res.message || "No se encontraron datos");
      }
    } catch (error) {
      toast.error("Error al consultar el documento.");
    } finally {
      setConsultandoDoc(false);
    }
  };

  // --- GUARDAR O ACTUALIZAR ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setErrores({});

    const url = clienteAEditar ? `/api/customers/${clienteAEditar.id}` : "/api/customers";
    const method = clienteAEditar ? "PUT" : "POST";

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
          toast.error("Por favor, revisa los campos en rojo.");
          return;
        }
        throw new Error("Error en el servidor");
      }

      toast.success(clienteAEditar ? "Cliente actualizado" : "Cliente registrado");
      await fetchClientes();
      cerrarModal();
    } catch (error) {
      toast.error("Hubo un problema de conexión al guardar.");
    } finally {
      setGuardando(false);
    }
  };

  // --- ESTADOS LÓGICOS ---
  const cambiarEstado = async (cliente: Cliente, nuevoEstado: boolean) => {
    try {
      const payload = { ...cliente, estado: nuevoEstado };
      const response = await fetch(`/api/customers/${cliente.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(nuevoEstado ? "Cliente reactivado" : "Cliente suspendido");
        await fetchClientes();
      } else {
        toast.error("No se pudo cambiar el estado.");
      }
    } catch (error) {
      toast.error("Error de conexión.");
    }
  };

  const handleDesactivar = (id: number, nombre: string) => {
    if (window.confirm(`¿Suspender al cliente "${nombre}"?`)) {
      const cliente = clientes.find((p) => p.id === id);
      if (cliente) cambiarEstado(cliente, false);
    }
  };

  const handleReactivar = (id: number) => {
    const cliente = clientes.find((p) => p.id === id);
    if (cliente) cambiarEstado(cliente, true);
  };

  // --- FILTROS Y PAGINACIÓN ---
  const clientesFiltrados = useMemo(() => {
    return clientes.filter((c) => {
      const coincideEstado = filtroEstado === "activos" ? c.estado : !c.estado;
      const texto = busqueda.toLowerCase();
      const coincideBusqueda =
        c.nombre.toLowerCase().includes(texto) ||
        (c.apellido && c.apellido.toLowerCase().includes(texto)) ||
        (c.numero_documento && c.numero_documento.includes(texto));
      return coincideEstado && coincideBusqueda;
    });
  }, [clientes, busqueda, filtroEstado]);

  const totalClientes = clientes.length;
  const clientesActivos = clientes.filter(c => c.estado).length;
  const clientesConTelefono = clientes.filter(c => c.telefono).length;

  const totalPaginas = Math.ceil(clientesFiltrados.length / POR_PAGINA) || 1;
  const paginaAjustada = Math.min(pagina, totalPaginas);

  const clientesPaginados = useMemo(() => {
    const inicio = (paginaAjustada - 1) * POR_PAGINA;
    return clientesFiltrados.slice(inicio, inicio + POR_PAGINA);
  }, [clientesFiltrados, paginaAjustada]);

  useEffect(() => {
    if (pagina !== paginaAjustada) setPagina(paginaAjustada);
  }, [paginaAjustada, pagina]);

  return {
    clientesPaginados, clientesFiltrados, cargando, filtroEstado, setFiltroEstado,
    busqueda, setBusqueda, isModalOpen, guardando, consultandoDoc, clienteAEditar, formData,
    handleChange, handleTelefonoChange, handleNumeroDocumentoChange, buscarDocumento, handleSubmit,
    handleDesactivar, handleReactivar, abrirModalCrear, abrirModalEditar, cerrarModal,
    errores, totalClientes, clientesActivos, clientesConTelefono,
    pagina, setPagina, totalPaginas, paginaAjustada,
  };
};