import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import api from "../../../lib/api";
import type { Producto } from "../productos/useProductos";
import { useConfiguracion } from "../../dashboard/configuracion/useConfiguracion";
 
// ─── Tipos ────────────────────────────────────────────────────────────────────
 
export interface ItemCarrito extends Producto {
  cantidadVenta: number;
  descuento: number;
}
 
export interface FormEnvio {
  requiere_envio: boolean;
  tipo_envio: "local" | "interregional";
  direccion_destino: string;
  agencia_transporte_id: string;
  repartidor_nombre: string;
  costo_envio: string;
  fecha_estimada_llegada: string;
}
 
const FORM_ENVIO_INICIAL: FormEnvio = {
  requiere_envio: false,
  tipo_envio: "local",
  direccion_destino: "",
  agencia_transporte_id: "",
  repartidor_nombre: "",
  costo_envio: "",
  fecha_estimada_llegada: "",
};
 
export interface Agencia {
  id: number;
  nombre: string;
  estado: boolean;
}
 
// ─── Hook ─────────────────────────────────────────────────────────────────────
 
export const usePuntoVenta = () => {
  const empresa = useConfiguracion();
 
  // ── Catálogo ───────────────────────────────────────────────────────────────
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<{ id: number; nombre_categoria: string }[]>([]);
  const [agencias, setAgencias] = useState<Agencia[]>([]);
  const [cargando, setCargando] = useState(true);
 
  // ── Filtros y paginación ───────────────────────────────────────────────────
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("");
  const [pagina, setPagina] = useState(1);
  const POR_PAGINA = 8;
 
  // ── Carrito ────────────────────────────────────────────────────────────────
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [procesando, setProcesando] = useState(false);
  const [ultimaVenta, setUltimaVenta] = useState<Record<string, unknown> | null>(null);
 
  // ── Formulario de venta ────────────────────────────────────────────────────
  const [formularioVenta, setFormularioVenta] = useState({
    cliente_id: "",
    numero_documento: "",
    nombre_cliente: "",
    tipo_venta: "minorista",
    tipo_comprobante: "Boleta",
    serie: "B001",
    metodo_pago: "Efectivo",
  });
 
  // ── Formulario de envío (opcional) ────────────────────────────────────────
  const [formEnvio, setFormEnvio] = useState<FormEnvio>(FORM_ENVIO_INICIAL);
  const [erroresEnvio, setErroresEnvio] = useState<Record<string, string>>({});
 
  // ─── Carga inicial ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchInicial = async () => {
      try {
        const [prodRes, catRes, agRes] = await Promise.all([
          api.get("/productos"),
          api.get("/categorias"),
          api.get("/agencias-transporte"),
        ]);
        if (prodRes.data.success) {
          setProductos(
            prodRes.data.data.filter((p: Producto) => p.estado && p.stock_actual > 0)
          );
        }
        if (catRes.data.success) {
          setCategorias(catRes.data.data.filter((c: { estado: boolean }) => c.estado));
        }
        if (agRes.data.success) {
          setAgencias(agRes.data.data.filter((a: Agencia) => a.estado));
        }
      } catch {
        toast.error("Error al cargar catálogo.");
      } finally {
        setCargando(false);
      }
    };
    fetchInicial();
  }, []);
 
  // ─── Filtrado y paginación de productos ───────────────────────────────────
  const productosFiltrados = useMemo(() => {
    let lista = productos;
    if (busqueda) {
      const t = busqueda.toLowerCase();
      lista = lista.filter(
        p => p.nombre.toLowerCase().includes(t) || p.sku.toLowerCase().includes(t)
      );
    }
    if (categoriaFiltro) {
      lista = lista.filter(p => p.categoria_id.toString() === categoriaFiltro);
    }
    return lista;
  }, [productos, busqueda, categoriaFiltro]);
 
  const totalPaginas = Math.max(1, Math.ceil(productosFiltrados.length / POR_PAGINA));
  const paginaAjustada = Math.min(pagina, totalPaginas);
  const productosPaginados = productosFiltrados.slice(
    (paginaAjustada - 1) * POR_PAGINA,
    paginaAjustada * POR_PAGINA
  );
 
  useEffect(() => { setPagina(1); }, [busqueda, categoriaFiltro]);
 
  // ─── Carrito ──────────────────────────────────────────────────────────────
  const agregarAlCarrito = useCallback((producto: Producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        if (existe.cantidadVenta + 1 > producto.stock_actual) {
          toast.warning(`Stock máximo alcanzado para ${producto.nombre}`);
          return prev;
        }
        return prev.map(item =>
          item.id === producto.id
            ? { ...item, cantidadVenta: item.cantidadVenta + 1 }
            : item
        );
      }
      return [...prev, { ...producto, cantidadVenta: 1, descuento: 0 }];
    });
  }, []);
 
  const modificarCantidad = useCallback((id: number, cantidad: number) => {
    if (cantidad < 1) return;
    setCarrito(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        if (cantidad > item.stock_actual) {
          toast.warning("La cantidad supera el stock disponible.");
          return item;
        }
        return { ...item, cantidadVenta: cantidad };
      })
    );
  }, []);
 
  const quitarDelCarrito = useCallback((id: number) => {
    setCarrito(prev => prev.filter(item => item.id !== id));
  }, []);
 
  // ─── Totales ──────────────────────────────────────────────────────────────
  const totales = useMemo(() => {
    let subtotalLineas = 0;
    let igvTotal = 0;
 
    carrito.forEach(item => {
      const precio =
        formularioVenta.tipo_venta === "minorista"
          ? item.precio_minorista
          : item.precio_mayorista;
      const totalLinea = precio * item.cantidadVenta - item.descuento;
      subtotalLineas += totalLinea;
      if (item.afecto_igv) {
        const base = totalLinea / 1.18;
        igvTotal += totalLinea - base;
      }
    });
 
    const costoEnvio = formEnvio.requiere_envio ? Number(formEnvio.costo_envio) || 0 : 0;
    return {
      subtotal: subtotalLineas - igvTotal,
      igvTotal,
      total: subtotalLineas,
      costoEnvio,
      totalConEnvio: subtotalLineas + costoEnvio,
    };
  }, [carrito, formularioVenta.tipo_venta, formEnvio.requiere_envio, formEnvio.costo_envio]);
 
  // ─── Consulta de documento ────────────────────────────────────────────────
  const buscarCliente = useCallback(async () => {
    if (formularioVenta.numero_documento.length < 8) {
      toast.error("Ingrese un número de documento válido.");
      return;
    }
    const tipo = formularioVenta.numero_documento.length === 11 ? "RUC" : "DNI";
    const toastId = toast.loading(`Consultando ${tipo}...`);
    try {
      const res = await api.get("/consultar-documento", {
        params: {
          tipo_documento: tipo,
          numero_documento: formularioVenta.numero_documento,
        },
      });
      if (res.data.success) {
        const datos = res.data.data;
        const nombre =
          tipo === "DNI"
            ? `${datos.nombre} ${datos.apellido}`.trim()
            : datos.nombre;
        setFormularioVenta(prev => ({ ...prev, nombre_cliente: nombre }));
        // Si se encontró dirección, pre-rellenar la dirección de envío
        if (datos.direccion && !formEnvio.direccion_destino) {
          setFormEnvio(prev => ({ ...prev, direccion_destino: datos.direccion }));
        }
        toast.success("Cliente encontrado", { id: toastId });
      } else {
        setFormularioVenta(prev => ({ ...prev, nombre_cliente: "No encontrado" }));
        toast.error(res.data.message || "Documento no encontrado", { id: toastId });
      }
    } catch {
      toast.error("Error al consultar documento.", { id: toastId });
    }
  }, [formularioVenta.numero_documento, formEnvio.direccion_destino]);
 
  // ─── Validar campos de envío ──────────────────────────────────────────────
  const validarEnvio = (): boolean => {
    if (!formEnvio.requiere_envio) return true;
    const e: Record<string, string> = {};
    if (!formEnvio.direccion_destino.trim()) e.direccion_destino = "La dirección es obligatoria.";
    if (formEnvio.tipo_envio === "interregional" && !formEnvio.agencia_transporte_id)
      e.agencia_transporte_id = "Seleccione una agencia para envío interregional.";
    setErroresEnvio(e);
    return Object.keys(e).length === 0;
  };
 
  // ─── Cambiar campos de envío ──────────────────────────────────────────────
  const handleChangeEnvio = (field: keyof FormEnvio, value: string | boolean) => {
    setFormEnvio(prev => ({ ...prev, [field]: value }));
    if (typeof value === "string" && erroresEnvio[field])
      setErroresEnvio(prev => ({ ...prev, [field]: "" }));
  };
 
  const toggleRequiereEnvio = () => {
    setFormEnvio(prev => ({
      ...FORM_ENVIO_INICIAL,
      requiere_envio: !prev.requiere_envio,
    }));
    setErroresEnvio({});
  };
 
  // ─── Procesar venta (con envío opcional) ──────────────────────────────────
  const procesarVenta = useCallback(async () => {
    if (carrito.length === 0) return toast.error("El carrito está vacío.");
    if (
      formularioVenta.tipo_comprobante === "Factura" &&
      formularioVenta.numero_documento.length !== 11
    ) {
      return toast.error("Para emitir Factura se requiere un RUC de 11 dígitos.");
    }
    if (!validarEnvio()) {
      toast.error("Complete los datos de envío.");
      return;
    }
 
    try {
      setProcesando(true);

      
 
      // 1. Crear la venta
      const detallesFormateados = carrito.map(item => ({
        producto_id: item.id,
        cantidad: item.cantidadVenta,
        precio_unitario:
          formularioVenta.tipo_venta === "minorista"
            ? item.precio_minorista
            : item.precio_mayorista,
        descuento: item.descuento,
      }));
 
      const payloadVenta = {
        ...formularioVenta,
        cliente_id: formularioVenta.cliente_id || null,
        detalles: detallesFormateados,
      };
 
      const resVenta = await api.post("/ventas", payloadVenta);
      if (!resVenta.data.success) throw new Error(resVenta.data.message);
 
      const ventaCreada = resVenta.data.data;
      toast.success(`Venta completada · ${ventaCreada.comprobante}`);
 
      // 2. Si requiere envío, crearlo automáticamente
      if (formEnvio.requiere_envio) {
        try {
          const payloadEnvio = {
            venta_id: ventaCreada.id,
            tipo_envio: formEnvio.tipo_envio,
            direccion_destino: formEnvio.direccion_destino,
            agencia_transporte_id: formEnvio.agencia_transporte_id
              ? Number(formEnvio.agencia_transporte_id)
              : null,
            repartidor_nombre: formEnvio.repartidor_nombre || null,
            costo_envio: Number(formEnvio.costo_envio) || 0,
            fecha_estimada_llegada: formEnvio.fecha_estimada_llegada || null,
            estado_actual: "preparando",
          };
          const resEnvio = await api.post("/envios", payloadEnvio);
          if (resEnvio.data.success) {
            toast.success("Envío registrado y listo para despacho 🚚");
          }
        } catch {
          // La venta ya se creó; el envío fallido no es crítico
          toast.warning("La venta se registró pero hubo un error al crear el envío. Créalo manualmente.");
        }
      }

            // Dentro de procesarVenta, después de crear la venta y opcionalmente el envío
      const infoEnvio = formEnvio.requiere_envio
        ? {
            requeria_envio: true,
            direccion_envio: formEnvio.direccion_destino,
            costo_envio: Number(formEnvio.costo_envio) || 0,
          }
        : { requeria_envio: false };

      setUltimaVenta({
        ...ventaCreada,
        empresa,
        ...infoEnvio,
      });
 
      // 3. Actualizar estado local
      setUltimaVenta({
        ...ventaCreada,
        empresa,
        ...infoEnvio,
      });
 
      // Limpiar
      setCarrito([]);
      setFormularioVenta(prev => ({ ...prev, numero_documento: "", nombre_cliente: "" }));
      setFormEnvio(FORM_ENVIO_INICIAL);
      setErroresEnvio({});
 
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message ?? err.message ?? "Error al procesar la venta.");
    } finally {
      setProcesando(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carrito, formularioVenta, formEnvio, empresa]);
 
  // ─── Cambiar comprobante ──────────────────────────────────────────────────
  const handleCambioComprobante = useCallback((tipo: string) => {
    const serieMap: Record<string, string> = {
      Boleta: "B001",
      Factura: "F001",
      "Nota de Venta": "NV01",
    };
    setFormularioVenta(prev => ({
      ...prev,
      tipo_comprobante: tipo,
      serie: serieMap[tipo] ?? "B001",
    }));
  }, []);
 
  return {
    // Config
    empresa,
    cargando,
 
    // Catálogo
    productos,
    categorias,
    agencias,
 
    // Filtros / paginación
    busqueda,
    setBusqueda,
    categoriaFiltro,
    setCategoriaFiltro,
    pagina,
    setPagina,
    totalPaginas,
    paginaAjustada,
    productosPaginados,
 
    // Carrito
    carrito,
    totales,
    agregarAlCarrito,
    modificarCantidad,
    quitarDelCarrito,
 
    // Formulario venta
    formularioVenta,
    setFormularioVenta,
    handleCambioComprobante,
    buscarCliente,
 
    // Formulario envío
    formEnvio,
    erroresEnvio,
    handleChangeEnvio,
    toggleRequiereEnvio,
 
    // Estado de proceso
    procesando,
    procesarVenta,
    ultimaVenta,
    setUltimaVenta,
  };
};