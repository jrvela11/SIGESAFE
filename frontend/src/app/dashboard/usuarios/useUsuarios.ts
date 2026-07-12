import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner"; // Usamos sonner para notificaciones

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
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [guardando, setGuardando] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState<Usuario | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<UsuarioFormData>({
    name: "",
    email: "",
    password: "",
    role: "vendedor", // Rol por defecto
    is_active: true,
  });

  const [busqueda, setBusqueda] = useState<string>("");
  const [filtroEstado, setFiltroEstado] = useState<"activos" | "inactivos">("activos");
  const [pagina, setPagina] = useState<number>(1);
  const elementosPorPagina = 8;

  // Helper para obtener el token actual
  const getToken = () => localStorage.getItem("token");

  // --- CARGAR DATOS ---
  const fetchUsuarios = async () => {
    setCargando(true);
    try {
      const response = await fetch("/api/users", {
        headers: { 
          Accept: "application/json",
          Authorization: `Bearer ${getToken()}` // <--- Token agregado
        },
      });
      if (response.ok) {
        const json = await response.json();
        setUsuarios(json.data);
      } else {
        toast.error("Error al obtener los usuarios.");
      }
    } catch (error) {
      toast.error("Error de conexión al cargar usuarios.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // --- MANEJO DEL MODAL ---
  const abrirModalCrear = () => {
    setUsuarioAEditar(null);
    setFormData({ name: "", email: "", password: "", role: "vendedor", is_active: true });
    setErrores({});
    setIsModalOpen(true);
  };

  const abrirModalEditar = (usuario: Usuario) => {
    setUsuarioAEditar(usuario);
    setFormData({
      name: usuario.name,
      email: usuario.email,
      password: "", 
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
      setErrores((prev) => ({ ...prev, [campo]: "" }));
    }
  };

  // --- GUARDAR O ACTUALIZAR ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setErrores({});

    const payload = { ...formData };
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
          Authorization: `Bearer ${getToken()}` // <--- Token agregado
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
          toast.warning("Revisa los campos con errores.");
          return;
        }
        throw new Error("Error interno del servidor");
      }

      toast.success(usuarioAEditar ? "Usuario actualizado" : "Usuario creado exitosamente");
      await fetchUsuarios();
      cerrarModal();
    } catch (error) {
      toast.error("Ocurrió un problema de sincronización con el servidor.");
    } finally {
      setGuardando(false);
    }
  };

// --- LÓGICA DE ACTUALIZACIÓN DE ESTADO ---
  const cambiarEstado = async (usuario: Usuario, nuevoEstado: boolean) => {
    try {
      // Construimos el payload exacto que el backend necesita, sin incluir password
      const payload = { 
        name: usuario.name,
        email: usuario.email,
        role: usuario.role,
        is_active: nuevoEstado 
      };

      const response = await fetch(`/api/users/${usuario.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(`Acceso ${nuevoEstado ? 'reactivado' : 'suspendido'} correctamente.`);
        await fetchUsuarios();
      } else {
        toast.error("No se pudo actualizar el estado.");
      }
    } catch (error) {
      toast.error("Error de red al actualizar estado.");
    }
  };

  const handleDesactivar = (id: number, name: string) => {
    if (window.confirm(`¿Estás seguro de suspender el acceso de ${name}?`)) {
      const usuario = usuarios.find((u) => u.id === id);
      if (usuario) cambiarEstado(usuario, false);
    }
  };

  const handleReactivar = (id: number, name: string) => {
    // Usamos la variable 'name' para agregar la misma confirmación de seguridad
    if (window.confirm(`¿Estás seguro de reactivar el acceso de ${name}?`)) {
      const usuario = usuarios.find((u) => u.id === id);
      if (usuario) cambiarEstado(usuario, true);
    }
  };

  // --- FILTROS Y PAGINACIÓN ---
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) => {
      const coincideEstado = filtroEstado === "activos" ? u.is_active : !u.is_active;
      const coincideBusqueda =
        u.name.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.email.toLowerCase().includes(busqueda.toLowerCase());
      return coincideEstado && coincideBusqueda;
    });
  }, [usuarios, busqueda, filtroEstado]);

  const totalUsuarios = usuarios.length;
  const usuariosActivos = usuarios.filter((u) => u.is_active).length;
  const totalAdmins = usuarios.filter((u) => u.role === "admin" && u.is_active).length;

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
    cargando, guardando, usuariosFiltrados, usuariosPaginados, paginaAjustada, totalPaginas, setPagina,
    busqueda, setBusqueda, filtroEstado, setFiltroEstado, totalUsuarios, usuariosActivos, totalAdmins,
    isModalOpen, abrirModalCrear, abrirModalEditar, cerrarModal, usuarioAEditar, formData, errores,
    handleChange, handleSubmit, handleDesactivar, handleReactivar,
  };
};