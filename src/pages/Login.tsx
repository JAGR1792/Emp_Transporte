import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, Shield, Users, Briefcase } from 'lucide-react';
import { useAuth, Role } from '@/context/AuthContext';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role: Role) => {
    login(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 bg-white rounded-radius-2xl shadow-shadow-elevated overflow-hidden border border-slate-100">
        
        {/* Branding Side */}
        <div className="bg-brand-600 p-12 text-white flex flex-col justify-center relative overflow-hidden hidden md:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-brand-800" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-heading-xl font-bold mb-4">
              Bienvenido a tu plataforma
            </h1>
            <p className="text-brand-100 text-body-lg">
              Sistema integral de gestión de pasajeros, encomiendas y logística.
            </p>
          </div>
        </div>

        {/* Login Side */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-heading-lg font-bold text-slate-900">Iniciar Sesión (Demo)</h2>
            <p className="text-body-sm text-slate-500 mt-2">
              Selecciona un perfil para acceder a su dashboard respectivo.
            </p>
          </div>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLogin('ADMIN')}
              className="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-radius-xl hover:border-brand-300 hover:bg-brand-50 transition-colors text-left"
            >
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Administrador</h3>
                <p className="text-caption text-slate-500">Acceso total, métricas y flota</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLogin('OPERARIO')}
              className="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-radius-xl hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Operario / Cajero</h3>
                <p className="text-caption text-slate-500">Ventas de tiquetes y encomiendas</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLogin('CLIENTE')}
              className="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-radius-xl hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-left"
            >
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Cliente</h3>
                <p className="text-caption text-slate-500">Portal de auto-servicio</p>
              </div>
            </motion.button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <button onClick={() => navigate('/')} className="text-body-sm font-medium text-brand-600 hover:text-brand-700">
              ← Volver al sitio público
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
