import React from "react";
import { DashboardLayout } from "../dashboard/DashboardLayout";
import { useEnvios } from "./useEnvios";
import {
  Plus, Edit, Trash2, Search, X, Save, RefreshCw, ChevronLeft, ChevronRight,
  Package, Truck, MapPin, DollarSign, Calendar, Activity, Info
} from "lucide-react";

// ─── Sub-componentes de UI ────────────────────────────────────────────────────

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

const inputError = "border-red-300 focus:border-red-500 focus:ring-red-500/15";

// ─── Vista principal ──────────────────────────────────────────────────────────

export const EnviosView = () => {
  const pe = useEnvios();

  const sol = (n: number) => new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(n);

  const Paginador = () => {
    if (pe.totalPaginas <= 1) return null;
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => pe.setPagina((p) => Math.max(1, p - 1))}
          disabled={pe.paginaAjustada === 1}
          className="w-7 h-7 rounded-md bg-white border border-[#EDE8E1] flex items-center justify-center text-[#7A6E65] hover:bg-[#F7F5F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {Array.from({ length: pe.totalPaginas }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => pe.setPagina(n)}
            className={`w-7 h-7 rounded-md text-[11.5px] font-bold transition-all ${
              pe.paginaAjustada === n
                ? "bg-[#C17B2A] text-white border border-[#C17B2A]"
                : "bg-white text-[#5A4A3C] border border-[#EDE8E1] hover:bg-[#F7F5F2]"
            }`}
          >
            {n}
          </button>
        ))}

        <button
          onClick={() => pe.setPagina((p) => Math.min(pe.totalPaginas, p + 1))}
          disabled={pe.paginaAjustada === pe.totalPaginas}
          className="w-7 h-7 rounded-md bg-white border border-[#EDE8E1] flex items-center justify-center text-[#7A6E65] hover:bg-[#F7F5F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 pb-12">

        {/* ── Page header ── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[20px] font-black text-[#1C0F05] tracking-tight leading-tight">
              Gestión de Envíos
            </h1>
            <p className="text-[12.5px] text-[#8B7D72] mt-1">
              Controla los despachos, su trazabilidad y costos logísticos.
            </p>
          </div>
          <button
            onClick={pe.abrirModalCrear}
            className="inline-flex items-center gap-2 bg-[#C17B2A] hover:bg-[#A86522] text-white text-[12.5px] font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm shadow-[#C17B2A]/20"
          >
            <Plus className="w-3.5 h-3.5" />
            Registrar Envío
          </button>
        </div>

        {/* ── KPIs ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              icon: <Package className="w-5 h-5 text-[#C17B2A]" />,
              iconBg: "bg-[#FDF3E7]",
              value: pe.totalEnvios,
              label: "Envíos Registrados",
            },
            {
              icon: <Activity className="w-5 h-5 text-[#0D7A3E]" />,
              iconBg: "bg-[#EDFBF3]",
              value: pe.enviosEnTransito,
              label: "En Tránsito / Preparación",
            },
            {
              icon: <DollarSign className="w-5 h-5 text-[#1A5FA0]" />,
              iconBg: "bg-[#E6F1FB]",
              value: sol(pe.costoTotal),
              label: "Costo Total Logístico",
            },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="bg-white rounded-xl border border-[#EDE8E1] p-4 flex items-center gap-3.5"
            >
              <div className={`w-10 h-10 rounded-lg ${kpi.iconBg} flex items-center justify-center shrink-0`}>
                {kpi.icon}
              </div>
              <div>
                <p className="text-[22px] font-black text-[#1C0F05] leading-none">{kpi.value}</p>
                <p className="text-[11px] text-[#9A8E82] mt-1 font-medium">{kpi.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filtros ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-white border border-[#EDE8E1] rounded-lg px-3 py-2 focus-within:border-[#C17B2A] focus-within:ring-2 focus-within:ring-[#C17B2A]/15 transition-all w-full">
            <Search className="w-3.5 h-3.5 text-[#B5A99E] shrink-0" />
            <input
              type="text"
              placeholder="Buscar por seguimiento, dirección o estado..."
              value={pe.busqueda}
              onChange={(e) => pe.setBusqueda(e.target.value)}
              className="flex-1 bg-transparent text-[12.5px] text-[#1C0F05] placeholder:text-[#C0B4AA] outline-none"
            />
            {pe.busqueda && (
              <button onClick={() => pe.setBusqueda("")} className="text-[#B5A99E] hover:text-[#5A4A3C] transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex bg-[#EDE8E1] rounded-lg p-1 gap-1 shrink-0">
            {(["activos", "inactivos"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => pe.setFiltroEstado(tab)}
                className={`px-4 py-1.5 rounded-md text-[11.5px] font-semibold transition-all ${
                  pe.filtroEstado === tab
                    ? "bg-white text-[#1C0F05] shadow-sm"
                    : "text-[#8B7D72] hover:text-[#4A3728]"
                }`}
              >
                {tab === "activos" ? "Activos" : "Anulados"}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tabla (CON SCROLL INTERNO) ── */}
        <div className="bg-white rounded-xl border border-[#EDE8E1] shadow-sm flex flex-col overflow-hidden">
          
          <div className="overflow-auto max-h-[300px]">
            <table className="w-full text-[12.5px] text-left relative">
              <thead className="sticky top-0 z-10 shadow-[0_1px_0_#EDE8E1]">
                <tr>
                  <th className="px-5 py-3 font-bold text-[10px] uppercase tracking-[0.8px] text-[#A8978B] bg-[#FDFAF7]">Detalle de Envío</th>
                  <th className="px-5 py-3 font-bold text-[10px] uppercase tracking-[0.8px] text-[#A8978B] bg-[#FDFAF7]">Agencia / Tipo</th>
                  <th className="px-5 py-3 font-bold text-[10px] uppercase tracking-[0.8px] text-[#A8978B] bg-[#FDFAF7]">Destino</th>
                  <th className="px-5 py-3 text-center font-bold text-[10px] uppercase tracking-[0.8px] text-[#A8978B] bg-[#FDFAF7]">Estado / Progreso</th>
                  <th className="px-5 py-3 text-right font-bold text-[10px] uppercase tracking-[0.8px] text-[#A8978B] bg-[#FDFAF7]">Acciones</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-[#F5F0EB]">
                {pe.cargando ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-5 py-3.5"><div className="h-3.5 bg-[#F0EBE4] rounded w-3/4 mb-1.5" /><div className="h-3 bg-[#F0EBE4] rounded w-1/2" /></td>
                      <td className="px-5 py-3.5"><div className="h-4 bg-[#F0EBE4] rounded w-20 mb-1.5" /><div className="h-3 bg-[#F0EBE4] rounded w-14" /></td>
                      <td className="px-5 py-3.5"><div className="h-4 bg-[#F0EBE4] rounded w-full" /></td>
                      <td className="px-5 py-3.5"><div className="h-5 bg-[#F0EBE4] rounded-full w-20 mx-auto" /></td>
                      <td className="px-5 py-3.5"><div className="h-7 bg-[#F0EBE4] rounded w-14 ml-auto" /></td>
                    </tr>
                  ))
                ) : pe.enviosPaginados.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-[#9A8E82] text-sm">
                      {pe.busqueda
                        ? `Sin resultados para "${pe.busqueda}".`
                        : `No hay envíos ${pe.filtroEstado}.`}
                    </td>
                  </tr>
                ) : (
                  pe.enviosPaginados.map((envio) => (
                    <tr key={envio.id} className="group hover:bg-[#FDFAF7] transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-semibold text-[#1C0F05]">
                          Venta #{envio.sale_id}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5 text-[#9A8E82]">
                          <Info className="w-3 h-3" />
                          <span className="text-[11px]">Track: <span className="font-mono text-[#C17B2A]">{envio.numero_seguimiento || 'Sin asignar'}</span></span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-[#B5A99E]" />
                          <span className="text-[11.5px] text-[#5A4A3C] font-semibold">{envio.carrier?.nombre || `Transportista #${envio.carrier_id}`}</span>
                        </div>
                        <p className="text-[10px] text-[#C0B4AA] uppercase mt-0.5 ml-5">{envio.tipo_envio}</p>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-start gap-1.5 text-[11.5px] text-[#5A4A3C]">
                          <MapPin className="w-3.5 h-3.5 text-[#B5A99E] shrink-0 mt-0.5" />
                          <span className="line-clamp-2 max-w-[200px]">{envio.direccion_destino}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                            !envio.estado ? "bg-[#FCEBEB] text-[#8B2020] border border-[#F7C1C1]" :
                            envio.estado_actual.toLowerCase() === 'entregado' ? "bg-[#EDFBF3] text-[#0D6E3F] border border-[#9FE1CB]" :
                            envio.estado_actual.toLowerCase() === 'preparando' ? "bg-[#FDF3E7] text-[#C17B2A] border border-[#F0D9B5]" :
                            "bg-[#E6F1FB] text-[#1A5FA0] border border-[#B8D5F0]"
                          }`}
                        >
                          {!envio.estado ? "Anulado" : envio.estado_actual}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                          {envio.estado ? (
                            <>
                              <button
                                onClick={() => pe.abrirModalEditar(envio)}
                                className="w-7 h-7 rounded-md flex items-center justify-center text-[#9A8E82] border border-transparent hover:text-[#1C0F05] hover:bg-[#F7F5F2] hover:border-[#EDE8E1] transition-all"
                                title="Editar"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => pe.handleDesactivar(envio.id, envio.numero_seguimiento)}
                                className="w-7 h-7 rounded-md flex items-center justify-center text-[#9A8E82] border border-transparent hover:text-red-600 hover:bg-[#FCEBEB] hover:border-[#F7C1C1] transition-all"
                                title="Anular envío"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => pe.handleReactivar(envio.id)}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold text-[#8B5A1A] bg-[#FDF3E7] border border-[#F0D9B5] rounded-lg hover:bg-[#F5E4C6] transition-colors"
                            >
                              <RefreshCw className="w-3 h-3" /> Reactivar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer de tabla (Paginador) */}
          <div className="px-5 py-2.5 bg-[#FDFAF7] border-t border-[#EDE8E1] flex items-center justify-between shrink-0">
            <span className="text-[11px] text-[#9A8E82]">
              {pe.enviosFiltrados?.length ?? 0} envío
              {(pe.enviosFiltrados?.length ?? 0) !== 1 ? "s" : ""}
            </span>
            <Paginador />
          </div>
        </div>
      </div>


      {/* ════════════════════════════════════════════════════════════════════
          MODAL
      ════════════════════════════════════════════════════════════════════ */}
      {pe.isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-[#1C0F05]/55 backdrop-blur-sm"
            onClick={pe.cerrarModal}
          />

          <div className="relative bg-white w-full max-w-[650px] mx-0 sm:mx-4 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[88vh] border border-[#EDE8E1]">
            <div className="sm:hidden w-9 h-1 bg-[#DDD5CB] rounded-full mx-auto mt-3 mb-1 shrink-0" />

            <div className="shrink-0 flex items-start justify-between px-5 py-4 border-b border-[#F0EBE4]">
              <div>
                <h2 className="text-[15px] font-black text-[#1C0F05]">
                  {pe.envioAEditar ? "Actualizar Envío" : "Nuevo Envío"}
                </h2>
                <p className="text-[11px] text-[#9A8E82] mt-0.5">
                  {pe.envioAEditar
                    ? "Modifica el estado y trazabilidad del paquete."
                    : "Vincula una venta con su agencia de transportes correspondiente."}
                </p>
              </div>
              <button
                onClick={pe.cerrarModal}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#7A6E65] hover:text-[#1C0F05] hover:bg-[#F7F5F2] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form
              id="envioForm"
              onSubmit={pe.handleSubmit}
              className="flex-1 overflow-y-auto px-5 py-5 space-y-6"
            >
              {/* Sección 1: Venta y Agencia */}
              <section>
                <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-[#F0EBE4]">
                  <Truck className="w-3.5 h-3.5 text-[#C17B2A]" />
                  <h3 className="text-[10px] font-black uppercase tracking-[1px] text-[#9A8E82]">
                    Origen del Envío
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required hint="ID Numérico">ID de Venta</FieldLabel>
                    <input
                      type="number"
                      value={pe.formData.sale_id}
                      onChange={(e) => pe.handleChange("sale_id", e.target.value)}
                      placeholder="Ej. 1042"
                      className={`${inputBase} ${pe.errores.sale_id ? inputError : ""}`}
                    />
                    {pe.errores.sale_id && <p className="text-red-500 text-[10.5px] mt-1 font-medium">{pe.errores.sale_id}</p>}
                  </div>

                  <div>
                    <FieldLabel required>Agencia / Transportista</FieldLabel>
                    <select
                      value={pe.formData.carrier_id}
                      onChange={(e) => pe.handleChange("carrier_id", e.target.value)}
                      className={`${inputBase} cursor-pointer ${pe.errores.carrier_id ? inputError : ""}`}
                    >
                      <option value="">Selecciona un transportista...</option>
                      {pe.transportistas.map(t => (
                        <option key={t.id} value={t.id}>{t.nombre}</option>
                      ))}
                    </select>
                    {pe.errores.carrier_id && <p className="text-red-500 text-[10.5px] mt-1 font-medium">{pe.errores.carrier_id}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <FieldLabel required>Tipo de Envío</FieldLabel>
                    <select
                      value={pe.formData.tipo_envio}
                      onChange={(e) => pe.handleChange("tipo_envio", e.target.value)}
                      className={`${inputBase} cursor-pointer ${pe.errores.tipo_envio ? inputError : ""}`}
                    >
                      <option value="bus">Agencia de Bus</option>
                      <option value="shalom">Shalom</option>
                      <option value="olva">Olva Courier</option>
                      <option value="motorizado">Motorizado Local</option>
                    </select>
                    {pe.errores.tipo_envio && <p className="text-red-500 text-[10.5px] mt-1 font-medium">{pe.errores.tipo_envio}</p>}
                  </div>
                  <div>
                    <FieldLabel required>Costo de Envío (S/)</FieldLabel>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-[#C0B4AA] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={pe.formData.costo_envio}
                        onChange={(e) => pe.handleChange("costo_envio", e.target.value)}
                        placeholder="0.00"
                        className={`${inputBase} pl-9 ${pe.errores.costo_envio ? inputError : ""}`}
                      />
                    </div>
                    {pe.errores.costo_envio && <p className="text-red-500 text-[10.5px] mt-1 font-medium">{pe.errores.costo_envio}</p>}
                  </div>
                </div>
              </section>

              {/* Sección 2: Trazabilidad y Destino */}
              <section>
                <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-[#F0EBE4]">
                  <MapPin className="w-3.5 h-3.5 text-[#C17B2A]" />
                  <h3 className="text-[10px] font-black uppercase tracking-[1px] text-[#9A8E82]">
                    Trazabilidad y Destino
                  </h3>
                </div>

                <div className="mb-4">
                  <FieldLabel required>Dirección de Destino</FieldLabel>
                  <input
                    type="text"
                    value={pe.formData.direccion_destino}
                    onChange={(e) => pe.handleChange("direccion_destino", e.target.value)}
                    placeholder="Dirección completa del cliente..."
                    className={`${inputBase} ${pe.errores.direccion_destino ? inputError : ""}`}
                  />
                  {pe.errores.direccion_destino && <p className="text-red-500 text-[10.5px] mt-1 font-medium">{pe.errores.direccion_destino}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel hint="Opcional">Número de Seguimiento (Track)</FieldLabel>
                    <input
                      type="text"
                      value={pe.formData.numero_seguimiento}
                      onChange={(e) => pe.handleChange("numero_seguimiento", e.target.value.toUpperCase())}
                      placeholder="Ej. SHAL-098234"
                      className={`${inputBase} font-mono ${pe.errores.numero_seguimiento ? inputError : ""}`}
                    />
                  </div>
                  <div>
                    <FieldLabel required>Estado Actual</FieldLabel>
                    <select
                      value={pe.formData.estado_actual}
                      onChange={(e) => pe.handleChange("estado_actual", e.target.value)}
                      className={`${inputBase} cursor-pointer font-bold ${
                        pe.formData.estado_actual === 'Preparando' ? 'text-[#C17B2A]' :
                        pe.formData.estado_actual === 'Entregado' ? 'text-[#0D6E3F]' : 'text-[#1A5FA0]'
                      }`}
                    >
                      <option value="Preparando">Preparando</option>
                      <option value="En Tránsito">En Tránsito</option>
                      <option value="En Agencia Destino">En Agencia Destino</option>
                      <option value="En Reparto">En Reparto</option>
                      <option value="Entregado">Entregado</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <FieldLabel hint="Opcional">Repartidor / Chofer</FieldLabel>
                    <input
                      type="text"
                      value={pe.formData.repartidor_nombre}
                      onChange={(e) => pe.handleChange("repartidor_nombre", e.target.value)}
                      placeholder="Nombre del encargado..."
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <FieldLabel hint="Opcional">Fecha Est. Llegada</FieldLabel>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-[#C0B4AA] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        value={pe.formData.fecha_estimada_llegada}
                        onChange={(e) => pe.handleChange("fecha_estimada_llegada", e.target.value)}
                        className={`${inputBase} pl-9`}
                      />
                    </div>
                  </div>
                </div>
              </section>

            </form>

            <div className="shrink-0 flex items-center gap-2.5 px-5 py-4 border-t border-[#F0EBE4] bg-white rounded-b-2xl">
              <button
                type="button"
                onClick={pe.cerrarModal}
                className="flex-1 py-2.5 rounded-lg text-[12.5px] font-semibold text-[#5A4A3C] bg-[#F7F5F2] border border-[#EDE8E1] hover:bg-[#EDE8E1] transition-colors"
              >
                Cancelar
              </button>
              <button
                form="envioForm"
                type="submit"
                disabled={pe.guardando}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12.5px] font-semibold text-white bg-[#C17B2A] hover:bg-[#A86522] disabled:opacity-60 active:scale-[0.98] transition-all shadow-sm shadow-[#C17B2A]/25"
              >
                {pe.guardando ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Guardando…
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    {pe.envioAEditar ? "Actualizar estado" : "Registrar envío"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};