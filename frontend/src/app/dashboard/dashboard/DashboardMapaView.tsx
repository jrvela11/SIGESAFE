import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Circle, Popup, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DashboardLayout } from "../dashboard/DashboardLayout";
import {
  Coffee, MapPin, Search, ChevronLeft, ChevronRight,
  Users, Building2, LayoutGrid, List, X
} from "lucide-react";
import api from "../../../lib/api";

// Iconos de Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const clienteIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const proveedorIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Tipos
interface DetalleEntidad {
  id: number;
  nombre: string;
  transacciones: number;
  direccion: string | null;
}

interface Entidad {
  id: number;
  tipo: "cliente" | "proveedor";
  nombre: string;
  direccion: string | null;
  distrito: string | null;
  provincia: string | null;
  departamento: string | null;
  latitud?: number | null;
  longitud?: number | null;
}

interface GrupoEntidad {
  departamento: string;
  cantidad: number;
  latitud: number | null;
  longitud: number | null;
  detalles: DetalleEntidad[];
}

type ModoVista = "agrupado" | "individual";

const ChangeView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  map.flyTo(center, zoom);
  return null;
};

export const DashboardMapaView = () => {
  const [modoVista, setModoVista] = useState<ModoVista>("agrupado");
  const [entidades, setEntidades] = useState<Entidad[]>([]);
  const [gruposClientes, setGruposClientes] = useState<GrupoEntidad[]>([]);
  const [gruposProveedores, setGruposProveedores] = useState<GrupoEntidad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [centro, setCentro] = useState<[number, number] | null>(null);
  const [zoom, setZoom] = useState<number | null>(null);
  
  // Filtros y Paginación - Individual
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "clientes" | "proveedores">("todos");
  const [pagina, setPagina] = useState(1);
  const POR_PAGINA = 6;

  // Filtros y Paginación - Agrupado (Regiones)
  const [tabRegiones, setTabRegiones] = useState<"clientes" | "proveedores">("clientes");
  const [paginaRegiones, setPaginaRegiones] = useState(1);
  const REGIONES_POR_PAGINA = 5;

  const [modalInfo, setModalData] = useState<{
    titulo: string;
    tipo: 'cliente' | 'proveedor';
    data: DetalleEntidad[];
  } | null>(null);

  useEffect(() => {
    if (modoVista === "individual") {
      cargarDatosIndividuales();
    } else {
      cargarDatosAgrupados();
    }
  }, [modoVista]);

  const cargarDatosAgrupados = async () => {
    setCargando(true);
    try {
      const [resCli, resProv] = await Promise.all([
        api.get("/clientes/agrupados"),
        api.get("/proveedores/agrupados"),
      ]);
      if (resCli.data.success) setGruposClientes(resCli.data.data || []);
      if (resProv.data.success) setGruposProveedores(resProv.data.data || []);
    } catch (err) {
      console.error("Error al cargar datos agrupados");
    } finally {
      setCargando(false);
    }
  };

  const cargarDatosIndividuales = async () => {
    setCargando(true);
    try {
      const [resClientes, resProveedores] = await Promise.all([
        api.get("/clientes/mapa"),
        api.get("/proveedores/mapa"),
      ]);
      const clientes: Entidad[] = (resClientes.data.data || []).map((c: any) => ({
        ...c,
        tipo: "cliente",
        nombre: c.nombre_completo || `${c.nombre} ${c.apellido || ""}`.trim(),
        latitud: c.latitud ?? null,
        longitud: c.longitud ?? null,
      }));
      const proveedores: Entidad[] = (resProveedores.data.data || []).map((p: any) => ({
        ...p,
        tipo: "proveedor",
        nombre: p.razon_social,
        latitud: p.latitud ?? null,
        longitud: p.longitud ?? null,
      }));
      setEntidades([...clientes, ...proveedores]);
    } catch (err) {
      console.error("Error al cargar datos individuales");
    } finally {
      setCargando(false);
    }
  };

  const centrarEnMapa = (lat: number, lon: number, zoomLevel = 14) => {
    setCentro([lat, lon]);
    setZoom(zoomLevel);
  };

  // --- LÓGICA DE PAGINACIÓN: INDIVIDUAL ---
  const entidadesFiltradas = entidades
    .filter((e) => {
      if (filtroTipo === "clientes") return e.tipo === "cliente";
      if (filtroTipo === "proveedores") return e.tipo === "proveedor";
      return true;
    })
    .filter((e) => e.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  const totalPaginas = Math.ceil(entidadesFiltradas.length / POR_PAGINA);
  const paginaAjustada = Math.min(pagina, Math.max(1, totalPaginas));
  const entidadesPaginadas = entidadesFiltradas.slice(
    (paginaAjustada - 1) * POR_PAGINA,
    paginaAjustada * POR_PAGINA
  );

  // --- LÓGICA DE PAGINACIÓN: AGRUPADO (REGIONES) ---
  const listaRegionesActiva = tabRegiones === "clientes" ? gruposClientes : gruposProveedores;
  const listaRegionesOrdenada = listaRegionesActiva
    .filter(g => g.latitud && g.longitud)
    .sort((a, b) => b.cantidad - a.cantidad);
  
  const totalPaginasRegiones = Math.ceil(listaRegionesOrdenada.length / REGIONES_POR_PAGINA);
  const paginaRegionesAjustada = Math.min(paginaRegiones, Math.max(1, totalPaginasRegiones));
  const regionesPaginadas = listaRegionesOrdenada.slice(
    (paginaRegionesAjustada - 1) * REGIONES_POR_PAGINA,
    paginaRegionesAjustada * REGIONES_POR_PAGINA
  );

  const defaultCenter: [number, number] = [-9.19, -75.0152];

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full gap-4 pb-4">
        
        {/* Banner */}
        <div className="shrink-0 relative bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 rounded-3xl p-5 sm:p-6 text-white overflow-hidden shadow-md shadow-amber-900/10">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 20% 40%, rgba(255,255,255,0.3) 2px, transparent 2px),
                              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 1.5px, transparent 1.5px)`,
            backgroundSize: "80px 80px, 120px 120px"
          }} />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                <Coffee className="w-6 h-6 text-amber-100" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-none mb-1">Geointeligencia de Negocios</h1>
                <p className="text-amber-100/80 text-xs">Visualiza y analiza la ubicación de tu red comercial.</p>
              </div>
            </div>
            <div className="flex bg-white/20 rounded-xl p-1 gap-1 self-start sm:self-auto backdrop-blur">
              <button
                onClick={() => { setModoVista("agrupado"); setCentro(null); setPaginaRegiones(1); }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  modoVista === "agrupado" ? "bg-white text-amber-800 shadow-sm" : "text-white/70 hover:text-white"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 inline mr-1" /> Regiones
              </button>
              <button
                onClick={() => { setModoVista("individual"); setCentro(null); setPagina(1); }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  modoVista === "individual" ? "bg-white text-amber-800 shadow-sm" : "text-white/70 hover:text-white"
                }`}
              >
                <List className="w-3.5 h-3.5 inline mr-1" /> Detallado
              </button>
            </div>
          </div>
        </div>

        {/* CONTENEDOR PRINCIPAL: h-auto en móvil, altura calculada en PC */}
        <div className="flex flex-col lg:flex-row gap-4 flex-1 h-auto lg:h-[calc(100vh-220px)] lg:overflow-hidden">
          
          {/* PANEL IZQUIERDO (Lista) */}
          <div className="w-full lg:w-[380px] xl:w-[420px] flex flex-col gap-3 h-auto lg:h-full shrink-0">
            
            {/* Controles y Filtros */}
            <div className="shrink-0 space-y-3">
              {modoVista === "individual" ? (
                <div className="flex flex-col gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre..."
                      value={busqueda}
                      onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500/20 shadow-sm"
                    />
                  </div>
                  <div className="flex bg-white border border-stone-200 shadow-sm rounded-xl p-1 gap-1">
                    {(["todos", "clientes", "proveedores"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => { setFiltroTipo(tab); setPagina(1); }}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          filtroTipo === tab ? "bg-stone-100 text-stone-800 shadow-sm" : "text-stone-400 hover:text-stone-600"
                        }`}
                      >
                        {tab === "todos" ? "Todos" : tab === "clientes" ? "Clientes" : "Proveedores"}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex bg-white border border-stone-200 shadow-sm rounded-xl p-1 gap-1">
                  <button
                    onClick={() => { setTabRegiones("clientes"); setPaginaRegiones(1); }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                      tabRegiones === "clientes" ? "bg-emerald-50 text-emerald-700 shadow-sm" : "text-stone-400 hover:bg-stone-50"
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" /> Clientes
                  </button>
                  <button
                    onClick={() => { setTabRegiones("proveedores"); setPaginaRegiones(1); }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                      tabRegiones === "proveedores" ? "bg-orange-50 text-orange-700 shadow-sm" : "text-stone-400 hover:bg-stone-50"
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" /> Proveedores
                  </button>
                </div>
              )}
            </div>

            {/* LISTA SCROLLABLE */}
            <div className="flex-1 bg-white border border-stone-200 rounded-2xl p-3 overflow-y-auto max-h-[400px] lg:max-h-none custom-scrollbar shadow-sm">
              {cargando ? (
                <div className="flex flex-col items-center justify-center h-full py-10 text-stone-400">
                  <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-700 rounded-full animate-spin mb-3" />
                  <p className="font-medium text-sm">Sincronizando satélites...</p>
                </div>
              ) : modoVista === "agrupado" ? (
                <div className="space-y-2">
                  {regionesPaginadas.length === 0 ? (
                    <div className="text-center text-stone-500 py-8 text-sm font-medium">No hay regiones registradas.</div>
                  ) : (
                    regionesPaginadas.map(grupo => (
                      <div
                        key={`${tabRegiones}-${grupo.departamento}`}
                        className={`rounded-xl border p-3 flex items-center justify-between transition-all cursor-pointer group ${
                          tabRegiones === 'clientes' 
                            ? 'bg-stone-50 border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/50' 
                            : 'bg-stone-50 border-stone-200 hover:border-orange-300 hover:bg-orange-50/50'
                        }`}
                        onClick={() => {
                          centrarEnMapa(grupo.latitud!, grupo.longitud!, 8);
                          setModalData({ 
                            titulo: `${grupo.departamento}`, 
                            tipo: tabRegiones === "clientes" ? "cliente" : "proveedor", 
                            data: grupo.detalles || [] 
                          });
                        }}
                      >
                        <div>
                          <p className={`font-extrabold text-stone-800 transition-colors ${tabRegiones === 'clientes' ? 'group-hover:text-emerald-700' : 'group-hover:text-orange-700'}`}>
                            {grupo.departamento}
                          </p>
                          <p className="text-[10px] text-stone-400 font-medium">Click para detallar</p>
                        </div>
                        <div className={`px-2.5 py-1 rounded-lg ${tabRegiones === 'clientes' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}`}>
                          <span className="text-lg font-black">{grupo.cantidad}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {entidadesPaginadas.length === 0 ? (
                    <div className="text-center text-stone-500 py-8 text-sm font-medium">No se encontraron registros.</div>
                  ) : (
                    entidadesPaginadas.map(entidad => {
                      const tieneUbicacion = entidad.latitud !== null && entidad.longitud !== null;
                      return (
                        <div
                          key={`${entidad.tipo}-${entidad.id}`}
                          className={`rounded-xl border p-3 flex items-center justify-between transition-all ${
                            tieneUbicacion ? 'bg-stone-50 border-stone-200 hover:border-amber-300' : 'bg-red-50/30 border-red-100'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              {entidad.tipo === "cliente" ? (
                                <Users className={`w-3.5 h-3.5 shrink-0 ${tieneUbicacion ? 'text-emerald-600' : 'text-stone-400'}`} />
                              ) : (
                                <Building2 className={`w-3.5 h-3.5 shrink-0 ${tieneUbicacion ? 'text-orange-600' : 'text-stone-400'}`} />
                              )}
                              <p className="font-bold text-sm text-stone-800 truncate">{entidad.nombre}</p>
                            </div>
                            {tieneUbicacion ? (
                              <p className="text-[10px] text-stone-500 font-medium ml-5 truncate">
                                {[entidad.distrito, entidad.provincia, entidad.departamento].filter(Boolean).join(', ')}
                              </p>
                            ) : (
                              <p className="text-[10px] text-red-500 font-bold ml-5">⚠️ Dirección no válida</p>
                            )}
                          </div>
                          {tieneUbicacion ? (
                            <button
                              onClick={() => centrarEnMapa(Number(entidad.latitud), Number(entidad.longitud), 14)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-amber-700 bg-white border border-stone-200 hover:bg-amber-100 hover:border-amber-300 transition-all shrink-0 shadow-sm"
                              title="Localizar en mapa"
                            >
                              <MapPin className="w-4 h-4" />
                            </button>
                          ) : (
                            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-100 text-stone-300 cursor-not-allowed shrink-0">
                              <MapPin className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Paginador Fijo */}
            <div className="shrink-0 bg-white border border-stone-200 rounded-xl p-2 shadow-sm flex items-center justify-between mt-1">
              {modoVista === "agrupado" ? (
                <>
                  <button
                    onClick={() => setPaginaRegiones(p => Math.max(1, p - 1))}
                    disabled={paginaRegiones === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-50 text-stone-600 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] text-stone-500 font-black tracking-widest uppercase">
                    Pág. {paginaRegionesAjustada} / {Math.max(1, totalPaginasRegiones)}
                  </span>
                  <button
                    onClick={() => setPaginaRegiones(p => Math.min(totalPaginasRegiones, p + 1))}
                    disabled={paginaRegiones === Math.max(1, totalPaginasRegiones)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-50 text-stone-600 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40 transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setPagina(p => Math.max(1, p - 1))}
                    disabled={pagina === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-50 text-stone-600 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] text-stone-500 font-black tracking-widest uppercase">
                    Pág. {paginaAjustada} / {Math.max(1, totalPaginas)}
                  </span>
                  <button
                    onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                    disabled={pagina === Math.max(1, totalPaginas)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-50 text-stone-600 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40 transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
            
            {/* Leyenda */}
            <div className="shrink-0 flex items-center justify-center gap-5 text-[10px] font-bold text-stone-400 uppercase tracking-widest bg-stone-100/50 p-2 rounded-xl mt-1">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Clientes</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Proveedores</div>
            </div>

          </div>

          {/* PANEL DERECHO (Mapa Interactivo): Forzamos altura estricta en todo momento */}
          <div 
            className="w-full lg:flex-1 bg-stone-100 rounded-3xl border-4 border-white shadow-xl overflow-hidden relative z-0"
            style={{ minHeight: "500px" }}
          >
            <MapContainer
              center={defaultCenter}
              zoom={6}
              style={{ height: "100%", width: "100%", minHeight: "500px" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />

              {modoVista === "agrupado" ? (
                <>
                  {gruposClientes.filter(g => g.latitud && g.longitud).map(grupo => (
                    <Circle
                      key={`cli-${grupo.departamento}`}
                      center={[grupo.latitud!, grupo.longitud!]}
                      radius={Math.min(60000, grupo.cantidad * 8000)}
                      eventHandlers={{
                        click: () => setModalData({ titulo: `${grupo.departamento}`, tipo: 'cliente', data: grupo.detalles || [] })
                      }}
                      pathOptions={{ color: "#10b981", fillColor: "#10b981", fillOpacity: 0.4, weight: 2 }}
                    >
                      <Tooltip sticky direction="top" className="font-bold text-emerald-800">
                        {grupo.departamento}: {grupo.cantidad} Clientes
                      </Tooltip>
                    </Circle>
                  ))}
                  {gruposProveedores.filter(g => g.latitud && g.longitud).map(grupo => (
                    <Circle
                      key={`prov-${grupo.departamento}`}
                      center={[grupo.latitud!, grupo.longitud!]}
                      radius={Math.min(60000, grupo.cantidad * 8000)}
                      eventHandlers={{
                        click: () => setModalData({ titulo: `${grupo.departamento}`, tipo: 'proveedor', data: grupo.detalles || [] })
                      }}
                      pathOptions={{ color: "#f97316", fillColor: "#f97316", fillOpacity: 0.4, weight: 2 }}
                    >
                      <Tooltip sticky direction="top" className="font-bold text-orange-800">
                        {grupo.departamento}: {grupo.cantidad} Proveedores
                      </Tooltip>
                    </Circle>
                  ))}
                </>
              ) : (
                entidades.filter(e => e.latitud && e.longitud).map(entidad => (
                  <Marker
                    key={`${entidad.tipo}-${entidad.id}`}
                    position={[entidad.latitud!, entidad.longitud!]}
                    icon={entidad.tipo === "cliente" ? clienteIcon : proveedorIcon}
                  >
                    <Popup className="rounded-2xl">
                      <div className="text-sm font-sans p-1">
                        <p className="font-black text-stone-800 mb-1 leading-tight">{entidad.nombre}</p>
                        <p className="text-stone-600 font-medium text-xs leading-tight mb-1">{entidad.direccion}</p>
                        <p className="text-stone-400 text-[10px] uppercase tracking-wider">
                          {[entidad.distrito, entidad.departamento].filter(Boolean).join(" • ")}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))
              )}

              {centro && zoom && <ChangeView center={centro} zoom={zoom} />}
            </MapContainer>
          </div>
        </div>

        {/* Modal Interactivo de Región */}
        {modalInfo && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300">
              <div className={`p-5 text-white flex justify-between items-center ${modalInfo.tipo === 'cliente' ? 'bg-gradient-to-r from-emerald-700 to-emerald-500' : 'bg-gradient-to-r from-orange-700 to-orange-500'}`}>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                    {modalInfo.tipo === 'cliente' ? <Users className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                    {modalInfo.titulo}
                  </h3>
                  <p className="text-white/90 text-xs font-bold mt-0.5">Ranking de operaciones en la región</p>
                </div>
                <button onClick={() => setModalData(null)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-stone-50">
                {modalInfo.data.length === 0 ? (
                  <p className="text-center text-stone-500 font-medium py-10">No hay datos registrados en esta región.</p>
                ) : (
                  <div className="space-y-3">
                    {modalInfo.data.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-stone-200 bg-white hover:border-amber-300 hover:shadow-md transition-all">
                        <div className="min-w-0 flex-1 pr-4">
                          <p className="font-extrabold text-stone-800 text-sm truncate">{item.nombre}</p>
                          <p className="text-[11px] font-medium text-stone-400 flex items-center gap-1 mt-1">
                            <MapPin className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{item.direccion || 'Dirección no especificada'}</span>
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-2xl font-black leading-none ${modalInfo.tipo === 'cliente' ? 'text-emerald-600' : 'text-orange-600'}`}>
                            {item.transacciones}
                          </p>
                          <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mt-1">
                            {modalInfo.tipo === 'cliente' ? 'Ventas' : 'Compras'}
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