import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../dashboard/DashboardLayout";
import { usePuntoVenta } from "./usePuntoVenta";
import {
  ShoppingCart, Search, Package, Plus, Minus, Trash2,
  User, FileText, CreditCard, Coffee, CheckCircle,
  ChevronLeft, ChevronRight, Filter, X, Clock
} from "lucide-react";
import { TicketVenta } from "./TicketVenta";

const sol = (n: number) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(n);

const FieldLabel: React.FC<{ children: React.ReactNode; required?: boolean; hint?: string }> = ({ children, required, hint }) => (
  <div className="flex items-center justify-between mb-1.5">
    <span className="text-[10px] font-bold text-[#7A6E65] uppercase tracking-[0.8px]">
      {children}
      {required && <span className="text-[#C17B2A] ml-0.5">*</span>}
    </span>
    {hint && <span className="text-[10px] text-[#B5A99E]">{hint}</span>}
  </div>
);

const inputBase =
  "w-full px-3 py-2.5 rounded-lg border border-[#DDD5CB] bg-[#FDFAF7] text-[12.5px] " +
  "text-[#2C1A0E] outline-none transition focus:border-[#C17B2A] focus:ring-2 " +
  "focus:ring-[#C17B2A]/15 placeholder:text-[#C0B4AA]";

export const PuntoVentaView = () => {
  const p = usePuntoVenta();
  const [vistaTicket, setVistaTicket] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  useEffect(() => {
    if (p.ultimaVenta) {
      setShowCheckoutModal(false);
      setVistaTicket(true);
    }
  }, [p.ultimaVenta]);

  return (
    <DashboardLayout>
      <div className="flex flex-col xl:flex-row gap-5 pb-12">
        
        {/* ════════ ZONA IZQUIERDA: CATÁLOGO ════════ */}
        <div className="flex-1 flex flex-col gap-4">
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[20px] font-black text-[#1C0F05] tracking-tight leading-tight">
                Punto de Venta
              </h1>
              <p className="text-[12.5px] text-[#8B7D72] mt-1">
                Seleccione los productos del catálogo y arme la orden de compra.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex-1 flex items-center gap-2 bg-white border border-[#EDE8E1] rounded-lg px-3 py-2 focus-within:border-[#C17B2A] focus-within:ring-2 focus-within:ring-[#C17B2A]/15 transition-all w-full shadow-sm">
              <Search className="w-3.5 h-3.5 text-[#B5A99E] shrink-0" />
              <input
                type="text"
                placeholder="Buscar producto por nombre o SKU..."
                value={p.busqueda}
                onChange={(e) => p.setBusqueda(e.target.value)}
                className="flex-1 bg-transparent text-[12.5px] text-[#1C0F05] placeholder:text-[#C0B4AA] outline-none"
              />
              {p.busqueda && (
                <button onClick={() => p.setBusqueda("")} className="text-[#B5A99E] hover:text-[#5A4A3C] transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            
            <div className="flex items-center px-2 bg-white border border-[#EDE8E1] rounded-lg shadow-sm w-full sm:w-auto h-[38px]">
              <Filter className="w-3.5 h-3.5 text-[#B5A99E] shrink-0 mr-2" />
              <select
                value={p.categoriaFiltro}
                onChange={(e) => p.setCategoriaFiltro(e.target.value)}
                className="bg-transparent text-[12px] text-[#5A4A3C] font-semibold outline-none cursor-pointer w-full pr-4"
              >
                <option value="">Todo el catálogo</option>
                {p.categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 relative min-h-[400px]">
            {p.cargando ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl z-10 border border-[#EDE8E1]">
                <div className="w-8 h-8 border-4 border-[#F0D9B5] border-t-[#C17B2A] rounded-full animate-spin mb-3" />
                <p className="text-[#7A6E65] font-bold text-sm">Cargando catálogo...</p>
              </div>
            ) : p.productosPaginados.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-16 bg-[#FDFAF7] rounded-xl border border-dashed border-[#DDD5CB]">
                <Package className="w-10 h-10 text-[#C0B4AA] mb-3" />
                <p className="text-[#5A4A3C] font-bold text-[14px]">Sin coincidencias</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-max">
                  {p.productosPaginados.map((prod) => (
                    <button
                      key={prod.id}
                      onClick={() => p.agregarAlCarrito(prod)}
                      className="group flex flex-col bg-white rounded-xl p-3 border border-[#EDE8E1] hover:border-[#C17B2A] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-left"
                    >
                      <div className="w-full aspect-4/3 rounded-lg bg-[#F7F5F2] mb-3 overflow-hidden flex items-center justify-center relative border border-[#EDE8E1]">
                        {/* URL EXACTA Y CORREGIDA PARA IMÁGENES */}
                        {prod.imagen_url ? (
                          <img
                            src={`/storage/${prod.imagen_url}`}
                            alt={prod.nombre}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <Coffee className="w-6 h-6 text-[#C0B4AA] group-hover:text-[#C17B2A] transition-colors" />
                        )}
                        <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-[#1C0F05] shadow-sm border border-[#EDE8E1]">
                          Stock: {prod.stock_actual}
                        </div>
                      </div>
                      <h3 className="font-bold text-[#1C0F05] text-[12.5px] leading-tight line-clamp-2 mb-1">
                        {prod.nombre}
                      </h3>
                      <div className="mt-auto pt-2 flex items-end justify-between border-t border-[#F0EBE4] w-full">
                        <span className="text-[9.5px] font-bold tracking-wider text-[#9A8E82] uppercase">
                          {p.formularioVenta.tipo_venta === "minorista" ? "Minorista" : "Mayorista"}
                        </span>
                        <span className="font-black text-[14.5px] text-[#0D7A3E] leading-none">
                          {sol(p.formularioVenta.tipo_venta === "minorista" ? prod.precio_minorista : prod.precio_mayorista)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {p.totalPaginas > 1 && (
                  <div className="flex items-center justify-center gap-1.5 mt-6">
                    <button
                      onClick={() => p.setPagina((pg) => Math.max(1, pg - 1))}
                      disabled={p.pagina === 1}
                      className="w-7 h-7 rounded-md bg-white border border-[#EDE8E1] flex items-center justify-center text-[#7A6E65] hover:bg-[#F7F5F2] disabled:opacity-40 transition-all shadow-sm"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11.5px] font-bold text-[#5A4A3C] px-2">
                      {p.pagina} de {p.totalPaginas}
                    </span>
                    <button
                      onClick={() => p.setPagina((pg) => Math.min(p.totalPaginas, pg + 1))}
                      disabled={p.pagina === p.totalPaginas}
                      className="w-7 h-7 rounded-md bg-white border border-[#EDE8E1] flex items-center justify-center text-[#7A6E65] hover:bg-[#F7F5F2] disabled:opacity-40 transition-all shadow-sm"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ════════ ZONA DERECHA: CARRITO ════════ */}
        <div className="w-full xl:w-[360px] flex flex-col shrink-0">
          <div className="bg-white rounded-xl border border-[#EDE8E1] shadow-sm flex flex-col h-[calc(100vh-120px)] sticky top-4 overflow-hidden">
            
            <div className="px-4 py-3 bg-[#FDFAF7] border-b border-[#EDE8E1] flex items-center justify-between shrink-0">
              <h2 className="text-[14px] font-black text-[#1C0F05] flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#C17B2A]" /> Orden en curso
              </h2>
              <select
                value={p.formularioVenta.tipo_venta}
                onChange={(e) => p.setFormularioVenta({ ...p.formularioVenta, tipo_venta: e.target.value })}
                className="text-[11px] bg-white border border-[#EDE8E1] text-[#5A4A3C] font-bold px-2 py-1 rounded-md outline-none cursor-pointer hover:border-[#C17B2A] transition-colors shadow-sm"
              >
                <option value="minorista">Minorista</option>
                <option value="mayorista">Mayorista</option>
              </select>
            </div>

            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar bg-white">
              {p.carrito.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-[#B5A99E] gap-2 opacity-80">
                  <div className="w-12 h-12 rounded-full bg-[#FDFAF7] flex items-center justify-center border border-[#EDE8E1]">
                    <ShoppingCart className="w-5 h-5 text-[#C0B4AA]" />
                  </div>
                  <p className="text-[12.5px] font-bold text-[#9A8E82]">Carrito vacío</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {p.carrito.map((item) => (
                    <div key={item.id} className="bg-[#FDFAF7] p-3 rounded-xl border border-[#EDE8E1] flex gap-2 group">
                      <div className="flex-1 min-w-0">
                        <p className="text-[12.5px] font-bold text-[#1C0F05] leading-tight mb-1">{item.nombre}</p>
                        <p className="text-[10px] font-medium text-[#7A6E65]">
                          PU: {sol(p.formularioVenta.tipo_venta === "minorista" ? item.precio_minorista : item.precio_mayorista)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between shrink-0">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-white rounded-md p-0.5 border border-[#EDE8E1] shadow-sm">
                            <button onClick={() => p.modificarCantidad(item.id, item.cantidadVenta - 1)} className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#F7F5F2] text-[#7A6E65] transition-colors">
                              <Minus className="w-3 h-3 font-bold" />
                            </button>
                            <span className="w-6 text-center text-[11px] font-bold text-[#1C0F05]">{item.cantidadVenta}</span>
                            <button onClick={() => p.modificarCantidad(item.id, item.cantidadVenta + 1)} className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#F7F5F2] text-[#7A6E65] transition-colors">
                              <Plus className="w-3 h-3 font-bold" />
                            </button>
                          </div>
                          <button onClick={() => p.quitarDelCarrito(item.id)} className="text-[#C0B4AA] hover:text-[#8B2020] transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[13px] font-black text-[#0D7A3E] mt-2">
                          {sol((p.formularioVenta.tipo_venta === "minorista" ? item.precio_minorista : item.precio_mayorista) * item.cantidadVenta)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="shrink-0 bg-[#FDFAF7] border-t border-[#EDE8E1] relative z-20 rounded-b-xl">
              <div className="p-4 space-y-1.5 text-[#5A4A3C]">
                <div className="flex justify-between text-[11.5px] font-semibold">
                  <span>Base Imponible</span>
                  <span>{sol(p.totales.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[11.5px] font-semibold">
                  <span>IGV (18%)</span>
                  <span>{sol(p.totales.igvTotal)}</span>
                </div>
                <div className="w-full h-px bg-[#EDE8E1] my-2" />
                <div className="flex justify-between items-center pt-0.5">
                  <span className="text-[12.5px] font-black text-[#1C0F05] uppercase tracking-wide">Total</span>
                  <span className="text-2xl font-black text-[#0D7A3E] tracking-tighter">
                    {sol(p.totales.total)}
                  </span>
                </div>
              </div>
              <div className="px-4 pb-4">
                <button
                  onClick={() => setShowCheckoutModal(true)}
                  disabled={p.carrito.length === 0}
                  className="w-full bg-[#C17B2A] hover:bg-[#A86522] text-white font-black text-[13px] py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-sm shadow-[#C17B2A]/20"
                >
                  PROCEDER AL PAGO
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════ MODAL DE COBRO (CHECKOUT) ════════ */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C0F05]/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
          {/* Overlay invisible para cerrar el dropdown si se hace click fuera */}
          {p.showClienteDropdown && (
            <div className="fixed inset-0 z-40" onClick={() => p.setShowClienteDropdown(false)} />
          )}

          <div className="bg-white rounded-[1.5rem] shadow-2xl max-w-[600px] w-full flex flex-col max-h-full overflow-visible animate-in zoom-in-95 duration-300 border border-[#EDE8E1] z-50">
            
            <div className="px-6 py-4 border-b border-[#EDE8E1] flex items-center justify-between bg-white sticky top-0 z-10 rounded-t-[1.5rem]">
              <h2 className="text-[16px] font-black text-[#1C0F05] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#C17B2A]" />
                Confirmar Venta
              </h2>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#F7F5F2] hover:bg-[#EDE8E1] text-[#7A6E65] hover:text-[#1C0F05] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar space-y-5">
              
              <div className="flex flex-col items-center justify-center bg-[#FDFAF7] border border-[#F0D9B5]/50 rounded-2xl py-6 px-4 shadow-sm">
                <p className="text-[10px] font-bold text-[#C17B2A] uppercase tracking-[0.2em] mb-1">
                  Monto Total de la Orden
                </p>
                <p className="text-4xl font-black text-[#0D7A3E] tracking-tighter">
                  {sol(p.totales.total)}
                </p>
              </div>

              {/* Controles de 3 Columnas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <FieldLabel>Comprobante</FieldLabel>
                  <select
                    className={inputBase + " cursor-pointer font-semibold"}
                    value={p.formularioVenta.tipo_comprobante}
                    onChange={(e) => p.handleCambioComprobante(e.target.value)}
                  >
                    <option value="Boleta">Boleta</option>
                    <option value="Factura">Factura</option>
                    <option value="Nota de Venta">Nota de Venta</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>Método</FieldLabel>
                  <select
                    className={inputBase + " cursor-pointer font-semibold"}
                    value={p.formularioVenta.metodo_pago}
                    onChange={(e) => p.setFormularioVenta({ ...p.formularioVenta, metodo_pago: e.target.value })}
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Yape">Yape</option>
                    <option value="Plin">Plin</option>
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="Transferencia">Transferencia</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>Estado</FieldLabel>
                  <select
                    className={`${inputBase} cursor-pointer font-bold ${
                      p.formularioVenta.estado_pago === "pagado" ? "text-[#0D7A3E] bg-[#EDFBF3] border-[#9FE1CB]" : "text-[#944F0A] bg-[#FEF3E6] border-[#F5D5A3]"
                    }`}
                    value={p.formularioVenta.estado_pago}
                    onChange={(e) => p.setFormularioVenta({ ...p.formularioVenta, estado_pago: e.target.value })}
                  >
                    <option value="pagado">Pago Completo</option>
                    <option value="pendiente">Dejar en Crédito</option>
                  </select>
                </div>
              </div>

              {/* Si es a crédito, mostramos campos para Abono y Saldo */}
              {p.formularioVenta.estado_pago === "pendiente" && (
                <div className="grid grid-cols-2 gap-4 bg-[#FEF3E6] border border-[#F5D5A3] p-4 rounded-2xl animate-in slide-in-from-top-2">
                  <div className="space-y-1.5">
                    <FieldLabel>Monto Abonado (S/)</FieldLabel>
                    <input 
                      type="number" 
                      step="0.01" 
                      min="0"
                      className={`${inputBase} font-black text-[#944F0A]`}
                      value={p.formularioVenta.monto_abonado}
                      onChange={(e) => p.setFormularioVenta({...p.formularioVenta, monto_abonado: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-1.5 flex flex-col justify-end">
                    <p className="text-[10px] font-bold text-[#7A6E65] uppercase tracking-[0.8px] mb-1.5">Saldo Deudor</p>
                    <p className="text-xl font-black text-[#8B2020] h-[42px] flex items-center">
                      {sol(Math.max(0, p.totales.total - p.formularioVenta.monto_abonado))}
                    </p>
                  </div>
                </div>
              )}

              {/* Buscador de Clientes Inteligente */}
              <div className="bg-white border border-[#EDE8E1] rounded-2xl p-4 shadow-sm space-y-3 relative z-30">
                <div className="flex items-center justify-between">
                  <label className="text-[10.5px] font-bold text-[#7A6E65] uppercase tracking-wide flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#B5A99E]" /> Identificar Cliente
                    {p.formularioVenta.tipo_comprobante === "Factura" && <span className="text-[#C17B2A]">* Obligatorio</span>}
                  </label>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#B5A99E]" />
                  <input
                    type="text"
                    placeholder="Buscar por DNI, RUC o Nombre..."
                    className={`${inputBase} pl-9`}
                    value={p.clienteSearch}
                    onChange={(e) => {
                      p.setClienteSearch(e.target.value);
                      p.setShowClienteDropdown(true);
                      p.setFormularioVenta(prev => ({ ...prev, customer_id: "" })); 
                    }}
                    onFocus={() => p.setShowClienteDropdown(true)}
                  />
                  
                  {/* Dropdown de autocompletado */}
                  {p.showClienteDropdown && p.clientesFiltrados.length > 0 && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-white border border-[#EDE8E1] rounded-xl shadow-xl max-h-48 overflow-y-auto z-50 custom-scrollbar">
                      {p.clientesFiltrados.map(c => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            p.setFormularioVenta(prev => ({ ...prev, customer_id: c.id.toString() }));
                            p.setClienteSearch(`${c.nombre} ${c.apellido || ''}`.trim());
                            p.setShowClienteDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-[#FDFAF7] hover:text-[#C17B2A] border-b border-[#EDE8E1] last:border-0 transition-colors flex justify-between items-center"
                        >
                          <span className="text-[12.5px] font-bold text-[#1C0F05]">{c.nombre} {c.apellido}</span>
                          {c.numero_documento && <span className="text-[#9A8E82] font-mono text-[10px]">{c.numero_documento}</span>}
                        </button>
                      ))}
                    </div>
                  )}
                  {p.showClienteDropdown && p.clienteSearch && p.clientesFiltrados.length === 0 && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-white border border-[#EDE8E1] rounded-xl shadow-xl px-4 py-3 text-center z-50">
                      <p className="text-[12px] font-semibold text-[#7A6E65]">No se encontró el cliente.</p>
                      <p className="text-[10px] text-[#9A8E82]">Debe registrarlo en el módulo de Personas.</p>
                    </div>
                  )}
                </div>

                {p.formularioVenta.customer_id && (
                  <div className="mt-2 px-3 py-2 bg-[#FDFAF7] border border-[#F0D9B5] rounded-xl text-[11.5px] font-bold text-[#C17B2A] flex items-center gap-2 animate-in slide-in-from-top-2">
                    <CheckCircle className="w-4 h-4 text-[#C17B2A] shrink-0" />
                    <span className="truncate">Cliente seleccionado correctamente.</span>
                  </div>
                )}
              </div>

            </div>

            <div className="px-6 py-4 bg-[#FDFAF7] border-t border-[#EDE8E1] flex gap-3 sticky bottom-0 z-20 rounded-b-[1.5rem]">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-white border border-[#EDE8E1] text-[#5A4A3C] font-bold text-[12.5px] hover:bg-[#F7F5F2] hover:text-[#1C0F05] transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={p.procesarVenta}
                disabled={p.procesando}
                className={`flex-[2] text-white font-black text-[12.5px] py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 shadow-sm ${
                  p.formularioVenta.estado_pago === "pagado" ? "bg-[#0D7A3E] hover:bg-[#0A5F30] shadow-[#0D7A3E]/20" : "bg-[#C17B2A] hover:bg-[#A86522] shadow-[#C17B2A]/20"
                }`}
              >
                {p.procesando ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> PROCESANDO...</>
                ) : (
                  <>
                    {p.formularioVenta.estado_pago === "pagado" ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    {p.formularioVenta.estado_pago === "pagado" ? "CONFIRMAR COBRO" : "REGISTRAR CRÉDITO"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL DEL TICKET ── */}
      {p.ultimaVenta && vistaTicket && (
        <TicketVenta
          venta={p.ultimaVenta}
          onCerrar={() => {
            p.setUltimaVenta(null);
            setVistaTicket(false);
          }}
        />
      )}
    </DashboardLayout>
  );
};