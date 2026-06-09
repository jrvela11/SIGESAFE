import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../../../lib/api";

export interface Proveedor {
  id: number;
  tipo_documento: string;
  numero_documento: string;
  razon_social: string;
  contacto: string | null;
  nombre_completo: string; // viene del backend (accessor)
  telefono: string | null;
  direccion: string | null;
  region: string | null;
  distrito: string | null;
  provincia: string | null;
  departamento: string | null;
  estado: boolean;
}

export const useProveedores = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<"activos" | "inactivos">("activos");
  const [busqueda, setBusqueda] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [proveedorAEditar, setProveedorAEditar] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    tipo_documento: "",
    numero_documento: "",
    razon_social: "",
    contacto: "",
    telefono: "",
    direccion: "",
    region: "",
    distrito: "",
    provincia: "",
    departamento: "",
    estado: true,
  });

  const [errores, setErrores] = useState<Record<string, string>>({});
  const [consultandoDoc, setConsultandoDoc] = useState(false);

  const POR_PAGINA = 10;
  const [pagina, setPagina] = useState(1);

  const fetchProveedores = async () => {
    try {
      setCargando(true);
      const response = await api.get("/proveedores");
      if (response.data.success) {
        setProveedores(response.data.data);
      }
    } catch (error) {
      toast.error("Error al cargar proveedores.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.razon_social.trim()) {
      nuevosErrores.razon_social = "La razón social es obligatoria.";
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
      if (proveedorAEditar) {
        response = await api.put(`/proveedores/${proveedorAEditar}`, formData);
      } else {
        response = await api.post("/proveedores", formData);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        cerrarModal();
        fetchProveedores();
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
        // Para DNI: concatenar nombre + apellido en razon_social
        // Para RUC: usar el nombre (razon_social)
        const razonSocial = formData.tipo_documento === "DNI"
          ? `${datos.nombre} ${datos.apellido}`.trim()
          : datos.nombre || "";

        setFormData(prev => ({
          ...prev,
          razon_social: razonSocial || prev.razon_social,
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
    if (!window.confirm(`¿Desactivar al proveedor ${nombre}?`)) return;
    try {
      await api.delete(`/proveedores/${id}`);
      toast.success("Proveedor desactivado.");
      fetchProveedores();
    } catch (error) {
      toast.error("No se pudo desactivar.");
    }
  };

  const handleReactivar = async (id: number, nombre: string) => {
    try {
      await api.put(`/proveedores/${id}/restaurar`);
      toast.success(`Proveedor ${nombre} reactivado.`);
      fetchProveedores();
    } catch (error) {
      toast.error("No se pudo reactivar.");
    }
  };

  const abrirModalCrear = () => {
    setProveedorAEditar(null);
    setFormData({
      tipo_documento: "",
      numero_documento: "",
      razon_social: "",
      contacto: "",
      telefono: "",
      direccion: "",
      region: "",
      distrito: "",
      provincia: "",
      departamento: "",
      estado: true,
    });
    setErrores({});
    setIsModalOpen(true);
  };

  const abrirModalEditar = (proveedor: Proveedor) => {
    setProveedorAEditar(proveedor.id);
    setFormData({
      tipo_documento: proveedor.tipo_documento || "",
      numero_documento: proveedor.numero_documento || "",
      razon_social: proveedor.razon_social || "",
      contacto: proveedor.contacto || "",
      telefono: proveedor.telefono || "",
      direccion: proveedor.direccion || "",
      region: proveedor.region || "",
      distrito: proveedor.distrito || "",
      provincia: proveedor.provincia || "",
      departamento: proveedor.departamento || "",
      estado: proveedor.estado,
    });
    setErrores({});
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setProveedorAEditar(null);
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

  // KPIs
  const totalProveedores = proveedores.length;
  const proveedoresActivos = proveedores.filter(p => p.estado).length;
  const proveedoresConTelefono = proveedores.filter(p => p.telefono).length;

  // Filtros + búsqueda + paginación
  const proveedoresFiltrados = proveedores
    .filter(p => (filtroEstado === "activos" ? p.estado : !p.estado))
    .filter(p => {
      const t = busqueda.toLowerCase();
      return (
        p.razon_social?.toLowerCase().includes(t) ||
        p.nombre_completo?.toLowerCase().includes(t) ||
        p.numero_documento?.includes(t)
      );
    });

  const totalPaginas = Math.ceil(proveedoresFiltrados.length / POR_PAGINA);
  const paginaAjustada = Math.min(pagina, Math.max(1, totalPaginas));
  const proveedoresPaginados = proveedoresFiltrados.slice(
    (paginaAjustada - 1) * POR_PAGINA,
    paginaAjustada * POR_PAGINA
  );

  useEffect(() => {
    setPagina(1);
  }, [filtroEstado, busqueda]);

  return {
    proveedores,
    cargando,
    filtroEstado,
    setFiltroEstado,
    busqueda,
    setBusqueda,
    isModalOpen,
    guardando,
    proveedorAEditar,
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
    totalProveedores,
    proveedoresActivos,
    proveedoresConTelefono,
    proveedoresFiltrados,
    proveedoresPaginados,
    pagina,
    setPagina,
    totalPaginas,
    paginaAjustada,
  };
};