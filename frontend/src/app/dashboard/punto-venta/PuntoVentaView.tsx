import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../dashboard/DashboardLayout";
import { usePuntoVenta } from "./usePuntoVenta";
import {
  ShoppingCart, Search, Package, Plus, Minus, Trash2,
  User, FileText, CreditCard, CheckCircle, Coffee,
  ChevronLeft, ChevronRight, Filter, X, Truck
} from "lucide-react";
import { TicketVenta } from "./TicketVenta";
import api from "../../../lib/api";

const BASE = api.defaults.baseURL?.replace("/api", "") ?? "";
const sol = (n: number) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(n);

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
      <div className="flex flex-col xl:flex-row gap-4 pb-4 min-h-[calc(100vh-80px)]">
        {/* ZONA IZQUIERDA: CATÁLOGO */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Banner Compacto */}
          <div className="relative bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 rounded-2xl p-4 text-white overflow-hidden shadow-md shadow-amber-900/10">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 40%, rgba(255,255,255,0.3) 2px, transparent 2px),
                                  radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 1.5px, transparent 1.5px)`,
                backgroundSize: "80px 80px, 120px 120px",
              }}
            />
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-2 z-10">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md border border-white/20 shadow-sm">
                    <Coffee className="w-5 h-5 text-amber-100" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none">
                    Punto de Venta
                  </h1>
                </div>
                <p className="text-amber-100/90 text-[13px] font-medium ml-1 mt-1">
                  Seleccione los productos para armar la orden.
                </p>
              </div>
            </div>
          </div>

          {/* Barra de Filtros */}
          <div className="flex flex-col sm:flex-row gap-2 bg-white p-1.5 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex-1 relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-amber-700 transition-colors" />
              <input
                type="text"
                placeholder="Buscar producto por nombre o SKU..."
                value={p.busqueda}
                onChange={(e) => p.setBusqueda(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-transparent text-sm font-medium text-stone-800 outline-none placeholder:text-stone-400"
              />
            </div>
            <div className="w-px bg-stone-200 hidden sm:block my-1" />
            <div className="relative flex items-center px-1">
              <Filter className="w-3.5 h-3.5 text-stone-400 mr-1.5" />
              <select
                value={p.categoriaFiltro}
                onChange={(e) => p.setCategoriaFiltro(e.target.value)}
                className="bg-transparent py-1.5 pr-6 text-sm font-bold text-stone-700 outline-none cursor-pointer appearance-none"
              >
                <option value="">Todo el catálogo</option>
                {p.categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nombre_categoria}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid de productos */}
          <div className="flex-1 relative">
            {p.cargando ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-2xl z-10">
                <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-700 rounded-full animate-spin mb-3" />
                <p className="text-stone-500 font-bold text-sm">Cargando...</p>
              </div>
            ) : p.productosPaginados.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-10 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
                <Package className="w-10 h-10 text-stone-300 mb-2" />
                <p className="text-stone-500 font-bold text-sm">Sin coincidencias</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-3 auto-rows-max">
                  {p.productosPaginados.map((prod) => (
                    <button
                      key={prod.id}
                      onClick={() => p.agregarAlCarrito(prod)}
                      className="group flex flex-col bg-white rounded-2xl p-2.5 border border-stone-200 hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-left"
                    >
                      <div className="w-full aspect-[4/3] rounded-xl bg-stone-50 mb-2 overflow-hidden flex items-center justify-center relative border border-stone-100">
                        {prod.imagen_url ? (
                          <img
                            src={BASE + prod.imagen_url}
                            alt={prod.nombre}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <Coffee className="w-6 h-6 text-stone-300 group-hover:text-amber-300 transition-colors" />
                        )}
                        <div className="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-bold text-stone-700 shadow-sm border border-stone-200">
                          Stock: {prod.stock_actual}
                        </div>
                      </div>
                      <h3 className="font-bold text-stone-800 text-[13px] leading-tight line-clamp-2 mb-1">
                        {prod.nombre}
                      </h3>
                      <div className="mt-auto flex items-end justify-between border-t border-stone-100 pt-1.5">
                        <span className="text-[9px] font-bold tracking-wider text-stone-400 uppercase">
                          {p.formularioVenta.tipo_venta === "minorista" ? "Minorista" : "Mayorista"}
                        </span>
                        <span className="font-black text-[15px] text-amber-700 leading-none">
                          {sol(p.formularioVenta.tipo_venta === "minorista" ? prod.precio_minorista : prod.precio_mayorista)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                {p.totalPaginas > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <button
                      onClick={() => p.setPagina((pg) => Math.max(1, pg - 1))}
                      disabled={p.pagina === 1}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-stone-200 text-stone-600 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 disabled:opacity-40 disabled:hover:border-stone-200 transition-all shadow-sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-stone-500">
                      {p.pagina} de {p.totalPaginas}
                    </span>
                    <button
                      onClick={() => p.setPagina((pg) => Math.min(p.totalPaginas, pg + 1))}
                      disabled={p.pagina === p.totalPaginas}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-stone-200 text-stone-600 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 disabled:opacity-40 disabled:hover:border-stone-200 transition-all shadow-sm"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ZONA DERECHA: CARRITO */}
        <div className="w-full xl:w-[380px] flex flex-col gap-3">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm flex flex-col h-[calc(100vh-100px)] sticky top-4 overflow-hidden">
            <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between shrink-0">
              <h2 className="text-sm font-black text-stone-800 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-amber-700" /> Orden en curso
              </h2>
              <select
                value={p.formularioVenta.tipo_venta}
                onChange={(e) => p.setFormularioVenta({ ...p.formularioVenta, tipo_venta: e.target.value })}
                className="text-[11px] bg-white border border-stone-200 text-stone-600 font-bold px-2 py-1 rounded-lg outline-none cursor-pointer hover:border-amber-400 transition-colors shadow-sm"
              >
                <option value="minorista">P. Minorista</option>
                <option value="mayorista">P. Mayorista</option>
              </select>
            </div>

            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar bg-white">
              {p.carrito.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-stone-400 gap-2 opacity-60">
                  <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center border border-stone-200">
                    <ShoppingCart className="w-5 h-5 text-stone-300" />
                  </div>
                  <p className="text-xs font-bold">Carrito vacío</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {p.carrito.map((item) => (
                    <div key={item.id} className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 flex gap-2 group relative">
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-stone-800 truncate leading-tight">{item.nombre}</p>
                        <p className="text-[10px] font-medium text-stone-500 mt-0.5">
                          PU: {sol(p.formularioVenta.tipo_venta === "minorista" ? item.precio_minorista : item.precio_mayorista)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between shrink-0">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-white rounded-lg p-0.5 border border-stone-200 shadow-sm">
                            <button onClick={() => p.modificarCantidad(item.id, item.cantidadVenta - 1)} className="w-5 h-5 flex items-center justify-center rounded hover:bg-stone-100 text-stone-500 transition-colors">
                              <Minus className="w-3 h-3 font-bold" />
                            </button>
                            <span className="w-6 text-center text-[11px] font-bold text-stone-800">{item.cantidadVenta}</span>
                            <button onClick={() => p.modificarCantidad(item.id, item.cantidadVenta + 1)} className="w-5 h-5 flex items-center justify-center rounded hover:bg-stone-100 text-stone-500 transition-colors">
                              <Plus className="w-3 h-3 font-bold" />
                            </button>
                          </div>
                          <button onClick={() => p.quitarDelCarrito(item.id)} className="text-stone-300 hover:text-red-500 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[13px] font-black text-stone-800 mt-1.5">
                          {sol((p.formularioVenta.tipo_venta === "minorista" ? item.precio_minorista : item.precio_mayorista) * item.cantidadVenta)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="shrink-0 bg-stone-50 border-t border-stone-200 relative z-20 rounded-b-2xl">
              <div className="p-4 space-y-1.5 text-stone-600">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span>Base Imponible</span>
                  <span>{sol(p.totales.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[11px] font-semibold">
                  <span>IGV (18%)</span>
                  <span>{sol(p.totales.igvTotal)}</span>
                </div>
                {p.formEnvio.requiere_envio && (
                  <div className="flex justify-between text-[11px] font-semibold text-amber-700">
                    <span>Envío</span>
                    <span>{sol(p.totales.costoEnvio)}</span>
                  </div>
                )}
                <div className="w-full h-px bg-stone-200 my-1.5" />
                <div className="flex justify-between items-center pt-0.5">
                  <span className="text-xs font-black text-stone-800 uppercase tracking-wide">Total a pagar</span>
                  <span className="text-2xl font-black text-amber-700 tracking-tighter">
                    {sol(p.formEnvio.requiere_envio ? p.totales.totalConEnvio : p.totales.total)}
                  </span>
                </div>
              </div>
              <div className="px-4 pb-4">
                <button
                  onClick={() => setShowCheckoutModal(true)}
                  disabled={p.carrito.length === 0}
                  className="w-full bg-amber-700 hover:bg-amber-800 text-white font-black text-sm py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-sm shadow-amber-700/20"
                >
                  PROCEDER AL PAGO
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE COBRO (CHECKOUT) REDISEÑADO */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-xl w-full flex flex-col max-h-full overflow-hidden animate-in zoom-in-95 duration-300">
            
            {/* Header Sticky */}
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <h2 className="text-xl font-black text-stone-800 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-600" />
                Confirmar Venta
              </h2>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
              >
                <X className="w-4 h-4 font-bold" />
              </button>
            </div>

            {/* Body Scrollable */}
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
              
              {/* Bloque Total */}
              <div className="flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-white border border-amber-100/50 rounded-3xl py-6 px-4 shadow-sm">
                <p className="text-xs font-bold text-amber-700/80 uppercase tracking-[0.2em] mb-2">
                  {p.formEnvio.requiere_envio ? "Total + Envío" : "Monto a Cobrar"}
                </p>
                <p className="text-5xl font-black text-amber-900 tracking-tighter">
                  {sol(p.formEnvio.requiere_envio ? p.totales.totalConEnvio : p.totales.total)}
                </p>
                {p.formEnvio.requiere_envio && (
                  <div className="mt-3 flex items-center gap-2 text-xs font-bold text-amber-700/70 bg-amber-100/50 px-3 py-1.5 rounded-full">
                    <span>Venta: {sol(p.totales.total)}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>Envío: {sol(p.totales.costoEnvio)}</span>
                  </div>
                )}
              </div>

              {/* Documentos y Método de Pago */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-stone-500 uppercase flex items-center gap-1.5 ml-1">
                    <FileText className="w-3.5 h-3.5 text-stone-400" /> Comprobante
                  </label>
                  <select
                    className="w-full bg-stone-50 border border-stone-200 text-sm font-bold text-stone-700 rounded-2xl px-4 py-3 outline-none focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all cursor-pointer"
                    value={p.formularioVenta.tipo_comprobante}
                    onChange={(e) => p.handleCambioComprobante(e.target.value)}
                  >
                    <option value="Boleta">Boleta</option>
                    <option value="Factura">Factura</option>
                    <option value="Nota de Venta">Nota de Venta</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-stone-500 uppercase flex items-center gap-1.5 ml-1">
                    <CreditCard className="w-3.5 h-3.5 text-stone-400" /> Método de Pago
                  </label>
                  <select
                    className="w-full bg-stone-50 border border-stone-200 text-sm font-bold text-stone-700 rounded-2xl px-4 py-3 outline-none focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all cursor-pointer"
                    value={p.formularioVenta.metodo_pago}
                    onChange={(e) => p.setFormularioVenta({ ...p.formularioVenta, metodo_pago: e.target.value })}
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Yape">Yape</option>
                    <option value="Plin">Plin</option>
                    <option value="Tarjeta Visa/Mastercard">Tarjeta</option>
                    <option value="Transferencia">Transferencia</option>
                  </select>
                </div>
              </div>

              {/* Sección de Cliente */}
              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[12px] font-bold text-stone-600 uppercase flex items-center gap-1.5">
                    <User className="w-4 h-4 text-stone-400" /> Cliente
                    <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full lowercase tracking-normal">opcional</span>
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Buscar por DNI o RUC..."
                      maxLength={11}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-medium outline-none focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all"
                      value={p.formularioVenta.numero_documento}
                      onChange={(e) => p.setFormularioVenta({ ...p.formularioVenta, numero_documento: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && p.buscarCliente()}
                    />
                  </div>
                  <button
                    onClick={p.buscarCliente}
                    className="bg-stone-800 text-white px-5 py-2.5 rounded-xl hover:bg-stone-700 transition-colors text-sm font-bold shadow-sm flex items-center justify-center gap-2"
                  >
                    Buscar
                  </button>
                </div>
                {p.formularioVenta.nombre_cliente && (
                  <div className="mt-2 px-4 py-3 bg-emerald-50 border border-emerald-100/50 rounded-xl text-sm font-bold text-emerald-800 flex items-center gap-2 animate-in slide-in-from-top-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="truncate">{p.formularioVenta.nombre_cliente}</span>
                  </div>
                )}
              </div>

              {/* Sección de Envío Expandible */}
              <div className={`border rounded-2xl overflow-hidden shadow-sm transition-colors duration-300 ${p.formEnvio.requiere_envio ? 'border-amber-200' : 'border-stone-200'}`}>
                <div 
                  className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${p.formEnvio.requiere_envio ? 'bg-amber-50/50 border-b border-amber-100/50' : 'bg-stone-50 hover:bg-stone-100'}`}
                  onClick={p.toggleRequiereEnvio}
                >
                  <label className="text-[13px] font-bold text-stone-700 uppercase flex items-center gap-2 cursor-pointer">
                    <div className={`p-1.5 rounded-lg transition-colors ${p.formEnvio.requiere_envio ? 'bg-amber-200/50 text-amber-700' : 'bg-stone-200/50 text-stone-500'}`}>
                      <Truck className="w-4 h-4" />
                    </div>
                    Programar Envío a Domicilio
                  </label>
                  <button
                    type="button"
                    className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${
                      p.formEnvio.requiere_envio ? "bg-amber-600" : "bg-stone-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                        p.formEnvio.requiere_envio ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>

                {p.formEnvio.requiere_envio && (
                  <div className="p-5 space-y-4 bg-white animate-in slide-in-from-top-2 duration-300">
                    
                    {/* Tabs de tipo de envío */}
                    <div className="flex p-1 bg-stone-100 rounded-xl">
                      {["local", "interregional"].map((tipo) => (
                        <button
                          key={tipo}
                          type="button"
                          onClick={() => p.handleChangeEnvio("tipo_envio", tipo)}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                            p.formEnvio.tipo_envio === tipo
                              ? "bg-white text-amber-800 shadow-sm"
                              : "text-stone-500 hover:text-stone-700"
                          }`}
                        >
                          {tipo === "local" ? "Envío Local" : "Envío Interregional"}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-stone-500 block ml-1">Dirección de entrega <span className="text-red-400">*</span></label>
                      <input
                        type="text"
                        value={p.formEnvio.direccion_destino}
                        onChange={(e) => p.handleChangeEnvio("direccion_destino", e.target.value)}
                        className={`w-full bg-stone-50 border rounded-xl px-4 py-2.5 text-sm outline-none transition-all ${
                          p.erroresEnvio.direccion_destino ? "border-red-400 focus:ring-4 focus:ring-red-400/10" : "border-stone-200 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
                        }`}
                        placeholder="Ej. Av. Los Olivos 123, Bagua"
                      />
                      {p.erroresEnvio.direccion_destino && <p className="text-red-500 text-[11px] font-medium ml-1">{p.erroresEnvio.direccion_destino}</p>}
                    </div>

                    {p.formEnvio.tipo_envio === "interregional" && (
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-stone-500 block ml-1">Agencia de transporte <span className="text-red-400">*</span></label>
                        <select
                          value={p.formEnvio.agencia_transporte_id}
                          onChange={(e) => p.handleChangeEnvio("agencia_transporte_id", e.target.value)}
                          className={`w-full bg-stone-50 border rounded-xl px-4 py-2.5 text-sm outline-none transition-all cursor-pointer ${
                            p.erroresEnvio.agencia_transporte_id ? "border-red-400 focus:ring-4 focus:ring-red-400/10" : "border-stone-200 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
                          }`}
                        >
                          <option value="">Seleccione una agencia...</option>
                          {p.agencias.map((ag) => (
                            <option key={ag.id} value={ag.id}>{ag.nombre}</option>
                          ))}
                        </select>
                        {p.erroresEnvio.agencia_transporte_id && <p className="text-red-500 text-[11px] font-medium ml-1">{p.erroresEnvio.agencia_transporte_id}</p>}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-stone-500 block ml-1">Repartidor (opcional)</label>
                        <input
                          type="text"
                          value={p.formEnvio.repartidor_nombre}
                          onChange={(e) => p.handleChangeEnvio("repartidor_nombre", e.target.value)}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
                          placeholder="Nombre del mototaxista/conductor"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-stone-500 block ml-1">Fecha estimada</label>
                        <input
                          type="date"
                          value={p.formEnvio.fecha_estimada_llegada}
                          onChange={(e) => p.handleChangeEnvio("fecha_estimada_llegada", e.target.value)}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-stone-500 block ml-1">Costo de envío</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold">S/</span>
                        <input
                          type="number"
                          step="0.01"
                          value={p.formEnvio.costo_envio}
                          onChange={(e) => p.handleChangeEnvio("costo_envio", e.target.value)}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-bold outline-none transition-all focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>

            {/* Footer Sticky */}
            <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex gap-3 sticky bottom-0 z-10">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="flex-1 py-3 rounded-xl bg-white border border-stone-200 text-stone-600 font-bold text-sm hover:bg-stone-100 hover:text-stone-800 transition-all focus:ring-4 focus:ring-stone-200"
              >
                Cancelar
              </button>
              <button
                onClick={p.procesarVenta}
                disabled={p.procesando}
                className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-emerald-600/20 focus:ring-4 focus:ring-emerald-600/30"
              >
                {p.procesando ? (
                  <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> PROCESANDO PAGO...</>
                ) : (
                  <><CheckCircle className="w-5 h-5" /> CONFIRMAR VENTA</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal del Ticket */}
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