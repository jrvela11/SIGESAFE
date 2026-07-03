import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../dashboard/DashboardLayout";
import { usePuntoCompra } from "./usePuntoCompra";
import {
  ShoppingCart, Search, Package, Plus, Minus, Trash2,
  Building2, FileText, CreditCard, Coffee, CheckCircle,
  ChevronLeft, ChevronRight, Filter, X, Calendar as CalendarIcon
} from "lucide-react";
// Importarás el TicketCompra cuando lo armemos (igual al TicketVenta pero para compras)
// import { TicketCompra } from "./TicketCompra";

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

export const PuntoCompraView = () => {
  const p = usePuntoCompra();
  const [vistaTicket, setVistaTicket] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  useEffect(() => {
    if (p.ultimaCompra) {
      setShowCheckoutModal(false);
      setVistaTicket(true);
    }
  }, [p.ultimaCompra]);

  return (
    <DashboardLayout>
      <div className="flex flex-col xl:flex-row gap-5 pb-12">
        
        {/* ════════ ZONA IZQUIERDA: CATÁLOGO ════════ */}
        <div className="flex-1 flex flex-col gap-4">
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[20px] font-black text-[#1C0F05] tracking-tight leading-tight">
                Punto de Compra (Ingresos)
              </h1>
              <p className="text-[12.5px] text-[#8B7D72] mt-1">
                Seleccione productos para reabastecer el inventario y registrar gastos.
              </p>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex-1 flex items-center gap-2 bg-white border border-[#EDE8E1] rounded-lg px-3 py-2 focus-within:border-[#C17B2A] focus-within:ring-2 focus-within:ring-[#C17B2A]/15 transition-all w-full shadow-sm">
              <Search className="w-3.5 h-3.5 text-[#B5A99E] shrink-0" />
              <input
                type="text"
                placeholder="Buscar insumo o producto..."
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
                <option value="">Todas las categorías</option>
                {p.categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid de Productos */}
          <div className="flex-1 relative min-h-[400px]">
            {p.cargando ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl z-10 border border-[#EDE8E1]">
                <div className="w-8 h-8 border-4 border-[#F0D9B5] border-t-[#C17B2A] rounded-full animate-spin mb-3" />
                <p className="text-[#7A6E65] font-bold text-sm">Cargando catálogo...</p>
              </div>
            ) : p.productosPaginados.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-16 bg-[#FDFAF7] rounded-xl border border-dashed border-[#DDD5CB]">
                <Package className="w-10 h-10 text-[#C0B4AA] mb-3" />
                <p className="text-[#5A4A3C] font-bold text-[14px]">Sin resultados</p>
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
                        {prod.imagen_url ? (
                          <img src={`/storage/${prod.imagen_url}`} alt={prod.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <Coffee className="w-6 h-6 text-[#C0B4AA] group-hover:text-[#C17B2A] transition-colors" />
                        )}
                        <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-[#1C0F05] shadow-sm border border-[#EDE8E1]">
                          Stock actual: {prod.stock_actual}
                        </div>
                      </div>
                      <h3 className="font-bold text-[#1C0F05] text-[12.5px] leading-tight line-clamp-2 mb-1">
                        {prod.nombre}
                      </h3>
                      <div className="mt-auto pt-2 flex items-end justify-between border-t border-[#F0EBE4] w-full">
                        <span className="text-[9.5px] font-bold tracking-wider text-[#9A8E82] uppercase">
                          Costo Base
                        </span>
                        <span className="font-black text-[14.5px] text-[#C17B2A] leading-none">
                          {sol(prod.precio_compra)}
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

        {/* ════════ ZONA DERECHA: CARRITO DE COMPRAS ════════ */}
        <div className="w-full xl:w-[380px] flex flex-col shrink-0">
          <div className="bg-white rounded-xl border border-[#EDE8E1] shadow-sm flex flex-col h-[calc(100vh-120px)] sticky top-4 overflow-hidden">
            
            <div className="px-4 py-3 bg-[#FDFAF7] border-b border-[#EDE8E1] flex items-center justify-between shrink-0">
              <h2 className="text-[14px] font-black text-[#1C0F05] flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#C17B2A]" /> Ingreso a Almacén
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar bg-white">
              {p.carrito.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-[#B5A99E] gap-2 opacity-80">
                  <div className="w-12 h-12 rounded-full bg-[#FDFAF7] flex items-center justify-center border border-[#EDE8E1]">
                    <Package className="w-5 h-5 text-[#C0B4AA]" />
                  </div>
                  <p className="text-[12.5px] font-bold text-[#9A8E82]">Lista de compra vacía</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {p.carrito.map((item) => (
                    <div key={item.id} className="bg-[#FDFAF7] p-3 rounded-xl border border-[#EDE8E1] flex flex-col gap-2 group">
                      
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-[12.5px] font-bold text-[#1C0F05] leading-tight flex-1">{item.nombre}</p>
                        <button onClick={() => p.quitarDelCarrito(item.id)} className="text-[#C0B4AA] hover:text-[#8B2020] transition-colors shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 justify-between">
                        {/* Selector de Cantidad */}
                        <div className="flex flex-col gap-1 w-[40%]">
                          <span className="text-[9px] font-bold text-[#9A8E82] uppercase">Cantidad</span>
                          <div className="flex items-center bg-white rounded-md p-0.5 border border-[#EDE8E1] shadow-sm">
                            <button onClick={() => p.modificarCantidad(item.id, item.cantidadComprada - 1)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#F7F5F2] text-[#7A6E65] transition-colors">
                              <Minus className="w-3 h-3 font-bold" />
                            </button>
                            <input 
                              type="number" 
                              min="1" 
                              value={item.cantidadComprada} 
                              onChange={(e) => p.modificarCantidad(item.id, Number(e.target.value))}
                              className="w-full text-center text-[11.5px] font-bold text-[#1C0F05] outline-none"
                            />
                            <button onClick={() => p.modificarCantidad(item.id, item.cantidadComprada + 1)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#F7F5F2] text-[#7A6E65] transition-colors">
                              <Plus className="w-3 h-3 font-bold" />
                            </button>
                          </div>
                        </div>

                        {/* Editor de Costo (Crucial en Compras) */}
                        <div className="flex flex-col gap-1 w-[55%]">
                          <span className="text-[9px] font-bold text-[#9A8E82] uppercase text-right">Costo Unitario (S/)</span>
                          <input 
                            type="number" 
                            step="0.01" 
                            min="0"
                            value={item.costo_negociado} 
                            onChange={(e) => p.modificarCosto(item.id, Number(e.target.value))}
                            className="w-full text-right bg-white border border-[#EDE8E1] rounded-md px-2 py-1 text-[12px] font-black text-[#C17B2A] outline-none focus:border-[#C17B2A] shadow-sm"
                          />
                        </div>
                      </div>

                      <div className="pt-1 border-t border-[#EDE8E1] text-right">
                        <span className="text-[13.5px] font-black text-[#0D7A3E]">
                          Total: {sol(item.costo_negociado * item.cantidadComprada)}
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
                  <span>Subtotal Inversión</span>
                  <span>{sol(p.totales.subtotal)}</span>
                </div>
                {p.formularioCompra.tipo_comprobante === "Factura" && (
                  <div className="flex justify-between text-[11.5px] font-semibold">
                    <span>IGV (18%)</span>
                    <span>{sol(p.totales.igv)}</span>
                  </div>
                )}
                <div className="w-full h-px bg-[#EDE8E1] my-2" />
                <div className="flex justify-between items-center pt-0.5">
                  <span className="text-[12.5px] font-black text-[#1C0F05] uppercase tracking-wide">Total Compra</span>
                  <span className="text-2xl font-black text-[#0D7A3E] tracking-tighter">
                    {sol(p.totales.total)}
                  </span>
                </div>
              </div>
              <div className="px-4 pb-4">
                <button
                  onClick={() => setShowCheckoutModal(true)}
                  disabled={p.carrito.length === 0}
                  className="w-full bg-[#1C0F05] hover:bg-[#3D1F0A] text-white font-black text-[13px] py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-sm"
                >
                  REGISTRAR INGRESO
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════ MODAL DE CONFIRMACIÓN DE COMPRA ════════ */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C0F05]/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
          
          {p.showProveedorDropdown && (
            <div className="fixed inset-0 z-40" onClick={() => p.setShowProveedorDropdown(false)} />
          )}

          <div className="bg-white rounded-[1.5rem] shadow-2xl max-w-[600px] w-full flex flex-col max-h-full overflow-visible animate-in zoom-in-95 duration-300 border border-[#EDE8E1] z-50">
            
            <div className="px-6 py-4 border-b border-[#EDE8E1] flex items-center justify-between bg-white sticky top-0 z-10 rounded-t-[1.5rem]">
              <h2 className="text-[16px] font-black text-[#1C0F05] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C17B2A]" />
                Registrar Documento de Compra
              </h2>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#F7F5F2] hover:bg-[#EDE8E1] text-[#7A6E65] hover:text-[#1C0F05] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar space-y-5">
              
              <div className="flex flex-col items-center justify-center bg-[#FDFAF7] border border-[#F0D9B5]/50 rounded-2xl py-5 px-4 shadow-sm">
                <p className="text-[10px] font-bold text-[#C17B2A] uppercase tracking-[0.2em] mb-1">Total del Documento</p>
                <p className="text-4xl font-black text-[#0D7A3E] tracking-tighter">{sol(p.totales.total)}</p>
              </div>

              {/* Buscador Inteligente de Proveedores */}
              <div className="bg-white border border-[#EDE8E1] rounded-2xl p-4 shadow-sm space-y-3 relative z-30">
                <FieldLabel required>Proveedor (Emisor del comprobante)</FieldLabel>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#B5A99E]" />
                  <input
                    type="text"
                    placeholder="Buscar por Razón Social o RUC..."
                    className={`${inputBase} pl-9`}
                    value={p.proveedorSearch}
                    onChange={(e) => {
                      p.setProveedorSearch(e.target.value);
                      p.setShowProveedorDropdown(true);
                      p.setFormularioCompra(prev => ({ ...prev, supplier_id: "" })); 
                    }}
                    onFocus={() => p.setShowProveedorDropdown(true)}
                  />
                  
                  {p.showProveedorDropdown && p.proveedoresFiltrados.length > 0 && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-white border border-[#EDE8E1] rounded-xl shadow-xl max-h-48 overflow-y-auto z-50 custom-scrollbar">
                      {p.proveedoresFiltrados.map(prov => (
                        <button
                          key={prov.id}
                          type="button"
                          onClick={() => {
                            p.setFormularioCompra(prev => ({ ...prev, supplier_id: prov.id.toString() }));
                            p.setProveedorSearch(prov.razon_social);
                            p.setShowProveedorDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-[#FDFAF7] hover:text-[#C17B2A] border-b border-[#EDE8E1] last:border-0 transition-colors flex justify-between items-center"
                        >
                          <span className="text-[12.5px] font-bold text-[#1C0F05]">{prov.razon_social}</span>
                          {prov.numero_documento && <span className="text-[#9A8E82] font-mono text-[10px]">{prov.numero_documento}</span>}
                        </button>
                      ))}
                    </div>
                  )}
                  {p.showProveedorDropdown && p.proveedorSearch && p.proveedoresFiltrados.length === 0 && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-white border border-[#EDE8E1] rounded-xl shadow-xl px-4 py-3 text-center z-50">
                      <p className="text-[12px] font-semibold text-[#7A6E65]">Proveedor no encontrado.</p>
                      <p className="text-[10px] text-[#9A8E82]">Regístrelo en el módulo correspondiente.</p>
                    </div>
                  )}
                </div>

                {p.formularioCompra.supplier_id && (
                  <div className="mt-2 px-3 py-2 bg-[#EDFBF3] border border-[#9FE1CB] rounded-xl text-[11.5px] font-bold text-[#0D7A3E] flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>Proveedor verificado.</span>
                  </div>
                )}
              </div>

              {/* Datos del Comprobante Físico */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <FieldLabel required>Tipo de Comprobante</FieldLabel>
                  <select
                    className={inputBase + " cursor-pointer font-semibold"}
                    value={p.formularioCompra.tipo_comprobante}
                    onChange={(e) => p.setFormularioCompra({ ...p.formularioCompra, tipo_comprobante: e.target.value })}
                  >
                    <option value="Factura">Factura (Graba IGV)</option>
                    <option value="Boleta">Boleta</option>
                    <option value="Guía de Remisión">Guía de Remisión</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <FieldLabel required>Fecha de Emisión</FieldLabel>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#B5A99E]" />
                    <input
                      type="date"
                      className={`${inputBase} pl-9`}
                      value={p.formularioCompra.fecha_emision}
                      onChange={(e) => p.setFormularioCompra({ ...p.formularioCompra, fecha_emision: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <FieldLabel hint="Ej. F001">Serie</FieldLabel>
                  <input
                    type="text"
                    placeholder="Serie"
                    className={`${inputBase} uppercase`}
                    value={p.formularioCompra.serie}
                    onChange={(e) => p.setFormularioCompra({ ...p.formularioCompra, serie: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <FieldLabel required>Número de Documento</FieldLabel>
                  <input
                    type="text"
                    placeholder="000123"
                    className={inputBase}
                    value={p.formularioCompra.numero}
                    onChange={(e) => p.setFormularioCompra({ ...p.formularioCompra, numero: e.target.value })}
                  />
                </div>
              </div>
              
            </div>

            <div className="px-6 py-4 bg-[#FDFAF7] border-t border-[#EDE8E1] flex gap-3 sticky bottom-0 z-10 rounded-b-[1.5rem]">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-white border border-[#EDE8E1] text-[#5A4A3C] font-bold text-[12.5px] hover:bg-[#F7F5F2] hover:text-[#1C0F05] transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={p.procesarCompra}
                disabled={p.procesando}
                className="flex-[2] bg-[#1C0F05] hover:bg-[#3D1F0A] text-white font-black text-[12.5px] py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 shadow-sm"
              >
                {p.procesando ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> PROCESANDO...</>
                ) : (
                  <><CheckCircle className="w-4 h-4" /> GUARDAR COMPRA Y STOCK</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};