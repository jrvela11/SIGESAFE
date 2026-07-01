import React, { useState } from "react";
import { DashboardLayout } from "../dashboard/dashboard/DashboardLayout";
import { useKardex } from "./useKardex";
import {
  Package, TrendingUp, TrendingDown, Layers,
  Search, ChevronLeft, ChevronRight, Calendar,
  FileText, ArrowLeftRight,
} from "lucide-react";

// ─── Badge de stock ──────────────────────────────────────────────────────────
const StockBadge: React.FC<{ stock: number }> = ({ stock }) => {
  if (stock === 0)
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#FCEBEB] text-[#8B2020] border border-[#F7C1C1]">
        Sin stock
      </span>
    );
  if (stock < 20)
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#FEF3E6] text-[#944F0A] border border-[#F5D5A3]">
        Stock bajo · {stock}
      </span>
    );
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#EDFBF3] text-[#0D6E3F] border border-[#9FE1CB]">
      {stock} en stock
    </span>
  );
};

// ─── Vista principal ─────────────────────────────────────────────────────────
export const KardexView = () => {
  const k = useKardex();
  const [busqueda, setBusqueda] = useState("");

  const productosFiltrados = k.productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.sku.toLowerCase().includes(busqueda.toLowerCase())
  );

  const productoActivo = k.productos.find(
    (p) => p.id.toString() === k.productoSeleccionado
  );

  // ── Paginador ──
  const Paginador = () => {
    if (k.totalPaginas <= 1) return null;
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => k.setPaginaActual(Math.max(1, k.paginaActual - 1))}
          disabled={k.paginaActual === 1}
          className="w-7 h-7 rounded-md bg-white border border-[#EDE8E1] flex items-center justify-center text-[#7A6E65] hover:bg-[#F7F5F2] disabled:opacity-40 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="text-[11.5px] font-bold text-[#5A4A3C] px-2">
          Página {k.paginaActual} de {k.totalPaginas}
        </span>
        <button
          onClick={() =>
            k.setPaginaActual(Math.min(k.totalPaginas, k.paginaActual + 1))
          }
          disabled={k.paginaActual === k.totalPaginas}
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

        {/* ── Page header ── */}
        <div>
          <h1 className="text-[20px] font-black text-[#1C0F05] tracking-tight leading-tight">
            Kardex de inventario
          </h1>
          <p className="text-[12.5px] text-[#8B7D72] mt-1">
            Auditoría detallada de entradas, salidas y saldos por producto.
          </p>
        </div>

        {/* ── Layout dividido ── */}
        <div className="grid grid-cols-[280px_1fr] gap-0 bg-white border border-[#EDE8E1] rounded-xl overflow-hidden min-h-[600px]">

          {/* ════ PANEL IZQUIERDO — Lista de productos ════ */}
          <div className="flex flex-col border-r border-[#EDE8E1] bg-[#FDFAF7]">

            {/* Cabecera del panel */}
            <div className="px-4 py-3.5 border-b border-[#EDE8E1]">
              <p className="text-[11px] font-black uppercase tracking-[0.8px] text-[#A8978B]">
                Productos
              </p>
              <p className="text-[10.5px] text-[#B5A99E] mt-0.5">
                Selecciona para ver el kardex
              </p>
            </div>

            {/* Buscador */}
            <div className="px-3 py-2.5 border-b border-[#EDE8E1]">
              <div className="flex items-center gap-2 bg-white border border-[#EDE8E1] rounded-lg px-2.5 py-2 focus-within:border-[#C17B2A] focus-within:ring-2 focus-within:ring-[#C17B2A]/15 transition-all">
                <Search className="w-3 h-3 text-[#B5A99E] shrink-0" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o SKU…"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="flex-1 bg-transparent text-[11.5px] text-[#1C0F05] placeholder:text-[#C0B4AA] outline-none"
                />
              </div>
            </div>

            {/* Lista */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#F0EBE4]">
              {k.cargando ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="px-4 py-3 animate-pulse">
                    <div className="h-3 bg-[#F0EBE4] rounded w-3/4 mb-1.5" />
                    <div className="h-2.5 bg-[#F0EBE4] rounded w-1/2" />
                  </div>
                ))
              ) : productosFiltrados.length === 0 ? (
                <div className="px-4 py-8 text-center text-[#B5A99E] text-[11.5px]">
                  Sin resultados para "{busqueda}"
                </div>
              ) : (
                productosFiltrados.map((p) => {
                  const activo = k.productoSeleccionado === p.id.toString();
                  return (
                    <button
                      key={p.id}
                      onClick={() => k.setProductoSeleccionado(p.id.toString())}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors group
                        ${activo
                          ? "bg-white border-l-2 border-l-[#C17B2A] pl-[14px]"
                          : "hover:bg-white border-l-2 border-l-transparent"
                        }`}
                    >
                      {/* Ícono */}
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
                          ${activo
                            ? "bg-[#FDF3E7] text-[#C17B2A]"
                            : "bg-[#F0EBE4] text-[#A8978B] group-hover:bg-[#FDF3E7] group-hover:text-[#C17B2A]"
                          }`}
                      >
                        <Package className="w-3.5 h-3.5" />
                      </div>

                      {/* Texto */}
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-[12px] leading-tight truncate font-semibold
                            ${activo ? "text-[#1C0F05]" : "text-[#3A2D24]"}`}
                        >
                          {p.nombre}
                        </p>
                        <p className="text-[10.5px] text-[#B5A99E] mt-0.5">
                          SKU: {p.sku}
                        </p>
                      </div>

                      {/* Stock badge */}
                      {activo && (
                        <span className="shrink-0 text-[10px] font-bold text-[#C17B2A]">
                          →
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-[#EDE8E1]">
              <p className="text-[10.5px] text-[#B5A99E]">
                {productosFiltrados.length} producto
                {productosFiltrados.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* ════ PANEL DERECHO — Detalle del kardex ════ */}
          <div className="flex flex-col bg-white">

            {/* Estado vacío */}
            {!k.productoSeleccionado ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
                <div className="w-14 h-14 rounded-2xl bg-[#FDF3E7] flex items-center justify-center">
                  <ArrowLeftRight className="w-6 h-6 text-[#C17B2A]" />
                </div>
                <div>
                  <p className="text-[14px] font-black text-[#1C0F05]">
                    Selecciona un producto
                  </p>
                  <p className="text-[12px] text-[#9A8E82] mt-1">
                    Elige uno de la lista para ver su libro de movimientos.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* ── Cabecera del producto ── */}
                <div className="px-5 py-4 border-b border-[#EDE8E1]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-[15px] font-black text-[#1C0F05] leading-tight">
                        {productoActivo?.nombre}
                      </h2>
                      <p className="text-[11.5px] text-[#9A8E82] mt-0.5">
                        SKU: {productoActivo?.sku}
                      </p>
                    </div>
                    <StockBadge stock={k.kpis.stock} />
                  </div>
                </div>

                {/* ── KPIs ── */}
                <div className="grid grid-cols-3 gap-0 border-b border-[#EDE8E1]">
                  {[
                    {
                      icon: <TrendingUp className="w-4 h-4 text-[#0D7A3E]" />,
                      iconBg: "bg-[#EDFBF3]",
                      value: `+${k.kpis.entradas}`,
                      label: "Total entradas",
                      valueColor: "text-[#0D7A3E]",
                    },
                    {
                      icon: <TrendingDown className="w-4 h-4 text-[#8B2020]" />,
                      iconBg: "bg-[#FCEBEB]",
                      value: `−${k.kpis.salidas}`,
                      label: "Total salidas",
                      valueColor: "text-[#8B2020]",
                    },
                    {
                      icon: <Layers className="w-4 h-4 text-[#C17B2A]" />,
                      iconBg: "bg-[#FDF3E7]",
                      value: k.kpis.stock,
                      label: "Saldo neto",
                      valueColor: "text-[#1C0F05]",
                    },
                  ].map((kpi, i) => (
                    <div
                      key={i}
                      className={`px-5 py-3.5 flex items-center gap-3 ${
                        i < 2 ? "border-r border-[#EDE8E1]" : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg ${kpi.iconBg} flex items-center justify-center shrink-0`}
                      >
                        {kpi.icon}
                      </div>
                      <div>
                        <p
                          className={`text-[18px] font-black leading-none ${kpi.valueColor}`}
                        >
                          {kpi.value}
                        </p>
                        <p className="text-[10.5px] text-[#9A8E82] mt-1 font-medium">
                          {kpi.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── Tabla de movimientos ── */}
                <div className="flex-1 overflow-y-auto max-h-[380px]">
                  <table className="w-full text-[12.5px] text-left">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-[#FDFAF7] border-b border-[#EDE8E1]">
                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.8px] text-[#A8978B] w-[100px]">
                          Fecha
                        </th>
                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.8px] text-[#A8978B]">
                          Descripción
                        </th>
                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.8px] text-[#0D7A3E] text-center w-[80px] bg-[#EDFBF3]/40">
                          Ingreso
                        </th>
                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.8px] text-[#8B2020] text-center w-[80px] bg-[#FCEBEB]/40">
                          Salida
                        </th>
                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.8px] text-[#944F0A] text-right w-[80px] bg-[#FEF3E6]/40">
                          Saldo
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5F0EB]">
                      {k.cargando ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-5 py-12 text-center text-[#9A8E82] text-sm font-bold animate-pulse"
                          >
                            Cargando movimientos…
                          </td>
                        </tr>
                      ) : k.kardexPaginado.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-5 py-16 text-center">
                            <FileText className="w-8 h-8 mx-auto mb-2 text-[#C0B4AA]" />
                            <p className="text-[13px] font-semibold text-[#5A4A3C]">
                              Sin movimientos registrados
                            </p>
                            <p className="text-[11.5px] text-[#9A8E82] mt-1">
                              Este producto no tiene operaciones aún.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        k.kardexPaginado.map((mov) => (
                          <tr
                            key={mov.id}
                            className="hover:bg-[#FDFAF7] transition-colors"
                          >
                            {/* Fecha */}
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3 h-3 text-[#C0B4AA] shrink-0" />
                                <span className="text-[11.5px] text-[#7A6E65] font-medium">
                                  {mov.fecha}
                                </span>
                              </div>
                            </td>

                            {/* Descripción */}
                            <td className="px-5 py-3.5">
                              <p className="font-semibold text-[#1C0F05] leading-tight">
                                {mov.descripcion}
                              </p>
                            </td>

                            {/* Ingreso */}
                            <td className="px-5 py-3.5 text-center bg-[#EDFBF3]/20">
                              {mov.tipo === "entrada" ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#EDFBF3] text-[#0D6E3F] border border-[#9FE1CB]">
                                  +{mov.cantidad}
                                </span>
                              ) : (
                                <span className="text-[#C0B4AA] text-base leading-none">
                                  —
                                </span>
                              )}
                            </td>

                            {/* Salida */}
                            <td className="px-5 py-3.5 text-center bg-[#FCEBEB]/20">
                              {mov.tipo === "salida" ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FCEBEB] text-[#8B2020] border border-[#F7C1C1]">
                                  −{mov.cantidad}
                                </span>
                              ) : (
                                <span className="text-[#C0B4AA] text-base leading-none">
                                  —
                                </span>
                              )}
                            </td>

                            {/* Saldo */}
                            <td className="px-5 py-3.5 text-right bg-[#FEF3E6]/20 border-l border-[#EDE8E1]">
                              <span
                                className={`text-[13px] font-black ${
                                  (mov.saldoAcumulado ?? 0) >= 0
                                    ? "text-[#1C0F05]"
                                    : "text-[#8B2020]"
                                }`}
                              >
                                {mov.saldoAcumulado}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* ── Footer ── */}
                <div className="px-5 py-2.5 bg-[#FDFAF7] border-t border-[#EDE8E1] flex items-center justify-between shrink-0">
                  <span className="text-[11px] text-[#9A8E82]">
                    {k.kardexTotales.length} movimiento
                    {k.kardexTotales.length !== 1 ? "s" : ""}
                  </span>
                  <Paginador />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
