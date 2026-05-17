import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../../../lib/api";

export interface Cliente {
  id: number;
  tipo_documento: string;
  numero_documento: string;
  nombre: string;
  apellido: string | null;
  nombre_completo: string;
  email: string;
  telefono: string | null;
  direccion: string | null;
  distrito: string | null;
  provincia: string | null;
  departamento: string | null;
  estado: boolean;
}

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<"activos" | "inactivos">("activos");
  const [busqueda, setBusqueda] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [clienteAEditar, setClienteAEditar] = useState<number | null>(null);

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
  const [consultandoDoc, setConsultandoDoc] = useState(false);

  const POR_PAGINA = 10;
  const [pagina, setPagina] = useState(1);

  const fetchClientes = async () => {
    try {
      setCargando(true);
      const response = await api.get("/clientes");
      if (response.data.success) {
        setClientes(response.data.data);
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

  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    }

    if (formData.tipo_documento && formData.numero_documento) {
      if (formData.tipo_documento === "DNI" && formData.numero_documento.length !== 8) {
        nuevosErrores.numero_documento = "El DNI debe tener 8 dígitos.";
      } else if (formData.tipo_documento === "RUC" && formData.numero_documento.length !== 11) {
        nuevosErrores.numero_documento = "El RUC debe tener 11 dígitos.";
      }
    }

    if (formData.telefono && formData.telefono.trim() !== "") {
      if (!/^9\d{8}$/.test(formData.telefono)) {
        nuevosErrores.telefono = "El celular debe tener 9 dígitos y empezar con 9.";
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      setGuardando(true);
      let response;
      if (clienteAEditar) {
        response = await api.put(`/clientes/${clienteAEditar}`, formData);
      } else {
        response = await api.post("/clientes", formData);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        cerrarModal();
        fetchClientes();
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        const nuevosErrores: Record<string, string> = {};
        Object.keys(backendErrors).forEach((key) => {
          nuevosErrores[key] = backendErrors[key][0];
        });
        setErrores(nuevosErrores);
      } else {
        toast.error("Error al procesar.");
      }
    } finally {
      setGuardando(false);
    }
  };

    const consultarDocumento = async () => {
    if (!formData.tipo_documento || !formData.numero_documento) {
      toast.error("Seleccione tipo y número de documento.");
      return;
    }

    setConsultandoDoc(true);
    try {
      const response = await api.get("/consultar-documento", {
        params: {
          tipo_documento: formData.tipo_documento,
          numero_documento: formData.numero_documento,
        },
      });

      if (response.data.success) {
        const datos = response.data.data;
        // El backend ya mapea los campos a 'nombre', 'apellido', 'direccion'
        setFormData(prev => ({
          ...prev,
          nombre: datos.nombre || prev.nombre,
          apellido: datos.apellido || prev.apellido,
          direccion: datos.direccion || prev.direccion,
          distrito: datos.distrito || prev.distrito,
          provincia: datos.provincia || prev.provincia,
          departamento: datos.departamento || prev.departamento,
        }));
        toast.success("Datos del documento obtenidos.");
      } else {
        toast.error(response.data.message || "No se encontró el documento.");
      }
    } catch (error) {
      toast.error("Error al consultar documento.");
    } finally {
      setConsultandoDoc(false);
    }
  };

  const handleDesactivar = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Desactivar al cliente ${nombre}?`)) return;
    try {
      await api.delete(`/clientes/${id}`);
      toast.success("Cliente desactivado.");
      fetchClientes();
    } catch (error) {
      toast.error("No se pudo desactivar.");
    }
  };

  const handleReactivar = async (id: number, nombre: string) => {
    try {
      await api.put(`/clientes/${id}/restaurar`);
      toast.success(`Cliente ${nombre} reactivado.`);
      fetchClientes();
    } catch (error) {
      toast.error("No se pudo reactivar.");
    }
  };

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
    setClienteAEditar(cliente.id);
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

  const handleChange = (field: string, value: string) => {
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

  // KPIs
  const totalClientes = clientes.length;
  const clientesActivos = clientes.filter((c) => c.estado).length;
  const clientesConTelefono = clientes.filter((c) => c.telefono).length;

  // Filtros + búsqueda + paginación
  const clientesFiltrados = clientes
    .filter((c) => (filtroEstado === "activos" ? c.estado : !c.estado))
    .filter((c) => {
      const t = busqueda.toLowerCase();
      return (
        c.nombre_completo?.toLowerCase().includes(t) ||
        c.nombre?.toLowerCase().includes(t) ||
        c.email?.toLowerCase().includes(t)
      );
    });

  const totalPaginas = Math.ceil(clientesFiltrados.length / POR_PAGINA);
  const paginaAjustada = Math.min(pagina, Math.max(1, totalPaginas));
  const clientesPaginados = clientesFiltrados.slice(
    (paginaAjustada - 1) * POR_PAGINA,
    paginaAjustada * POR_PAGINA
  );

  useEffect(() => {
    setPagina(1);
  }, [filtroEstado, busqueda]);

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
    setFormData,
    handleSubmit,
    handleDesactivar,
    handleReactivar,
    abrirModalCrear,
    abrirModalEditar,
    cerrarModal,
    handleTelefonoChange,
    handleNumeroDocumentoChange,
    handleChange,
    errores,
    consultarDocumento,
    consultandoDoc,
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