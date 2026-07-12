import { useState, useEffect } from "react";
import { toast } from "sonner";

export const useDashboard = () => {
  const [cargando, setCargando] = useState(true);
  const [kpis, setKpis] = useState({
    ventasMes: 0,
    comprasMes: 0,
    margenOperativo: 0,
    productosBajos: 0,
    clientesActivos: 0,
    enviosEnRuta: 0,
  });
  const [actividadReciente, setActividadReciente] = useState<any[]>([]);
  const [datosGrafico, setDatosGrafico] = useState<any[]>([]);
  
  // Nuevos estados para más información
  const [estadoEnviosGrafico, setEstadoEnviosGrafico] = useState<{name: string, value: number, color: string}[]>([]);
  const [productosBajosLista, setProductosBajosLista] = useState<any[]>([]);

  const getToken = () => localStorage.getItem("token");

  const fetchDashboardData = async () => {
    try {
      setCargando(true);
      
      const headers = { 
        Accept: "application/json",
        Authorization: `Bearer ${getToken()}`
      };

      const [ventasRes, comprasRes, prodRes, clientesRes, enviosRes] = await Promise.all([
        fetch("/api/sales", { headers }),
        fetch("/api/purchases", { headers }),
        fetch("/api/products", { headers }),
        fetch("/api/customers", { headers }),
        fetch("/api/shipments", { headers })
      ]);

      let ventas = [], compras = [], productos = [], clientes = [], envios = [];

      if (ventasRes.ok) ventas = (await ventasRes.json()).data || [];
      if (comprasRes.ok) compras = (await comprasRes.json()).data || [];
      if (prodRes.ok) productos = (await prodRes.json()).data || [];
      if (clientesRes.ok) clientes = (await clientesRes.json()).data || [];
      if (enviosRes.ok) envios = (await enviosRes.json()).data || [];

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // ── KPIs ──
      const ventasMes = ventas.filter((v: any) => {
        const d = new Date(v.fecha_venta || v.created_at);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear && v.estado !== false;
      }).reduce((sum: number, v: any) => sum + Number(v.total), 0);

      const comprasMes = compras.filter((c: any) => {
        const d = new Date(c.fecha_emision || c.created_at);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear && c.estado !== false;
      }).reduce((sum: number, c: any) => sum + Number(c.total), 0);

      const margenOperativo = ventasMes - comprasMes;
      const productosBajosArr = productos.filter((p: any) => p.estado && p.stock_actual < 20);
      const clientesActivos = clientes.filter((c: any) => c.estado).length;

      const enviosEnRutaCount = envios.filter((e: any) => 
        e.estado && !['Entregado', 'Anulado', 'Preparando'].includes(e.estado_actual)
      ).length;

      setKpis({ 
        ventasMes, comprasMes, margenOperativo, 
        productosBajos: productosBajosArr.length, 
        clientesActivos, enviosEnRuta: enviosEnRutaCount 
      });

      // ── Tablas ──
      setActividadReciente(ventas.slice(0, 5)); 
      
      // Top 5 productos con menos stock
      setProductosBajosLista(
        productosBajosArr.sort((a: any, b: any) => a.stock_actual - b.stock_actual).slice(0, 5)
      );

      // ── Gráfico de Barras (Tendencia 6 meses) ──
      const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      const graficoTemp = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(currentYear, currentMonth - i, 1);
        const mesTarget = d.getMonth();
        const yearTarget = d.getFullYear();

        const vMes = ventas.filter((v: any) => {
          const f = new Date(v.fecha_venta || v.created_at);
          return f.getMonth() === mesTarget && f.getFullYear() === yearTarget;
        }).reduce((sum: number, v: any) => sum + Number(v.total), 0);

        const cMes = compras.filter((c: any) => {
          const f = new Date(c.fecha_emision || c.created_at);
          return f.getMonth() === mesTarget && f.getFullYear() === yearTarget;
        }).reduce((sum: number, c: any) => sum + Number(c.total), 0);

        graficoTemp.push({ name: meses[mesTarget], Ingresos: vMes, Egresos: cMes });
      }
      setDatosGrafico(graficoTemp);

      // ── Gráfico Circular (Estado Logístico Global) ──
      const enviosEntregados = envios.filter((e: any) => e.estado_actual === 'Entregado').length;
      const enviosPreparando = envios.filter((e: any) => e.estado_actual === 'Preparando').length;
      
      setEstadoEnviosGrafico([
        { name: 'Entregados', value: enviosEntregados, color: '#0D7A3E' },
        { name: 'En Ruta', value: enviosEnRutaCount, color: '#5B45C2' },
        { name: 'Preparando', value: enviosPreparando, color: '#C17B2A' }
      ]);

    } catch (error) {
      toast.error("Error al sincronizar datos del dashboard.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const sincronizar = () => {
    toast.promise(fetchDashboardData(), {
      loading: 'Analizando métricas...',
      success: 'Dashboard actualizado',
      error: 'Error de conexión',
    });
  };

  return { cargando, kpis, actividadReciente, datosGrafico, estadoEnviosGrafico, productosBajosLista, sincronizar };
};