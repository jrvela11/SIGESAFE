import React from "react";
import { DashboardLayout } from "../dashboard/DashboardLayout";
import { useCategorias } from "./useCategorias";
import {
  Plus, Edit, Trash2, Search, X, Save, Tags, CheckCircle, XCircle, RefreshCw,
  ChevronLeft, ChevronRight
} from "lucide-react";

// ─── Sub-componentes de UI ────────────────────────────────────────────────────

const FieldLabel: React.FC<{ children: React.ReactNode; required?: boolean }> = ({ children, required }) => (
  <div className="flex items-center justify-between mb-1.5">
    <span className="text-[10px] font-bold text-[#7A6E65] uppercase tracking-[0.8px]">
      {children}
      {required && <span className="text-[#C17B2A] ml-0.5">*</span>}
    </span>
  </div>
);

const inputBase =
  "w-full px-3 py-2.5 rounded-lg border border-[#DDD5CB] bg-[#FDFAF7] text-[12.5px] " +
  "text-[#2C1A0E] outline-none transition focus:border-[#C17B2A] focus:ring-2 " +
  "focus:ring-[#C17B2A]/15 placeholder:text-[#C0B4AA]";

const inputError = "border-red-300 focus:border-red-500 focus:ring-red-500/15";

// ─── Vista principal ──────────────────────────────────────────────────────────

export const CategoriasView = () => {
  const cat = useCategorias();

  const Paginador = () => {
    if (cat.totalPaginas <= 1) return null;
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => cat.setPagina((p) => Math.max(1, p - 1))}
          disabled={cat.paginaAjustada === 1}
          className="w-7 h-7 rounded-md bg-white border border-[#EDE8E1] flex items-center justify-center text-[#7A6E65] hover:bg-[#F7F5F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {Array.from({ length: cat.totalPaginas }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => cat.setPagina(n)}
            className={`w-7 h-7 rounded-md text-[11.5px] font-bold transition-all ${
              cat.paginaAjustada === n
                ? "bg-[#C17B2A] text-white border border-[#C17B2A]"
                : "bg-white text-[#5A4A3C] border border-[#EDE8E1] hover:bg-[#F7F5F2]"
            }`}
          >
            {n}
          </button>
        ))}

        <button
          onClick={() => cat.setPagina((p) => Math.min(cat.totalPaginas, p + 1))}
          disabled={cat.paginaAjustada === cat.totalPaginas}
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
              Catálogo de Categorías
            </h1>
            <p className="text-[12.5px] text-[#8B7D72] mt-1">
              Clasifica y organiza tus productos de café, cacao y subproductos.
            </p>
          </div>
          <button
            onClick={cat.abrirModalCrear}
            className="inline-flex items-center gap-2 bg-[#C17B2A] hover:bg-[#A86522] text-white text-[12.5px] font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm shadow-[#C17B2A]/20"
          >
            <Plus className="w-3.5 h-3.5" />
            Nueva Categoría
          </button>
        </div>

        {/* ── KPIs ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              icon: <Tags className="w-5 h-5 text-[#C17B2A]" />,
              iconBg: "bg-[#FDF3E7]",
              value: cat.totalCategorias,
              label: "Total categorías",
            },
            {
              icon: <CheckCircle className="w-5 h-5 text-[#0D7A3E]" />,
              iconBg: "bg-[#EDFBF3]",
              value: cat.categoriasActivas,
              label: "Categorías activas",
            },
            {
              icon: <XCircle className="w-5 h-5 text-[#8B2020]" />,
              iconBg: "bg-[#FCEBEB]",
              value: cat.categoriasInactivas,
              label: "Categorías inactivas",
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
          {/* Búsqueda */}
          <div className="flex-1 flex items-center gap-2 bg-white border border-[#EDE8E1] rounded-lg px-3 py-2 focus-within:border-[#C17B2A] focus-within:ring-2 focus-within:ring-[#C17B2A]/15 transition-all w-full">
            <Search className="w-3.5 h-3.5 text-[#B5A99E] shrink-0" />
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={cat.busqueda}
              onChange={(e) => cat.setBusqueda(e.target.value)}
              className="flex-1 bg-transparent text-[12.5px] text-[#1C0F05] placeholder:text-[#C0B4AA] outline-none"
            />
            {cat.busqueda && (
              <button onClick={() => cat.setBusqueda("")} className="text-[#B5A99E] hover:text-[#5A4A3C] transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Tabs activos/inactivos */}
          <div className="flex bg-[#EDE8E1] rounded-lg p-1 gap-1 shrink-0">
            {(["activos", "inactivos"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => cat.setFiltroEstado(tab)}
                className={`px-4 py-1.5 rounded-md text-[11.5px] font-semibold transition-all ${
                  cat.filtroEstado === tab
                    ? "bg-white text-[#1C0F05] shadow-sm"
                    : "text-[#8B7D72] hover:text-[#4A3728]"
                }`}
              >
                {tab === "activos" ? "Activos" : "Inactivos"}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tabla ── */}
        <div className="bg-white rounded-xl border border-[#EDE8E1] overflow-hidden">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="bg-[#FDFAF7] border-b border-[#EDE8E1]">
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.8px] text-[#A8978B] w-1/4">
                  Categoría
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.8px] text-[#A8978B]">
                  Descripción
                </th>
                <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-[0.8px] text-[#A8978B]">
                  Estado
                </th>
                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.8px] text-[#A8978B]">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F0EB]">
              {cat.cargando ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-3.5"><div className="h-4 bg-[#F0EBE4] rounded w-3/4" /></td>
                    <td className="px-5 py-3.5"><div className="h-4 bg-[#F0EBE4] rounded w-full" /></td>
                    <td className="px-5 py-3.5"><div className="h-5 bg-[#F0EBE4] rounded-full w-14 mx-auto" /></td>
                    <td className="px-5 py-3.5"><div className="h-7 bg-[#F0EBE4] rounded w-14 ml-auto" /></td>
                  </tr>
                ))
              ) : cat.categoriasPaginadas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-[#9A8E82] text-sm">
                    {cat.busqueda
                      ? `Sin resultados para "${cat.busqueda}".`
                      : `No hay categorías ${cat.filtroEstado}.`}
                  </td>
                </tr>
              ) : (
                cat.categoriasPaginadas.map((categoria) => (
                  <tr key={categoria.id} className="group hover:bg-[#FDFAF7] transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center">
                        <Tags className="w-3.5 h-3.5 text-[#C17B2A] mr-2 opacity-70" />
                        <span className="font-semibold text-[#1C0F05]">{categoria.nombre}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[#7A6E65] max-w-xs truncate" title={categoria.descripcion || ""}>
                      {categoria.descripcion || <span className="text-[#C0B4AA] italic">Sin descripción</span>}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                          categoria.estado
                            ? "bg-[#EDFBF3] text-[#0D6E3F] border border-[#9FE1CB]"
                            : "bg-[#FCEBEB] text-[#8B2020] border border-[#F7C1C1]"
                        }`}
                      >
                        {categoria.estado ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {categoria.estado ? (
                          <>
                            <button
                              onClick={() => cat.abrirModalEditar(categoria)}
                              className="w-7 h-7 rounded-md flex items-center justify-center text-[#9A8E82] border border-transparent hover:text-[#1C0F05] hover:bg-[#F7F5F2] hover:border-[#EDE8E1] transition-all"
                              title="Editar"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => cat.handleDesactivar(categoria.id, categoria.nombre)}
                              className="w-7 h-7 rounded-md flex items-center justify-center text-[#9A8E82] border border-transparent hover:text-red-600 hover:bg-[#FCEBEB] hover:border-[#F7C1C1] transition-all"
                              title="Suspender categoría"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => cat.handleReactivar(categoria.id)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold text-[#8B5A1A] bg-[#FDF3E7] border border-[#F0D9B5] rounded-lg hover:bg-[#F5E4C6] transition-colors"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Reactivar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Footer de tabla */}
          <div className="px-5 py-2.5 bg-[#FDFAF7] border-t border-[#EDE8E1] flex items-center justify-between">
            <span className="text-[11px] text-[#9A8E82]">
              {cat.categoriasFiltradas?.length ?? 0} categoría
              {(cat.categoriasFiltradas?.length ?? 0) !== 1 ? "s" : ""}
            </span>
            <Paginador />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          MODAL
      ════════════════════════════════════════════════════════════════════ */}
      {cat.isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Fondo */}
          <div
            className="absolute inset-0 bg-[#1C0F05]/55 backdrop-blur-sm"
            onClick={cat.cerrarModal}
          />

          {/* Panel */}
          <div className="relative bg-white w-full max-w-[440px] mx-0 sm:mx-4 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[88vh] border border-[#EDE8E1]">
            {/* Drag handle móvil */}
            <div className="sm:hidden w-9 h-1 bg-[#DDD5CB] rounded-full mx-auto mt-3 mb-1 shrink-0" />

            {/* Header del modal */}
            <div className="shrink-0 flex items-start justify-between px-5 py-4 border-b border-[#F0EBE4]">
              <div>
                <h2 className="text-[15px] font-black text-[#1C0F05]">
                  {cat.categoriaAEditar ? "Editar categoría" : "Nueva categoría"}
                </h2>
                <p className="text-[11px] text-[#9A8E82] mt-0.5">
                  {cat.categoriaAEditar
                    ? "Modifica los detalles de la categoría."
                    : "Crea una nueva clasificación para el catálogo."}
                </p>
              </div>
              <button
                onClick={cat.cerrarModal}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#7A6E65] hover:text-[#1C0F05] hover:bg-[#F7F5F2] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Cuerpo del formulario */}
            <form
              id="categoriaForm"
              onSubmit={cat.handleSubmit}
              className="flex-1 overflow-y-auto px-5 py-5 space-y-4"
            >
              <div>
                <FieldLabel required>Nombre de la Categoría</FieldLabel>
                <input
                  type="text"
                  value={cat.formData.nombre}
                  onChange={(e) => cat.handleChange("nombre", e.target.value)}
                  className={`${inputBase} ${cat.errores.nombre ? inputError : ""}`}
                  placeholder="Ej: Café Tostado Mínimo"
                />
                {cat.errores.nombre && (
                  <p className="text-red-500 text-[10.5px] mt-1 font-medium">{cat.errores.nombre}</p>
                )}
              </div>

              <div>
                <FieldLabel>Descripción</FieldLabel>
                <textarea
                  rows={4}
                  value={cat.formData.descripcion}
                  onChange={(e) => cat.handleChange("descripcion", e.target.value)}
                  className={`${inputBase} resize-none`}
                  placeholder="Detalles y alcance de los subproductos..."
                />
              </div>
            </form>

            {/* Footer del modal */}
            <div className="shrink-0 flex items-center gap-2.5 px-5 py-4 border-t border-[#F0EBE4] bg-white rounded-b-2xl">
              <button
                type="button"
                onClick={cat.cerrarModal}
                className="flex-1 py-2.5 rounded-lg text-[12.5px] font-semibold text-[#5A4A3C] bg-[#F7F5F2] border border-[#EDE8E1] hover:bg-[#EDE8E1] transition-colors"
              >
                Cancelar
              </button>
              <button
                form="categoriaForm"
                type="submit"
                disabled={cat.guardando}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12.5px] font-semibold text-white bg-[#C17B2A] hover:bg-[#A86522] disabled:opacity-60 active:scale-[0.98] transition-all shadow-sm shadow-[#C17B2A]/25"
              >
                {cat.guardando ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Guardando…
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    {cat.categoriaAEditar ? "Actualizar" : "Guardar"}
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