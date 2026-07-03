import { useState } from "react";
import { MapContainer, TileLayer, Marker, Circle, Popup, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DashboardLayout } from "../dashboard/DashboardLayout";
import { useMapa } from "./useMapa";
import {
  MapPin, Search, ChevronLeft, ChevronRight,
  Users, LayoutGrid, List, X, Navigation, Loader2
} from "lucide-react";

// ─── Configuración de Iconos de Leaflet ───────────────────────────────────────
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const clienteIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const ChangeView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  map.flyTo(center, zoom);
  return null;
};

// ─── Vista principal ──────────────────────────────────────────────────────────

export const DashboardMapaView = () => {
  const map = useMapa();
  // Coordenadas ajustadas para enfocar la zona de Amazonas/Bagua por defecto
  const defaultCenter: [number, number] = [-5.70, -78.50]; 

  const Paginador = ({ actual, total, onChange }: { actual: number, total: number, onChange: (p: number) => void }) => {
    if (total <= 1) return null;
    return (
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => onChange(Math.max(1, actual - 1))}
          disabled={actual === 1}
          className="w-7 h-7 rounded-md bg-white border border-[#EDE8E1] flex items-center justify-center text-[#7A6E65] hover:bg-[#F7F5F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="text-[10px] font-bold text-[#9A8E82] uppercase tracking-[0.8px] px-1">
          {actual} / {total}
        </span>
        <button
          onClick={() => onChange(Math.min(total, actual + 1))}
          disabled={actual === total}
          className="w-7 h-7 rounded-md bg-white border border-[#EDE8E1] flex items-center justify-center text-[#7A6E65] hover:bg-[#F7F5F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  };

  return (
    <DashboardLayout>
      {/* Contenedor estricto con altura fija en PC y auto en Móvil */}
      <div className="flex flex-col lg:flex-row gap-6 pb-8 h-auto lg:h-[calc(100vh-7rem)]">
        
        {/* ── PANEL IZQUIERDO: Controles y Lista (35%) ── */}
        <div className="w-full lg:w-[35%] flex flex-col gap-5 h-[550px] lg:h-full">
          
          <div className="shrink-0">
            <h1 className="text-[20px] font-black text-[#1C0F05] tracking-tight leading-tight">
              Mapa de Clientes
            </h1>
            <p className="text-[12.5px] text-[#8B7D72] mt-1">
              Visualiza y analiza la ubicación geográfica de tu cartera.
            </p>
          </div>

          <div className="shrink-0 flex bg-[#EDE8E1] rounded-lg p-1 gap-1">
            <button
              onClick={() => { map.setModoVista("agrupado"); map.setCentro(null); map.setPaginaRegiones(1); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11.5px] font-semibold transition-all ${
                map.modoVista === "agrupado" ? "bg-white text-[#1C0F05] shadow-sm" : "text-[#8B7D72] hover:text-[#4A3728]"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Regiones
            </button>
            <button
              onClick={() => { map.setModoVista("individual"); map.setCentro(null); map.setPagina(1); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11.5px] font-semibold transition-all ${
                map.modoVista === "individual" ? "bg-white text-[#1C0F05] shadow-sm" : "text-[#8B7D72] hover:text-[#4A3728]"
              }`}
            >
              <List className="w-3.5 h-3.5" /> Detallado
            </button>
          </div>

          {map.modoVista === "individual" && (
            <div className="shrink-0 flex items-center gap-2 bg-white border border-[#EDE8E1] rounded-lg px-3 py-2 focus-within:border-[#C17B2A] focus-within:ring-2 focus-within:ring-[#C17B2A]/15 transition-all w-full">
              <Search className="w-3.5 h-3.5 text-[#B5A99E] shrink-0" />
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={map.busqueda}
                onChange={(e) => map.setBusqueda(e.target.value)}
                className="flex-1 bg-transparent text-[12.5px] text-[#1C0F05] placeholder:text-[#C0B4AA] outline-none"
              />
              {map.busqueda && (
                <button onClick={() => map.setBusqueda("")} className="text-[#B5A99E] hover:text-[#5A4A3C]">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          <div className="flex-1 bg-white border border-[#EDE8E1] rounded-2xl flex flex-col overflow-hidden shadow-sm">
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
              {map.cargando ? (
                <div className="flex flex-col items-center justify-center h-full py-10 text-[#A8978B]">
                  <Loader2 className="w-6 h-6 animate-spin mb-2" />
                  <p className="text-[11px] font-semibold">Cargando ubicaciones...</p>
                </div>
              ) : map.modoVista === "agrupado" ? (
                map.regionesPaginadas.length === 0 ? (
                  <p className="text-center text-[#9A8E82] text-[12px] py-8">No hay regiones registradas.</p>
                ) : (
                  map.regionesPaginadas.map(grupo => (
                    <div
                      key={grupo.departamento}
                      onClick={() => {
                        map.centrarEnMapa(grupo.latitud, grupo.longitud, 8);
                        map.setModalData({ titulo: `${grupo.departamento}`, data: grupo.detalles });
                      }}
                      className="group p-3 rounded-xl border border-[#EDE8E1] bg-[#FDFAF7] hover:border-[#C17B2A] hover:bg-white cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-[#1C0F05] text-[13px] group-hover:text-[#C17B2A] transition-colors">{grupo.departamento}</p>
                        <p className="text-[10px] text-[#9A8E82] mt-0.5">Click para detallar</p>
                      </div>
                      <div className="px-2.5 py-1 rounded-lg font-black text-[14px] bg-[#FDF3E7] text-[#C17B2A]">
                        {grupo.cantidad}
                      </div>
                    </div>
                  ))
                )
              ) : (
                map.clientesPaginados.length === 0 ? (
                  <p className="text-center text-[#9A8E82] text-[12px] py-8">No se encontraron clientes.</p>
                ) : (
                  map.clientesPaginados.map(cliente => {
                    const tieneUbicacion = cliente.latitud !== null && cliente.longitud !== null;
                    return (
                      <div
                        key={cliente.id}
                        className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                          tieneUbicacion ? 'bg-white border-[#EDE8E1] hover:border-[#C17B2A]' : 'bg-[#FCEBEB]/50 border-[#F7C1C1]'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-1.5">
                            <Users className={`w-3.5 h-3.5 shrink-0 ${tieneUbicacion ? 'text-[#C17B2A]' : 'text-[#A8978B]'}`} />
                            <p className="font-semibold text-[#1C0F05] text-[12.5px] truncate">{cliente.nombre}</p>
                          </div>
                          {tieneUbicacion ? (
                            <p className="text-[10px] text-[#9A8E82] ml-5 truncate mt-0.5">
                              {[cliente.distrito, cliente.provincia, cliente.departamento].filter(Boolean).join(', ')}
                            </p>
                          ) : (
                            <p className="text-[10px] text-[#8B2020] font-bold ml-5 mt-0.5 flex items-center gap-1">
                              ⚠️ Dirección no válida
                            </p>
                          )}
                        </div>
                        {tieneUbicacion ? (
                          <button
                            onClick={() => map.centrarEnMapa(Number(cliente.latitud), Number(cliente.longitud), 14)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#7A6E65] bg-[#F7F5F2] hover:text-[#C17B2A] hover:bg-[#FDF3E7] transition-colors shrink-0"
                            title="Localizar en mapa"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#F7F5F2] text-[#D4C8BC] cursor-not-allowed shrink-0">
                            <MapPin className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    );
                  })
                )
              )}
            </div>

            <div className="shrink-0 px-3 py-2.5 bg-[#FDFAF7] border-t border-[#EDE8E1] flex items-center justify-between">
              {map.modoVista === "agrupado" ? (
                <>
                  <span className="text-[10px] text-[#9A8E82] font-semibold uppercase tracking-wider">Regiones</span>
                  <Paginador actual={map.paginaRegionesAjustada} total={map.totalPaginasRegiones} onChange={map.setPaginaRegiones} />
                </>
              ) : (
                <>
                  <span className="text-[10px] text-[#9A8E82] font-semibold uppercase tracking-wider">Clientes</span>
                  <Paginador actual={map.paginaAjustada} total={map.totalPaginas} onChange={map.setPagina} />
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── PANEL DERECHO: Mapa Interactivo (65%) ── */}
        <div className="w-full lg:w-[65%] bg-[#FDFAF7] rounded-2xl border border-[#EDE8E1] shadow-sm overflow-hidden h-[500px] lg:h-full relative z-0 flex flex-col">
          <MapContainer 
            center={defaultCenter} 
            zoom={8} 
            style={{ height: "100%", width: "100%", flex: 1, zIndex: 0 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            {map.modoVista === "agrupado" ? (
              <>
                {map.gruposRegiones.map(grupo => (
                  <Circle
                    key={grupo.departamento}
                    center={[grupo.latitud, grupo.longitud]}
                    radius={Math.min(60000, grupo.cantidad * 8000)}
                    eventHandlers={{
                      click: () => map.setModalData({ titulo: `${grupo.departamento}`, data: grupo.detalles })
                    }}
                    pathOptions={{ color: "#C17B2A", fillColor: "#C17B2A", fillOpacity: 0.4, weight: 2 }}
                  >
                    <Tooltip sticky direction="top" className="font-bold text-[#C17B2A]">
                      {grupo.departamento}: {grupo.cantidad} Clientes
                    </Tooltip>
                  </Circle>
                ))}
              </>
            ) : (
              map.clientes.filter(e => e.latitud && e.longitud).map(cliente => (
                <Marker
                  key={cliente.id}
                  position={[cliente.latitud!, cliente.longitud!]}
                  icon={clienteIcon}
                >
                  <Popup className="rounded-2xl">
                    <div className="text-[12px] font-sans p-1">
                      <p className="font-black text-[#1C0F05] mb-1 leading-tight">{cliente.nombre}</p>
                      <p className="text-[#5A4A3C] font-medium text-[11px] leading-tight mb-1">{cliente.direccion}</p>
                      <p className="text-[#9A8E82] text-[9.5px] uppercase tracking-[0.5px]">
                        {[cliente.distrito, cliente.departamento].filter(Boolean).join(" • ")}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))
            )}

            {map.centro && map.zoom && <ChangeView center={map.centro} zoom={map.zoom} />}
          </MapContainer>
        </div>

        {/* ── MODAL DE DETALLES DE REGIÓN ── */}
        {map.modalInfo && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#1C0F05]/55 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px] overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 border border-[#EDE8E1]">
              
              <div className="shrink-0 flex items-start justify-between px-5 py-4 border-b border-[#F0EBE4] bg-[#FDFAF7]">
                <div>
                  <h2 className="text-[15px] font-black flex items-center gap-2 text-[#C17B2A]">
                    <Users className="w-4 h-4" />
                    {map.modalInfo.titulo}
                  </h2>
                  <p className="text-[11px] text-[#9A8E82] mt-0.5">Listado de clientes en la región</p>
                </div>
                <button
                  onClick={() => map.setModalData(null)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[#7A6E65] hover:text-[#1C0F05] hover:bg-[#EDE8E1] transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-white">
                {map.modalInfo.data.length === 0 ? (
                  <p className="text-center text-[#9A8E82] text-[12.5px] py-10">No hay clientes registrados en esta región.</p>
                ) : (
                  <div className="space-y-3">
                    {map.modalInfo.data.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-[#EDE8E1] bg-[#FDFAF7] hover:border-[#C17B2A] transition-all">
                        <div className="min-w-0 flex-1 pr-4">
                          <p className="font-bold text-[#1C0F05] text-[13px] truncate">{item.nombre}</p>
                          <p className="text-[10.5px] font-medium text-[#8B7D72] flex items-center gap-1.5 mt-1">
                            <MapPin className="w-3.5 h-3.5 shrink-0 text-[#B5A99E]" /> 
                            <span className="truncate">{item.direccion || 'Dirección no especificada'}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};