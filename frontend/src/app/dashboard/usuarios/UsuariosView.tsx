import React from "react";
import { DashboardLayout } from "../dashboard/DashboardLayout";
import { useUsuarios } from "./useUsuarios";
import {
  Plus, Edit, Trash2, Search, X, Save, Shield, Users, UserCheck,
  RefreshCw, Key, Briefcase, ChevronLeft, ChevronRight, Coffee
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

const getRoleBadge = (role: string) => {
  switch (role) {
    case "admin":
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
          Administrador
        </span>
      );
    case "logistica":
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
          Logística
        </span>
      );
    case "repartidor":
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-700 border border-teal-200">
          Repartidor
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
          Vendedor
        </span>
      );
  }
};

export const UsuariosView = () => {
  const u = useUsuarios();

  const Paginador = () => {
    if (u.totalPaginas <= 1) return null;
    const paginas = [];
    for (let i = 1; i <= u.totalPaginas; i++) {
      paginas.push(
        <button
          key={i}
          onClick={() => u.setPagina(i)}
          className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
            u.paginaAjustada === i
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
          onClick={() => u.setPagina((p) => Math.max(1, p - 1))}
          disabled={u.paginaAjustada === 1}
          className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {paginas}
        <button
          onClick={() => u.setPagina((p) => Math.min(u.totalPaginas, p + 1))}
          disabled={u.paginaAjustada === u.totalPaginas}
          className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <span className="text-xs text-stone-400 ml-2">
          {u.usuariosFiltrados?.length ?? 0} usuario{(u.usuariosFiltrados?.length ?? 0) !== 1 ? "s" : ""}
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
                <Shield className="w-7 h-7 text-amber-200" />
                <h1 className="text-2xl font-extrabold tracking-tight">Cuentas de Usuario</h1>
              </div>
              <p className="text-amber-100/80 text-sm max-w-lg">
                Administra los accesos al sistema ERP y vincúlalos a tu personal.
              </p>
            </div>
            <button
              onClick={u.abrirModalCrear}
              className="self-start sm:self-auto inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-sm px-5 py-3 rounded-2xl transition-all border border-white/30 shadow-lg"
            >
              <Plus className="w-4 h-4" /> Nuevo Usuario
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
              <p className="text-2xl font-extrabold text-stone-900 leading-none">{u.totalUsuarios}</p>
              <p className="text-xs text-stone-400 mt-1 font-medium">Total registrados</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-stone-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
              <UserCheck className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-stone-900 leading-none">{u.usuariosActivos}</p>
              <p className="text-xs text-stone-400 mt-1 font-medium">Cuentas activas</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-stone-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0">
              <Shield className="w-7 h-7 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-stone-900 leading-none">{u.totalAdmins}</p>
              <p className="text-xs text-stone-400 mt-1 font-medium">Administradores</p>
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
                placeholder="Buscar por nombre, correo o empleado..."
                value={u.busqueda}
                onChange={(e) => u.setBusqueda(e.target.value)}
                className="flex-1 bg-transparent text-sm text-stone-700 placeholder:text-stone-300 outline-none w-full"
              />
              {u.busqueda && (
                <button onClick={() => u.setBusqueda("")} className="text-stone-300 hover:text-stone-500 transition-colors ml-2">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex bg-stone-100 rounded-xl p-1 gap-1 shrink-0">
            {(["activos", "inactivos"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => u.setFiltroEstado(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  u.filtroEstado === tab ? "bg-white text-stone-800 shadow-sm" : "text-stone-400 hover:text-stone-600"
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
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-stone-400">Usuario</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-stone-400">Rol</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-stone-400">Empleado</th>
                <th className="px-5 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-stone-400">Estado</th>
                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-stone-400">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {u.cargando ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4"><div className="h-4 bg-stone-100 rounded w-3/4" /></td>
                    <td className="px-5 py-4"><div className="h-6 bg-stone-100 rounded-full w-24" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-stone-100 rounded w-28" /></td>
                    <td className="px-5 py-4"><div className="h-6 bg-stone-100 rounded-full w-16 mx-auto" /></td>
                    <td className="px-5 py-4"><div className="h-8 bg-stone-100 rounded w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : u.usuariosPaginados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-stone-400">
                    {u.busqueda ? "Sin resultados." : `No hay usuarios ${u.filtroEstado}.`}
                  </td>
                </tr>
              ) : (
                u.usuariosPaginados.map((usuario) => (
                  <tr key={usuario.id} className="group hover:bg-amber-50/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-stone-800">{usuario.name}</p>
                      <p className="text-[11px] text-stone-400">{usuario.email}</p>
                    </td>
                    <td className="px-5 py-3.5">{getRoleBadge(usuario.role)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-stone-600">
                        <Briefcase className="w-3.5 h-3.5 text-stone-400" />
                        {usuario.empleado_nombre || "Sin vínculo"}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          usuario.is_active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {usuario.is_active ? "Activo" : "Suspendido"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {usuario.is_active ? (
                          <>
                            <button
                              onClick={() => u.abrirModalEditar(usuario)}
                              className="p-2 rounded-lg text-stone-400 hover:text-amber-700 hover:bg-amber-50 border border-transparent hover:border-amber-200 transition-all"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => u.handleDesactivar(usuario.id, usuario.name)}
                              className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
                              title="Suspender"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => u.handleReactivar(usuario.id, usuario.name)}
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
        {u.isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={u.cerrarModal} />
            <div className="relative bg-white w-full max-w-xl mx-0 sm:mx-4 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] border border-stone-200/60">
              <div className="sm:hidden w-10 h-1 bg-stone-200 rounded-full mx-auto mt-3 mb-1 shrink-0" />

              <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-stone-100">
                <div>
                  <h2 className="text-lg font-extrabold text-stone-900">
                    {u.usuarioAEditar ? "Editar usuario" : "Nuevo usuario"}
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {u.usuarioAEditar
                      ? "Actualiza los datos de acceso."
                      : "Crea una nueva cuenta para el sistema."}
                  </p>
                </div>
                <button onClick={u.cerrarModal} className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form id="usuarioForm" onSubmit={u.handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                {/* Vinculación con empleado */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="w-5 h-5 text-amber-700" />
                    <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wide">Vinculación</h3>
                  </div>
                  <div>
                    <Label>Empleado (opcional)</Label>
                    <select
                      value={u.formData.empleado_id}
                      onChange={(e) => u.handleChange("empleado_id", e.target.value)}
                      className={inputClass + " cursor-pointer"}
                    >
                      <option value="">— Cuenta independiente —</option>
                      {u.empleadosLista.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.nombre_completo} - {emp.cargo}
                        </option>
                      ))}
                    </select>
                  </div>
                </section>

                {/* Datos de la cuenta */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-amber-700" />
                    <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wide">Credenciales</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label req>Nombre completo</Label>
                      <input
                        type="text"
                        value={u.formData.name}
                        onChange={(e) => u.handleChange("name", e.target.value)}
                        className={`${inputClass} ${u.errores.name ? errorInputClass : ""}`}
                      />
                      {u.errores.name && (
                        <p className="text-red-500 text-[11px] mt-1 font-medium">{u.errores.name}</p>
                      )}
                    </div>
                    <div>
                      <Label req>Correo electrónico</Label>
                      <input
                        type="email"
                        value={u.formData.email}
                        onChange={(e) => u.handleChange("email", e.target.value)}
                        className={`${inputClass} ${u.errores.email ? errorInputClass : ""}`}
                      />
                      {u.errores.email && (
                        <p className="text-red-500 text-[11px] mt-1 font-medium">{u.errores.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3">
                    <Label req={!u.usuarioAEditar} hint={u.usuarioAEditar ? "Dejar vacío para no cambiar" : "Mínimo 8 caracteres"}>
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type="password"
                        value={u.formData.password}
                        onChange={(e) => u.handleChange("password", e.target.value)}
                        placeholder={u.usuarioAEditar ? "••••••••" : "Contraseña segura"}
                        className={`pl-9 ${inputClass} ${u.errores.password ? errorInputClass : ""}`}
                      />
                    </div>
                    {u.errores.password && (
                      <p className="text-red-500 text-[11px] mt-1 font-medium">{u.errores.password}</p>
                    )}
                  </div>
                </section>

                {/* Rol */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-amber-700" />
                    <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wide">Rol</h3>
                  </div>
                  <div>
                    <Label req>Rol del sistema</Label>
                    <select
                      value={u.formData.role}
                      onChange={(e) => u.handleChange("role", e.target.value)}
                      className={inputClass + " cursor-pointer"}
                    >
                      <option value="admin">Administrador (Acceso Total)</option>
                      <option value="vendedor">Vendedor (Punto de Venta / Clientes)</option>
                      <option value="logistica">Logística (Inventarios / Proveedores)</option>
                      <option value="repartidor">Repartidor (Entregas / Trazabilidad)</option>
                    </select>
                  </div>
                </section>
              </form>

              <div className="shrink-0 flex items-center gap-3 px-6 py-4 border-t border-stone-100 bg-white rounded-b-3xl">
                <button
                  type="button"
                  onClick={u.cerrarModal}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold text-stone-500 bg-stone-100 hover:bg-stone-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  form="usuarioForm"
                  type="submit"
                  disabled={u.guardando}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-white bg-amber-700 hover:bg-amber-800 disabled:opacity-60 active:scale-[0.98] transition-all shadow-md shadow-amber-800/20"
                >
                  {u.guardando ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Guardando…
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {u.usuarioAEditar ? "Actualizar usuario" : "Crear cuenta"}
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