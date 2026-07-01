import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { Producto } from "../productos/useProductos";

// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface ItemCompra extends Producto {
  cantidadComprada: number;
  costo_negociado: number; // En la compra, el costo se puede editar
}

export interface ProveedorCompra {
  id: number;
  razon_social: string;
  numero_documento: string | null;
}

export const usePuntoCompra = () => {
  const empresa = { nombre_empresa: "San Felipe", ruc_empresa: "20123456789", direccion_empresa: "Sede Principal" };

  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<{ id: number; nombre: string }[]>([]);
  const [proveedoresLista, setProveedoresLista] = useState<ProveedorCompra[]>([]);
  const [cargando, setCargando] = useState(true);

  // Filtros de Catálogo
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("");
  const [pagina, setPagina] = useState(1);
  const POR_PAGINA = 8;

  // Carrito y Proceso
  const [carrito, setCarrito] = useState<ItemCompra[]>([]);
  const [procesando, setProcesando] = useState(false);
  const [ultimaCompra, setUltimaCompra] = useState<Record<string, unknown> | null>(null);

  // Buscador de Proveedores
  const [proveedorSearch, setProveedorSearch] = useState("");
  const [showProveedorDropdown, setShowProveedorDropdown] = useState(false);

  const [formularioCompra, setFormularioCompra] = useState({
    supplier_id: "",
    tipo_comprobante: "Factura",
    serie: "F001",
    numero: "",
    metodo_pago: "Transferencia",
    fecha_emision: new Date().toISOString().split("T")[0],
  });

  // ─── Carga Inicial ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchInicial = async () => {
      try {
        const [prodRes, catRes, provRes] = await Promise.all([
          fetch("/api/products", { headers: { Accept: "application/json" } }),
          fetch("/api/categories", { headers: { Accept: "application/json" } }),
          fetch("/api/suppliers", { headers: { Accept: "application/json" } }),
        ]);

        if (prodRes.ok) {
          const jsonProd = await prodRes.json();
          setProductos(jsonProd.data.filter((p: Producto) => p.estado));
        }
        if (catRes.ok) {
          const jsonCat = await catRes.json();
          setCategorias(jsonCat.data.filter((c: any) => c.estado));
        }
        if (provRes.ok) {
          const jsonProv = await provRes.json();
          setProveedoresLista(jsonProv.data.filter((p: any) => p.estado));
        }
      } catch {
        toast.error("Error al cargar datos del sistema.");
      } finally {
        setCargando(false);
      }
    };
    fetchInicial();
  }, []);

  // ─── Filtrado y paginación de Productos ──────────────────────────────────
  const productosFiltrados = useMemo(() => {
    let lista = productos;
    if (busqueda) {
      const t = busqueda.toLowerCase();
      lista = lista.filter(p => p.nombre.toLowerCase().includes(t) || p.sku.toLowerCase().includes(t));
    }
    if (categoriaFiltro) {
      lista = lista.filter(p => p.category_id.toString() === categoriaFiltro);
    }
    return lista;
  }, [productos, busqueda, categoriaFiltro]);

  const totalPaginas = Math.max(1, Math.ceil(productosFiltrados.length / POR_PAGINA));
  const paginaAjustada = Math.min(pagina, totalPaginas);
  const productosPaginados = productosFiltrados.slice((paginaAjustada - 1) * POR_PAGINA, paginaAjustada * POR_PAGINA);

  useEffect(() => { setPagina(1); }, [busqueda, categoriaFiltro]);

  // ─── Buscador de Proveedores ──────────────────────────────────────────────
  const proveedoresFiltrados = useMemo(() => {
    if (!proveedorSearch) return proveedoresLista;
    const lower = proveedorSearch.toLowerCase();
    return proveedoresLista.filter(p => 
      p.razon_social.toLowerCase().includes(lower) || 
      (p.numero_documento && p.numero_documento.includes(lower))
    );
  }, [proveedoresLista, proveedorSearch]);

  // ─── Operaciones del Carrito ──────────────────────────────────────────────
  const agregarAlCarrito = useCallback((producto: Producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        return prev.map(item => item.id === producto.id ? { ...item, cantidadComprada: item.cantidadComprada + 1 } : item);
      }
      return [...prev, { ...producto, cantidadComprada: 1, costo_negociado: producto.precio_compra }];
    });
  }, []);

  const modificarCantidad = useCallback((id: number, cantidad: number) => {
    if (cantidad <= 0) return;
    setCarrito(prev => prev.map(item => item.id === id ? { ...item, cantidadComprada: cantidad } : item));
  }, []);

  const modificarCosto = useCallback((id: number, costo: number) => {
    if (costo < 0) return;
    setCarrito(prev => prev.map(item => item.id === id ? { ...item, costo_negociado: costo } : item));
  }, []);

  const quitarDelCarrito = useCallback((id: number) => {
    setCarrito(prev => prev.filter(item => item.id !== id));
  }, []);

  // ─── Totales ──────────────────────────────────────────────────────────────
  const totales = useMemo(() => {
    let subtotal = 0;
    carrito.forEach(item => {
      subtotal += item.costo_negociado * item.cantidadComprada;
    });

    const igv = formularioCompra.tipo_comprobante === "Factura" ? subtotal * 0.18 : 0;
    
    return { subtotal, igv, total: subtotal + igv };
  }, [carrito, formularioCompra.tipo_comprobante]);

  // ─── Procesar Compra ──────────────────────────────────────────────────────
  const procesarCompra = useCallback(async () => {
    if (carrito.length === 0) return toast.error("El carrito está vacío.");
    if (!formularioCompra.supplier_id) return toast.error("Debe seleccionar un proveedor válido.");
    if (!formularioCompra.numero.trim()) return toast.error("Debe ingresar el número del comprobante.");

    try {
      setProcesando(true);

      const itemsFormateados = carrito.map(item => ({
        product_id: item.id,
        cantidad: item.cantidadComprada,
        precio_compra: item.costo_negociado,
      }));

      const payload = {
        supplier_id: Number(formularioCompra.supplier_id),
        user_id: 1, // TODO: ID de usuario logueado
        tipo_comprobante: formularioCompra.tipo_comprobante,
        serie: formularioCompra.serie,
        numero: formularioCompra.numero,
        metodo_pago: formularioCompra.metodo_pago,
        fecha_emision: formularioCompra.fecha_emision,
        items: itemsFormateados,
      };

      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        if (res.status === 422) return toast.error("Error de validación. Revisa los datos de la compra.");
        throw new Error("Error en el servidor");
      }

      const json = await res.json();
      const compraCreada = json.data;
      
      toast.success("¡Ingreso al almacén completado exitosamente!");

      const provData = proveedoresLista.find(p => p.id.toString() === formularioCompra.supplier_id);

      setUltimaCompra({
        ...compraCreada,
        empresa,
        proveedor_nombre: provData?.razon_social || "Proveedor",
        proveedor_doc: provData?.numero_documento || "",
      });

      // Limpiar formulario
      setCarrito([]);
      setFormularioCompra(prev => ({ ...prev, numero: "", supplier_id: "" }));
      setProveedorSearch("");

      // Recargar catálogo
      const prodRes = await fetch("/api/products", { headers: { Accept: "application/json" } });
      if (prodRes.ok) {
        const jsonProd = await prodRes.json();
        setProductos(jsonProd.data.filter((p: Producto) => p.estado));
      }

    } catch (error) {
      toast.error("Error al registrar la compra.");
    } finally {
      setProcesando(false);
    }
  }, [carrito, formularioCompra, proveedoresLista, empresa]);

  return {
    cargando, productos, categorias, proveedoresLista,
    busqueda, setBusqueda, categoriaFiltro, setCategoriaFiltro,
    pagina, setPagina, totalPaginas, paginaAjustada, productosPaginados,
    carrito, totales, agregarAlCarrito, modificarCantidad, modificarCosto, quitarDelCarrito,
    formularioCompra, setFormularioCompra, procesando, procesarCompra, ultimaCompra, setUltimaCompra,
    proveedorSearch, setProveedorSearch, showProveedorDropdown, setShowProveedorDropdown, proveedoresFiltrados
  };
};