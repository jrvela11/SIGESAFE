import { useState, useEffect } from "react";
import api from "../../../lib/api";

export interface ConfigItem {
  id: number;
  clave: string;
  valor: string;
  descripcion: string;
}

export const useConfiguracion = () => {
  const [configs, setConfigs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchConfigs = async () => {
    try {
      const res = await api.get("/configuraciones");
      if (res.data.success) {
        const map: Record<string, string> = {};
        res.data.data.forEach((c: ConfigItem) => {
          map[c.clave] = c.valor;
        });
        setConfigs(map);
      }
    } catch (error) {
      console.error("Error al cargar configuraciones");
    } finally {
      setLoading(false);
    }
  };

  const updateConfigs = async (settings: Record<string, string>) => {
    const payload = {
      settings: Object.entries(settings).map(([clave, valor]) => ({
        clave,
        valor,
      })),
    };
    const res = await api.put("/configuraciones", payload);
    if (res.data.success) {
      // Actualizar el estado local
      setConfigs((prev) => ({ ...prev, ...settings }));
      return true;
    }
    throw new Error("Error al actualizar configuraciones");
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  return { configs, loading, updateConfigs };
};