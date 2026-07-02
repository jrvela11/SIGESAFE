import { useState, useEffect } from "react";
import { toast } from "sonner";

export const useDashboard = () => {
  const [cargando, setCargando] = useState(true);
  const [kpis, setKpis] = useState({
    ventasMes: 0,
    comprasMes: 0,
    productosBajos: 0,
    clientesActivos: 0,
  });
  const [actividadReciente, setActividadReciente] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    try {
      setCargando(true);
      // Hacemos las 4 peticiones en paralelo para que sea súper rápido
      const [ventasRes, comprasRes, prodRes, clientesRes] = await Promise.all([
        fetch("/api/sales", { headers: { Accept: "application/json" } }),
        fetch("/api/purchases", { headers: { Accept: "application/json" } }),
        fetch("/api/products", { headers: { Accept: "application/json" } }),
        fetch("/api/customers", { headers: { Accept: "application/json" } })
      ]);

      let ventas = [], compras = [], productos = [], clientes = [];

      if (ventasRes.ok) ventas = (await ventasRes.json()).data || [];
      if (comprasRes.ok) compras = (await comprasRes.json()).data || [];
      if (prodRes.ok) productos = (await prodRes.json()).data || [];
      if (clientesRes.ok) clientes = (await clientesRes.json()).data || [];

      // Filtro para el mes actual
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const ventasMes = ventas.filter((v: any) => {
        const d = new Date(v.fecha_venta || v.created_at);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear && v.estado !== false;
      }).reduce((sum: number, v: any) => sum + Number(v.total), 0);

      const comprasMes = compras.filter((c: any) => {
        const d = new Date(c.fecha_emision || c.created_at);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear && c.estado !== false;
      }).reduce((sum: number, c: any) => sum + Number(c.total), 0);

      const productosBajos = productos.filter((p: any) => p.estado && p.stock_actual < 20).length;
      const clientesActivos = clientes.filter((c: any) => c.estado).length;

      setKpis({ ventasMes, comprasMes, productosBajos, clientesActivos });

      // Actividad Reciente: Las últimas 5 ventas
      setActividadReciente(ventas.slice(0, 5)); 

    } catch (error) {
      toast.error("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const sincronizar = () => {
    toast.promise(fetchDashboardData(), {
      loading: 'Sincronizando base de datos...',
      success: '¡Dashboard actualizado!',
      error: 'Error al sincronizar datos',
    });
  };

  return { cargando, kpis, actividadReciente, sincronizar };
};