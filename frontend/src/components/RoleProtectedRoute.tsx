import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface RoleProtectedRouteProps {
  allowedRoles: string[];
}

export const RoleProtectedRoute = ({ allowedRoles }: RoleProtectedRouteProps) => {
  const { user } = useAuth();

  // Si por alguna razón se perdió la sesión, al login
  if (!user) return <Navigate to="/login" replace />;

  // Si el rol del usuario NO está en la lista de permitidos para este módulo...
  if (!allowedRoles.includes(user.role)) {
    // Redirección inteligente: Si es motorizado lo mandamos a sus entregas, a los demás al dashboard
    const defaultPath = user.role === "motorizado" ? "/entregas" : "/dashboard";
    return <Navigate to={defaultPath} replace />;
  }

  // Si tiene permiso, lo dejamos pasar al módulo
  return <Outlet />;
};