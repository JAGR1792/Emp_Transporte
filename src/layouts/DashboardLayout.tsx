import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Truck, Bell, Settings, User as UserIcon } from 'lucide-react';
import { cn } from '@/utils';

export const DashboardLayout = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="h-16 flex items-center px-6 bg-slate-950">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-white">
            <Truck className="w-6 h-6 text-brand-500" />
            Emp Transporte
          </Link>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <img 
              src={user?.avatar} 
              alt={user?.name} 
              className="w-10 h-10 rounded-full border-2 border-slate-700" 
            />
            <div>
              <p className="text-body-sm font-bold text-white line-clamp-1">{user?.name}</p>
              <p className="text-caption text-brand-400">{user?.role}</p>
            </div>
          </div>

          <nav className="space-y-1">
            <div className="px-3 py-2 text-white bg-slate-800 rounded-radius-lg font-medium text-body-sm flex items-center gap-3">
              Dashboard Principal
            </div>
            <div className="px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-radius-lg font-medium text-body-sm flex items-center gap-3 cursor-pointer transition-colors">
              <UserIcon className="w-4 h-4" /> Mi Perfil
            </div>
            <div className="px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-radius-lg font-medium text-body-sm flex items-center gap-3 cursor-pointer transition-colors">
              <Settings className="w-4 h-4" /> Configuración
            </div>
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-slate-800">
          <button 
            onClick={logout}
            className="flex items-center gap-2 w-full px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-radius-lg transition-colors text-body-sm"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <h1 className="text-heading-sm font-bold text-slate-900">
            {user?.role === 'ADMIN' ? 'Vista Gerencial' : user?.role === 'OPERARIO' ? 'Portal Operativo' : 'Mi Portal'}
          </h1>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
