import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { Producto } from "../productos/useProductos";

export interface ItemCarrito extends Producto {
  cantidadVenta: number;
  descuento: number;
}

export interface ClientePos {
  id: number;
  nombre: string;
  apellido: string | null;
  numero_documento: string | null;
}

export const usePuntoVenta = () => {
  const empresa = { nombre_empresa: "San Felipe", ruc_empresa: "20123456789", direccion_empresa: "Sede Principal" };

  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<{ id: number; nombre: string }[]>([]);
  const [clientesLista, setClientesLista] = useState<ClientePos[]>([]);
  const [cargando, setCargando] = useState(true);

  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("");
  const [pagina, setPagina] = useState(1);
  const POR_PAGINA = 8;

  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [procesando, setProcesando] = useState(false);
  const [ultimaVenta, setUltimaVenta] = useState<Record<string, unknown> | null>(null);

  // ── NUEVO: Estados para el buscador de clientes ──
  const [clienteSearch, setClienteSearch] = useState("");
  const [showClienteDropdown, setShowClienteDropdown] = useState(false);

  const [formularioVenta, setFormularioVenta] = useState({
    customer_id: "",
    tipo_venta: "minorista",
    tipo_comprobante: "Boleta",
    serie: "B001",
    metodo_pago: "Efectivo",
    estado_pago: "pagado", 
    monto_abonado: 0, // NUEVO: Monto que deja a cuenta
  });

  useEffect(() => {
    const fetchInicial = async () => {
      try {
        const [prodRes, catRes, cliRes] = await Promise.all([
          fetch("/api/products", { headers: { Accept: "application/json" } }),
          fetch("/api/categories", { headers: { Accept: "application/json" } }),
          fetch("/api/customers", { headers: { Accept: "application/json" } }),
        ]);

        if (prodRes.ok) {
          const jsonProd = await prodRes.json();
          setProductos(jsonProd.data.filter((p: Producto) => p.estado && p.stock_actual > 0));
        }
        if (catRes.ok) {
          const jsonCat = await catRes.json();
          setCategorias(jsonCat.data.filter((c: any) => c.estado));
        }
        if (cliRes.ok) {
          const jsonCli = await cliRes.json();
          setClientesLista(jsonCli.data.filter((c: any) => c.estado));
        }
      } catch {
        toast.error("Error al cargar datos del sistema.");
      } finally {
        setCargando(false);
      }
    };
    fetchInicial();
  }, []);

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

  // ── BUSCADOR DE CLIENTES FILTRADO ──
  const clientesFiltrados = useMemo(() => {
    if (!clienteSearch) return clientesLista;
    const lower = clienteSearch.toLowerCase();
    return clientesLista.filter(c => 
      c.nombre.toLowerCase().includes(lower) || 
      (c.apellido && c.apellido.toLowerCase().includes(lower)) ||
      (c.numero_documento && c.numero_documento.includes(lower))
    );
  }, [clientesLista, clienteSearch]);

  const agregarAlCarrito = useCallback((producto: Producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        if (existe.cantidadVenta + 1 > producto.stock_actual) {
          toast.warning(`Stock máximo alcanzado para ${producto.nombre}`);
          return prev;
        }
        return prev.map(item => item.id === producto.id ? { ...item, cantidadVenta: item.cantidadVenta + 1 } : item);
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

  const totales = useMemo(() => {
    let subtotalLineas = 0;
    let igvTotal = 0;

    carrito.forEach(item => {
      const precio = formularioVenta.tipo_venta === "minorista" ? item.precio_minorista : item.precio_mayorista;
      const totalLinea = precio * item.cantidadVenta - item.descuento;
      subtotalLineas += totalLinea;
      if (item.afecto_igv) {
        const base = totalLinea / 1.18;
        igvTotal += totalLinea - base;
      }
    });

    return { subtotal: subtotalLineas - igvTotal, igvTotal, total: subtotalLineas };
  }, [carrito, formularioVenta.tipo_venta]);

  // Si se paga completo, el monto abonado debe ser igual al total automáticamente
  useEffect(() => {
    if (formularioVenta.estado_pago === "pagado") {
      setFormularioVenta(prev => ({ ...prev, monto_abonado: totales.total }));
    }
  }, [formularioVenta.estado_pago, totales.total]);

  const procesarVenta = useCallback(async () => {
    if (carrito.length === 0) return toast.error("El carrito está vacío.");
    
    const clienteSeleccionado = clientesLista.find(c => c.id.toString() === formularioVenta.customer_id);

    if (formularioVenta.tipo_comprobante === "Factura") {
      if (!clienteSeleccionado) return toast.error("Factura: Seleccione un cliente con RUC.");
      if (clienteSeleccionado.numero_documento?.length !== 11) return toast.error("Factura: El cliente requiere un RUC válido (11 dígitos).");
    }

    if (formularioVenta.estado_pago === "pendiente" && formularioVenta.monto_abonado > totales.total) {
      return toast.error("El monto abonado no puede ser mayor al total.");
    }

    try {
      setProcesando(true);

      const itemsFormateados = carrito.map(item => ({
        product_id: item.id,
        cantidad: item.cantidadVenta,
        descuento: item.descuento,
      }));

      // NOTA: Tu API en Laravel actualmente no guarda "monto_abonado". 
      // Lo enviamos igual por si tus compañeros lo agregan luego.
      const payloadVenta = {
        customer_id: formularioVenta.customer_id || null,
        user_id: 1, 
        tipo_venta: formularioVenta.tipo_venta,
        tipo_comprobante: formularioVenta.tipo_comprobante,
        serie: formularioVenta.serie,
        metodo_pago: formularioVenta.metodo_pago,
        estado_pago: formularioVenta.estado_pago,
        monto_abonado: formularioVenta.monto_abonado, 
        items: itemsFormateados,
      };

      const resVenta = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payloadVenta)
      });

      if (!resVenta.ok) {
        if (resVenta.status === 422) return toast.error("Error de validación. Revisa los datos.");
        throw new Error("Error interno del servidor");
      }

      const jsonVenta = await resVenta.json();
      const ventaCreada = jsonVenta.data;
      
      toast.success(`Venta registrada · ${ventaCreada.tipo_comprobante} ${ventaCreada.serie}-${ventaCreada.correlativo}`);

      const nombreMostrar = clienteSeleccionado ? `${clienteSeleccionado.nombre} ${clienteSeleccionado.apellido || ''}`.trim() : "Público General";
      
      setUltimaVenta({
        ...ventaCreada,
        empresa,
        nombre_cliente: nombreMostrar,
        numero_documento: clienteSeleccionado?.numero_documento || "",
        monto_abonado: formularioVenta.monto_abonado,
        saldo_pendiente: totales.total - formularioVenta.monto_abonado
      });

      setCarrito([]);
      setFormularioVenta(prev => ({ ...prev, customer_id: "", estado_pago: "pagado", monto_abonado: 0 }));
      setClienteSearch("");
      
      const prodRes = await fetch("/api/products", { headers: { Accept: "application/json" } });
      if (prodRes.ok) {
        const jsonProd = await prodRes.json();
        setProductos(jsonProd.data.filter((p: Producto) => p.estado && p.stock_actual > 0));
      }

    } catch (error) {
      toast.error("Error al procesar la venta.");
    } finally {
      setProcesando(false);
    }
  }, [carrito, formularioVenta, clientesLista, empresa, totales.total]);

  const handleCambioComprobante = useCallback((tipo: string) => {
    const serieMap: Record<string, string> = { "Boleta": "B001", "Factura": "F001", "Nota de Venta": "NV01" };
    setFormularioVenta(prev => ({ ...prev, tipo_comprobante: tipo, serie: serieMap[tipo] ?? "B001" }));
  }, []);

  return {
    empresa, cargando, productos, categorias, clientesLista,
    busqueda, setBusqueda, categoriaFiltro, setCategoriaFiltro,
    pagina, setPagina, totalPaginas, paginaAjustada, productosPaginados,
    carrito, totales, agregarAlCarrito, modificarCantidad, quitarDelCarrito,
    formularioVenta, setFormularioVenta, handleCambioComprobante,
    procesando, procesarVenta, ultimaVenta, setUltimaVenta,
    clienteSearch, setClienteSearch, showClienteDropdown, setShowClienteDropdown, clientesFiltrados
  };
};