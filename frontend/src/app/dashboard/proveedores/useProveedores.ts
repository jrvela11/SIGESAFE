import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export interface Proveedor {
  id: number;
  tipo_documento: string;
  numero_documento: string;
  razon_social: string;
  contacto: string | null;
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
  const [consultandoDoc, setConsultandoDoc] = useState(false);
  const [proveedorAEditar, setProveedorAEditar] = useState<Proveedor | null>(null);

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
  
  const POR_PAGINA = 10;
  const [pagina, setPagina] = useState(1);

  // --- CARGAR DATOS ---
  const fetchProveedores = async () => {
    try {
      setCargando(true);
      const response = await fetch("/api/suppliers", { headers: { Accept: "application/json" } });
      if (response.ok) {
        const json = await response.json();
        setProveedores(json.data);
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

  // --- MANEJO DEL MODAL ---
  const abrirModalCrear = () => {
    setProveedorAEditar(null);
    setFormData({
      tipo_documento: "", numero_documento: "", razon_social: "", contacto: "",
      telefono: "", direccion: "", region: "", distrito: "", provincia: "", departamento: "", estado: true,
    });
    setErrores({});
    setIsModalOpen(true);
  };

  const abrirModalEditar = (prov: Proveedor) => {
    setProveedorAEditar(prov);
    setFormData({
      tipo_documento: prov.tipo_documento || "",
      numero_documento: prov.numero_documento || "",
      razon_social: prov.razon_social || "",
      contacto: prov.contacto || "",
      telefono: prov.telefono || "",
      direccion: prov.direccion || "",
      region: prov.region || "",
      distrito: prov.distrito || "",
      provincia: prov.provincia || "",
      departamento: prov.departamento || "",
      estado: prov.estado,
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
      // Reutilizamos el endpoint de clientes
      const response = await fetch(`/api/customers/verify-document?tipo=${tipo}&numero=${formData.numero_documento}`, {
        headers: { Accept: "application/json" }
      });
      
      const res = await response.json();
      
      if (response.ok && res.success && res.data) {
        // Si es DNI unimos nombre y apellido, si es RUC usamos la razón social
        const nombreCompleto = res.data.apellido ? `${res.data.nombre} ${res.data.apellido}`.trim() : res.data.nombre;

        setFormData(prev => ({
          ...prev,
          razon_social: res.data.razon_social || nombreCompleto || prev.razon_social,
          direccion: res.data.direccion || prev.direccion,
          distrito: res.data.distrito || prev.distrito,
          provincia: res.data.provincia || prev.provincia,
          departamento: res.data.departamento || prev.departamento,
        }));
        toast.success("Datos del proveedor obtenidos correctamente");
      } else {
        toast.error(res.message || "No se encontraron datos");
      }
    } catch (error) {
      toast.error("Error de red al consultar el documento.");
    } finally {
      setConsultandoDoc(false);
    }
  };

  // --- GUARDAR O ACTUALIZAR ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setErrores({});

    const url = proveedorAEditar ? `/api/suppliers/${proveedorAEditar.id}` : "/api/suppliers";
    const method = proveedorAEditar ? "PUT" : "POST";

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

      toast.success(proveedorAEditar ? "Proveedor actualizado" : "Proveedor registrado");
      await fetchProveedores();
      cerrarModal();
    } catch (error) {
      toast.error("Hubo un problema de conexión al guardar.");
    } finally {
      setGuardando(false);
    }
  };

  // --- ESTADOS LÓGICOS ---
  const cambiarEstado = async (proveedor: Proveedor, nuevoEstado: boolean) => {
    try {
      const payload = { ...proveedor, estado: nuevoEstado };
      const response = await fetch(`/api/suppliers/${proveedor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(nuevoEstado ? "Proveedor reactivado" : "Proveedor suspendido");
        await fetchProveedores();
      } else {
        toast.error("No se pudo cambiar el estado.");
      }
    } catch (error) {
      toast.error("Error de conexión.");
    }
  };

  const handleDesactivar = (id: number, nombre: string) => {
    if (window.confirm(`¿Suspender al proveedor "${nombre}"?`)) {
      const prov = proveedores.find((p) => p.id === id);
      if (prov) cambiarEstado(prov, false);
    }
  };

  const handleReactivar = (id: number) => {
    const prov = proveedores.find((p) => p.id === id);
    if (prov) cambiarEstado(prov, true);
  };

  // --- FILTROS Y PAGINACIÓN ---
  const proveedoresFiltrados = useMemo(() => {
    return proveedores.filter((p) => {
      const coincideEstado = filtroEstado === "activos" ? p.estado : !p.estado;
      const texto = busqueda.toLowerCase();
      const coincideBusqueda =
        p.razon_social.toLowerCase().includes(texto) ||
        (p.contacto && p.contacto.toLowerCase().includes(texto)) ||
        (p.numero_documento && p.numero_documento.includes(texto));
      return coincideEstado && coincideBusqueda;
    });
  }, [proveedores, busqueda, filtroEstado]);

  const totalProveedores = proveedores.length;
  const proveedoresActivos = proveedores.filter(p => p.estado).length;
  const proveedoresConTelefono = proveedores.filter(p => p.telefono).length;

  const totalPaginas = Math.ceil(proveedoresFiltrados.length / POR_PAGINA) || 1;
  const paginaAjustada = Math.min(pagina, totalPaginas);

  const proveedoresPaginados = useMemo(() => {
    const inicio = (paginaAjustada - 1) * POR_PAGINA;
    return proveedoresFiltrados.slice(inicio, inicio + POR_PAGINA);
  }, [proveedoresFiltrados, paginaAjustada]);

  useEffect(() => {
    if (pagina !== paginaAjustada) setPagina(paginaAjustada);
  }, [paginaAjustada, pagina]);

  return {
    proveedoresPaginados, proveedoresFiltrados, cargando, filtroEstado, setFiltroEstado,
    busqueda, setBusqueda, isModalOpen, guardando, consultandoDoc, proveedorAEditar, formData,
    handleChange, handleTelefonoChange, handleNumeroDocumentoChange, buscarDocumento, handleSubmit,
    handleDesactivar, handleReactivar, abrirModalCrear, abrirModalEditar, cerrarModal,
    errores, totalProveedores, proveedoresActivos, proveedoresConTelefono,
    pagina, setPagina, totalPaginas, paginaAjustada,
  };
};