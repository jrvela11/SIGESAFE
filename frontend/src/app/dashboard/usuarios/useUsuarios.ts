import { useState, useEffect, useMemo } from "react";

// Interfaz exacta basada en tu UserResource de Laravel
export interface Usuario {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role: string;
  is_active: boolean;
}

export interface UsuarioFormData {
  name: string;
  email: string;
  password?: string;
  role: string;
  is_active: boolean;
}

export const useUsuarios = () => {
  // --- ESTADOS GLOBALES ---
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [guardando, setGuardando] = useState<boolean>(false);

  // --- ESTADOS DEL MODAL Y FORMULARIO ---
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState<Usuario | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<UsuarioFormData>({
    name: "",
    email: "",
    password: "",
    role: "vendedor",
    is_active: true,
  });

  // --- ESTADOS DE FILTROS Y PAGINACIÓN ---
  const [busqueda, setBusqueda] = useState<string>("");
  const [filtroEstado, setFiltroEstado] = useState<"activos" | "inactivos">("activos");
  const [pagina, setPagina] = useState<number>(1);
  const elementosPorPagina = 8;

  // --- CARGAR DATOS ---
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setCargando(true);
    try {
      const response = await fetch("/api/users", {
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        const json = await response.json();
        setUsuarios(json.data); // UserCollection envuelve la respuesta en "data"
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setCargando(false);
    }
  };

  // --- MANEJO DEL MODAL Y ACCIONES ---
  const abrirModalCrear = () => {
    setUsuarioAEditar(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "vendedor",
      is_active: true,
    });
    setErrores({});
    setIsModalOpen(true);
  };

  const abrirModalEditar = (usuario: Usuario) => {
    setUsuarioAEditar(usuario);
    setFormData({
      name: usuario.name,
      email: usuario.email,
      password: "", // Vacío por seguridad, el backend lo maneja como nullable en updates
      role: usuario.role,
      is_active: usuario.is_active,
    });
    setErrores({});
    setIsModalOpen(true);
  };

  const cerrarModal = () => setIsModalOpen(false);

  const handleChange = (campo: keyof UsuarioFormData, valor: any) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
    if (errores[campo]) {
      setErrores((prev) => ({ ...prev, [campo]: "" })); // Limpia el error mientras escribe
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setErrores({});

    const payload = { ...formData };
    // Si estamos editando y el password está vacío, no lo enviamos al servidor
    if (!payload.password && usuarioAEditar) {
      delete payload.password;
    }

    const url = usuarioAEditar ? `/api/users/${usuarioAEditar.id}` : "/api/users";
    const method = usuarioAEditar ? "PUT" : "POST";

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
          // Captura de errores de validación de Laravel (ej. email duplicado o formato inválido)
          const data = await response.json();
          const validacionErrores: Record<string, string> = {};
          if (data.errors) {
            Object.keys(data.errors).forEach((key) => {
              validacionErrores[key] = data.errors[key][0];
            });
          }
          setErrores(validacionErrores);
          return;
        }
        throw new Error("Error interno del servidor");
      }

      await fetchUsuarios();
      cerrarModal();
    } catch (error) {
      console.error("Error al procesar el formulario:", error);
      alert("Ocurrió un problema de red o sincronización con el servidor.");
    } finally {
      setGuardando(false);
    }
  };

  // --- LÓGICA DE ACTUALIZACIÓN DE ESTADO (SUSPENDER/REACTIVAR) ---
  const cambiarEstado = async (usuario: Usuario, nuevoEstado: boolean) => {
    try {
      const payload = {
        name: usuario.name,
        email: usuario.email,
        role: usuario.role,
        is_active: nuevoEstado,
      };

      const response = await fetch(`/api/users/${usuario.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchUsuarios();
      } else {
        alert("No se pudo actualizar el estado del usuario.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDesactivar = (id: number, name: string) => {
    if (window.confirm(`¿Estás seguro de suspender el acceso de ${name}?`)) {
      const usuario = usuarios.find((u) => u.id === id);
      if (usuario) cambiarEstado(usuario, false);
    }
  };

  const handleReactivar = (id: number, name: string) => {
    const usuario = usuarios.find((u) => u.id === id);
    if (usuario) cambiarEstado(usuario, true);
  };

  // --- FILTROS, BÚSQUEDA Y PAGINACIÓN ---
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) => {
      const coincideEstado = filtroEstado === "activos" ? u.is_active : !u.is_active;
      const coincideBusqueda =
        u.name.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.email.toLowerCase().includes(busqueda.toLowerCase());
      return coincideEstado && coincideBusqueda;
    });
  }, [usuarios, busqueda, filtroEstado]);

  // Indicadores (KPIs)
  const totalUsuarios = usuarios.length;
  const usuariosActivos = usuarios.filter((u) => u.is_active).length;
  const totalAdmins = usuarios.filter((u) => u.role === "admin" && u.is_active).length;

  // Control estricto de páginas
  const totalPaginas = Math.ceil(usuariosFiltrados.length / elementosPorPagina) || 1;
  const paginaAjustada = Math.min(pagina, totalPaginas);

  const usuariosPaginados = useMemo(() => {
    const inicio = (paginaAjustada - 1) * elementosPorPagina;
    return usuariosFiltrados.slice(inicio, inicio + elementosPorPagina);
  }, [usuariosFiltrados, paginaAjustada, elementosPorPagina]);

  useEffect(() => {
    if (pagina !== paginaAjustada) setPagina(paginaAjustada);
  }, [paginaAjustada, pagina]);

  return {
    cargando,
    guardando,
    usuariosFiltrados,
    usuariosPaginados,
    paginaAjustada,
    totalPaginas,
    setPagina,
    busqueda,
    setBusqueda,
    filtroEstado,
    setFiltroEstado,
    totalUsuarios,
    usuariosActivos,
    totalAdmins,
    isModalOpen,
    abrirModalCrear,
    abrirModalEditar,
    cerrarModal,
    usuarioAEditar,
    formData,
    errores,
    handleChange,
    handleSubmit,
    handleDesactivar,
    handleReactivar,
  };
};