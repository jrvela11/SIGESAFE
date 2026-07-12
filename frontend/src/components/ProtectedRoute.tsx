import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFAF7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#C17B2A]/30 border-t-[#C17B2A] rounded-full animate-spin" />
          <p className="text-[12px] font-bold text-[#8B7D72] uppercase tracking-widest">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirige al login y guarda la ruta a la que intentaba acceder
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};