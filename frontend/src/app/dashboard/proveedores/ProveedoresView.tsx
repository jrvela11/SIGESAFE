import React from "react";
import { DashboardLayout } from "../dashboard/DashboardLayout";
import { useProveedores } from "./useProveedores";
import {
  Plus, Edit, Trash2, Search, X, Save, Users, UserCheck, Phone,
  MapPin, Mail, RefreshCw, ChevronLeft, ChevronRight, Coffee, FileSearch,
  CreditCard, Building2
} from "lucide-react";

const Label: React.FC<{ children: React.ReactNode; req?: boolean; hint?: string }> = ({ children, req, hint }) => (
  <div className="flex items-center justify-between mb-1.5">
    <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
      {children}{req && <span className="text-amber-600 ml-0.5">*</span>}
    </p>
    {hint && <span className="text-[10px] text-stone-400">{hint}</span>}
  </div>
);

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-800 " +
  "outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-700/15 " +
  "placeholder:text-stone-300";
const errorInputClass = "border-red-300 focus:border-red-500 focus:ring-red-500/15";

export const ProveedoresView = () => {
  const pv = useProveedores();

  const Paginador = () => {
    if (pv.totalPaginas <= 1) return null;
    const paginas = [];
    for (let i = 1; i <= pv.totalPaginas; i++) {
      paginas.push(
        <button
          key={i}
          onClick={() => pv.setPagina(i)}
          className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
            pv.paginaAjustada === i
              ? "bg-amber-700 text-white shadow-md"
              : "bg-white text-stone-600 hover:bg-amber-50 border border-stone-200"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2 pt-6">
        <button
          onClick={() => pv.setPagina(p => Math.max(1, p - 1))}
          disabled={pv.paginaAjustada === 1}
          className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {paginas}
        <button
          onClick={() => pv.setPagina(p => Math.min(pv.totalPaginas, p + 1))}
          disabled={pv.paginaAjustada === pv.totalPaginas}
          className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <span className="text-xs text-stone-400 ml-2">
          {pv.proveedoresFiltrados?.length ?? 0} proveedor{(pv.proveedoresFiltrados?.length ?? 0) !== 1 ? "es" : ""}
        </span>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        {/* Banner */}
        <div className="relative bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 rounded-3xl p-6 sm:p-8 text-white overflow-hidden shadow-xl shadow-amber-900/20">
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 40%, rgba(255,255,255,0.3) 2px, transparent 2px),
                                radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 1.5px, transparent 1.5px),
                                radial-gradient(circle at 60% 70%, rgba(255,255,255,0.3) 2px, transparent 2px),
                                radial-gradient(circle at 30% 80%, rgba(255,255,255,0.2) 1px, transparent 1px)`,
              backgroundSize: "80px 80px, 120px 120px, 100px 100px, 90px 90px"
            }}
          />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-7 h-7 text-amber-200" />
                <h1 className="text-2xl font-extrabold tracking-tight">Proveedores</h1>
              </div>
              <p className="text-amber-100/80 text-sm max-w-lg">
                Administra los agricultores y empresas que abastecen de café y cacao.
              </p>
            </div>
            <button
              onClick={pv.abrirModalCrear}
              className="self-start sm:self-auto inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-sm px-5 py-3 rounded-2xl transition-all border border-white/30 shadow-lg"
            >
              <Plus className="w-4 h-4" /> Nuevo Proveedor
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
              <Users className="w-7 h-7 text-amber-700" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-stone-900 leading-none">{pv.totalProveedores}</p>
              <p className="text-xs text-stone-400 mt-1 font-medium">Total registrados</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-stone-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
              <UserCheck className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-stone-900 leading-none">{pv.proveedoresActivos}</p>
              <p className="text-xs text-stone-400 mt-1 font-medium">Proveedores activos</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-stone-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
              <Phone className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-stone-900 leading-none">{pv.proveedoresConTelefono}</p>
              <p className="text-xs text-stone-400 mt-1 font-medium">Con teléfono registrado</p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="flex-1 flex items-center bg-white border border-stone-200 rounded-2xl p-1 gap-2 w-full shadow-sm focus-within:border-amber-700 focus-within:ring-2 focus-within:ring-amber-700/15 transition-all">
            <div className="flex-1 flex items-center px-3 py-2">
              <Search className="w-4 h-4 text-stone-300 shrink-0 mr-2" />
              <input
                type="text"
                placeholder="Buscar por razón social o documento..."
                value={pv.busqueda}
                onChange={(e) => pv.setBusqueda(e.target.value)}
                className="flex-1 bg-transparent text-sm text-stone-700 placeholder:text-stone-300 outline-none w-full"
              />
              {pv.busqueda && (
                <button onClick={() => pv.setBusqueda("")} className="text-stone-300 hover:text-stone-500 transition-colors ml-2">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex bg-stone-100 rounded-xl p-1 gap-1 shrink-0">
            {(["activos", "inactivos"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => pv.setFiltroEstado(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  pv.filtroEstado === tab ? "bg-white text-stone-800 shadow-sm" : "text-stone-400 hover:text-stone-600"
                }`}
              >
                {tab === "activos" ? "Activos" : "Inactivos"}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/70">
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-stone-400">Proveedor</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-stone-400">Documento</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-stone-400">Contacto</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-stone-400">Región</th>
                <th className="px-5 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-stone-400">Estado</th>
                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-stone-400">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {pv.cargando ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4"><div className="h-4 bg-stone-100 rounded w-3/4" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-stone-100 rounded w-20" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-stone-100 rounded w-28" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-stone-100 rounded w-20" /></td>
                    <td className="px-5 py-4"><div className="h-6 bg-stone-100 rounded-full w-16 mx-auto" /></td>
                    <td className="px-5 py-4"><div className="h-8 bg-stone-100 rounded w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : pv.proveedoresPaginados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-stone-400">
                    {pv.busqueda ? "Sin resultados." : `No hay proveedores ${pv.filtroEstado}.`}
                  </td>
                </tr>
              ) : (
                pv.proveedoresPaginados.map((proveedor) => (
                  <tr key={proveedor.id} className="group hover:bg-amber-50/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-stone-800">{proveedor.nombre_completo || proveedor.razon_social}</p>
                      {proveedor.contacto && <p className="text-[11px] text-stone-400">{proveedor.contacto}</p>}
                    </td>
                    <td className="px-5 py-3.5">
                      {proveedor.tipo_documento && proveedor.numero_documento ? (
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-stone-400" />
                          <span className="text-xs font-mono text-stone-700">
                            {proveedor.tipo_documento}: {proveedor.numero_documento}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-stone-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-stone-600">
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        {proveedor.telefono || "—"}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-stone-600">{proveedor.region || "—"}</span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          proveedor.estado
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {proveedor.estado ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {proveedor.estado ? (
                          <>
                            <button
                              onClick={() => pv.abrirModalEditar(proveedor)}
                              className="p-2 rounded-lg text-stone-400 hover:text-amber-700 hover:bg-amber-50 border border-transparent hover:border-amber-200 transition-all"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => pv.handleDesactivar(proveedor.id, proveedor.razon_social)}
                              className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => pv.handleReactivar(proveedor.id, proveedor.razon_social)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
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
          <div className="px-5 py-3 border-t border-stone-100 bg-stone-50/30 flex justify-end">
            <Paginador />
          </div>
        </div>

        {/* Modal */}
        {pv.isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={pv.cerrarModal} />
            <div className="relative bg-white w-full max-w-2xl mx-0 sm:mx-4 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] border border-stone-200/60">
              <div className="sm:hidden w-10 h-1 bg-stone-200 rounded-full mx-auto mt-3 mb-1 shrink-0" />

              <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-stone-100">
                <div>
                  <h2 className="text-lg font-extrabold text-stone-900">
                    {pv.proveedorAEditar ? "Editar proveedor" : "Nuevo proveedor"}
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {pv.proveedorAEditar
                      ? "Actualiza los datos del proveedor."
                      : "Registra un nuevo proveedor de café o cacao."}
                  </p>
                </div>
                <button onClick={pv.cerrarModal} className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form id="proveedorForm" onSubmit={pv.handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                {/* Identificación */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-amber-700" />
                    <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wide">Identificación</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Tipo Doc.</Label>
                      <select
                        value={pv.formData.tipo_documento}
                        onChange={(e) => pv.handleChange("tipo_documento", e.target.value)}
                        className={inputClass + " cursor-pointer"}
                      >
                        <option value="">—</option>
                        <option value="DNI">DNI</option>
                        <option value="RUC">RUC</option>
                        <option value="CE">C.E.</option>
                        <option value="Pasaporte">Pasaporte</option>
                      </select>
                    </div>
                    <div>
                      <Label>Número</Label>
                      <input
                        type="text"
                        value={pv.formData.numero_documento}
                        onChange={pv.handleNumeroDocumentoChange}
                        placeholder="Ingrese número"
                        className={`${inputClass} ${pv.errores.numero_documento ? errorInputClass : ""}`}
                      />
                      {pv.errores.numero_documento && (
                        <p className="text-red-500 text-[11px] mt-1 font-medium">{pv.errores.numero_documento}</p>
                      )}
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={pv.consultarDocumento}
                        disabled={pv.consultandoDoc}
                        className="w-full py-2.5 px-4 bg-amber-100 text-amber-800 rounded-xl text-xs font-bold hover:bg-amber-200 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
                      >
                        {pv.consultandoDoc ? (
                          <span className="w-4 h-4 border-2 border-amber-300 border-t-amber-700 rounded-full animate-spin" />
                        ) : (
                          <FileSearch className="w-4 h-4" />
                        )}
                        {pv.consultandoDoc ? "Consultando..." : "Consultar"}
                      </button>
                    </div>
                  </div>
                </section>

                {/* Datos principales */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5 text-amber-700" />
                    <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wide">Razón social</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label req>Razón social / Nombre</Label>
                      <input
                        type="text"
                        value={pv.formData.razon_social}
                        onChange={(e) => pv.handleChange("razon_social", e.target.value)}
                        className={`${inputClass} ${pv.errores.razon_social ? errorInputClass : ""}`}
                      />
                      {pv.errores.razon_social && (
                        <p className="text-red-500 text-[11px] mt-1 font-medium">{pv.errores.razon_social}</p>
                      )}
                    </div>
                    <div>
                      <Label>Contacto (persona)</Label>
                      <input
                        type="text"
                        value={pv.formData.contacto}
                        onChange={(e) => pv.handleChange("contacto", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    <div>
                      <Label hint="9 dígitos, empieza con 9">Teléfono</Label>
                      <input
                        type="tel"
                        value={pv.formData.telefono}
                        onChange={pv.handleTelefonoChange}
                        className={`${inputClass} ${pv.errores.telefono ? errorInputClass : ""}`}
                      />
                      {pv.errores.telefono && (
                        <p className="text-red-500 text-[11px] mt-1 font-medium">{pv.errores.telefono}</p>
                      )}
                    </div>
                    <div>
                      <Label>Dirección</Label>
                      <input
                        type="text"
                        value={pv.formData.direccion}
                        onChange={(e) => pv.handleChange("direccion", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <Label>Región</Label>
                      <input
                        type="text"
                        value={pv.formData.region}
                        onChange={(e) => pv.handleChange("region", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </section>

                {/* Ubigeo */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-amber-700" />
                    <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wide">Ubigeo</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Distrito</Label>
                      <input
                        type="text"
                        value={pv.formData.distrito}
                        onChange={(e) => pv.handleChange("distrito", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <Label>Provincia</Label>
                      <input
                        type="text"
                        value={pv.formData.provincia}
                        onChange={(e) => pv.handleChange("provincia", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <Label>Departamento</Label>
                      <input
                        type="text"
                        value={pv.formData.departamento}
                        onChange={(e) => pv.handleChange("departamento", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </section>
              </form>

              <div className="shrink-0 flex items-center gap-3 px-6 py-4 border-t border-stone-100 bg-white rounded-b-3xl">
                <button
                  type="button"
                  onClick={pv.cerrarModal}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold text-stone-500 bg-stone-100 hover:bg-stone-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  form="proveedorForm"
                  type="submit"
                  disabled={pv.guardando}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-white bg-amber-700 hover:bg-amber-800 disabled:opacity-60 active:scale-[0.98] transition-all shadow-md shadow-amber-800/20"
                >
                  {pv.guardando ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Guardando…
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {pv.proveedorAEditar ? "Actualizar proveedor" : "Registrar proveedor"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};