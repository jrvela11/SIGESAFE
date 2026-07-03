import React, { useState } from "react";
import { DashboardLayout } from "../dashboard/DashboardLayout";
import { useProductos } from "./useProductos";
import {
  Plus, Edit, Trash2, Search, X, Save, Package, AlertTriangle,
  CheckCircle, RefreshCw, Tag, DollarSign, ShoppingCart, 
  LayoutGrid, List, TrendingUp, Filter, ChevronLeft, ChevronRight, Coffee
} from "lucide-react";

const sol = (n: number) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(n);

// ─── Sub-componentes de UI ──────────────────────────────────────────────────
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

// ─── Tarjeta de producto (Grid) ─────────────────────────────────────────────
const ProductCard: React.FC<{
  prod: ReturnType<typeof useProductos>["productos"][0];
  catNombre: string;
  onEdit: () => void;
  onDelete: () => void;
  onReactivar: () => void;
}> = ({ prod, catNombre, onEdit, onDelete, onReactivar }) => {
  const critico = prod.stock_actual <= prod.stock_minimo;
  const margen =
    prod.precio_compra > 0
      ? (((prod.precio_minorista - prod.precio_compra) / prod.precio_compra) * 100).toFixed(0)
      : null;

  return (
    <div
      className={`group bg-white rounded-2xl border flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        critico ? "border-red-200 hover:border-red-300" : "border-[#EDE8E1] hover:border-[#C17B2A]"
      } ${!prod.estado ? "opacity-60" : ""} overflow-hidden`}
    >
      <div className="relative aspect-[4/3] rounded-t-2xl overflow-hidden bg-[#F7F5F2] shrink-0">
        {prod.imagen_url ? (
          <img src={`/storage/${prod.imagen_url}`} alt={prod.nombre} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#FDFAF7]">
            <Coffee className="w-8 h-8 text-[#C0B4AA]" />
            <span className="text-[10px] text-[#C0B4AA] font-medium">Sin imagen</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-[#1C0F05]/80 text-[#F5ECD7] backdrop-blur-sm shadow-sm">
            <Tag className="w-2.5 h-2.5" />
            {catNombre}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm ${
            critico ? "bg-red-500 text-white" : "bg-white/90 text-[#0D7A3E] border border-[#9FE1CB] backdrop-blur-sm"
          }`}>
            {critico && <AlertTriangle className="w-3 h-3" />}
            {prod.stock_actual} <span className="font-normal opacity-80">{prod.unidad_medida}</span>
          </span>
        </div>
        
        {prod.estado && (
          <div className="absolute inset-0 bg-[#1C0F05]/0 group-hover:bg-[#1C0F05]/10 transition-colors flex items-end justify-end p-3 opacity-0 group-hover:opacity-100">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="p-2 bg-white rounded-lg shadow-md text-[#C17B2A] hover:bg-[#FDF3E7] transition-all"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-bold text-[#1C0F05] text-[13px] leading-snug line-clamp-2">{prod.nombre}</h3>
          <p className="text-[10px] font-mono text-[#9A8E82] mt-1">SKU: {prod.sku}</p>
        </div>

        <div className="bg-[#FDFAF7] rounded-xl p-3 border border-[#F0EBE4] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#9A8E82] flex items-center gap-1">
              <ShoppingCart className="w-3 h-3" /> Costo ref.
            </span>
            <span className="text-[11.5px] font-semibold text-[#5A4A3C]">{sol(prod.precio_compra)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#9A8E82]">Venta min.</span>
            <div className="flex items-center gap-2">
              {margen && (
                <span className="text-[9px] font-bold text-[#0D7A3E] bg-[#EDFBF3] border border-[#9FE1CB] px-1.5 py-0.5 rounded-md">
                  +{margen}%
                </span>
              )}
              <span className="text-[13px] font-black text-[#0D7A3E]">{sol(prod.precio_minorista)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-auto">
          {prod.estado ? (
            <>
              <button
                onClick={onEdit}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#F7F5F2] hover:bg-[#FDF3E7] hover:text-[#C17B2A] text-[#5A4A3C] text-[11.5px] font-bold transition-colors border border-[#EDE8E1] hover:border-[#F0D9B5]"
              >
                <Edit className="w-3.5 h-3.5" /> Editar
              </button>
              <button
                onClick={onDelete}
                className="p-2 rounded-lg bg-[#F7F5F2] hover:bg-[#FCEBEB] hover:text-red-600 text-[#9A8E82] transition-colors border border-[#EDE8E1] hover:border-[#F7C1C1]"
                title="Desactivar"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              onClick={onReactivar}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#FDF3E7] hover:bg-[#F5E4C6] text-[#8B5A1A] text-[11.5px] font-bold border border-[#F0D9B5] transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Publicar de nuevo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Fila de tabla (List) ───────────────────────────────────────────────────
const ProductRow: React.FC<{
  prod: ReturnType<typeof useProductos>["productos"][0];
  catNombre: string;
  onEdit: () => void;
  onDelete: () => void;
  onReactivar: () => void;
}> = ({ prod, catNombre, onEdit, onDelete, onReactivar }) => {
  const critico = prod.stock_actual <= prod.stock_minimo;
  return (
    <tr className={`group transition-colors hover:bg-[#FDFAF7] ${!prod.estado ? "opacity-60" : ""}`}>
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          {prod.imagen_url ? (
            <img src={`/storage/${prod.imagen_url}`} alt={prod.nombre}
              className="w-10 h-10 rounded-lg object-cover border border-[#EDE8E1] shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-[#F7F5F2] flex items-center justify-center shrink-0 border border-[#EDE8E1]">
              <Coffee className="w-4 h-4 text-[#C0B4AA]" />
            </div>
          )}
          <div>
            <p className="font-semibold text-[#1C0F05] text-[12.5px] leading-tight">{prod.nombre}</p>
            <p className="text-[10px] font-mono text-[#9A8E82] mt-0.5">
              {prod.sku} · <span className="text-[#C17B2A]">{catNombre}</span>
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3">
        <p className="text-[12.5px] font-black text-[#0D7A3E]">{sol(prod.precio_minorista)}</p>
        <p className="text-[10px] text-[#9A8E82]">costo {sol(prod.precio_compra)}</p>
      </td>
      <td className="px-5 py-3 text-center">
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
          critico ? "bg-[#FCEBEB] text-[#8B2020] border border-[#F7C1C1]" : "bg-[#EDFBF3] text-[#0D6E3F] border border-[#9FE1CB]"
        }`}>
          {critico && <AlertTriangle className="w-3 h-3" />}
          {prod.stock_actual} <span className="font-medium opacity-80">{prod.unidad_medida}</span>
        </span>
      </td>
      <td className="px-5 py-3">
        <div className="flex items-center justify-end gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
          {prod.estado ? (
            <>
              <button onClick={onEdit}
                className="w-7 h-7 rounded-md flex items-center justify-center text-[#9A8E82] border border-transparent hover:text-[#1C0F05] hover:bg-[#F7F5F2] hover:border-[#EDE8E1] transition-all">
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button onClick={onDelete}
                className="w-7 h-7 rounded-md flex items-center justify-center text-[#9A8E82] border border-transparent hover:text-red-600 hover:bg-[#FCEBEB] hover:border-[#F7C1C1] transition-all">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button onClick={onReactivar}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold text-[#8B5A1A] bg-[#FDF3E7] border border-[#F0D9B5] rounded-lg hover:bg-[#F5E4C6] transition-colors">
              <RefreshCw className="w-3 h-3" /> Publicar
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

// ─── Esqueletos ────────────────────────────────────────────────────────────
const CardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-[#EDE8E1] overflow-hidden animate-pulse">
    <div className="aspect-[4/3] bg-[#F7F5F2]" />
    <div className="p-4 space-y-3">
      <div className="h-3.5 bg-[#F0EBE4] rounded w-3/4" />
      <div className="h-2.5 bg-[#F0EBE4] rounded w-1/3" />
      <div className="h-14 bg-[#FDFAF7] border border-[#F0EBE4] rounded-xl" />
      <div className="h-8 bg-[#F0EBE4] rounded-lg" />
    </div>
  </div>
);

const TableSkeleton = () => (
  <div className="bg-white rounded-2xl border border-[#EDE8E1] shadow-sm overflow-hidden flex flex-col animate-pulse">
    <div className="overflow-auto max-h-[300px] p-6 space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#F7F5F2] rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-[#F0EBE4] rounded w-40" />
            <div className="h-2.5 bg-[#F0EBE4] rounded w-24" />
          </div>
          <div className="h-3.5 bg-[#F0EBE4] rounded w-20" />
          <div className="h-6 bg-[#F0EBE4] rounded-full w-16" />
        </div>
      ))}
    </div>
  </div>
);

// ─── Vista principal ───────────────────────────────────────────────────────

export const ProductosView = () => {
  const p = useProductos();
  const [vista, setVista] = useState<"grid" | "list">("grid");

  const Paginador = () => {
    if (p.totalPaginas <= 1) return null;
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => p.setPagina(Math.max(1, p.pagina - 1))}
          disabled={p.paginaAjustada === 1}
          className="w-7 h-7 rounded-md bg-white border border-[#EDE8E1] flex items-center justify-center text-[#7A6E65] hover:bg-[#F7F5F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {Array.from({ length: p.totalPaginas }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => p.setPagina(n)}
            className={`w-7 h-7 rounded-md text-[11.5px] font-bold transition-all ${
              p.paginaAjustada === n
                ? "bg-[#C17B2A] text-white border border-[#C17B2A]"
                : "bg-white text-[#5A4A3C] border border-[#EDE8E1] hover:bg-[#F7F5F2]"
            }`}
          >
            {n}
          </button>
        ))}

        <button
          onClick={() => p.setPagina(Math.min(p.totalPaginas, p.pagina + 1))}
          disabled={p.paginaAjustada === p.totalPaginas}
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
              Catálogo de Productos
            </h1>
            <p className="text-[12.5px] text-[#8B7D72] mt-1">
              Gestiona el catálogo de tu ERP. Costos y stock se nutren desde compras.
            </p>
          </div>
          <button
            onClick={p.abrirModalCrear}
            className="inline-flex items-center gap-2 bg-[#C17B2A] hover:bg-[#A86522] text-white text-[12.5px] font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm shadow-[#C17B2A]/20"
          >
            <Plus className="w-3.5 h-3.5" />
            Nuevo producto
          </button>
        </div>

        {/* ── KPIs ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-[#EDE8E1] p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#FDF3E7] flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 text-[#C17B2A]" />
            </div>
            <div>
              <p className="text-[22px] font-black text-[#1C0F05] leading-none">{p.totalActivos}</p>
              <p className="text-[11px] text-[#9A8E82] mt-1 font-medium">Productos activos</p>
            </div>
          </div>
          
          <div className={`rounded-xl border p-4 flex items-center gap-3.5 ${p.alertas > 0 ? "bg-[#FCEBEB] border-[#F7C1C1]" : "bg-white border-[#EDE8E1]"}`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${p.alertas > 0 ? "bg-[#FAD4D4]" : "bg-[#EDFBF3]"}`}>
              {p.alertas > 0 ? <AlertTriangle className="w-5 h-5 text-[#8B2020]" /> : <CheckCircle className="w-5 h-5 text-[#0D7A3E]" />}
            </div>
            <div>
              <p className={`text-[22px] font-black leading-none ${p.alertas > 0 ? "text-[#8B2020]" : "text-[#1C0F05]"}`}>{p.alertas}</p>
              <p className={`text-[11px] mt-1 font-medium ${p.alertas > 0 ? "text-[#B73D3D]" : "text-[#9A8E82]"}`}>
                {p.alertas > 0 ? "Con stock bajo" : "Sin alertas de stock"}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#EDE8E1] p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#F7F5F2] flex items-center justify-center shrink-0 border border-[#EDE8E1]">
              <TrendingUp className="w-5 h-5 text-[#7A6E65]" />
            </div>
            <div className="min-w-0">
              <p className="text-[20px] font-black text-[#1C0F05] leading-none truncate">{sol(p.costoTotal)}</p>
              <p className="text-[11px] text-[#9A8E82] mt-1 font-medium">Valor ref. inventario</p>
            </div>
          </div>
        </div>

        {/* ── Filtros y controles ── */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
          <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center bg-white border border-[#EDE8E1] rounded-lg px-2 py-1 gap-2 w-full focus-within:border-[#C17B2A] focus-within:ring-2 focus-within:ring-[#C17B2A]/15 transition-all">
            <div className="flex-1 flex items-center px-2 py-1.5">
              <Search className="w-3.5 h-3.5 text-[#B5A99E] shrink-0 mr-2" />
              <input type="text" placeholder="Buscar por nombre, SKU..." value={p.busqueda}
                onChange={(e) => p.setBusqueda(e.target.value)}
                className="flex-1 bg-transparent text-[12.5px] text-[#1C0F05] placeholder:text-[#C0B4AA] outline-none w-full"
              />
              {p.busqueda && (
                <button onClick={() => p.setBusqueda("")} className="text-[#B5A99E] hover:text-[#5A4A3C]">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="hidden sm:block w-px h-5 bg-[#EDE8E1] shrink-0" />
            <div className="flex items-center px-2 w-full sm:w-auto pb-1 sm:pb-0">
              <Filter className="w-3.5 h-3.5 text-[#B5A99E] shrink-0 mr-2 hidden sm:block" />
              <select value={p.filtroCategoria} onChange={(e) => p.setFiltroCategoria(e.target.value)}
                className="bg-transparent text-[11.5px] text-[#7A6E65] font-semibold outline-none cursor-pointer w-full sm:w-auto py-1">
                <option value="">Todas las categorías</option>
                {p.categoriasLista.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="flex bg-[#EDE8E1] rounded-lg p-1 gap-1 flex-1 sm:flex-none">
              {(["activos", "inactivos"] as const).map((tab) => (
                <button key={tab} onClick={() => p.setFiltroEstado(tab)}
                  className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-[11.5px] font-semibold transition-all ${
                    p.filtroEstado === tab ? "bg-white text-[#1C0F05] shadow-sm" : "text-[#8B7D72] hover:text-[#4A3728]"
                  }`}>
                  {tab === "activos" ? "Activos" : "Inactivos"}
                </button>
              ))}
            </div>
            <div className="hidden sm:flex bg-[#EDE8E1] rounded-lg p-1 gap-1">
              <button onClick={() => setVista("grid")} title="Cuadrícula"
                className={`p-1.5 rounded-md transition-all ${vista === "grid" ? "bg-white text-[#C17B2A] shadow-sm" : "text-[#8B7D72] hover:text-[#4A3728]"}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setVista("list")} title="Lista"
                className={`p-1.5 rounded-md transition-all ${vista === "list" ? "bg-white text-[#C17B2A] shadow-sm" : "text-[#8B7D72] hover:text-[#4A3728]"}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Contenido ── */}
        {p.cargando ? (
          vista === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : <TableSkeleton />
        ) : p.productosPaginados.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#EDE8E1] py-20 flex flex-col items-center gap-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#F7F5F2] border border-[#EDE8E1] flex items-center justify-center">
              <Coffee className="w-7 h-7 text-[#C0B4AA]" />
            </div>
            <div className="text-center px-4">
              <p className="text-[#1C0F05] font-bold text-[15px]">
                {p.busqueda || p.filtroCategoria ? "Sin resultados" : "No hay productos"}
              </p>
              <p className="text-[#9A8E82] text-[12.5px] mt-1 max-w-xs">
                {p.busqueda || p.filtroCategoria ? "Intenta con otros términos de búsqueda." : "Agrega el primer producto al catálogo."}
              </p>
            </div>
          </div>
        ) : vista === "grid" ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {p.productosPaginados.map((prod) => (
                <ProductCard key={prod.id} prod={prod} catNombre={p.getNombreCat(prod.category_id)}
                  onEdit={() => p.abrirModalEditar(prod)}
                  onDelete={() => p.handleEliminar(prod.id, prod.nombre)}
                  onReactivar={() => p.handleReactivar(prod.id)}
                />
              ))}
            </div>
            {p.totalPaginas > 1 && (
              <div className="flex justify-center mt-6">
                <Paginador />
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl border border-[#EDE8E1] shadow-sm flex flex-col overflow-hidden">
            {/* Contenedor del scroll de la tabla (Altura máxima de 300px) */}
            <div className="overflow-auto max-h-[300px]">
              <table className="w-full text-[12.5px] text-left relative">
                <thead className="sticky top-0 z-10 shadow-[0_1px_0_#EDE8E1]">
                  <tr className="bg-[#FDFAF7]">
                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.8px] text-[#A8978B]">Producto</th>
                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.8px] text-[#A8978B]">Precio</th>
                    <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-[0.8px] text-[#A8978B]">Stock</th>
                    <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.8px] text-[#A8978B]">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F0EB]">
                  {p.productosPaginados.map((prod) => (
                    <ProductRow key={prod.id} prod={prod} catNombre={p.getNombreCat(prod.category_id)}
                      onEdit={() => p.abrirModalEditar(prod)}
                      onDelete={() => p.handleEliminar(prod.id, prod.nombre)}
                      onReactivar={() => p.handleReactivar(prod.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer de tabla (Paginador) */}
            <div className="px-5 py-2.5 bg-[#FDFAF7] border-t border-[#EDE8E1] flex items-center justify-between shrink-0">
              <span className="text-[11px] text-[#9A8E82]">
                {p.productosFiltrados.length} producto{p.productosFiltrados.length !== 1 ? "s" : ""}
              </span>
              <Paginador />
            </div>
          </div>
        )}

        {/* ── MODAL ───────────────────────────────────────────────────────── */}
        {p.isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-[#1C0F05]/55 backdrop-blur-sm" onClick={p.cerrarModal} />
            <div className="relative bg-white w-full max-w-[650px] mx-0 sm:mx-4 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[88vh] border border-[#EDE8E1]">
              <div className="sm:hidden w-9 h-1 bg-[#DDD5CB] rounded-full mx-auto mt-3 mb-1 shrink-0" />

              <div className="shrink-0 flex items-start justify-between px-5 py-4 border-b border-[#F0EBE4]">
                <div>
                  <h2 className="text-[15px] font-black text-[#1C0F05]">
                    {p.productoAEditar ? "Editar producto" : "Nuevo producto"}
                  </h2>
                  <p className="text-[11px] text-[#9A8E82] mt-0.5">
                    Define la información base. El costo y stock real se alimentan desde Compras.
                  </p>
                </div>
                <button onClick={p.cerrarModal}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[#7A6E65] hover:text-[#1C0F05] hover:bg-[#F7F5F2] transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <form id="productoForm" onSubmit={p.handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
                
                <section>
                  <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-[#F0EBE4]">
                    <Coffee className="w-3.5 h-3.5 text-[#C17B2A]" />
                    <h3 className="text-[10px] font-black uppercase tracking-[1px] text-[#9A8E82]">Información básica</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-5">
                    <div className="shrink-0 mx-auto sm:mx-0">
                      <input type="file" ref={p.fileInputRef} id="img-upload" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={p.handleImageChange} />
                      <label htmlFor="img-upload" className="cursor-pointer block">
                        <div className={`w-28 h-28 rounded-2xl border-2 border-dashed bg-[#FDFAF7] overflow-hidden flex items-center justify-center group transition-colors ${p.errores.imagen ? 'border-red-400' : 'border-[#DDD5CB] hover:border-[#C17B2A]'}`}>
                          {p.previewUrl ? (
                            <img src={p.previewUrl} alt="preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center gap-1 group-hover:opacity-60 transition-opacity">
                              <Coffee className="w-6 h-6 text-[#C0B4AA]" />
                              <span className="text-[10px] text-[#B5A99E] font-bold text-center leading-tight mt-1">Subir foto</span>
                            </div>
                          )}
                        </div>
                        <p className="text-[9px] text-[#B5A99E] text-center mt-1.5 font-medium">PNG, JPG (máx 2MB)</p>
                      </label>
                      {p.errores.imagen && <p className="text-red-500 text-[9px] text-center mt-1">{p.errores.imagen}</p>}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <FieldLabel required>Nombre del producto</FieldLabel>
                        <input type="text" value={p.formData.nombre} onChange={e => p.setFormData({ ...p.formData, nombre: e.target.value })}
                          placeholder="Ej. Café Lavado Premium" className={`${inputBase} ${p.errores.nombre ? inputError : ""}`} />
                        {p.errores.nombre && <p className="text-red-500 text-[10.5px] mt-1 font-medium">{p.errores.nombre}</p>}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <FieldLabel required>Categoría</FieldLabel>
                          <select value={p.formData.category_id} onChange={e => p.setFormData({ ...p.formData, category_id: e.target.value })}
                            className={`${inputBase} cursor-pointer ${p.errores.category_id ? inputError : ""}`}>
                            <option value="" disabled>— Seleccionar —</option>
                            {p.categoriasLista.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                          </select>
                          {p.errores.category_id && <p className="text-red-500 text-[10.5px] mt-1 font-medium">{p.errores.category_id}</p>}
                        </div>
                        <div>
                          <FieldLabel required hint="Único">SKU</FieldLabel>
                          <input type="text" value={p.formData.sku} onChange={e => p.setFormData({ ...p.formData, sku: e.target.value.toUpperCase().replace(/\s/g, "-") })}
                            placeholder="PROD-001" className={`${inputBase} font-mono uppercase ${p.errores.sku ? inputError : ""}`} />
                          {p.errores.sku && <p className="text-red-500 text-[10.5px] mt-1 font-medium">{p.errores.sku}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <FieldLabel>Código de Barras</FieldLabel>
                      <input type="text" value={p.formData.codigo_barras} onChange={e => p.setFormData({ ...p.formData, codigo_barras: e.target.value })}
                        placeholder="EAN / UPC (Opcional)" className={`${inputBase} font-mono`} />
                    </div>
                    <div>
                      <FieldLabel>Descripción (Perfil de taza, notas)</FieldLabel>
                      <input type="text" value={p.formData.descripcion} onChange={e => p.setFormData({ ...p.formData, descripcion: e.target.value })}
                        placeholder="Breve descripción..." className={inputBase} />
                    </div>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-[#F0EBE4]">
                    <DollarSign className="w-3.5 h-3.5 text-[#C17B2A]" />
                    <h3 className="text-[10px] font-black uppercase tracking-[1px] text-[#9A8E82]">Política de Ventas</h3>
                  </div>
                  <div className="bg-[#FDFAF7] border border-[#F0EBE4] rounded-xl p-3.5 space-y-3">
                    {[
                      { label: "Precio Minorista", key: "precio_minorista", color: "text-[#0D7A3E]", bg: "bg-[#EDFBF3]", border: "border-[#9FE1CB]" },
                      { label: "Precio Mayorista", key: "precio_mayorista", color: "text-[#1A5FA0]", bg: "bg-[#E6F1FB]", border: "border-[#B5D4F4]" },
                    ].map(({ label, key, color, bg, border }) => (
                      <div key={key}>
                        {key !== "precio_minorista" && <div className="border-t border-[#F0EBE4] mb-3" />}
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 text-[9px] font-black ${bg} ${border} ${color}`}>
                            {key === "precio_minorista" ? "MIN" : "MAY"}
                          </div>
                          <div className="flex-1">
                            <p className="text-[11.5px] text-[#5A4A3C] font-bold">{label} <span className="text-[#C17B2A]">*</span></p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[12.5px] text-[#9A8E82] font-semibold">S/</span>
                            <input required type="number" step="0.01" min="0" onKeyDown={p.preventInvalidNumberInput}
                              value={(p.formData as any)[key]} onChange={e => p.setFormData({ ...p.formData, [key]: Number(e.target.value) })}
                              className={`w-28 px-3 py-1.5 rounded-lg border text-[12.5px] font-black text-right outline-none transition-all ${color} ${
                                p.errores[key] ? inputError : "border-[#DDD5CB] bg-white focus:border-[#C17B2A] focus:ring-2 focus:ring-[#C17B2A]/15"
                              }`}
                            />
                          </div>
                        </div>
                        {p.errores[key] && <p className="text-red-500 text-[10.5px] mt-1 text-right font-medium">{p.errores[key]}</p>}
                      </div>
                    ))}
                  </div>
                  
                  <label className="flex items-center gap-3 mt-3 p-3 rounded-xl border border-[#EDE8E1] hover:bg-[#FDFAF7] cursor-pointer transition-colors">
                    <input type="checkbox" checked={p.formData.afecto_igv} onChange={e => p.setFormData({ ...p.formData, afecto_igv: e.target.checked })}
                      className="w-4 h-4 text-[#C17B2A] rounded border-[#DDD5CB] focus:ring-[#C17B2A]" />
                    <div>
                      <p className="text-[12.5px] font-bold text-[#1C0F05] leading-tight">Afecto a IGV (18%)</p>
                      <p className="text-[10px] text-[#9A8E82] mt-0.5">Determina si el producto graba impuestos en facturación.</p>
                    </div>
                  </label>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-[#F0EBE4]">
                    <Package className="w-3.5 h-3.5 text-[#C17B2A]" />
                    <h3 className="text-[10px] font-black uppercase tracking-[1px] text-[#9A8E82]">Inventario</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <FieldLabel required>Unidad de medida</FieldLabel>
                      <select required value={p.formData.unidad_medida} onChange={e => p.setFormData({ ...p.formData, unidad_medida: e.target.value })}
                        className={`${inputBase} cursor-pointer ${p.errores.unidad_medida ? inputError : ""}`}>
                        <option value="Unidades">Unidades</option>
                        <option value="Sacos">Sacos</option>
                        <option value="Kilogramos">Kilogramos (Kg)</option>
                        <option value="Gramos">Gramos (g)</option>
                        <option value="Litros">Litros (L)</option>
                        <option value="Quintales">Quintales (qq)</option>
                      </select>
                      {p.errores.unidad_medida && <p className="text-red-500 text-[10.5px] mt-1 font-medium">{p.errores.unidad_medida}</p>}
                    </div>
                    <div>
                      <FieldLabel required hint="Alerta de reposición">Stock mínimo</FieldLabel>
                      <input required type="number" step="0.01" min="0" onKeyDown={p.preventInvalidNumberInput}
                        value={p.formData.stock_minimo} onChange={e => p.setFormData({ ...p.formData, stock_minimo: Number(e.target.value) })}
                        className={`${inputBase} ${p.errores.stock_minimo ? inputError : ""}`} />
                      {p.errores.stock_minimo && <p className="text-red-500 text-[10.5px] mt-1 font-medium">{p.errores.stock_minimo}</p>}
                    </div>
                  </div>
                </section>
              </form>

              <div className="shrink-0 flex items-center gap-2.5 px-5 py-4 border-t border-[#F0EBE4] bg-white rounded-b-2xl">
                <button type="button" onClick={p.cerrarModal}
                  className="flex-1 py-2.5 rounded-lg text-[12.5px] font-semibold text-[#5A4A3C] bg-[#F7F5F2] border border-[#EDE8E1] hover:bg-[#EDE8E1] transition-colors">
                  Cancelar
                </button>
                <button form="productoForm" type="submit" disabled={p.guardando}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12.5px] font-semibold text-white bg-[#C17B2A] hover:bg-[#A86522] disabled:opacity-60 active:scale-[0.98] transition-all shadow-sm shadow-[#C17B2A]/25">
                  {p.guardando ? (
                    <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Guardando…</>
                  ) : (
                    <><Save className="w-3.5 h-3.5" /> {p.productoAEditar ? "Actualizar" : "Guardar"}</>
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