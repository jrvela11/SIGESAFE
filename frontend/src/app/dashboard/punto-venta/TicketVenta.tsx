import React from "react";
import { Printer, X } from "lucide-react";

interface Props {
  venta: any;
  onCerrar: () => void;
}

export const TicketVenta: React.FC<Props> = ({ venta, onCerrar }) => {
  if (!venta) return null;

  const empresa = venta.empresa || {};
  const detalles = venta.detalles || [];

  const handleImprimir = () => window.print();

  const sol = (n: number) =>
    new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(n);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1C0F05]/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <button
        onClick={onCerrar}
        className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex flex-col max-w-[320px] w-full animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        <div className="bg-white shadow-2xl relative rounded-t-sm">
          <div
            className="absolute -top-1.5 left-0 right-0 h-1.5 bg-repeat-x"
            style={{
              backgroundImage: "radial-gradient(circle, transparent 3px, white 3px)",
              backgroundSize: "10px 10px",
            }}
          />

          <div className="p-7 pt-8 font-mono text-[#1C0F05]">
            <div className="text-center border-b border-dashed border-[#B5A99E] pb-4 mb-4">
              <h2 className="text-lg font-black uppercase tracking-widest mb-1">
                {empresa.nombre_empresa || "SAN FELIPE"}
              </h2>
              <p className="text-[10px] font-bold text-[#7A6E65]">
                {empresa.direccion_empresa || "Ruta del Café y Cacao"}
              </p>
              <p className="text-[10px] font-bold text-[#7A6E65]">
                RUC: {empresa.ruc_empresa || "20123456789"}
              </p>

              <div className="mt-3 inline-block bg-[#1C0F05] text-white px-3 py-1 font-bold tracking-widest text-[11px] uppercase">
                {venta.tipo_comprobante}
              </div>
              <p className="text-[13px] font-black mt-1 tracking-widest">
                {venta.serie}-{venta.correlativo}
              </p>
            </div>

            <div className="space-y-1 text-[10px] font-bold uppercase mb-4">
              <div className="flex justify-between">
                <span className="text-[#9A8E82]">FECHA:</span>
                <span>{new Date(venta.fecha_venta || new Date()).toLocaleString("es-PE")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9A8E82]">CLIENTE:</span>
                <span className="text-right max-w-[140px] truncate">
                  {venta.nombre_cliente || "PÚBLICO GENERAL"}
                </span>
              </div>
              {venta.numero_documento && (
                <div className="flex justify-between">
                  <span className="text-[#9A8E82]">DOC:</span>
                  <span>{venta.numero_documento}</span>
                </div>
              )}
            </div>

            <div className="border-y border-dashed border-[#B5A99E] py-3 mb-3">
              <div className="flex justify-between text-[9px] font-black text-[#9A8E82] uppercase tracking-widest mb-2">
                <span>Cant. Descripción</span>
                <span className="text-right">Importe</span>
              </div>
              <div className="space-y-2">
                {detalles.map((det: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-[11px] font-bold">
                    <span className="text-[#5A4A3C] flex-1 pr-2 leading-tight">
                      <span className="mr-1 text-[#9A8E82]">{det.cantidad}x</span>
                      {det.producto?.nombre || `Ítem #${det.product_id}`}
                    </span>
                    <span className="text-[#1C0F05]">{sol(det.subtotal)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1 text-[11px] font-bold uppercase">
              <div className="flex justify-between text-[#7A6E65]">
                <span>Subtotal:</span>
                <span>{sol(venta.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#7A6E65]">
                <span>IGV (18%):</span>
                <span>{sol(venta.igv)}</span>
              </div>
              <div className="flex justify-between mt-2 pt-2 border-t border-[#1C0F05] font-black text-lg tracking-tight">
                <span>TOTAL:</span>
                <span>{sol(venta.total)}</span>
              </div>
            </div>

            <div className="mt-6 text-center space-y-1.5">
              <p className="text-[9px] font-bold text-[#9A8E82] uppercase">
                PAGO EN: {venta.metodo_pago}
              </p>
              <div className="w-full flex justify-center py-1">
                <div
                  className="h-[3px] w-3/4"
                  style={{
                    backgroundImage: "repeating-linear-gradient(to right, transparent, transparent 2px, #1C0F05 2px, #1C0F05 4px)",
                  }}
                />
              </div>
              <p className="text-[9px] font-bold text-[#9A8E82] uppercase">
                ¡Gracias por su preferencia!
              </p>
            </div>
          </div>

          <div
            className="absolute -bottom-1.5 left-0 right-0 h-1.5 bg-repeat-x rotate-180"
            style={{
              backgroundImage: "radial-gradient(circle, transparent 3px, white 3px)",
              backgroundSize: "10px 10px",
            }}
          />
        </div>

        <div className="mt-6 flex gap-3 w-full">
          <button
            onClick={onCerrar}
            className="flex-1 py-3 rounded-xl bg-white/10 text-white border border-white/20 font-black text-[12px] uppercase tracking-widest hover:bg-white/20 backdrop-blur-md transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={handleImprimir}
            className="flex-1 py-3 rounded-xl bg-[#C17B2A] text-white font-black text-[12px] uppercase tracking-widest hover:bg-[#A86522] shadow-[0_0_15px_rgba(193,123,42,0.4)] transition-all flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Imprimir
          </button>
        </div>
      </div>
    </div>
  );
};