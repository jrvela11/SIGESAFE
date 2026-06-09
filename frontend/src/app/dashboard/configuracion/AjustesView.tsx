import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../dashboard/DashboardLayout";
import { useConfiguracion } from "../../dashboard/configuracion/useConfiguracion";
import { Save, Settings } from "lucide-react";
import { toast } from "sonner";

export const AjustesView = () => {
  const { configs, loading, updateConfigs } = useConfiguracion();
  const [form, setForm] = useState({
    nombre_empresa: "",
    ruc_empresa: "",
    direccion_empresa: "",
    telefono_empresa: "",
    correo_empresa: "",
    igv: "18",
  });
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!loading) {
      setForm({
        nombre_empresa: configs.nombre_empresa || "",
        ruc_empresa: configs.ruc_empresa || "",
        direccion_empresa: configs.direccion_empresa || "",
        telefono_empresa: configs.telefono_empresa || "",
        correo_empresa: configs.correo_empresa || "",
        igv: configs.igv || "18",
      });
    }
  }, [configs, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    try {
      await updateConfigs(form);
      toast.success("Configuraciones guardadas.");
    } catch (error) {
      toast.error("Error al guardar.");
    } finally {
      setGuardando(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8 pb-12">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-8 h-8 text-amber-700" />
          <h1 className="text-2xl font-extrabold text-stone-900">Ajustes del Sistema</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Nombre de la Empresa</label>
              <input
                type="text"
                value={form.nombre_empresa}
                onChange={(e) => setForm({ ...form, nombre_empresa: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">RUC</label>
              <input
                type="text"
                value={form.ruc_empresa}
                onChange={(e) => setForm({ ...form, ruc_empresa: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-stone-500 mb-1">Dirección Fiscal</label>
              <input
                type="text"
                value={form.direccion_empresa}
                onChange={(e) => setForm({ ...form, direccion_empresa: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Teléfono</label>
              <input
                type="text"
                value={form.telefono_empresa}
                onChange={(e) => setForm({ ...form, telefono_empresa: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Correo</label>
              <input
                type="email"
                value={form.correo_empresa}
                onChange={(e) => setForm({ ...form, correo_empresa: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">IGV (%)</label>
              <input
                type="number"
                value={form.igv}
                onChange={(e) => setForm({ ...form, igv: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={guardando}
              className="flex items-center gap-2 bg-amber-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-800 transition-colors shadow-md disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {guardando ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};