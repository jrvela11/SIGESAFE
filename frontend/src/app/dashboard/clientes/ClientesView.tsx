import React from "react";
import { DashboardLayout } from "../dashboard/DashboardLayout";
import { useClientes } from "./useClientes";
import {
  Plus, Edit, Trash2, Search, X, Save, Users, UserCheck, Phone,
  MapPin, Mail, RefreshCw, ChevronLeft, ChevronRight, Coffee, FileSearch, CreditCard
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

export const ClientesView = () => {
  const cl = useClientes();

  const Paginador = () => {
    if (cl.totalPaginas <= 1) return null;
    const paginas = [];
    for (let i = 1; i <= cl.totalPaginas; i++) {
      paginas.push(
        <button
          key={i}
          onClick={() => cl.setPagina(i)}
          className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
            cl.paginaAjustada === i
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
          onClick={() => cl.setPagina((p) => Math.max(1, p - 1))}
          disabled={cl.paginaAjustada === 1}
          className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {paginas}
        <button
          onClick={() => cl.setPagina((p) => Math.min(cl.totalPaginas, p + 1))}
          disabled={cl.paginaAjustada === cl.totalPaginas}
          className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <span className="text-xs text-stone-400 ml-2">
          {cl.clientesFiltrados?.length ?? 0} cliente{(cl.clientesFiltrados?.length ?? 0) !== 1 ? "s" : ""}
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
                <Coffee className="w-7 h-7 text-amber-200" />
                <h1 className="text-2xl font-extrabold tracking-tight">Directorio de Clientes</h1>
              </div>
              <p className="text-amber-100/80 text-sm max-w-lg">
                Administra los compradores de café y cacao, tanto minoristas como corporativos.
              </p>
            </div>
            <button
              onClick={cl.abrirModalCrear}
              className="self-start sm:self-auto inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-sm px-5 py-3 rounded-2xl transition-all border border-white/30 shadow-lg"
            >
              <Plus className="w-4 h-4" /> Nuevo Cliente
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
              <p className="text-2xl font-extrabold text-stone-900 leading-none">{cl.totalClientes}</p>
              <p className="text-xs text-stone-400 mt-1 font-medium">Total registrados</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-stone-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
              <UserCheck className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-stone-900 leading-none">{cl.clientesActivos}</p>
              <p className="text-xs text-stone-400 mt-1 font-medium">Clientes activos</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-stone-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
              <Phone className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-stone-900 leading-none">{cl.clientesConTelefono}</p>
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
                placeholder="Buscar por nombre o correo..."
                value={cl.busqueda}
                onChange={(e) => cl.setBusqueda(e.target.value)}
                className="flex-1 bg-transparent text-sm text-stone-700 placeholder:text-stone-300 outline-none w-full"
              />
              {cl.busqueda && (
                <button onClick={() => cl.setBusqueda("")} className="text-stone-300 hover:text-stone-500 transition-colors ml-2">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex bg-stone-100 rounded-xl p-1 gap-1 shrink-0">
            {(["activos", "inactivos"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => cl.setFiltroEstado(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  cl.filtroEstado === tab ? "bg-white text-stone-800 shadow-sm" : "text-stone-400 hover:text-stone-600"
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
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-stone-400">Cliente</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-stone-400">Documento</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-stone-400">Contacto</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-stone-400">Dirección</th>
                <th className="px-5 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-stone-400">Estado</th>
                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-stone-400">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {cl.cargando ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4"><div className="h-4 bg-stone-100 rounded w-3/4" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-stone-100 rounded w-20" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-stone-100 rounded w-28" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-stone-100 rounded w-24" /></td>
                    <td className="px-5 py-4"><div className="h-6 bg-stone-100 rounded-full w-16 mx-auto" /></td>
                    <td className="px-5 py-4"><div className="h-8 bg-stone-100 rounded w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : cl.clientesPaginados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-stone-400">
                    {cl.busqueda ? "Sin resultados para esta búsqueda." : `No hay clientes ${cl.filtroEstado}.`}
                  </td>
                </tr>
              ) : (
                cl.clientesPaginados.map((cliente) => (
                  <tr key={cliente.id} className="group hover:bg-amber-50/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-stone-800">{cliente.nombre_completo || cliente.nombre}</p>
                      {cliente.apellido && <p className="text-[11px] text-stone-400">{cliente.apellido}</p>}
                    </td>
                    <td className="px-5 py-3.5">
                      {cliente.tipo_documento && cliente.numero_documento ? (
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-stone-400" />
                          <span className="text-xs font-mono text-stone-700">{cliente.tipo_documento}: {cliente.numero_documento}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-stone-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-stone-600">
                          <Mail className="w-3.5 h-3.5 text-stone-400" />
                          {cliente.email || "—"}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-stone-600">
                          <Phone className="w-3.5 h-3.5 text-stone-400" />
                          {cliente.telefono || "—"}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-stone-600">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        {cliente.direccion || "—"}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          cliente.estado
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {cliente.estado ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {cliente.estado ? (
                          <>
                            <button
                              onClick={() => cl.abrirModalEditar(cliente)}
                              className="p-2 rounded-lg text-stone-400 hover:text-amber-700 hover:bg-amber-50 border border-transparent hover:border-amber-200 transition-all"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => cl.handleDesactivar(cliente.id, cliente.nombre)}
                              className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => cl.handleReactivar(cliente.id, cliente.nombre)}
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
        {cl.isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={cl.cerrarModal} />
            <div className="relative bg-white w-full max-w-2xl mx-0 sm:mx-4 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] border border-stone-200/60">
              <div className="sm:hidden w-10 h-1 bg-stone-200 rounded-full mx-auto mt-3 mb-1 shrink-0" />

              <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-stone-100">
                <div>
                  <h2 className="text-lg font-extrabold text-stone-900">
                    {cl.clienteAEditar ? "Editar cliente" : "Nuevo cliente"}
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {cl.clienteAEditar
                      ? "Actualiza los datos del cliente."
                      : "Registra un nuevo comprador de café o cacao."}
                  </p>
                </div>
                <button onClick={cl.cerrarModal} className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form id="clienteForm" onSubmit={cl.handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
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
                        value={cl.formData.tipo_documento}
                        onChange={(e) => cl.handleChange("tipo_documento", e.target.value)}
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
                        value={cl.formData.numero_documento}
                        onChange={cl.handleNumeroDocumentoChange}
                        placeholder="Ingrese número"
                        className={`${inputClass} ${cl.errores.numero_documento ? errorInputClass : ""}`}
                      />
                      {cl.errores.numero_documento && (
                        <p className="text-red-500 text-[11px] mt-1 font-medium">{cl.errores.numero_documento}</p>
                      )}
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={cl.consultarDocumento}
                        disabled={cl.consultandoDoc}
                        className="w-full py-2.5 px-4 bg-amber-100 text-amber-800 rounded-xl text-xs font-bold hover:bg-amber-200 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
                      >
                        {cl.consultandoDoc ? (
                          <span className="w-4 h-4 border-2 border-amber-300 border-t-amber-700 rounded-full animate-spin" />
                        ) : (
                          <FileSearch className="w-4 h-4" />
                        )}
                        {cl.consultandoDoc ? "Consultando..." : "Consultar"}
                      </button>
                    </div>
                  </div>
                </section>

                {/* Datos personales */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-amber-700" />
                    <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wide">Nombre</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label req>Nombre / Razón Social</Label>
                      <input
                        type="text"
                        value={cl.formData.nombre}
                        onChange={(e) => cl.handleChange("nombre", e.target.value)}
                        className={`${inputClass} ${cl.errores.nombre ? errorInputClass : ""}`}
                      />
                      {cl.errores.nombre && (
                        <p className="text-red-500 text-[11px] mt-1 font-medium">{cl.errores.nombre}</p>
                      )}
                    </div>
                    <div>
                      <Label>Apellidos</Label>
                      <input
                        type="text"
                        value={cl.formData.apellido}
                        onChange={(e) => cl.handleChange("apellido", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </section>

                {/* Contacto */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Mail className="w-5 h-5 text-amber-700" />
                    <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wide">Contacto</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Correo electrónico</Label>
                      <input
                        type="email"
                        value={cl.formData.email}
                        onChange={(e) => cl.handleChange("email", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <Label hint="9 dígitos, empieza con 9">Teléfono celular</Label>
                      <input
                        type="tel"
                        value={cl.formData.telefono}
                        onChange={cl.handleTelefonoChange}
                        placeholder="987654321"
                        className={`${inputClass} ${cl.errores.telefono ? errorInputClass : ""}`}
                      />
                      {cl.errores.telefono && (
                        <p className="text-red-500 text-[11px] mt-1 font-medium">{cl.errores.telefono}</p>
                      )}
                    </div>
                  </div>
                </section>

                {/* Dirección */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-amber-700" />
                    <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wide">Dirección</h3>
                  </div>
                  <div>
                    <Label>Dirección fiscal / envío</Label>
                    <input
                      type="text"
                      value={cl.formData.direccion}
                      onChange={(e) => cl.handleChange("direccion", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </section>

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
                        value={cl.formData.distrito}
                        onChange={(e) => cl.handleChange("distrito", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <Label>Provincia</Label>
                      <input
                        type="text"
                        value={cl.formData.provincia}
                        onChange={(e) => cl.handleChange("provincia", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <Label>Departamento</Label>
                      <input
                        type="text"
                        value={cl.formData.departamento}
                        onChange={(e) => cl.handleChange("departamento", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </section>
              </form>

              <div className="shrink-0 flex items-center gap-3 px-6 py-4 border-t border-stone-100 bg-white rounded-b-3xl">
                <button
                  type="button"
                  onClick={cl.cerrarModal}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold text-stone-500 bg-stone-100 hover:bg-stone-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  form="clienteForm"
                  type="submit"
                  disabled={cl.guardando}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-white bg-amber-700 hover:bg-amber-800 disabled:opacity-60 active:scale-[0.98] transition-all shadow-md shadow-amber-800/20"
                >
                  {cl.guardando ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Guardando…
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {cl.clienteAEditar ? "Actualizar cliente" : "Registrar cliente"}
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