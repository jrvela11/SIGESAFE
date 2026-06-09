
// Este es un ejemplo de cómo podría verse la vista del dashboard utilizando el marco DashboardLayout y Sonner para notificaciones.
// src/app/dashboard/DashboardView.tsx
import React from "react";
import { toast } from "sonner";
import { DashboardLayout } from "./DashboardLayout"; // Importamos el marco
import { TrendingUp, Users, Package, DollarSign } from "lucide-react";

export const DashboardView = () => {

  // Función para probar Sonner
  const simularSincronizacion = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)), // Simulamos que tarda 1.5s
      {
        loading: 'Sincronizando inventario...',
        success: '¡Inventario actualizado correctamente!',
        error: 'Error al sincronizar datos',
      }
    );
  };

  return (
    <DashboardLayout>
      {/* Contenido de la vista */}
      <div className="space-y-6">
        
        {/* Fila de Encabezado y Botón de prueba */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">Resumen General</h2>
          <button 
            onClick={simularSincronizacion}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
          >
            Sincronizar Datos
          </button>
        </div>

        {/* Fila de Tarjetas (KPIs) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Ventas del Mes</p>
                <h3 className="text-2xl font-bold text-slate-800">S/ 24,500</h3>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm text-emerald-600 mt-4 flex items-center font-medium">
              <TrendingUp className="w-4 h-4 mr-1" /> +12% vs mes anterior
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Nuevos Clientes</p>
                <h3 className="text-2xl font-bold text-slate-800">+48</h3>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Productos Bajos</p>
                <h3 className="text-2xl font-bold text-slate-800">12</h3>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </div>

        </div>

        {/* Espacio para una tabla o gráfico futuro */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 min-h-[300px]">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Actividad Reciente</h3>
          <div className="flex items-center justify-center h-[200px] text-slate-400 border-2 border-dashed border-slate-100 rounded-lg">
            Aquí irá la tabla de las últimas ventas
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};