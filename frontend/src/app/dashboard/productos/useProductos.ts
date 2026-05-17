import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import api from "../../../lib/api";

export interface Producto {
  id: number;
  categoria_id: number;
  categoria_nombre: string;
  sku: string;
  codigo_barras: string | null;
  nombre: string;
  descripcion: string | null;
  precio_compra: number;
  precio_minorista: number;
  precio_mayorista: number;
  afecto_igv: boolean;
  unidad_medida: string;
  stock_actual: number;
  stock_minimo: number;
  imagen_url: string | null;
  estado: boolean;
}

export interface Categoria {
  id: number;
  nombre_categoria: string;
}

export const useProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categoriasLista, setCategoriasLista] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<'activos' | 'inactivos'>('activos');
  const [busqueda, setBusqueda] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState<number | null>(null);
  
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Los campos ocultos precio_compra y stock_actual no se muestran en el formulario
  const [formData, setFormData] = useState({
    categoria_id: "",
    sku: "",
    codigo_barras: "",
    nombre: "",
    descripcion: "",
    precio_minorista: 0,
    precio_mayorista: 0,
    afecto_igv: true,
    unidad_medida: "Unidades",
    stock_minimo: 5,
    estado: true,
    // campos ocultos (solo para mantener el valor en edición)
    precio_compra: 0,
    stock_actual: 0,
  });

  const fetchDatos = async () => {
    try {
      setCargando(true);
      const [resProductos, resCategorias] = await Promise.all([
        api.get("/productos"),
        api.get("/categorias")
      ]);
      if (resProductos.data.success) setProductos(resProductos.data.data);
      if (resCategorias.data.success) {
        setCategoriasLista(resCategorias.data.data.filter((c: any) => c.estado));
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { fetchDatos(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoria_id) return toast.error("Seleccione una categoría.");
    if (formData.precio_minorista < 0) return toast.error("El precio no puede ser negativo.");

    try {
      setGuardando(true);
      const formPayload = new FormData();
      
      // Campos siempre enviados
      formPayload.append("categoria_id", formData.categoria_id);
      formPayload.append("sku", formData.sku);
      formPayload.append("codigo_barras", formData.codigo_barras || "");
      formPayload.append("nombre", formData.nombre);
      formPayload.append("descripcion", formData.descripcion || "");
      formPayload.append("precio_minorista", formData.precio_minorista.toString());
      formPayload.append("precio_mayorista", formData.precio_mayorista.toString());
      formPayload.append("afecto_igv", formData.afecto_igv ? "1" : "0");
      formPayload.append("unidad_medida", formData.unidad_medida);
      formPayload.append("stock_minimo", formData.stock_minimo.toString());
      formPayload.append("estado", formData.estado ? "1" : "0");

      // Solo en edición enviamos precio_compra y stock_actual (para que no se pierdan)
      if (productoAEditar) {
        formPayload.append("precio_compra", formData.precio_compra.toString());
        formPayload.append("stock_actual", formData.stock_actual.toString());
      }

      if (archivoImagen) {
        formPayload.append("imagen", archivoImagen);
      }

      let response;
      if (productoAEditar) {
        formPayload.append("_method", "PUT");
        response = await api.post(`/productos/${productoAEditar}`, formPayload, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        response = await api.post("/productos", formPayload, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }
      
      if (response.data.success) {
        toast.success(response.data.message);
        cerrarModal();
        fetchDatos();
      }
    } catch (error: any) {
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0] as string[];
        toast.error(firstError[0]);
      } else {
        toast.error("Error al procesar el producto.");
      }
    } finally {
      setGuardando(false);
    }
  };

  const abrirModalCrear = () => {
    setProductoAEditar(null);
    setArchivoImagen(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    
    setFormData({
      categoria_id: "",
      sku: "",
      codigo_barras: "",
      nombre: "",
      descripcion: "",
      precio_minorista: 0,
      precio_mayorista: 0,
      afecto_igv: true,
      unidad_medida: "Unidades",
      stock_minimo: 5,
      estado: true,
      precio_compra: 0,
      stock_actual: 0,
    });
    setIsModalOpen(true);
  };

  const abrirModalEditar = (prod: Producto) => {
    setProductoAEditar(prod.id);
    setArchivoImagen(null);
    setPreviewUrl(prod.imagen_url || null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    setFormData({
      categoria_id: prod.categoria_id.toString(),
      sku: prod.sku,
      codigo_barras: prod.codigo_barras || "",
      nombre: prod.nombre,
      descripcion: prod.descripcion || "",
      precio_minorista: prod.precio_minorista,
      precio_mayorista: prod.precio_mayorista,
      afecto_igv: prod.afecto_igv,
      unidad_medida: prod.unidad_medida,
      stock_minimo: prod.stock_minimo,
      estado: prod.estado,
      precio_compra: prod.precio_compra,
      stock_actual: prod.stock_actual,
    });
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setProductoAEditar(null);
    setArchivoImagen(null);
    if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("La imagen es muy pesada. Máximo 2MB.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setArchivoImagen(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleEliminar = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Retirar ${nombre} del catálogo?`)) return;
    try {
      await api.delete(`/productos/${id}`);
      toast.success("Producto desactivado");
      fetchDatos();
    } catch (error) { toast.error("No se pudo desactivar el producto"); }
  };

  const handleReactivar = async (id: number, nombre: string) => {
    try {
      await api.put(`/productos/${id}/restaurar`);
      toast.success("Producto reactivado");
      fetchDatos();
    } catch (error) { toast.error("No se pudo reactivar el producto"); }
  };

  const preventInvalidNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['e', 'E', '-', '+'].includes(e.key)) e.preventDefault();
  };

  return {
    productos, categoriasLista, cargando, filtroEstado, setFiltroEstado,
    busqueda, setBusqueda, isModalOpen, guardando, productoAEditar,
    previewUrl, fileInputRef, formData, setFormData, handleSubmit,
    abrirModalCrear, abrirModalEditar, cerrarModal, handleEliminar, handleReactivar,
    handleImageChange, preventInvalidNumberInput
  };
};