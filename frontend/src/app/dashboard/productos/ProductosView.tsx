import React, { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "../dashboard/DashboardLayout";
import { useProductos } from "./useProductos";
import {
  Plus, Edit, Trash2, Search, X, Save, Package, AlertTriangle,
  CheckCircle, RefreshCw, Tag, DollarSign, Image as ImageIcon,
  ShoppingCart, LayoutGrid, List, TrendingUp, Filter,
  ChevronLeft, ChevronRight, Coffee
} from "lucide-react";
import api from "../../../lib/api";

const BASE = api.defaults.baseURL?.replace("/api", "") ?? "";
const sol = (n: number) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(n);

// ─── Componentes atómicos ──────────────────────────────────────────────────
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

// ─── Tarjeta de producto (vista cuadrícula) ────────────────────────────────
const ProductCard: React.FC<{
  prod: ReturnType<typeof useProductos>["productos"][0];
  onEdit: () => void;
  onDelete: () => void;
  onReactivar: () => void;
}> = ({ prod, onEdit, onDelete, onReactivar }) => {
  const critico = prod.stock_actual <= prod.stock_minimo;
  const margen =
    prod.precio_compra > 0
      ? (((prod.precio_minorista - prod.precio_compra) / prod.precio_compra) * 100).toFixed(0)
      : null;

  return (
    <div
      className={`group bg-white rounded-3xl border flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        critico ? "border-red-200 hover:border-red-300" : "border-stone-200 hover:border-amber-200"
      } ${!prod.estado ? "opacity-60" : ""} overflow-hidden`}
    >
      {/* Imagen */}
      <div className="relative aspect-[4/3] rounded-t-3xl overflow-hidden bg-stone-100 shrink-0">
        {prod.imagen_url ? (
          <img src={BASE + prod.imagen_url} alt={prod.nombre} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-stone-50">
            <Coffee className="w-8 h-8 text-stone-300" />
            <span className="text-[10px] text-stone-300 font-medium">Sin imagen</span>
          </div>
        )}
        {/* Badge de categoría */}
        <div className="absolute top-3 left-3">
          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-amber-900/80 text-amber-100 backdrop-blur-sm">
            <Tag className="w-2.5 h-2.5" />
            {prod.categoria_nombre}
          </span>
        </div>
        {/* Stock */}
        <div className="absolute top-3 right-3">
          <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
            critico ? "bg-red-500 text-white" : "bg-white/90 text-emerald-700 border border-emerald-200 backdrop-blur-sm"
          }`}>
            {critico && <AlertTriangle className="w-3 h-3" />}
            {prod.stock_actual} {prod.unidad_medida}
          </span>
        </div>
        {/* Overlay de acciones rápidas */}
        {prod.estado && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end justify-end p-3 opacity-0 group-hover:opacity-100">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="p-2 bg-white rounded-full shadow-md text-amber-700 hover:bg-amber-50 transition-all"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-bold text-stone-800 text-sm leading-snug line-clamp-2">{prod.nombre}</h3>
          <p className="text-[11px] font-mono text-stone-400 mt-1">SKU: {prod.sku}</p>
        </div>

        <div className="bg-stone-50 rounded-2xl p-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-stone-400 flex items-center gap-1">
              <ShoppingCart className="w-3 h-3" /> Costo ref.
            </span>
            <span className="text-xs font-semibold text-stone-600">{sol(prod.precio_compra)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-stone-400">Venta min.</span>
            <div className="flex items-center gap-2">
              {margen && (
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full">
                  +{margen}%
                </span>
              )}
              <span className="text-xs font-bold text-emerald-700">{sol(prod.precio_minorista)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-auto">
          {prod.estado ? (
            <>
              <button
                onClick={onEdit}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-stone-100 hover:bg-amber-50 hover:text-amber-800 text-stone-600 text-xs font-semibold transition-colors border border-transparent hover:border-amber-200"
              >
                <Edit className="w-3.5 h-3.5" /> Editar
              </button>
              <button
                onClick={onDelete}
                className="p-2 rounded-xl bg-stone-100 hover:bg-red-50 hover:text-red-600 text-stone-400 transition-colors border border-transparent hover:border-red-200"
                title="Desactivar"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              onClick={onReactivar}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Publicar de nuevo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Fila de tabla (vista lista) ───────────────────────────────────────────
const ProductRow: React.FC<{
  prod: ReturnType<typeof useProductos>["productos"][0];
  onEdit: () => void;
  onDelete: () => void;
  onReactivar: () => void;
}> = ({ prod, onEdit, onDelete, onReactivar }) => {
  const critico = prod.stock_actual <= prod.stock_minimo;
  return (
    <tr className={`group transition-colors hover:bg-amber-50/40 ${!prod.estado ? "opacity-60" : ""}`}>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          {prod.imagen_url ? (
            <img src={BASE + prod.imagen_url} alt={prod.nombre}
              className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
              <Coffee className="w-4 h-4 text-stone-300" />
            </div>
          )}
          <div>
            <p className="font-semibold text-stone-800 text-sm leading-tight">{prod.nombre}</p>
            <p className="text-[11px] font-mono text-stone-400 mt-0.5">
              {prod.sku} · <span className="text-amber-700">{prod.categoria_nombre}</span>
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <p className="text-sm font-semibold text-stone-700">{sol(prod.precio_minorista)}</p>
        <p className="text-[11px] text-stone-400">costo ref. {sol(prod.precio_compra)}</p>
      </td>
      <td className="px-5 py-3.5 text-center">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
          critico ? "bg-red-100 text-red-700" : "bg-emerald-50 text-emerald-700"
        }`}>
          {critico && <AlertTriangle className="w-3 h-3" />}
          {prod.stock_actual} <span className="font-normal opacity-70">{prod.unidad_medida}</span>
        </span>
      </td>
      <td className="px-5 py-3.5 text-right">
        <div className="flex items-center justify-end gap-1.5">
          {prod.estado ? (
            <>
              <button onClick={onEdit}
                className="p-2 rounded-lg text-stone-400 hover:text-amber-700 hover:bg-amber-50 border border-transparent hover:border-amber-200 transition-all">
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button onClick={onDelete}
                className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button onClick={onReactivar}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors">
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
  <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden animate-pulse">
    <div className="aspect-[4/3] bg-stone-100" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-stone-100 rounded-lg w-3/4" />
      <div className="h-3 bg-stone-100 rounded w-1/3" />
      <div className="h-16 bg-stone-50 rounded-2xl" />
      <div className="h-9 bg-stone-100 rounded-xl" />
    </div>
  </div>
);

const TableSkeleton = () => (
  <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 animate-pulse">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center gap-4">
        <div className="w-10 h-10 bg-stone-100 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-stone-100 rounded w-40" />
          <div className="h-2.5 bg-stone-100 rounded w-24" />
        </div>
        <div className="h-3.5 bg-stone-100 rounded w-20" />
        <div className="h-7 bg-stone-100 rounded-lg w-16" />
      </div>
    ))}
  </div>
);

// ─── Vista principal con paginación ────────────────────────────────────────
const POR_PAGINA = 10;

export const ProductosView = () => {
  const p = useProductos();
  const [vista, setVista] = useState<"grid" | "list">("grid");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("");
  const [pagina, setPagina] = useState(1);

  const filtrados = useMemo(() => {
    return p.productos.filter((prod) => {
      const okEstado = p.filtroEstado === "activos" ? prod.estado : !prod.estado;
      const okCategoria = filtroCategoria === "" || prod.categoria_id.toString() === filtroCategoria;
      const t = p.busqueda.toLowerCase();
      const okBusqueda =
        prod.nombre.toLowerCase().includes(t) ||
        prod.sku.toLowerCase().includes(t) ||
        prod.categoria_nombre.toLowerCase().includes(t);
      return okEstado && okCategoria && okBusqueda;
    });
  }, [p.productos, p.filtroEstado, p.busqueda, filtroCategoria]);

  const totalPaginas = Math.ceil(filtrados.length / POR_PAGINA);
  const paginaAjustada = Math.min(pagina, Math.max(1, totalPaginas));
  const productosPaginados = filtrados.slice(
    (paginaAjustada - 1) * POR_PAGINA,
    paginaAjustada * POR_PAGINA
  );

  useEffect(() => {
    setPagina(1);
  }, [p.filtroEstado, p.busqueda, filtroCategoria]);

  const alertas = p.productos.filter(pr => pr.estado && pr.stock_actual <= pr.stock_minimo).length;
  const costoTotal = p.productos.filter(pr => pr.estado).reduce((acc, pr) => acc + pr.precio_compra * pr.stock_actual, 0);
  const totalActivos = p.productos.filter(pr => pr.estado).length;

  const Paginador = () => {
    if (totalPaginas <= 1) return null;
    const paginas = [];
    for (let i = 1; i <= totalPaginas; i++) {
      paginas.push(
        <button
          key={i}
          onClick={() => setPagina(i)}
          className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
            paginaAjustada === i
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
          onClick={() => setPagina(p => Math.max(1, p - 1))}
          disabled={paginaAjustada === 1}
          className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {paginas}
        <button
          onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
          disabled={paginaAjustada === totalPaginas}
          className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <span className="text-xs text-stone-400 ml-2">
          {filtrados.length} producto{filtrados.length !== 1 ? "s" : ""}
        </span>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">

        {/* ── Cabecera con textura de granos ──────────────────────────── */}
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
                <h1 className="text-2xl font-extrabold tracking-tight">Catálogo de Productos</h1>
              </div>
              <p className="text-amber-100/80 text-sm max-w-lg">
                Gestiona los productos de café y cacao. Los costos y el stock se actualizan desde el módulo de inventario.
              </p>
            </div>
            <button
              onClick={p.abrirModalCrear}
              className="self-start sm:self-auto inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-sm px-5 py-3 rounded-2xl transition-all border border-white/30 shadow-lg"
            >
              <Plus className="w-4 h-4" /> Nuevo Producto
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
              <Package className="w-7 h-7 text-amber-700" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-stone-900 leading-none">{totalActivos}</p>
              <p className="text-xs text-stone-400 mt-1 font-medium">Productos activos</p>
            </div>
          </div>
          <div className={`rounded-3xl border p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow ${
            alertas > 0 ? "bg-red-50 border-red-200" : "bg-white border-stone-200"
          }`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
              alertas > 0 ? "bg-red-100" : "bg-emerald-50"
            }`}>
              {alertas > 0 ? <AlertTriangle className="w-7 h-7 text-red-600" /> : <CheckCircle className="w-7 h-7 text-emerald-600" />}
            </div>
            <div>
              <p className={`text-2xl font-extrabold leading-none ${alertas > 0 ? "text-red-700" : "text-stone-900"}`}>{alertas}</p>
              <p className={`text-xs mt-1 font-medium ${alertas > 0 ? "text-red-400" : "text-stone-400"}`}>
                {alertas > 0 ? "Con stock bajo" : "Sin alertas de stock"}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-stone-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center shrink-0">
              <TrendingUp className="w-7 h-7 text-stone-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-extrabold text-stone-900 leading-none truncate">{sol(costoTotal)}</p>
              <p className="text-xs text-stone-400 mt-1 font-medium">Valor ref. del inventario</p>
            </div>
          </div>
        </div>

        {/* Filtros y controles */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center bg-white border border-stone-200 rounded-2xl p-1 gap-2 w-full shadow-sm focus-within:border-amber-700 focus-within:ring-2 focus-within:ring-amber-700/15 transition-all">
            <div className="flex-1 flex items-center px-3 py-2">
              <Search className="w-4 h-4 text-stone-300 shrink-0 mr-2" />
              <input
                type="text"
                placeholder="Buscar por nombre, SKU..."
                value={p.busqueda}
                onChange={(e) => p.setBusqueda(e.target.value)}
                className="flex-1 bg-transparent text-sm text-stone-700 placeholder:text-stone-300 outline-none w-full"
              />
              {p.busqueda && (
                <button onClick={() => p.setBusqueda("")} className="text-stone-300 hover:text-stone-500 transition-colors ml-2">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="hidden sm:block w-px h-6 bg-stone-200 shrink-0" />
            <div className="flex items-center px-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-stone-400 shrink-0 mr-2 hidden sm:block" />
              <select 
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="bg-transparent text-sm text-stone-600 font-medium outline-none cursor-pointer w-full sm:w-auto py-2 sm:py-1"
              >
                <option value="">Todas las categorías</option>
                {p.categoriasLista.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre_categoria}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="flex bg-stone-100 rounded-xl p-1 gap-1 flex-1 sm:flex-none">
              {(["activos", "inactivos"] as const).map((tab) => (
                <button key={tab} onClick={() => p.setFiltroEstado(tab)}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    p.filtroEstado === tab ? "bg-white text-stone-800 shadow-sm" : "text-stone-400 hover:text-stone-600"
                  }`}>
                  {tab === "activos" ? "Activos" : "Inactivos"}
                </button>
              ))}
            </div>
            <div className="hidden sm:flex bg-stone-100 rounded-xl p-1 gap-1">
              <button onClick={() => setVista("grid")} title="Cuadrícula"
                className={`p-2 rounded-lg transition-all ${vista === "grid" ? "bg-white text-amber-700 shadow-sm" : "text-stone-400 hover:text-stone-600"}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setVista("list")} title="Lista"
                className={`p-2 rounded-lg transition-all ${vista === "list" ? "bg-white text-amber-700 shadow-sm" : "text-stone-400 hover:text-stone-600"}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        {p.cargando ? (
          vista === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : (
            <TableSkeleton />
          )
        ) : productosPaginados.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 py-20 flex flex-col items-center gap-4 shadow-sm">
            <div className="w-20 h-20 rounded-2xl bg-stone-100 flex items-center justify-center">
              <Coffee className="w-10 h-10 text-stone-300" />
            </div>
            <div className="text-center">
              <p className="text-stone-700 font-semibold text-lg">
                {p.busqueda || filtroCategoria ? "Sin resultados" : "No hay productos"}
              </p>
              <p className="text-stone-400 text-sm mt-1 max-w-xs">
                {p.busqueda || filtroCategoria ? "Intenta con otros términos o elimina los filtros." : "Comienza registrando el primer producto del catálogo."}
              </p>
            </div>
            {!p.busqueda && !filtroCategoria && (
              <button onClick={p.abrirModalCrear}
                className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors mt-2">
                <Plus className="w-4 h-4" /> Registrar primer producto
              </button>
            )}
          </div>
        ) : vista === "grid" ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {productosPaginados.map((prod) => (
                <ProductCard key={prod.id} prod={prod}
                  onEdit={() => p.abrirModalEditar(prod)}
                  onDelete={() => p.handleEliminar(prod.id, prod.nombre)}
                  onReactivar={() => p.handleReactivar(prod.id, prod.nombre)}
                />
              ))}
            </div>
            <Paginador />
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/70">
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-stone-400">Producto</th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-stone-400">Precio</th>
                  <th className="px-5 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-stone-400">Stock</th>
                  <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-stone-400">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {productosPaginados.map((prod) => (
                  <ProductRow key={prod.id} prod={prod}
                    onEdit={() => p.abrirModalEditar(prod)}
                    onDelete={() => p.handleEliminar(prod.id, prod.nombre)}
                    onReactivar={() => p.handleReactivar(prod.id, prod.nombre)}
                  />
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-stone-100 bg-stone-50/30 flex justify-end">
              <Paginador />
            </div>
          </div>
        )}

        {/* ── MODAL (SIN precio_compra NI stock_actual) ──────────────── */}
        {p.isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={p.cerrarModal} />

            <div className="relative bg-white w-full max-w-2xl mx-0 sm:mx-4 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] border border-stone-200/60">
              <div className="sm:hidden w-10 h-1 bg-stone-200 rounded-full mx-auto mt-3 mb-1 shrink-0" />

              <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-stone-100">
                <div>
                  <h2 className="text-lg font-extrabold text-stone-900">
                    {p.productoAEditar ? "Editar producto" : "Nuevo producto"}
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {p.productoAEditar
                      ? "Modifica los datos del producto. El costo y el stock se gestionan en inventario."
                      : "Completa la información del producto. El costo y el stock se asignarán desde inventario."}
                  </p>
                </div>
                <button onClick={p.cerrarModal}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form id="productoForm" onSubmit={p.handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-8">
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Coffee className="w-5 h-5 text-amber-700" />
                    <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wide">Información básica</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4">
                    <div className="shrink-0 mx-auto sm:mx-0">
                      <input type="file" ref={p.fileInputRef} id="img-upload"
                        accept="image/png,image/jpeg,image/webp" className="hidden"
                        onChange={p.handleImageChange} />
                      <label htmlFor="img-upload" className="cursor-pointer block">
                        <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 overflow-hidden flex items-center justify-center group hover:border-amber-400 transition-colors">
                          {p.previewUrl ? (
                            <img src={p.previewUrl.startsWith("blob:") ? p.previewUrl : BASE + p.previewUrl}
                              alt="preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center gap-1 group-hover:opacity-60 transition-opacity">
                              <Coffee className="w-6 h-6 text-stone-300" />
                              <span className="text-[10px] text-stone-300 font-medium text-center leading-tight">Agregar foto</span>
                            </div>
                          )}
                        </div>
                        <p className="text-[9px] text-stone-300 text-center mt-1">PNG · JPG · máx 2MB</p>
                      </label>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label req>Nombre del producto</Label>
                        <input required type="text" value={p.formData.nombre}
                          onChange={e => p.setFormData({ ...p.formData, nombre: e.target.value })}
                          placeholder="Ej. Café Tostado Premium 250g" className={inputClass} />
                      </div>
                      <div>
                        <Label req>Categoría</Label>
                        <select required value={p.formData.categoria_id}
                          onChange={e => p.setFormData({ ...p.formData, categoria_id: e.target.value })}
                          className={inputClass + " cursor-pointer"}>
                          <option value="" disabled>— Seleccione —</option>
                          {p.categoriasLista.map(c => (
                            <option key={c.id} value={c.id}>{c.nombre_categoria}</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label req hint="Código interno">SKU</Label>
                          <input required type="text" value={p.formData.sku}
                            onChange={e => p.setFormData({ ...p.formData, sku: e.target.value.toUpperCase().replace(/\s/g, "-") })}
                            placeholder="PROD-001" className={inputClass + " font-mono uppercase"} />
                        </div>
                        <div>
                          <Label>Código de Barras</Label>
                          <input type="text" value={p.formData.codigo_barras}
                            onChange={e => p.setFormData({ ...p.formData, codigo_barras: e.target.value })}
                            placeholder="EAN / UPC" className={inputClass + " font-mono"} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Label>Descripción</Label>
                    <textarea rows={3} value={p.formData.descripcion}
                      onChange={e => p.setFormData({ ...p.formData, descripcion: e.target.value })}
                      placeholder="Notas, características, origen…" className={inputClass + " resize-none"} />
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-amber-700" />
                    <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wide">Precios de venta</h3>
                  </div>
                  <div className="bg-stone-50 rounded-2xl p-4 space-y-3">
                    {[
                      { label: "Precio minorista", key: "precio_minorista", color: "emerald" },
                      { label: "Precio mayorista", key: "precio_mayorista", color: "blue" },
                    ].map(({ label, key }) => (
                      <div key={key}>
                        {key !== "precio_minorista" && <div className="border-t border-stone-200 mb-3" />}
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-bold
                              ${key === "precio_minorista" ? "bg-emerald-50 border border-emerald-100 text-emerald-600" :
                              "bg-blue-50 border border-blue-100 text-blue-600"}`}>
                            {key === "precio_minorista" ? "MIN" : "MAY"}
                          </div>
                          <div className="flex-1">
                            <p className="text-[11px] text-stone-400 font-semibold">{label} <span className="text-amber-600">*</span></p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-stone-400 font-medium">S/</span>
                            <input required type="number" step="0.01" min="0"
                              onKeyDown={p.preventInvalidNumberInput}
                              value={(p.formData as any)[key]}
                              onChange={e => p.setFormData({ ...p.formData, [key]: Number(e.target.value) })}
                              className={`w-28 px-3 py-2 rounded-xl border text-sm font-bold text-right outline-none transition-all
                                  ${key === "precio_minorista" ? "border-emerald-200 bg-white text-emerald-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/15" :
                                  "border-blue-200 bg-white text-blue-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/15"}`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <label className="flex items-center gap-3 mt-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer transition-colors">
                    <input type="checkbox" checked={p.formData.afecto_igv}
                      onChange={e => p.setFormData({ ...p.formData, afecto_igv: e.target.checked })}
                      className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500" />
                    <div>
                      <p className="text-sm font-semibold text-stone-700 leading-tight">Afecto a IGV (18%)</p>
                      <p className="text-[11px] text-stone-400">Se aplicará en comprobantes de facturación</p>
                    </div>
                  </label>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-amber-700" />
                    <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wide">Inventario</h3>
                  </div>
                  <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-xl mb-3 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-blue-800 leading-tight">
                      El stock actual y el precio de compra se actualizan automáticamente al registrar lotes en <strong>Compras/Inventarios</strong>. Aquí solo defines la unidad y el stock mínimo de alerta.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label req>Unidad de medida</Label>
                      <select required value={p.formData.unidad_medida}
                        onChange={e => p.setFormData({ ...p.formData, unidad_medida: e.target.value })}
                        className={inputClass + " cursor-pointer"}>
                        <option value="Unidades">Unidades</option>
                        <option value="Kilogramos">Kilogramos (Kg)</option>
                        <option value="Gramos">Gramos (g)</option>
                        <option value="Litros">Litros (L)</option>
                        <option value="Quintales">Quintales (qq)</option>
                        <option value="Libras">Libras (lb)</option>
                      </select>
                    </div>
                    <div>
                      <Label req>Alerta stock mínimo</Label>
                      <input required type="number" step="0.01" min="0"
                        onKeyDown={p.preventInvalidNumberInput}
                        value={p.formData.stock_minimo}
                        onChange={e => p.setFormData({ ...p.formData, stock_minimo: Number(e.target.value) })}
                        className={inputClass} />
                    </div>
                  </div>
                </section>
              </form>

              <div className="shrink-0 flex items-center gap-3 px-6 py-4 border-t border-stone-100 bg-white rounded-b-3xl">
                <button type="button" onClick={p.cerrarModal}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold text-stone-500 bg-stone-100 hover:bg-stone-200 transition-colors">
                  Cancelar
                </button>
                <button form="productoForm" type="submit" disabled={p.guardando}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-white bg-amber-700 hover:bg-amber-800 disabled:opacity-60 active:scale-[0.98] transition-all shadow-md shadow-amber-800/20">
                  {p.guardando ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Guardando…</>
                  ) : (
                    <><Save className="w-4 h-4" />{p.productoAEditar ? "Guardar cambios" : "Guardar producto"}</>
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