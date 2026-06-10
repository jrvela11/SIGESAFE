import { useState, useEffect, useRef, useMemo } from "react";
import { toast } from "sonner";

export interface Producto {
  id: number;
  category_id: number;
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
  category?: { id: number; nombre: string }; // Relación de Laravel
}

export interface Categoria {
  id: number;
  nombre: string;
  estado: boolean;
}

export const useProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categoriasLista, setCategoriasLista] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<'activos' | 'inactivos'>('activos');
  const [busqueda, setBusqueda] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState<Producto | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const [pagina, setPagina] = useState(1);
  
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    category_id: "",
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

  // --- CARGAR DATOS ---
  const fetchDatos = async () => {
    try {
      setCargando(true);
      const [resProductos, resCategorias] = await Promise.all([
        fetch("/api/products", { headers: { Accept: "application/json" } }),
        fetch("/api/categories", { headers: { Accept: "application/json" } })
      ]);

      if (resProductos.ok) {
        const jsonProd = await resProductos.json();
        setProductos(jsonProd.data);
      }
      if (resCategorias.ok) {
        const jsonCat = await resCategorias.json();
        setCategoriasLista(jsonCat.data.filter((c: Categoria) => c.estado));
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { fetchDatos(); }, []);

  // --- MANEJO DE IMAGEN ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 2 * 1024 * 1024; // 2MB dictado por el FormRequest
      if (file.size > maxSize) {
        toast.error("La imagen es muy pesada. Máximo 2MB.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setArchivoImagen(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrores(prev => ({ ...prev, imagen: "" }));
    }
  };

  // --- GUARDAR O ACTUALIZAR ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrores({});
    if (!formData.category_id) return toast.error("Seleccione una categoría.");
    if (formData.precio_minorista < 0 || formData.precio_mayorista < 0) {
        return toast.error("Los precios no pueden ser negativos.");
    }

    try {
      setGuardando(true);
      
      // Construimos el form-data ya que Laravel lo requiere para recibir archivos
      const formPayload = new FormData();
      formPayload.append("category_id", formData.category_id);
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
      
      // Siempre enviamos esto para que Laravel no rechace la petición (Required en ProductStoreRequest)
      formPayload.append("precio_compra", formData.precio_compra.toString());
      formPayload.append("stock_actual", formData.stock_actual.toString());

      if (archivoImagen) {
        formPayload.append("imagen", archivoImagen);
      }

      let url = "/api/products";
      if (productoAEditar) {
        url = `/api/products/${productoAEditar.id}`;
        formPayload.append("_method", "PUT"); // Truco de Laravel para PUT con FormData
      }

      const response = await fetch(url, {
        method: "POST", // Siempre POST cuando hay archivos y _method=PUT
        headers: { Accept: "application/json" },
        body: formPayload,
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
          toast.error("Revisa los campos en rojo.");
          return;
        }
        throw new Error("Error en el servidor");
      }

      toast.success(productoAEditar ? "Producto actualizado" : "Producto registrado");
      cerrarModal();
      fetchDatos();
    } catch (error: any) {
      toast.error("Error al procesar el producto.");
    } finally {
      setGuardando(false);
    }
  };

  // --- ESTADOS LÓGICOS ---
  const cambiarEstado = async (producto: Producto, nuevoEstado: boolean) => {
    try {
      const payload = { ...producto, estado: nuevoEstado };
      const response = await fetch(`/api/products/${producto.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(nuevoEstado ? "Producto publicado" : "Producto retirado");
        await fetchDatos();
      } else {
        toast.error("No se pudo cambiar el estado.");
      }
    } catch (error) {
      toast.error("Error de conexión.");
    }
  };

  const handleEliminar = (id: number, nombre: string) => {
    if (window.confirm(`¿Retirar ${nombre} del catálogo?`)) {
      const prod = productos.find(p => p.id === id);
      if (prod) cambiarEstado(prod, false);
    }
  };

  const handleReactivar = (id: number) => {
    const prod = productos.find(p => p.id === id);
    if (prod) cambiarEstado(prod, true);
  };

  // --- MODAL ---
  const abrirModalCrear = () => {
    setProductoAEditar(null);
    setArchivoImagen(null);
    setPreviewUrl(null);
    setErrores({});
    if (fileInputRef.current) fileInputRef.current.value = "";
    
    setFormData({
      category_id: "",
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
    setProductoAEditar(prod);
    setArchivoImagen(null);
    setPreviewUrl(prod.imagen_url ? `/storage/${prod.imagen_url}` : null);
    setErrores({});
    if (fileInputRef.current) fileInputRef.current.value = "";

    setFormData({
      category_id: prod.category_id.toString(),
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
    setErrores({});
  };

  const preventInvalidNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['e', 'E', '-', '+'].includes(e.key)) e.preventDefault();
  };

  return {
    productos, categoriasLista, cargando, filtroEstado, setFiltroEstado,
    busqueda, setBusqueda, isModalOpen, guardando, productoAEditar,
    previewUrl, fileInputRef, formData, setFormData, handleSubmit,
    abrirModalCrear, abrirModalEditar, cerrarModal, handleEliminar, handleReactivar,
    handleImageChange, preventInvalidNumberInput, errores, pagina, setPagina
  };
};
