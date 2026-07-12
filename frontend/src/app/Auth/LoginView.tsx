import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export const LoginView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  
  const { login, checkAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Si intentó entrar a una ruta privada antes de loguearse, lo devolvemos ahí. Si no, al dashboard.
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning("Por favor, ingresa tu correo y contraseña.");
      return;
    }

    setCargando(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        // Guardamos el token temporalmente para llamar a /me
        localStorage.setItem("token", data.access_token);
        
        // Obtenemos los datos del usuario
        const meResponse = await fetch("/api/me", {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${data.access_token}`
          }
        });

        if (meResponse.ok) {
          const userData = await meResponse.json();
          login(data.access_token, userData);
          toast.success(`¡Bienvenido de vuelta, ${userData.name}!`);
          navigate(from, { replace: true });
        }
      } else {
        if (response.status === 401) {
          toast.error("Credenciales incorrectas. Verifica tu correo y contraseña.");
        } else {
          toast.error("Error al iniciar sesión.");
        }
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFAF7] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Círculos decorativos de fondo */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#FDF3E7] rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#FDF3E7] rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#C17B2A] rounded-2xl flex items-center justify-center shadow-lg shadow-[#C17B2A]/30">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-black text-[#1C0F05] tracking-tight">
          San Felipe - SIGESAFE
        </h2>
        <p className="mt-2 text-center text-sm font-medium text-[#8B7D72]">
          Ingresa tus credenciales para acceder al sistema
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-4 shadow-xl shadow-[#1C0F05]/5 sm:rounded-3xl sm:px-10 border border-[#EDE8E1]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[11px] font-bold text-[#7A6E65] uppercase tracking-wider mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-[#B5A99E]" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-[#FDFAF7] border border-[#DDD5CB] rounded-xl text-[13px] text-[#1C0F05] placeholder-[#C0B4AA] focus:outline-none focus:ring-2 focus:ring-[#C17B2A]/20 focus:border-[#C17B2A] transition-all"
                  placeholder="ejemplo@empresa.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#7A6E65] uppercase tracking-wider mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#B5A99E]" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-[#FDFAF7] border border-[#DDD5CB] rounded-xl text-[13px] text-[#1C0F05] placeholder-[#C0B4AA] focus:outline-none focus:ring-2 focus:ring-[#C17B2A]/20 focus:border-[#C17B2A] transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md shadow-[#C17B2A]/20 text-sm font-bold text-white bg-[#C17B2A] hover:bg-[#A86522] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C17B2A] transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {cargando ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};