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
}

export interface ClienteFormData {
  tipo_documento: string;
  numero_documento: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  distrito: string;
  provincia: string;
  departamento: string;
  estado: boolean;
}

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<"activos" | "inactivos">("activos");
  const [busqueda, setBusqueda] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [clienteAEditar, setClienteAEditar] = useState<Cliente | null>(null);

  const [formData, setFormData] = useState<ClienteFormData>({
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
      const response = await fetch("/api/customers", {
        headers: { Accept: "application/json" }
      });
      if (response.ok) {
        const json = await response.json();
        setClientes(json.data);
      }
    } catch (error) {
      toast.error("Error al cargar clientes desde el servidor.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // --- MANEJO DEL FORMULARIO Y MODAL ---
  const abrirModalCrear = () => {
    setClienteAEditar(null);
    setFormData({
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
    setErrores({});
    setIsModalOpen(true);
  };

  const abrirModalEditar = (cliente: Cliente) => {
    setClienteAEditar(cliente);
    setFormData({
      tipo_documento: cliente.tipo_documento || "",
      numero_documento: cliente.numero_documento || "",
      nombre: cliente.nombre,
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

  const handleChange = (field: keyof ClienteFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrores((prev) => ({ ...prev, [field]: "" }));
  };

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const soloNumeros = e.target.value.replace(/\D/g, "");
    if (soloNumeros.length <= 9) setFormData({ ...formData, telefono: soloNumeros });
    setErrores((prev) => ({ ...prev, telefono: "" }));
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
    setErrores((prev) => ({ ...prev, numero_documento: "" }));
  };

  // --- GUARDAR O ACTUALIZAR ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setErrores({});

    const url = clienteAEditar ? `/api/customers/${clienteAEditar.id}` : "/api/customers";
    const method = clienteAEditar ? "PUT" : "POST";
    const payload = { ...formData };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
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

      toast.success(clienteAEditar ? "Cliente actualizado exitosamente" : "Cliente registrado exitosamente");
      await fetchClientes();
      cerrarModal();
    } catch (error) {
      toast.error("Hubo un problema de conexión al guardar el cliente.");
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
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(nuevoEstado ? "Cliente reactivado" : "Cliente suspendido");
        await fetchClientes();
      } else {
        toast.error("No se pudo cambiar el estado del cliente.");
      }
    } catch (error) {
      toast.error("Error de conexión.");
    }
  };

  const handleDesactivar = (id: number, nombre: string) => {
    if (window.confirm(`¿Estás seguro de suspender al cliente ${nombre}?`)) {
      const cliente = clientes.find((c) => c.id === id);
      if (cliente) cambiarEstado(cliente, false);
    }
  };

  const handleReactivar = (id: number) => {
    const cliente = clientes.find((c) => c.id === id);
    if (cliente) cambiarEstado(cliente, true);
  };

  // --- FILTROS Y PAGINACIÓN ---
  const clientesFiltrados = useMemo(() => {
    return clientes.filter((c) => {
      const coincideEstado = filtroEstado === "activos" ? c.estado : !c.estado;
      const textoBusqueda = busqueda.toLowerCase();
      const coincideBusqueda =
        c.nombre.toLowerCase().includes(textoBusqueda) ||
        (c.apellido && c.apellido.toLowerCase().includes(textoBusqueda)) ||
        (c.email && c.email.toLowerCase().includes(textoBusqueda)) ||
        (c.numero_documento && c.numero_documento.includes(textoBusqueda));
        
      return coincideEstado && coincideBusqueda;
    });
  }, [clientes, busqueda, filtroEstado]);

  const totalClientes = clientes.length;
  const clientesActivos = clientes.filter((c) => c.estado).length;
  const clientesConTelefono = clientes.filter((c) => c.telefono).length;

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
    clientes,
    cargando,
    filtroEstado,
    setFiltroEstado,
    busqueda,
    setBusqueda,
    isModalOpen,
    guardando,
    clienteAEditar,
    formData,
    handleChange,
    handleTelefonoChange,
    handleNumeroDocumentoChange,
    handleSubmit,
    handleDesactivar,
    handleReactivar,
    abrirModalCrear,
    abrirModalEditar,
    cerrarModal,
    errores,
    totalClientes,
    clientesActivos,
    clientesConTelefono,
    clientesFiltrados,
    clientesPaginados,
    pagina,
    setPagina,
    totalPaginas,
    paginaAjustada,
  };
};