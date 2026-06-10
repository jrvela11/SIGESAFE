import React from "react";
import { DashboardLayout } from "../dashboard/DashboardLayout";
import { useProveedores } from "./useProveedores";
import {
  Plus, Edit, Trash2, Search, X, Save, Users, UserCheck, Phone,
  MapPin, RefreshCw, ChevronLeft, ChevronRight,
  CreditCard, Building2
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

export const ProveedoresView = () => {
  const pv = useProveedores();

  const Paginador = () => {
    if (pv.totalPaginas <= 1) return null;
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => pv.setPagina((p) => Math.max(1, p - 1))}
          disabled={pv.paginaAjustada === 1}
          className="w-7 h-7 rounded-md bg-white border border-[#EDE8E1] flex items-center justify-center text-[#7A6E65] hover:bg-[#F7F5F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {Array.from({ length: pv.totalPaginas }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => pv.setPagina(n)}
            className={`w-7 h-7 rounded-md text-[11.5px] font-bold transition-all ${
              pv.paginaAjustada === n
                ? "bg-[#C17B2A] text-white border border-[#C17B2A]"
                : "bg-white text-[#5A4A3C] border border-[#EDE8E1] hover:bg-[#F7F5F2]"
            }`}
          >
            {n}
          </button>
        ))}

        <button
          onClick={() => pv.setPagina((p) => Math.min(pv.totalPaginas, p + 1))}
          disabled={pv.paginaAjustada === pv.totalPaginas}
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
              Directorio de Proveedores
            </h1>
            <p className="text-[12.5px] text-[#8B7D72] mt-1">
              Administra los agricultores y empresas que te abastecen de materia prima.
            </p>
          </div>
          <button
            onClick={pv.abrirModalCrear}
            className="inline-flex items-center gap-2 bg-[#C17B2A] hover:bg-[#A86522] text-white text-[12.5px] font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm shadow-[#C17B2A]/20"
          >
            <Plus className="w-3.5 h-3.5" />
            Nuevo proveedor
          </button>
        </div>

        {/* ── KPIs ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              icon: <Users className="w-5 h-5 text-[#C17B2A]" />,
              iconBg: "bg-[#FDF3E7]",
              value: pv.totalProveedores,
              label: "Total registrados",
            },
            {
              icon: <UserCheck className="w-5 h-5 text-[#0D7A3E]" />,
              iconBg: "bg-[#EDFBF3]",
              value: pv.proveedoresActivos,
              label: "Proveedores activos",
            },
            {
              icon: <Phone className="w-5 h-5 text-[#1A5FA0]" />,
              iconBg: "bg-[#E6F1FB]",
              value: pv.proveedoresConTelefono,
              label: "Con teléfono registrado",
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
              placeholder="Buscar por razón social, documento o contacto..."
              value={pv.busqueda}
              onChange={(e) => pv.setBusqueda(e.target.value)}
              className="flex-1 bg-transparent text-[12.5px] text-[#1C0F05] placeholder:text-[#C0B4AA] outline-none"
            />
            {pv.busqueda && (
              <button onClick={() => pv.setBusqueda("")} className="text-[#B5A99E] hover:text-[#5A4A3C] transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex bg-[#EDE8E1] rounded-lg p-1 gap-1 shrink-0">
            {(["activos", "inactivos"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => pv.setFiltroEstado(tab)}
                className={`px-4 py-1.5 rounded-md text-[11.5px] font-semibold transition-all ${
                  pv.filtroEstado === tab
                    ? "bg-white text-[#1C0F05] shadow-sm"
                    : "text-[#8B7D72] hover:text-[#4A3728]"
                }`}
              >
                {tab === "activos" ? "Activos" : "Inactivos"}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tabla (CON SCROLL INTERNO) ── */}
        <div className="bg-white rounded-xl border border-[#EDE8E1] shadow-sm flex flex-col overflow-hidden">
          
          {/* Contenedor del scroll (Altura máxima de 300px) */}
          <div className="overflow-auto max-h-[300px]">
            <table className="w-full text-[12.5px] text-left relative">
              
              {/* Cabecera pegajosa (Sticky Header) */}
              <thead className="sticky top-0 z-10 shadow-[0_1px_0_#EDE8E1]">
                <tr>
                  <th className="px-5 py-3 font-bold text-[10px] uppercase tracking-[0.8px] text-[#A8978B] bg-[#FDFAF7]">Proveedor</th>
                  <th className="px-5 py-3 font-bold text-[10px] uppercase tracking-[0.8px] text-[#A8978B] bg-[#FDFAF7]">Documento</th>
                  <th className="px-5 py-3 font-bold text-[10px] uppercase tracking-[0.8px] text-[#A8978B] bg-[#FDFAF7]">Contacto / Región</th>
                  <th className="px-5 py-3 text-center font-bold text-[10px] uppercase tracking-[0.8px] text-[#A8978B] bg-[#FDFAF7]">Estado</th>
                  <th className="px-5 py-3 text-right font-bold text-[10px] uppercase tracking-[0.8px] text-[#A8978B] bg-[#FDFAF7]">Acciones</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-[#F5F0EB]">
                {pv.cargando ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-5 py-3.5">
                        <div className="h-3.5 bg-[#F0EBE4] rounded w-3/4 mb-1.5" />
                        <div className="h-3 bg-[#F0EBE4] rounded w-1/2" />
                      </td>
                      <td className="px-5 py-3.5"><div className="h-4 bg-[#F0EBE4] rounded w-20" /></td>
                      <td className="px-5 py-3.5">
                        <div className="h-3 bg-[#F0EBE4] rounded w-28 mb-1.5" />
                        <div className="h-3 bg-[#F0EBE4] rounded w-20" />
                      </td>
                      <td className="px-5 py-3.5"><div className="h-5 bg-[#F0EBE4] rounded-full w-14 mx-auto" /></td>
                      <td className="px-5 py-3.5"><div className="h-7 bg-[#F0EBE4] rounded w-14 ml-auto" /></td>
                    </tr>
                  ))
                ) : pv.proveedoresPaginados.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-[#9A8E82] text-sm">
                      {pv.busqueda
                        ? `Sin resultados para "${pv.busqueda}".`
                        : `No hay proveedores ${pv.filtroEstado}.`}
                    </td>
                  </tr>
                ) : (
                  pv.proveedoresPaginados.map((proveedor) => (
                    <tr key={proveedor.id} className="group hover:bg-[#FDFAF7] transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-semibold text-[#1C0F05]">{proveedor.razon_social}</p>
                        {proveedor.contacto && <p className="text-[11px] text-[#9A8E82] mt-0.5">{proveedor.contacto}</p>}
                      </td>
                      <td className="px-5 py-3">
                        {proveedor.tipo_documento && proveedor.numero_documento ? (
                          <div className="flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5 text-[#B5A99E]" />
                            <span className="text-[11.5px] font-mono text-[#5A4A3C] font-medium">{proveedor.tipo_documento}: {proveedor.numero_documento}</span>
                          </div>
                        ) : (
                          <span className="text-[11.5px] text-[#C0B4AA]">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[11.5px] text-[#5A4A3C]">
                            <Phone className="w-3.5 h-3.5 text-[#B5A99E]" />
                            {proveedor.telefono || "—"}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11.5px] text-[#5A4A3C]">
                            <MapPin className="w-3.5 h-3.5 text-[#B5A99E]" />
                            <span className="truncate max-w-[150px]">{proveedor.region || "—"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                            proveedor.estado
                              ? "bg-[#EDFBF3] text-[#0D6E3F] border border-[#9FE1CB]"
                              : "bg-[#FCEBEB] text-[#8B2020] border border-[#F7C1C1]"
                          }`}
                        >
                          {proveedor.estado ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                          {proveedor.estado ? (
                            <>
                              <button
                                onClick={() => pv.abrirModalEditar(proveedor)}
                                className="w-7 h-7 rounded-md flex items-center justify-center text-[#9A8E82] border border-transparent hover:text-[#1C0F05] hover:bg-[#F7F5F2] hover:border-[#EDE8E1] transition-all"
                                title="Editar"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => pv.handleDesactivar(proveedor.id, proveedor.razon_social)}
                                className="w-7 h-7 rounded-md flex items-center justify-center text-[#9A8E82] border border-transparent hover:text-red-600 hover:bg-[#FCEBEB] hover:border-[#F7C1C1] transition-all"
                                title="Suspender proveedor"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => pv.handleReactivar(proveedor.id)}
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
              {pv.proveedoresFiltrados?.length ?? 0} proveedor
              {(pv.proveedoresFiltrados?.length ?? 0) !== 1 ? "es" : ""}
            </span>
            <Paginador />
          </div>
        </div>
      </div>


      {/* ════════════════════════════════════════════════════════════════════
          MODAL
      ════════════════════════════════════════════════════════════════════ */}
      {pv.isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Fondo */}
          <div
            className="absolute inset-0 bg-[#1C0F05]/55 backdrop-blur-sm"
            onClick={pv.cerrarModal}
          />

          {/* Panel */}
          <div className="relative bg-white w-full max-w-[600px] mx-0 sm:mx-4 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[88vh] border border-[#EDE8E1]">
            <div className="sm:hidden w-9 h-1 bg-[#DDD5CB] rounded-full mx-auto mt-3 mb-1 shrink-0" />

            {/* Header del modal */}
            <div className="shrink-0 flex items-start justify-between px-5 py-4 border-b border-[#F0EBE4]">
              <div>
                <h2 className="text-[15px] font-black text-[#1C0F05]">
                  {pv.proveedorAEditar ? "Editar proveedor" : "Nuevo proveedor"}
                </h2>
                <p className="text-[11px] text-[#9A8E82] mt-0.5">
                  {pv.proveedorAEditar
                    ? "Actualiza los datos del proveedor."
                    : "Registra un nuevo proveedor de materia prima."}
                </p>
              </div>
              <button
                onClick={pv.cerrarModal}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#7A6E65] hover:text-[#1C0F05] hover:bg-[#F7F5F2] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Cuerpo del formulario */}
            <form
              id="proveedorForm"
              onSubmit={pv.handleSubmit}
              className="flex-1 overflow-y-auto px-5 py-5 space-y-6"
            >
              {/* Sección: Identificación (2 Columnas perfectas) */}
              <section>
                <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-[#F0EBE4]">
                  <CreditCard className="w-3.5 h-3.5 text-[#C17B2A]" />
                  <h3 className="text-[10px] font-black uppercase tracking-[1px] text-[#9A8E82]">
                    Identificación
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Tipo Doc.</FieldLabel>
                    <select
                      value={pv.formData.tipo_documento}
                      onChange={(e) => pv.handleChange("tipo_documento", e.target.value)}
                      className={`${inputBase} cursor-pointer`}
                    >
                      <option value="">—</option>
                      <option value="DNI">DNI</option>
                      <option value="RUC">RUC</option>
                      <option value="CE">C.E.</option>
                      <option value="Pasaporte">Pasaporte</option>
                    </select>
                  </div>
                  <div>
                    <FieldLabel>Número</FieldLabel>
                    <input
                      type="text"
                      value={pv.formData.numero_documento}
                      onChange={pv.handleNumeroDocumentoChange}
                      placeholder="Ingrese número"
                      className={`${inputBase} ${pv.errores.numero_documento ? inputError : ""}`}
                    />
                    {pv.errores.numero_documento && (
                      <p className="text-red-500 text-[10.5px] mt-1 font-medium">{pv.errores.numero_documento}</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Sección: Razón Social */}
              <section>
                <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-[#F0EBE4]">
                  <Building2 className="w-3.5 h-3.5 text-[#C17B2A]" />
                  <h3 className="text-[10px] font-black uppercase tracking-[1px] text-[#9A8E82]">
                    Datos Principales
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>Razón social / Nombre</FieldLabel>
                    <input
                      type="text"
                      value={pv.formData.razon_social}
                      onChange={(e) => pv.handleChange("razon_social", e.target.value)}
                      className={`${inputBase} ${pv.errores.razon_social ? inputError : ""}`}
                    />
                    {pv.errores.razon_social && (
                      <p className="text-red-500 text-[10.5px] mt-1 font-medium">{pv.errores.razon_social}</p>
                    )}
                  </div>
                  <div>
                    <FieldLabel>Contacto (Persona)</FieldLabel>
                    <input
                      type="text"
                      value={pv.formData.contacto}
                      onChange={(e) => pv.handleChange("contacto", e.target.value)}
                      className={inputBase}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <FieldLabel hint="9 dígitos">Teléfono</FieldLabel>
                    <input
                      type="tel"
                      value={pv.formData.telefono}
                      onChange={pv.handleTelefonoChange}
                      placeholder="987654321"
                      className={`${inputBase} ${pv.errores.telefono ? inputError : ""}`}
                    />
                    {pv.errores.telefono && (
                      <p className="text-red-500 text-[10.5px] mt-1 font-medium">{pv.errores.telefono}</p>
                    )}
                  </div>
                  <div>
                    <FieldLabel>Dirección</FieldLabel>
                    <input
                      type="text"
                      value={pv.formData.direccion}
                      onChange={(e) => pv.handleChange("direccion", e.target.value)}
                      className={inputBase}
                    />
                  </div>
                </div>
              </section>

              {/* Sección: Ubicación */}
              <section>
                <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-[#F0EBE4]">
                  <MapPin className="w-3.5 h-3.5 text-[#C17B2A]" />
                  <h3 className="text-[10px] font-black uppercase tracking-[1px] text-[#9A8E82]">
                    Ubicación y Región
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <FieldLabel>Región Principal</FieldLabel>
                    <input
                      type="text"
                      value={pv.formData.region}
                      onChange={(e) => pv.handleChange("region", e.target.value)}
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <FieldLabel>Departamento</FieldLabel>
                    <input
                      type="text"
                      value={pv.formData.departamento}
                      onChange={(e) => pv.handleChange("departamento", e.target.value)}
                      className={inputBase}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Provincia</FieldLabel>
                    <input
                      type="text"
                      value={pv.formData.provincia}
                      onChange={(e) => pv.handleChange("provincia", e.target.value)}
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <FieldLabel>Distrito</FieldLabel>
                    <input
                      type="text"
                      value={pv.formData.distrito}
                      onChange={(e) => pv.handleChange("distrito", e.target.value)}
                      className={inputBase}
                    />
                  </div>
                </div>
              </section>
            </form>

            {/* Footer del modal */}
            <div className="shrink-0 flex items-center gap-2.5 px-5 py-4 border-t border-[#F0EBE4] bg-white rounded-b-2xl">
              <button
                type="button"
                onClick={pv.cerrarModal}
                className="flex-1 py-2.5 rounded-lg text-[12.5px] font-semibold text-[#5A4A3C] bg-[#F7F5F2] border border-[#EDE8E1] hover:bg-[#EDE8E1] transition-colors"
              >
                Cancelar
              </button>
              <button
                form="proveedorForm"
                type="submit"
                disabled={pv.guardando}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12.5px] font-semibold text-white bg-[#C17B2A] hover:bg-[#A86522] disabled:opacity-60 active:scale-[0.98] transition-all shadow-sm shadow-[#C17B2A]/25"
              >
                {pv.guardando ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Guardando…
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    {pv.proveedorAEditar ? "Actualizar proveedor" : "Registrar proveedor"}
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