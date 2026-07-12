import React from "react";
import { DashboardLayout } from "../dashboard/DashboardLayout";
import { useUsuarios } from "./useUsuarios";
import {
  Plus, Edit, Trash2, Search, X, Save,
  Shield, Users, UserCheck, RefreshCw, Key,
  ChevronLeft, ChevronRight,
} from "lucide-react";

const FieldLabel: React.FC<{ children: React.ReactNode; required?: boolean; hint?: string; }> = ({ children, required, hint }) => (
  <div className="flex items-center justify-between mb-1.5">
    <span className="text-[10px] font-bold text-[#7A6E65] uppercase tracking-[0.8px]">
      {children} {required && <span className="text-[#C17B2A] ml-0.5">*</span>}
    </span>
    {hint && <span className="text-[10px] text-[#B5A99E]">{hint}</span>}
  </div>
);

const inputBase =
  "w-full px-3 py-2.5 rounded-lg border border-[#DDD5CB] bg-[#FDFAF7] text-[12.5px] " +
  "text-[#2C1A0E] outline-none transition focus:border-[#C17B2A] focus:ring-2 " +
  "focus:ring-[#C17B2A]/15 placeholder:text-[#C0B4AA]";
const inputError = "border-red-300 focus:border-red-500 focus:ring-red-500/15";

const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  const map: Record<string, { label: string; className: string }> = {
    admin: { label: "Administrador", className: "bg-[#F1EFFE] text-[#5B45C2] border border-[#D9D2F9]" },
    comprador: { label: "Comprador", className: "bg-[#FEF3E6] text-[#944F0A] border border-[#F5D5A3]" },
    vendedor: { label: "Vendedor", className: "bg-[#E6F1FB] text-[#1A5FA0] border border-[#B5D4F4]" },
    motorizado: { label: "Motorizado", className: "bg-[#EDFBF3] text-[#0D6E3F] border border-[#9FE1CB]" },
  };
  const cfg = map[role] ?? map.vendedor;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${cfg.className}`}>
      {cfg.label}
    </span>
  );
};

export const UsuariosView = () => {
  const u = useUsuarios();

  const Paginador = () => {
    if (u.totalPaginas <= 1) return null;
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => u.setPagina((p) => Math.max(1, p - 1))}
          disabled={u.paginaAjustada === 1}
          className="w-7 h-7 rounded-md bg-white border border-[#EDE8E1] flex items-center justify-center text-[#7A6E65] hover:bg-[#F7F5F2] disabled:opacity-40 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {Array.from({ length: u.totalPaginas }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => u.setPagina(n)}
            className={`w-7 h-7 rounded-md text-[11.5px] font-bold transition-all ${
              u.paginaAjustada === n
                ? "bg-[#C17B2A] text-white border border-[#C17B2A]"
                : "bg-white text-[#5A4A3C] border border-[#EDE8E1] hover:bg-[#F7F5F2]"
            }`}
          >
            {n}
          </button>
        ))}

        <button
          onClick={() => u.setPagina((p) => Math.min(u.totalPaginas, p + 1))}
          disabled={u.paginaAjustada === u.totalPaginas}
          className="w-7 h-7 rounded-md bg-white border border-[#EDE8E1] flex items-center justify-center text-[#7A6E65] hover:bg-[#F7F5F2] disabled:opacity-40 transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 pb-12">
        {/* Cabecera y KPIs (sin cambios visuales mayores) */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[20px] font-black text-[#1C0F05] tracking-tight leading-tight">Cuentas de usuario</h1>
            <p className="text-[12.5px] text-[#8B7D72] mt-1">Administra los accesos y roles del sistema</p>
          </div>
          <button
            onClick={u.abrirModalCrear}
            className="inline-flex items-center gap-2 bg-[#C17B2A] hover:bg-[#A86522] text-white text-[12.5px] font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm shadow-[#C17B2A]/20"
          >
            <Plus className="w-3.5 h-3.5" /> Nuevo usuario
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: <Users className="w-5 h-5 text-[#C17B2A]" />, bg: "bg-[#FDF3E7]", value: u.totalUsuarios, label: "Total registrados" },
            { icon: <UserCheck className="w-5 h-5 text-[#0D7A3E]" />, bg: "bg-[#EDFBF3]", value: u.usuariosActivos, label: "Cuentas activas" },
            { icon: <Shield className="w-5 h-5 text-[#5B45C2]" />, bg: "bg-[#F1EFFE]", value: u.totalAdmins, label: "Administradores" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white rounded-xl border border-[#EDE8E1] p-4 flex items-center gap-3.5">
              <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center shrink-0`}>{kpi.icon}</div>
              <div>
                <p className="text-[22px] font-black text-[#1C0F05] leading-none">{kpi.value}</p>
                <p className="text-[11px] text-[#9A8E82] mt-1 font-medium">{kpi.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Buscador */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-white border border-[#EDE8E1] rounded-lg px-3 py-2 focus-within:border-[#C17B2A] transition-all w-full">
            <Search className="w-3.5 h-3.5 text-[#B5A99E] shrink-0" />
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={u.busqueda}
              onChange={(e) => u.setBusqueda(e.target.value)}
              className="flex-1 bg-transparent text-[12.5px] text-[#1C0F05] placeholder:text-[#C0B4AA] outline-none"
            />
            {u.busqueda && <button onClick={() => u.setBusqueda("")}><X className="w-3.5 h-3.5 text-[#B5A99E]" /></button>}
          </div>

          <div className="flex bg-[#EDE8E1] rounded-lg p-1 gap-1 shrink-0">
            {(["activos", "inactivos"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => u.setFiltroEstado(tab)}
                className={`px-4 py-1.5 rounded-md text-[11.5px] font-semibold transition-all ${
                  u.filtroEstado === tab ? "bg-white text-[#1C0F05] shadow-sm" : "text-[#8B7D72] hover:text-[#4A3728]"
                }`}
              >
                {tab === "activos" ? "Activos" : "Inactivos"}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl border border-[#EDE8E1] overflow-hidden">
          <div className="max-h-[300px] overflow-y-auto">
            <table className="w-full text-[12.5px]">
              <thead>
                <tr className="bg-[#FDFAF7] border-b border-[#EDE8E1]">
                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.8px] text-[#A8978B]">Usuario</th>
                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.8px] text-[#A8978B]">Rol</th>
                  <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-[0.8px] text-[#A8978B]">Estado</th>
                  <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.8px] text-[#A8978B]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F0EB]">
                {u.cargando ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-5 py-3.5"><div className="h-3.5 bg-[#F0EBE4] rounded w-3/4 mb-1.5" /><div className="h-3 bg-[#F0EBE4] rounded w-1/2" /></td>
                      <td className="px-5 py-3.5"><div className="h-5 bg-[#F0EBE4] rounded-full w-20" /></td>
                      <td className="px-5 py-3.5"><div className="h-5 bg-[#F0EBE4] rounded-full w-14 mx-auto" /></td>
                      <td className="px-5 py-3.5"><div className="h-7 bg-[#F0EBE4] rounded w-14 ml-auto" /></td>
                    </tr>
                  ))
                ) : u.usuariosPaginados.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-[#9A8E82] text-sm">
                      {u.busqueda ? `Sin resultados para "${u.busqueda}".` : `No hay usuarios ${u.filtroEstado}.`}
                    </td>
                  </tr>
                ) : (
                  u.usuariosPaginados.map((usuario) => (
                    <tr key={usuario.id} className="group hover:bg-[#FDFAF7] transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-semibold text-[#1C0F05]">{usuario.name}</p>
                        <p className="text-[11px] text-[#9A8E82] mt-0.5">{usuario.email}</p>
                      </td>
                      <td className="px-5 py-3"><RoleBadge role={usuario.role} /></td>
                      <td className="px-5 py-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                            usuario.is_active ? "bg-[#EDFBF3] text-[#0D6E3F] border border-[#9FE1CB]" : "bg-[#FCEBEB] text-[#8B2020] border border-[#F7C1C1]"
                          }`}
                        >
                          {usuario.is_active ? "Activo" : "Suspendido"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          {usuario.is_active ? (
                            <>
                              <button onClick={() => u.abrirModalEditar(usuario)} className="w-7 h-7 rounded-md flex items-center justify-center text-[#9A8E82] hover:text-[#1C0F05] hover:bg-[#F7F5F2]"><Edit className="w-3.5 h-3.5" /></button>
                              <button onClick={() => u.handleDesactivar(usuario.id, usuario.name)} className="w-7 h-7 rounded-md flex items-center justify-center text-[#9A8E82] hover:text-red-600 hover:bg-[#FCEBEB]"><Trash2 className="w-3.5 h-3.5" /></button>
                            </>
                          ) : (
                            <button onClick={() => u.handleReactivar(usuario.id, usuario.name)} className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold text-[#8B5A1A] bg-[#FDF3E7] border border-[#F0D9B5] rounded-lg hover:bg-[#F5E4C6]"><RefreshCw className="w-3 h-3" /> Reactivar</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-2.5 bg-[#FDFAF7] border-t border-[#EDE8E1] flex items-center justify-between">
            <span className="text-[11px] text-[#9A8E82]">{u.usuariosFiltrados?.length ?? 0} usuario{(u.usuariosFiltrados?.length !== 1) && "s"}</span>
            <Paginador />
          </div>
        </div>
      </div>

      {/* Modal */}
      {u.isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-[#1C0F05]/55 backdrop-blur-sm" onClick={u.cerrarModal} />
          <div className="relative bg-white w-full max-w-[480px] mx-0 sm:mx-4 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[88vh] border border-[#EDE8E1]">
            <div className="sm:hidden w-9 h-1 bg-[#DDD5CB] rounded-full mx-auto mt-3 mb-1 shrink-0" />
            <div className="shrink-0 flex items-start justify-between px-5 py-4 border-b border-[#F0EBE4]">
              <div>
                <h2 className="text-[15px] font-black text-[#1C0F05]">{u.usuarioAEditar ? "Editar usuario" : "Nuevo usuario"}</h2>
                <p className="text-[11px] text-[#9A8E82] mt-0.5">{u.usuarioAEditar ? "Actualiza los datos de acceso." : "Crea una nueva cuenta."}</p>
              </div>
              <button onClick={u.cerrarModal} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#7A6E65] hover:bg-[#F7F5F2]"><X className="w-3.5 h-3.5" /></button>
            </div>

            <form id="usuarioForm" onSubmit={u.handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
              <section>
                <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-[#F0EBE4]"><Users className="w-3.5 h-3.5 text-[#C17B2A]" /><h3 className="text-[10px] font-black uppercase tracking-[1px] text-[#9A8E82]">Datos de la cuenta</h3></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>Nombre completo</FieldLabel>
                    <input type="text" value={u.formData.name} onChange={(e) => u.handleChange("name", e.target.value)} className={`${inputBase} ${u.errores.name ? inputError : ""}`} placeholder="Ej. Carlos Mendoza" />
                    {u.errores.name && <p className="text-red-500 text-[10.5px] mt-1 font-medium">{u.errores.name}</p>}
                  </div>
                  <div>
                    <FieldLabel required>Correo electrónico</FieldLabel>
                    <input type="email" value={u.formData.email} onChange={(e) => u.handleChange("email", e.target.value)} className={`${inputBase} ${u.errores.email ? inputError : ""}`} placeholder="usuario@empresa.com" />
                    {u.errores.email && <p className="text-red-500 text-[10.5px] mt-1 font-medium">{u.errores.email}</p>}
                  </div>
                </div>
                <div className="mt-4">
                  <FieldLabel required={!u.usuarioAEditar} hint={u.usuarioAEditar ? "Dejar vacío para no cambiar" : "Mínimo 8 caracteres"}>Contraseña</FieldLabel>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#B5A99E]" />
                    <input type="password" value={u.formData.password} onChange={(e) => u.handleChange("password", e.target.value)} placeholder={u.usuarioAEditar ? "••••••••" : "Contraseña de acceso"} className={`pl-9 ${inputBase} ${u.errores.password ? inputError : ""}`} />
                  </div>
                  {u.errores.password && <p className="text-red-500 text-[10.5px] mt-1 font-medium">{u.errores.password}</p>}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-[#F0EBE4]"><Shield className="w-3.5 h-3.5 text-[#C17B2A]" /><h3 className="text-[10px] font-black uppercase tracking-[1px] text-[#9A8E82]">Permisos y rol</h3></div>
                <div>
                  <FieldLabel required>Rol del sistema</FieldLabel>
                  <select value={u.formData.role} onChange={(e) => u.handleChange("role", e.target.value)} className={`${inputBase} cursor-pointer`}>
                    <option value="admin">Administrador — Acceso total</option>
                    <option value="vendedor">Vendedor — Punto de venta / Clientes</option>
                    <option value="comprador">Comprador — Punto de compra / Proveedores</option>
                    <option value="motorizado">Motorizado — Entregas / Trazabilidad</option>
                  </select>
                </div>
              </section>
            </form>

            <div className="shrink-0 flex items-center gap-2.5 px-5 py-4 border-t border-[#F0EBE4] bg-white rounded-b-2xl">
              <button type="button" onClick={u.cerrarModal} className="flex-1 py-2.5 rounded-lg text-[12.5px] font-semibold text-[#5A4A3C] bg-[#F7F5F2] border border-[#EDE8E1] hover:bg-[#EDE8E1]">Cancelar</button>
              <button form="usuarioForm" type="submit" disabled={u.guardando} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12.5px] font-semibold text-white bg-[#C17B2A] hover:bg-[#A86522] disabled:opacity-60 shadow-sm shadow-[#C17B2A]/25">
                {u.guardando ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Guardando…</> : <><Save className="w-3.5 h-3.5" /> {u.usuarioAEditar ? "Actualizar" : "Crear cuenta"}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};