import React, { useEffect, useState } from "react";
import { DashboardLayout } from "../dashboard/DashboardLayout";
import { Plus, Edit, Trash2, Search, X, Save, Tags, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import api from "../../../lib/api";

interface Categoria {
  id: number;
  nombre_categoria: string;
  descripcion: string | null;
  estado: boolean;
}

export const CategoriasView = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<'activos' | 'inactivos'>('activos');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [categoriaAEditar, setCategoriaAEditar] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    nombre_categoria: "",
    descripcion: "",
    estado: true
  });

  const fetchCategorias = async () => {
    try {
      setCargando(true);
      const response = await api.get("/categorias");
      if (response.data.success) {
        setCategorias(response.data.data);
      }
    } catch (error) {
      toast.error("Error al cargar las categorías.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setGuardando(true);
      let response;
      if (categoriaAEditar) {
        response = await api.put(`/categorias/${categoriaAEditar}`, formData);
      } else {
        response = await api.post("/categorias", formData);
      }
      
      if (response.data.success) {
        toast.success(response.data.message);
        cerrarModal();
        fetchCategorias();
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach((err: any) => toast.error(err[0]));
      } else {
        toast.error("Ocurrió un error al procesar la solicitud.");
      }
    } finally {
      setGuardando(false);
    }
  };

  const handleDesactivar = async (id: number, nombre: string) => {
    const confirmar = window.confirm(`¿Estás seguro de desactivar la categoría "${nombre}"?`);
    if (!confirmar) return;
    try {
      const response = await api.delete(`/categorias/${id}`);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchCategorias();
      }
    } catch (error) {
      toast.error("No se pudo desactivar la categoría.");
    }
  };

  const handleReactivar = async (id: number, nombre: string) => {
    try {
      const response = await api.put(`/categorias/${id}/restaurar`);
      if (response.data.success) {
        toast.success(`Categoría "${nombre}" reactivada correctamente.`);
        fetchCategorias();
      }
    } catch (error) {
      toast.error("No se pudo reactivar la categoría.");
    }
  };

  const abrirModalCrear = () => {
    setCategoriaAEditar(null);
    setFormData({ nombre_categoria: "", descripcion: "", estado: true });
    setIsModalOpen(true);
  };

  const abrirModalEditar = (categoria: Categoria) => {
    setCategoriaAEditar(categoria.id);
    setFormData({
      nombre_categoria: categoria.nombre_categoria,
      descripcion: categoria.descripcion || "",
      estado: categoria.estado
    });
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setCategoriaAEditar(null);
  };

  // KPIs
  const totalCategorias = categorias.length;
  const categoriasActivas = categorias.filter(c => c.estado).length;
  const categoriasInactivas = totalCategorias - categoriasActivas;

  const categoriasFiltradas = categorias.filter(c => filtroEstado === 'activos' ? c.estado : !c.estado);

  return (
    <DashboardLayout>
      <div className="space-y-6 relative">
        
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Catálogo de Categorías</h2>
            <p className="text-sm text-slate-500 mt-1">Clasifica y organiza tus productos de café y cacao.</p>
          </div>
          <button onClick={abrirModalCrear} className="flex items-center bg-amber-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-amber-800 transition-colors shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Categoría
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mr-4"><Tags className="w-6 h-6" /></div>
            <div><p className="text-sm text-slate-500 font-medium">Total Categorías</p><p className="text-2xl font-bold text-slate-800">{totalCategorias}</p></div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mr-4"><CheckCircle className="w-6 h-6" /></div>
            <div><p className="text-sm text-slate-500 font-medium">Categorías Activas</p><p className="text-2xl font-bold text-slate-800">{categoriasActivas}</p></div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mr-4"><XCircle className="w-6 h-6" /></div>
            <div><p className="text-sm text-slate-500 font-medium">Categorías Inactivas</p><p className="text-2xl font-bold text-slate-800">{categoriasInactivas}</p></div>
          </div>
        </div>

        {/* Controles: Buscador y Filtro */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center w-full sm:w-auto bg-slate-100 p-1 rounded-lg">
            <button onClick={() => setFiltroEstado('activos')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filtroEstado === 'activos' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Activos</button>
            <button onClick={() => setFiltroEstado('inactivos')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filtroEstado === 'inactivos' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Inactivos</button>
          </div>

          <div className="flex items-center w-full sm:w-72 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input type="text" placeholder="Buscar categoría..." className="w-full bg-transparent border-none outline-none text-sm text-slate-700" />
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                <tr>
                  <th className="px-6 py-4">Categoría</th>
                  <th className="px-6 py-4">Descripción</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cargando ? (
                  [1, 2, 3].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-1/2"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-3/4"></div></td>
                      <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded-full w-16"></div></td>
                      <td className="px-6 py-4 text-right"><div className="h-8 bg-slate-200 rounded w-16 ml-auto"></div></td>
                    </tr>
                  ))
                ) : categoriasFiltradas.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">No hay categorías {filtroEstado} para mostrar.</td></tr>
                ) : (
                  categoriasFiltradas.map((categoria) => (
                    <tr key={categoria.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        <div className="flex items-center">
                          <Tags className="w-4 h-4 text-amber-600 mr-2" />
                          {categoria.nombre_categoria}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={categoria.descripcion || ''}>
                        {categoria.descripcion || <span className="text-slate-400 italic">Sin descripción</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${categoria.estado ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {categoria.estado ? 'Activa' : 'Inactiva'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {categoria.estado ? (
                            <>
                              <button onClick={() => abrirModalEditar(categoria)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => handleDesactivar(categoria.id, categoria.nombre_categoria)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                            </>
                          ) : (
                            <button onClick={() => handleReactivar(categoria.id, categoria.nombre_categoria)} className="flex items-center px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors">
                              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Reactivar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={cerrarModal}></div>
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">{categoriaAEditar ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
                <button onClick={cerrarModal} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Nombre de la Categoría *</label>
                  <input required type="text" value={formData.nombre_categoria} onChange={e => setFormData({...formData, nombre_categoria: e.target.value})} placeholder="Ej: Café Tostado Mínimo" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-600/20" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Descripción</label>
                  <textarea rows={3} value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} placeholder="Detalles sobre esta categoría..." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-600/20 resize-none" />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={cerrarModal} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
                  <button type="submit" disabled={guardando} className="flex items-center px-4 py-2 bg-amber-700 text-white text-sm font-medium rounded-lg hover:bg-amber-800 disabled:opacity-50">
                    <Save className="w-4 h-4 mr-2" />
                    {guardando ? 'Guardando...' : (categoriaAEditar ? 'Actualizar' : 'Guardar')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};