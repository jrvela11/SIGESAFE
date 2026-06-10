import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  estado: boolean;
}

export interface CategoriaFormData {
  nombre: string;
  descripcion: string;
  estado: boolean;
}

export const useCategorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<"activos" | "inactivos">("activos");
  const [busqueda, setBusqueda] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [categoriaAEditar, setCategoriaAEditar] = useState<Categoria | null>(null);

  const [formData, setFormData] = useState<CategoriaFormData>({
    nombre: "",
    descripcion: "",
    estado: true,
  });

  const [errores, setErrores] = useState<Record<string, string>>({});

  const POR_PAGINA = 10;
  const [pagina, setPagina] = useState(1);

  // --- CARGAR DATOS ---
  const fetchCategorias = async () => {
    try {
      setCargando(true);
      const response = await fetch("/api/categories", {
        headers: { Accept: "application/json" }
      });
      if (response.ok) {
        const json = await response.json();
        setCategorias(json.data);
      }
    } catch (error) {
      toast.error("Error al cargar las categorías.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  // --- MANEJO DEL MODAL ---
  const abrirModalCrear = () => {
    setCategoriaAEditar(null);
    setFormData({ nombre: "", descripcion: "", estado: true });
    setErrores({});
    setIsModalOpen(true);
  };

  const abrirModalEditar = (categoria: Categoria) => {
    setCategoriaAEditar(categoria);
    setFormData({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || "",
      estado: categoria.estado,
    });
    setErrores({});
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setCategoriaAEditar(null);
    setErrores({});
  };

  const handleChange = (field: keyof CategoriaFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrores((prev) => ({ ...prev, [field]: "" }));
  };

  // --- GUARDAR O ACTUALIZAR ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setErrores({});

    const url = categoriaAEditar ? `/api/categories/${categoriaAEditar.id}` : "/api/categories";
    const method = categoriaAEditar ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
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
          toast.error("Revisa los campos requeridos.");
          return;
        }
        throw new Error("Error en el servidor");
      }

      toast.success(categoriaAEditar ? "Categoría actualizada" : "Categoría creada");
      await fetchCategorias();
      cerrarModal();
    } catch (error) {
      toast.error("Hubo un problema de conexión al guardar.");
    } finally {
      setGuardando(false);
    }
  };

  // --- ESTADOS LÓGICOS ---
  const cambiarEstado = async (categoria: Categoria, nuevoEstado: boolean) => {
    try {
      const payload = { ...categoria, estado: nuevoEstado };
      const response = await fetch(`/api/categories/${categoria.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(nuevoEstado ? "Categoría reactivada" : "Categoría suspendida");
        await fetchCategorias();
      } else {
        toast.error("No se pudo cambiar el estado.");
      }
    } catch (error) {
      toast.error("Error de conexión.");
    }
  };

  const handleDesactivar = (id: number, nombre: string) => {
    if (window.confirm(`¿Suspender la categoría "${nombre}"?`)) {
      const cat = categorias.find((c) => c.id === id);
      if (cat) cambiarEstado(cat, false);
    }
  };

  const handleReactivar = (id: number) => {
    const cat = categorias.find((c) => c.id === id);
    if (cat) cambiarEstado(cat, true);
  };

  // --- FILTROS Y PAGINACIÓN ---
  const categoriasFiltradas = useMemo(() => {
    return categorias.filter((c) => {
      const coincideEstado = filtroEstado === "activos" ? c.estado : !c.estado;
      const texto = busqueda.toLowerCase();
      const coincideBusqueda =
        c.nombre.toLowerCase().includes(texto) ||
        (c.descripcion && c.descripcion.toLowerCase().includes(texto));
      return coincideEstado && coincideBusqueda;
    });
  }, [categorias, busqueda, filtroEstado]);

  const totalCategorias = categorias.length;
  const categoriasActivas = categorias.filter((c) => c.estado).length;
  const categoriasInactivas = totalCategorias - categoriasActivas;

  const totalPaginas = Math.ceil(categoriasFiltradas.length / POR_PAGINA) || 1;
  const paginaAjustada = Math.min(pagina, totalPaginas);

  const categoriasPaginadas = useMemo(() => {
    const inicio = (paginaAjustada - 1) * POR_PAGINA;
    return categoriasFiltradas.slice(inicio, inicio + POR_PAGINA);
  }, [categoriasFiltradas, paginaAjustada]);

  useEffect(() => {
    if (pagina !== paginaAjustada) setPagina(paginaAjustada);
  }, [paginaAjustada, pagina]);

  return {
    categoriasPaginadas,
    categoriasFiltradas,
    cargando,
    filtroEstado,
    setFiltroEstado,
    busqueda,
    setBusqueda,
    isModalOpen,
    guardando,
    categoriaAEditar,
    formData,
    handleChange,
    handleSubmit,
    handleDesactivar,
    handleReactivar,
    abrirModalCrear,
    abrirModalEditar,
    cerrarModal,
    errores,
    totalCategorias,
    categoriasActivas,
    categoriasInactivas,
    pagina,
    setPagina,
    totalPaginas,
    paginaAjustada,
  };
};