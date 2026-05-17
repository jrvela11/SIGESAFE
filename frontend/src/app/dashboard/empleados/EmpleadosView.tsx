import React from "react";
import { DashboardLayout } from "../dashboard/DashboardLayout";
import { useEmpleados } from "./useEmpleados";
import {
  Plus, Edit, Trash2, Search, X, Save, Users, UserCheck, Phone,
  RefreshCw, ChevronLeft, ChevronRight, Coffee, Briefcase, CreditCard, FileSearch, ShieldCheck, ShieldAlert
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

export const EmpleadosView = () => {
  const emp = useEmpleados();

  const Paginador = () => {
    if (emp.totalPaginas <= 1) return null;
    const paginas = [];
    for (let i = 1; i <= emp.totalPaginas; i++) {
      paginas.push(
        <button
          key={i}
          onClick={() => emp.setPagina(i)}
          className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
            emp.paginaAjustada === i
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
          onClick={() => emp.setPagina((p) => Math.max(1, p - 1))}
          disabled={emp.paginaAjustada === 1}
          className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {paginas}
        <button
          onClick={() => emp.setPagina((p) => Math.min(emp.totalPaginas, p + 1))}
          disabled={emp.paginaAjustada === emp.totalPaginas}
          className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <span className="text-xs text-stone-400 ml-2">
          {emp.empleadosFiltrados?.length ?? 0} empleado{(emp.empleadosFiltrados?.length ?? 0) !== 1 ? "s" : ""}
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
                <Briefcase className="w-7 h-7 text-amber-200" />
                <h1 className="text-2xl font-extrabold tracking-tight">Recursos Humanos</h1>
              </div>
              <p className="text-amber-100/80 text-sm max-w-lg">
                Directorio del personal, con o sin acceso al sistema ERP.
              </p>
            </div>
            <button
              onClick={emp.abrirModalCrear}
              className="self-start sm:self-auto inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-sm px-5 py-3 rounded-2xl transition-all border border-white/30 shadow-lg"
            >
              <Plus className="w-4 h-4" /> Registrar Ficha
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
              <p className="text-2xl font-extrabold text-stone-900 leading-none">{emp.totalEmpleados}</p>
              <p className="text-xs text-stone-400 mt-1 font-medium">Plantilla histórica</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-stone-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
              <UserCheck className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-stone-900 leading-none">{emp.empleadosActivos}</p>
              <p className="text-xs text-stone-400 mt-1 font-medium">Personal activo</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-stone-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
              <Briefcase className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-stone-900 leading-none">{emp.personalReparto}</p>
              <p className="text-xs text-stone-400 mt-1 font-medium">Equipo de reparto</p>
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
                placeholder="Buscar por nombre, DNI o cargo..."
                value={emp.busqueda}
                onChange={(e) => emp.setBusqueda(e.target.value)}
                className="flex-1 bg-transparent text-sm text-stone-700 placeholder:text-stone-300 outline-none w-full"
              />
              {emp.busqueda && (
                <button onClick={() => emp.setBusqueda("")} className="text-stone-300 hover:text-stone-500 transition-colors ml-2">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex bg-stone-100 rounded-xl p-1 gap-1 shrink-0">
            {(["activos", "inactivos"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => emp.setFiltroEstado(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  emp.filtroEstado === tab ? "bg-white text-stone-800 shadow-sm" : "text-stone-400 hover:text-stone-600"
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
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-stone-400">Empleado</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-stone-400">Documento</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-stone-400">Cargo</th>
                <th className="px-5 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-stone-400">Sistema</th>
                <th className="px-5 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-stone-400">Estado</th>
                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-stone-400">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {emp.cargando ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4"><div className="h-4 bg-stone-100 rounded w-3/4" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-stone-100 rounded w-20" /></td>
                    <td className="px-5 py-4"><div className="h-6 bg-stone-100 rounded-full w-24" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-stone-100 rounded w-16 mx-auto" /></td>
                    <td className="px-5 py-4"><div className="h-6 bg-stone-100 rounded-full w-16 mx-auto" /></td>
                    <td className="px-5 py-4"><div className="h-8 bg-stone-100 rounded w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : emp.empleadosPaginados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-stone-400">
                    {emp.busqueda ? "Sin resultados." : `No hay empleados ${emp.filtroEstado}.`}
                  </td>
                </tr>
              ) : (
                emp.empleadosPaginados.map((empleado) => (
                  <tr key={empleado.id} className="group hover:bg-amber-50/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-stone-800">{empleado.nombre_completo}</p>
                      <p className="text-[11px] text-stone-400">{empleado.telefono || "Sin teléfono"}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-stone-400" />
                        <span className="text-xs font-mono text-stone-700">{empleado.tipo_documento}: {empleado.numero_documento}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200">
                        {empleado.cargo}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      {empleado.email_sistema ? (
                        <div className="flex items-center justify-center gap-1 text-emerald-600 text-xs font-medium">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span className="hidden xl:inline">{empleado.email_sistema}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1 text-stone-400 text-xs">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>—</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          empleado.estado
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {empleado.estado ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {empleado.estado ? (
                          <>
                            <button
                              onClick={() => emp.abrirModalEditar(empleado)}
                              className="p-2 rounded-lg text-stone-400 hover:text-amber-700 hover:bg-amber-50 border border-transparent hover:border-amber-200 transition-all"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => emp.handleDesactivar(empleado.id, empleado.nombre_completo)}
                              className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => emp.handleReactivar(empleado.id, empleado.nombre_completo)}
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
        {emp.isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={emp.cerrarModal} />
            <div className="relative bg-white w-full max-w-2xl mx-0 sm:mx-4 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] border border-stone-200/60">
              <div className="sm:hidden w-10 h-1 bg-stone-200 rounded-full mx-auto mt-3 mb-1 shrink-0" />

              <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-stone-100">
                <div>
                  <h2 className="text-lg font-extrabold text-stone-900">
                    {emp.empleadoAEditar ? "Editar ficha" : "Alta de personal"}
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {emp.empleadoAEditar
                      ? "Actualiza los datos del empleado."
                      : "Registra un nuevo miembro del equipo."}
                  </p>
                </div>
                <button onClick={emp.cerrarModal} className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form id="empleadoForm" onSubmit={emp.handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                {/* Identificación */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-amber-700" />
                    <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wide">Identificación</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label req>Tipo Doc.</Label>
                      <select
                        value={emp.formData.tipo_documento}
                        onChange={emp.handleTipoDocumentoChange}
                        className={inputClass + " cursor-pointer"}
                      >
                        <option value="DNI">DNI</option>
                        <option value="CE">C.E.</option>
                        <option value="Pasaporte">Pasaporte</option>
                      </select>
                    </div>
                    <div>
                      <Label req>Número</Label>
                      <input
                        type="text"
                        value={emp.formData.numero_documento}
                        onChange={emp.handleNumeroDocumentoChange}
                        placeholder={emp.formData.tipo_documento === "DNI" ? "8 dígitos" : "Número"}
                        className={`${inputClass} ${emp.errores.numero_documento ? errorInputClass : ""}`}
                      />
                      {emp.errores.numero_documento && (
                        <p className="text-red-500 text-[11px] mt-1 font-medium">{emp.errores.numero_documento}</p>
                      )}
                    </div>
                    <div className="flex items-end">
                      {emp.formData.tipo_documento === "DNI" && (
                        <button
                          type="button"
                          onClick={emp.consultarDocumento}
                          disabled={emp.consultandoDoc}
                          className="w-full py-2.5 px-4 bg-amber-100 text-amber-800 rounded-xl text-xs font-bold hover:bg-amber-200 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
                        >
                          {emp.consultandoDoc ? (
                            <span className="w-4 h-4 border-2 border-amber-300 border-t-amber-700 rounded-full animate-spin" />
                          ) : (
                            <FileSearch className="w-4 h-4" />
                          )}
                          {emp.consultandoDoc ? "Consultando..." : "Consultar"}
                        </button>
                      )}
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
                      <Label req>Nombres</Label>
                      <input
                        type="text"
                        value={emp.formData.nombres}
                        onChange={(e) => emp.handleChange("nombres", e.target.value)}
                        className={`${inputClass} ${emp.errores.nombres ? errorInputClass : ""}`}
                      />
                      {emp.errores.nombres && (
                        <p className="text-red-500 text-[11px] mt-1 font-medium">{emp.errores.nombres}</p>
                      )}
                    </div>
                    <div>
                      <Label req>Apellidos</Label>
                      <input
                        type="text"
                        value={emp.formData.apellidos}
                        onChange={(e) => emp.handleChange("apellidos", e.target.value)}
                        className={`${inputClass} ${emp.errores.apellidos ? errorInputClass : ""}`}
                      />
                      {emp.errores.apellidos && (
                        <p className="text-red-500 text-[11px] mt-1 font-medium">{emp.errores.apellidos}</p>
                      )}
                    </div>
                  </div>
                </section>

                {/* Cargo y contacto */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="w-5 h-5 text-amber-700" />
                    <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wide">Cargo y contacto</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label req>Cargo</Label>
                      <select
                        value={emp.formData.cargo}
                        onChange={(e) => emp.handleChange("cargo", e.target.value)}
                        className={inputClass + " cursor-pointer"}
                      >
                        <option value="Administrador">Administrador</option>
                        <option value="Vendedor">Vendedor</option>
                        <option value="Almacenero">Almacenero / Logística</option>
                        <option value="Repartidor">Repartidor (Delivery)</option>
                        <option value="Agricultor">Agricultor / Producción</option>
                        <option value="Limpieza">Mantenimiento / Limpieza</option>
                      </select>
                      {emp.errores.cargo && (
                        <p className="text-red-500 text-[11px] mt-1 font-medium">{emp.errores.cargo}</p>
                      )}
                    </div>
                    <div>
                      <Label hint="9 dígitos, empieza con 9">Teléfono</Label>
                      <input
                        type="tel"
                        value={emp.formData.telefono}
                        onChange={emp.handleTelefonoChange}
                        placeholder="987654321"
                        className={`${inputClass} ${emp.errores.telefono ? errorInputClass : ""}`}
                      />
                      {emp.errores.telefono && (
                        <p className="text-red-500 text-[11px] mt-1 font-medium">{emp.errores.telefono}</p>
                      )}
                    </div>
                  </div>
                </section>

                {/* Acceso al sistema */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck className="w-5 h-5 text-amber-700" />
                    <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wide">Acceso al sistema</h3>
                  </div>
                  <div>
                    <Label>Cuenta de usuario (opcional)</Label>
                    <select
                      value={emp.formData.user_id}
                      onChange={(e) => emp.handleChange("user_id", e.target.value)}
                      className={inputClass + " cursor-pointer"}
                    >
                      <option value="">— Sin acceso al sistema —</option>
                      {emp.usuariosLista.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-stone-400 mt-1">
                      Solo asigne una cuenta si el empleado necesita usar el sistema.
                    </p>
                  </div>
                </section>
              </form>

              <div className="shrink-0 flex items-center gap-3 px-6 py-4 border-t border-stone-100 bg-white rounded-b-3xl">
                <button
                  type="button"
                  onClick={emp.cerrarModal}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold text-stone-500 bg-stone-100 hover:bg-stone-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  form="empleadoForm"
                  type="submit"
                  disabled={emp.guardando}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-white bg-amber-700 hover:bg-amber-800 disabled:opacity-60 active:scale-[0.98] transition-all shadow-md shadow-amber-800/20"
                >
                  {emp.guardando ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Guardando…
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {emp.empleadoAEditar ? "Actualizar ficha" : "Crear ficha"}
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