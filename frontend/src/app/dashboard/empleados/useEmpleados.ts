import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../../../lib/api";

export interface Empleado {
  id: number;
  user_id: number | null;
  nombres: string;
  apellidos: string;
  nombre_completo: string;
  tipo_documento: string;
  numero_documento: string;
  telefono: string | null;
  cargo: string;
  estado: boolean;
  email_sistema: string | null;
}

interface Usuario {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
}

export const useEmpleados = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [usuariosLista, setUsuariosLista] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<"activos" | "inactivos">("activos");
  const [busqueda, setBusqueda] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [empleadoAEditar, setEmpleadoAEditar] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    user_id: "",
    nombres: "",
    apellidos: "",
    tipo_documento: "DNI",
    numero_documento: "",
    telefono: "",
    cargo: "Vendedor",
    estado: true,
  });

  const [errores, setErrores] = useState<Record<string, string>>({});
  const [consultandoDoc, setConsultandoDoc] = useState(false);

  const POR_PAGINA = 10;
  const [pagina, setPagina] = useState(1);

  const fetchDatos = async () => {
    try {
      setCargando(true);
      const [resEmpleados, resUsuarios] = await Promise.all([
        api.get("/empleados"),
        api.get("/users"),
      ]);
      if (resEmpleados.data.success) setEmpleados(resEmpleados.data.data);
      if (resUsuarios.data.success)
        setUsuariosLista(resUsuarios.data.data.filter((u: Usuario) => u.is_active));
    } catch (error) {
      toast.error("Error al cargar datos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.nombres.trim()) nuevosErrores.nombres = "El nombre es obligatorio.";
    if (!formData.apellidos.trim()) nuevosErrores.apellidos = "Los apellidos son obligatorios.";
    if (!formData.numero_documento.trim()) nuevosErrores.numero_documento = "El número de documento es obligatorio.";

    if (formData.tipo_documento === "DNI" && formData.numero_documento.length !== 8) {
      nuevosErrores.numero_documento = "El DNI debe tener 8 dígitos.";
    }

    if (formData.telefono && formData.telefono.trim() !== "") {
      if (!/^9\d{8}$/.test(formData.telefono)) {
        nuevosErrores.telefono = "El celular debe tener 9 dígitos y empezar con 9.";
      }
    }

    if (!formData.cargo.trim()) nuevosErrores.cargo = "El cargo es obligatorio.";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const dataAEnviar = {
      ...formData,
      user_id: formData.user_id === "" ? null : formData.user_id,
    };

    try {
      setGuardando(true);
      let response;
      if (empleadoAEditar) {
        response = await api.put(`/empleados/${empleadoAEditar}`, dataAEnviar);
      } else {
        response = await api.post("/empleados", dataAEnviar);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        cerrarModal();
        fetchDatos();
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
    if (formData.tipo_documento !== "DNI") {
      toast.error("Solo se puede consultar DNI.");
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
        setFormData((prev) => ({
          ...prev,
          nombres: datos.nombre || prev.nombres,
          apellidos: datos.apellido || prev.apellidos,
        }));
        toast.success("Datos del DNI obtenidos.");
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
    if (!window.confirm(`¿Desactivar la ficha de ${nombre}?`)) return;
    try {
      await api.delete(`/empleados/${id}`);
      toast.success("Empleado desactivado.");
      fetchDatos();
    } catch (error) {
      toast.error("No se pudo desactivar.");
    }
  };

  const handleReactivar = async (id: number, nombre: string) => {
    try {
      await api.put(`/empleados/${id}/restaurar`);
      toast.success(`Ficha de ${nombre} reactivada.`);
      fetchDatos();
    } catch (error) {
      toast.error("No se pudo reactivar.");
    }
  };

  const abrirModalCrear = () => {
    setEmpleadoAEditar(null);
    setFormData({
      user_id: "",
      nombres: "",
      apellidos: "",
      tipo_documento: "DNI",
      numero_documento: "",
      telefono: "",
      cargo: "Vendedor",
      estado: true,
    });
    setErrores({});
    setIsModalOpen(true);
  };

  const abrirModalEditar = (empleado: Empleado) => {
    setEmpleadoAEditar(empleado.id);
    setFormData({
      user_id: empleado.user_id ? empleado.user_id.toString() : "",
      nombres: empleado.nombres,
      apellidos: empleado.apellidos,
      tipo_documento: empleado.tipo_documento,
      numero_documento: empleado.numero_documento,
      telefono: empleado.telefono || "",
      cargo: empleado.cargo,
      estado: empleado.estado,
    });
    setErrores({});
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setEmpleadoAEditar(null);
    setErrores({});
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrores((prev) => ({ ...prev, [field]: "" }));
  };

  const handleNumeroDocumentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (formData.tipo_documento === "DNI") {
      const soloNumeros = value.replace(/\D/g, "").slice(0, 8);
      setFormData({ ...formData, numero_documento: soloNumeros });
    } else {
      setFormData({ ...formData, numero_documento: value.toUpperCase().slice(0, 15) });
    }
    setErrores((prev) => ({ ...prev, numero_documento: "" }));
  };

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const soloNumeros = e.target.value.replace(/\D/g, "").slice(0, 9);
    setFormData({ ...formData, telefono: soloNumeros });
    setErrores((prev) => ({ ...prev, telefono: "" }));
  };

  const handleTipoDocumentoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, tipo_documento: e.target.value, numero_documento: "" });
    setErrores((prev) => ({ ...prev, numero_documento: "" }));
  };

  // KPIs
  const totalEmpleados = empleados.length;
  const empleadosActivos = empleados.filter((e) => e.estado).length;
  const personalReparto = empleados.filter((e) => e.cargo === "Repartidor" && e.estado).length;

  // Filtros + búsqueda + paginación
  const empleadosFiltrados = empleados
    .filter((e) => (filtroEstado === "activos" ? e.estado : !e.estado))
    .filter((e) => {
      const t = busqueda.toLowerCase();
      return (
        e.nombre_completo.toLowerCase().includes(t) ||
        e.numero_documento.includes(t) ||
        e.cargo.toLowerCase().includes(t)
      );
    });

  const totalPaginas = Math.ceil(empleadosFiltrados.length / POR_PAGINA);
  const paginaAjustada = Math.min(pagina, Math.max(1, totalPaginas));
  const empleadosPaginados = empleadosFiltrados.slice(
    (paginaAjustada - 1) * POR_PAGINA,
    paginaAjustada * POR_PAGINA
  );

  useEffect(() => {
    setPagina(1);
  }, [filtroEstado, busqueda]);

  return {
    empleados,
    usuariosLista,
    cargando,
    filtroEstado,
    setFiltroEstado,
    busqueda,
    setBusqueda,
    isModalOpen,
    guardando,
    empleadoAEditar,
    formData,
    setFormData,
    handleSubmit,
    handleDesactivar,
    handleReactivar,
    abrirModalCrear,
    abrirModalEditar,
    cerrarModal,
    handleChange,
    handleNumeroDocumentoChange,
    handleTelefonoChange,
    handleTipoDocumentoChange,
    errores,
    consultarDocumento,
    consultandoDoc,
    totalEmpleados,
    empleadosActivos,
    personalReparto,
    empleadosFiltrados,
    empleadosPaginados,
    pagina,
    setPagina,
    totalPaginas,
    paginaAjustada,
  };
};