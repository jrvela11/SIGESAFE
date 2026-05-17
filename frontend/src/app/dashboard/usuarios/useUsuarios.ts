import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../../../lib/api";

export interface Usuario {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  empleado_id: number | null;
  empleado_nombre: string;
  created_at: string;
}

interface EmpleadoMin {
  id: number;
  nombre_completo: string;
  tipo_documento: string;
  numero_documento: string;
  cargo: string;
}

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [empleadosLista, setEmpleadosLista] = useState<EmpleadoMin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<"activos" | "inactivos">("activos");
  const [busqueda, setBusqueda] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "vendedor",
    is_active: true,
    empleado_id: "",
  });

  const [errores, setErrores] = useState<Record<string, string>>({});

  const POR_PAGINA = 10;
  const [pagina, setPagina] = useState(1);

  const fetchDatos = async () => {
    try {
      setCargando(true);
      const [resUsuarios, resEmpleados] = await Promise.all([
        api.get("/users"),
        api.get("/empleados"),
      ]);
      if (resUsuarios.data.success) setUsuarios(resUsuarios.data.data);
      if (resEmpleados.data.success) setEmpleadosLista(resEmpleados.data.data.filter((e: any) => e.estado));
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

    if (!formData.name.trim()) nuevosErrores.name = "El nombre es obligatorio.";
    if (!formData.email.trim()) {
      nuevosErrores.email = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nuevosErrores.email = "Formato de correo inválido.";
    }

    if (!usuarioAEditar) {
      if (!formData.password) {
        nuevosErrores.password = "La contraseña es obligatoria.";
      } else if (formData.password.length < 8) {
        nuevosErrores.password = "Mínimo 8 caracteres.";
      }
    } else if (formData.password && formData.password.length < 8) {
      nuevosErrores.password = "Mínimo 8 caracteres.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const dataAEnviar = {
      ...formData,
      empleado_id: formData.empleado_id === "" ? null : formData.empleado_id,
    };

    try {
      setGuardando(true);
      let response;
      if (usuarioAEditar) {
        response = await api.put(`/users/${usuarioAEditar}`, dataAEnviar);
      } else {
        response = await api.post("/users", dataAEnviar);
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

  const handleDesactivar = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Suspender el acceso de "${nombre}"?`)) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success("Usuario desactivado.");
      fetchDatos();
    } catch (error) {
      toast.error("No se pudo desactivar.");
    }
  };

  const handleReactivar = async (id: number, nombre: string) => {
    try {
      await api.put(`/users/${id}/restaurar`);
      toast.success(`Acceso restaurado para "${nombre}".`);
      fetchDatos();
    } catch (error) {
      toast.error("No se pudo reactivar.");
    }
  };

  const abrirModalCrear = () => {
    setUsuarioAEditar(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "vendedor",
      is_active: true,
      empleado_id: "",
    });
    setErrores({});
    setIsModalOpen(true);
  };

  const abrirModalEditar = (usuario: Usuario) => {
    setUsuarioAEditar(usuario.id);
    setFormData({
      name: usuario.name,
      email: usuario.email,
      password: "",
      role: usuario.role,
      is_active: usuario.is_active,
      empleado_id: usuario.empleado_id ? usuario.empleado_id.toString() : "",
    });
    setErrores({});
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setUsuarioAEditar(null);
    setErrores({});
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrores((prev) => ({ ...prev, [field]: "" }));
  };

  // KPIs
  const totalUsuarios = usuarios.length;
  const usuariosActivos = usuarios.filter((u) => u.is_active).length;
  const totalAdmins = usuarios.filter((u) => u.role === "admin" && u.is_active).length;

  // Filtros + búsqueda + paginación
  const usuariosFiltrados = usuarios
    .filter((u) => (filtroEstado === "activos" ? u.is_active : !u.is_active))
    .filter((u) => {
      const t = busqueda.toLowerCase();
      return (
        u.name.toLowerCase().includes(t) ||
        u.email.toLowerCase().includes(t) ||
        u.empleado_nombre.toLowerCase().includes(t)
      );
    });

  const totalPaginas = Math.ceil(usuariosFiltrados.length / POR_PAGINA);
  const paginaAjustada = Math.min(pagina, Math.max(1, totalPaginas));
  const usuariosPaginados = usuariosFiltrados.slice(
    (paginaAjustada - 1) * POR_PAGINA,
    paginaAjustada * POR_PAGINA
  );

  useEffect(() => {
    setPagina(1);
  }, [filtroEstado, busqueda]);

  return {
    usuarios,
    empleadosLista,
    cargando,
    filtroEstado,
    setFiltroEstado,
    busqueda,
    setBusqueda,
    isModalOpen,
    guardando,
    usuarioAEditar,
    formData,
    handleSubmit,
    handleDesactivar,
    handleReactivar,
    abrirModalCrear,
    abrirModalEditar,
    cerrarModal,
    handleChange,
    errores,
    totalUsuarios,
    usuariosActivos,
    totalAdmins,
    usuariosFiltrados,
    usuariosPaginados,
    pagina,
    setPagina,
    totalPaginas,
    paginaAjustada,
  };
};