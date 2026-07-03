import { useState, useEffect } from "react";
import { toast } from "sonner";

export const useReportes = () => {
  const [cargando, setCargando] = useState<'customers' | 'products' | null>(null);
  
  // Estados para la previsualización en pantalla dividida
  const [reporteActivo, setReporteActivo] = useState<'customers' | 'products' | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfFilename, setPdfFilename] = useState<string>("");

  const previsualizarPDF = async (tipo: 'customers' | 'products', nombreArchivo: string) => {
    try {
      setCargando(tipo);
      
      // Si ya hay un PDF cargado, liberamos la memoria antes de cargar el nuevo
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl);
      }

      const response = await fetch(`/api/reports/export-pdf?type=${tipo}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        }
      });

      if (!response.ok) {
        throw new Error("No se pudo generar el reporte");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      setPdfUrl(url);
      setPdfFilename(`${nombreArchivo}-${new Date().toISOString().split('T')[0]}.pdf`);
      setReporteActivo(tipo);
      
    } catch (error) {
      toast.error("Ocurrió un problema al generar la previsualización.");
      setReporteActivo(null);
      setPdfUrl(null);
    } finally {
      setCargando(null);
    }
  };

  const descargarPDF = () => {
    if (!pdfUrl) return;
    
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = pdfFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success("Reporte descargado correctamente");
  };

  const limpiarPreview = () => {
    if (pdfUrl) {
      window.URL.revokeObjectURL(pdfUrl);
    }
    setPdfUrl(null);
    setReporteActivo(null);
  };

  // Limpiar la memoria si el componente se desmonta
  useEffect(() => {
    return () => {
      if (pdfUrl) window.URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  return {
    previsualizarPDF,
    descargarPDF,
    limpiarPreview,
    cargando,
    pdfUrl,
    reporteActivo
  };
};