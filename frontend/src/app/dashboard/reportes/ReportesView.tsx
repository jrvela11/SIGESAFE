import React from "react";
import { DashboardLayout } from "../dashboard/DashboardLayout";
import { useReportes } from "./useReportes";
import { Users, Package, FileText, Download, Loader2, Eye, X, FileSearch } from "lucide-react";

export const ReportesView = () => {
  const rep = useReportes();

  return (
    <DashboardLayout>
      {/* Contenedor principal que ocupa toda la altura disponible y divide en 2 */}
      <div className="flex flex-col lg:flex-row gap-6 pb-8 min-h-[calc(100vh-7rem)]">
        
        {/* ── PANEL IZQUIERDO: Módulos (35%) ── */}
        <div className="w-full lg:w-[35%] flex flex-col gap-5">
          
          {/* Cabecera */}
          <div>
            <h1 className="text-[20px] font-black text-[#1C0F05] tracking-tight leading-tight">
              Reportes
            </h1>
            <p className="text-[12.5px] text-[#8B7D72] mt-1">
              Selecciona un módulo para visualizar y descargar el informe en PDF.
            </p>
          </div>

          {/* Tarjetas de Opciones */}
          <div className="flex flex-col gap-4">
            
            {/* Tarjeta: Reporte de Clientes */}
            <div className={`rounded-2xl border p-5 transition-all flex flex-col group ${
              rep.reporteActivo === 'customers' 
                ? "bg-[#FDFAF7] border-[#C17B2A] shadow-md shadow-[#C17B2A]/10" 
                : "bg-white border-[#EDE8E1] hover:border-[#D4C8BC] shadow-sm"
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                  rep.reporteActivo === 'customers' ? "bg-[#C17B2A] text-white" : "bg-[#FDF3E7] border border-[#F0D9B5] text-[#C17B2A] group-hover:scale-105"
                }`}>
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[14.5px] font-black text-[#1C0F05]">Directorio de Clientes</h3>
                  <p className="text-[11.5px] text-[#8B7D72] mt-1 leading-snug">
                    Listado de clientes activos con sus datos de contacto y ubicación.
                  </p>
                </div>
              </div>
              <button
                onClick={() => rep.previsualizarPDF('customers', 'reporte-clientes')}
                disabled={rep.cargando === 'customers'}
                className={`w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12.5px] font-bold transition-colors disabled:opacity-60 ${
                  rep.reporteActivo === 'customers'
                    ? "bg-[#C17B2A] text-white hover:bg-[#A86522] shadow-sm shadow-[#C17B2A]/20"
                    : "bg-[#F7F5F2] text-[#5A4A3C] border border-[#EDE8E1] hover:bg-[#FDF3E7] hover:text-[#C17B2A] hover:border-[#F0D9B5]"
                }`}
              >
                {rep.cargando === 'customers' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Cargando documento...</>
                ) : (
                  <><Eye className="w-4 h-4" /> {rep.reporteActivo === 'customers' ? "Actualizar Vista" : "Generar Vista"}</>
                )}
              </button>
            </div>

            {/* Tarjeta: Reporte de Productos */}
            <div className={`rounded-2xl border p-5 transition-all flex flex-col group ${
              rep.reporteActivo === 'products' 
                ? "bg-[#EDFBF3] border-[#0D7A3E] shadow-md shadow-[#0D7A3E]/10" 
                : "bg-white border-[#EDE8E1] hover:border-[#D4C8BC] shadow-sm"
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                  rep.reporteActivo === 'products' ? "bg-[#0D7A3E] text-white" : "bg-[#EDFBF3] border border-[#9FE1CB] text-[#0D7A3E] group-hover:scale-105"
                }`}>
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[14.5px] font-black text-[#1C0F05]">Inventario de Productos</h3>
                  <p className="text-[11.5px] text-[#8B7D72] mt-1 leading-snug">
                    Catálogo de artículos, precios de venta y niveles de stock.
                  </p>
                </div>
              </div>
              <button
                onClick={() => rep.previsualizarPDF('products', 'reporte-productos')}
                disabled={rep.cargando === 'products'}
                className={`w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12.5px] font-bold transition-colors disabled:opacity-60 ${
                  rep.reporteActivo === 'products'
                    ? "bg-[#0D7A3E] text-white hover:bg-[#0B5E30] shadow-sm shadow-[#0D7A3E]/20"
                    : "bg-[#F7F5F2] text-[#5A4A3C] border border-[#EDE8E1] hover:bg-[#EDFBF3] hover:text-[#0D7A3E] hover:border-[#9FE1CB]"
                }`}
              >
                {rep.cargando === 'products' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Cargando documento...</>
                ) : (
                  <><Eye className="w-4 h-4" /> {rep.reporteActivo === 'products' ? "Actualizar Vista" : "Generar Vista"}</>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* ── PANEL DERECHO: Visor PDF (65%) ── */}
        <div className="w-full lg:w-[65%] flex flex-col bg-white rounded-2xl border border-[#EDE8E1] shadow-sm overflow-hidden h-[600px] lg:h-auto lg:min-h-full">
          
          {rep.pdfUrl ? (
            <>
              {/* Cabecera del Visor */}
              <div className="shrink-0 flex items-center justify-between px-5 py-3.5 border-b border-[#F0EBE4] bg-[#FDFAF7]">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${rep.reporteActivo === 'products' ? 'bg-[#EDFBF3] text-[#0D7A3E]' : 'bg-[#FDF3E7] text-[#C17B2A]'}`}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-[13px] font-black text-[#1C0F05]">Vista Previa del Documento</h2>
                    <p className="text-[10px] text-[#9A8E82] font-mono mt-0.5">Hoja A4 (Vertical)</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={rep.limpiarPreview}
                    className="p-2 rounded-lg text-[#9A8E82] hover:bg-[#FCEBEB] hover:text-red-600 transition-colors"
                    title="Cerrar vista"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={rep.descargarPDF}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-bold text-white transition-all shadow-sm active:scale-95 ${
                      rep.reporteActivo === 'products' ? 'bg-[#0D7A3E] hover:bg-[#0B5E30]' : 'bg-[#C17B2A] hover:bg-[#A86522]'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" /> Descargar PDF
                  </button>
                </div>
              </div>

              {/* Visor PDF Iframe */}
              <div className="flex-1 bg-[#525659] relative w-full h-full">
                <iframe 
                  src={`${rep.pdfUrl}#toolbar=0`} 
                  className="absolute inset-0 w-full h-full border-0" 
                  title="Visor de Reporte PDF" 
                />
              </div>
            </>
          ) : (
            
            /* Estado Vacío (Placeholder) */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#FDFAF7]/50">
              <div className="w-20 h-20 bg-white border border-[#EDE8E1] rounded-2xl flex items-center justify-center shadow-sm mb-4">
                <FileSearch className="w-8 h-8 text-[#C0B4AA]" />
              </div>
              <h3 className="text-[16px] font-black text-[#1C0F05]">Área de Previsualización</h3>
              <p className="text-[12.5px] text-[#8B7D72] mt-2 max-w-sm">
                Selecciona la opción <strong>"Generar Vista"</strong> en alguno de los módulos de la izquierda para cargar el PDF aquí.
              </p>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
};