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

  const handleImprimir = () => {
    window.print();
  };

  const sol = (n: number) =>
    new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(n);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <button
        onClick={onCerrar}
        className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="flex flex-col max-w-sm w-full animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        <div className="bg-[#f9f9f9] shadow-2xl relative">
          <div
            className="absolute -top-2 left-0 right-0 h-2 bg-repeat-x"
            style={{
              backgroundImage:
                "radial-gradient(circle, transparent 4px, #f9f9f9 4px)",
              backgroundSize: "12px 12px",
            }}
          />

          <div className="p-8 pt-10 font-mono text-stone-800">
            {/* Encabezado */}
            <div className="text-center border-b-2 border-dashed border-stone-300 pb-5 mb-5">
              <h2 className="text-xl font-black uppercase tracking-widest mb-1">
                {empresa.nombre_empresa || "CAFÉ & CACAO"}
              </h2>
              <p className="text-xs uppercase font-bold text-stone-500">
                {empresa.direccion_empresa || "Dirección fiscal"}
              </p>
              <p className="text-xs font-bold text-stone-500">
                RUC: {empresa.ruc_empresa || "20123456789"}
              </p>

              <div className="mt-4 inline-block bg-stone-800 text-white px-4 py-1.5 font-bold tracking-widest text-sm uppercase">
                {venta.tipo_comprobante}
              </div>
              <p className="text-sm font-black mt-2 tracking-widest">
                {venta.serie}-{venta.correlativo}
              </p>
            </div>

            {/* Metadatos */}
            <div className="space-y-1 text-[11px] font-bold uppercase mb-5">
              <div className="flex justify-between">
                <span className="text-stone-500">FECHA:</span>
                <span>{new Date(venta.fecha_venta).toLocaleString("es-PE")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">CLIENTE:</span>
                <span className="text-right max-w-[150px] truncate">
                  {venta.nombre_cliente || "PÚBLICO GENERAL"}
                </span>
              </div>
              {venta.numero_documento && (
                <div className="flex justify-between">
                  <span className="text-stone-500">DOC:</span>
                  <span>{venta.numero_documento}</span>
                </div>
              )}
              {venta.requeria_envio && (
                <>
                  <div className="flex justify-between">
                    <span className="text-stone-500">ENVÍO:</span>
                    <span className="text-right text-emerald-700 font-bold">Sí</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">DIRECCIÓN:</span>
                    <span className="text-right max-w-[150px] truncate text-xs">
                      {venta.direccion_envio}
                    </span>
                  </div>
                  {venta.costo_envio > 0 && (
                    <div className="flex justify-between">
                      <span className="text-stone-500">COSTO ENVÍO:</span>
                      <span>{sol(venta.costo_envio)}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Detalle de productos */}
            <div className="border-y-2 border-dashed border-stone-300 py-4 mb-4">
              <div className="flex justify-between text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">
                <span>Cant. Descripción</span>
                <span className="text-right">Importe</span>
              </div>
              <div className="space-y-3">
                {detalles.map((det: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-xs font-bold">
                    <span className="text-stone-800 flex-1 pr-2">
                      <span className="mr-2 text-stone-500">{det.cantidad}x</span>
                      {det.producto?.nombre || `ÍTEM #${det.producto_id}`}
                    </span>
                    <span className="text-stone-900">{sol(det.subtotal)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totales */}
            <div className="space-y-1.5 text-xs font-bold uppercase">
              <div className="flex justify-between text-stone-500">
                <span>Base Imponible:</span>
                <span>{sol(venta.subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>IGV (18%):</span>
                <span>{sol(venta.igv)}</span>
              </div>
              <div className="flex justify-between mt-3 pt-3 border-t-2 border-stone-800 font-black text-xl tracking-tight">
                <span>TOTAL:</span>
                <span>{sol(venta.total)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center space-y-2">
              <p className="text-[10px] font-bold text-stone-500 uppercase">
                PAGO EN: {venta.metodo_pago}
              </p>
              <div className="w-full flex justify-center py-2">
                <div
                  className="h-10 w-4/5 bg-gradient-to-r from-stone-800 via-stone-800 to-stone-800"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(to right, transparent, transparent 2px, #292524 2px, #292524 4px)",
                  }}
                />
              </div>
              <p className="text-[10px] font-bold text-stone-400 uppercase">
                ¡Gracias por su preferencia!
              </p>
            </div>
          </div>

          <div
            className="absolute -bottom-2 left-0 right-0 h-2 bg-repeat-x rotate-180"
            style={{
              backgroundImage:
                "radial-gradient(circle, transparent 4px, #f9f9f9 4px)",
              backgroundSize: "12px 12px",
            }}
          />
        </div>

        <div className="mt-8 flex gap-4 w-full">
          <button
            onClick={onCerrar}
            className="flex-1 py-4 rounded-2xl bg-white/10 text-white border border-white/20 font-black text-sm uppercase tracking-widest hover:bg-white/20 backdrop-blur-md transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={handleImprimir}
            className="flex-1 py-4 rounded-2xl bg-amber-500 text-stone-900 font-black text-sm uppercase tracking-widest hover:bg-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2"
          >
            <Printer className="w-5 h-5" /> Imprimir
          </button>
        </div>
      </div>
    </div>
  );
};