import { useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Truck, Bell, Settings, User as UserIcon, Menu, X, BarChart2, Package, Calendar, CreditCard, Layers, FileText, MapPin } from 'lucide-react';
import { cn } from '@/utils';

// Nav items per role
const NAV_ITEMS: Record<string, { icon: React.ReactNode; label: string; to?: string }[]> = {
  ADMIN: [
    { icon: <BarChart2 className="w-4 h-4" />, label: 'Gerencia', to: '/dashboard' },
    { icon: <MapPin className="w-4 h-4" />, label: 'Rutas y Métricas', to: '/dashboard/rutas' },
    { icon: <Truck className="w-4 h-4" />, label: 'Flota' },
    { icon: <FileText className="w-4 h-4" />, label: 'Reportes' },
    { icon: <UserIcon className="w-4 h-4" />, label: 'Usuarios' },
    { icon: <Settings className="w-4 h-4" />, label: 'Configuración' },
  ],
  OPERARIO: [
    { icon: <Calendar className="w-4 h-4" />, label: 'Tiquetes' },
    { icon: <Package className="w-4 h-4" />, label: 'Encomiendas' },
    { icon: <Layers className="w-4 h-4" />, label: 'Mi Turno' },
    { icon: <UserIcon className="w-4 h-4" />, label: 'Mi Perfil' },
  ],
  CLIENTE: [
    { icon: <Truck className="w-4 h-4" />, label: 'Mis Viajes' },
    { icon: <Package className="w-4 h-4" />, label: 'Mis Envíos' },
    { icon: <CreditCard className="w-4 h-4" />, label: 'Mis Pagos' },
    { icon: <UserIcon className="w-4 h-4" />, label: 'Mi Perfil' },
  ],
};

const useLiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
};

export const DashboardLayout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const now = useLiveClock();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const navItems = NAV_ITEMS[user?.role ?? ''] ?? [];

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const roleLabel: Record<string, string> = { ADMIN: 'Vista Gerencial', OPERARIO: 'Portal Operativo', CLIENTE: 'Mi Portal' };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-x-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "w-64 bg-slate-900 text-slate-300 flex flex-col fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 bg-slate-950">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-white">
            <Truck className="w-6 h-6 text-brand-500" />
            Emp Transporte
          </Link>
          <button
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {/* User profile */}
          <div className="flex items-center gap-3 mb-7 p-3 bg-slate-800/60 rounded-radius-xl">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full border-2 border-slate-700 flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-body-sm flex-shrink-0 border-2 border-slate-700">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-body-sm font-bold text-white truncate">{user?.name}</p>
              <p className="text-caption text-brand-400 font-medium">{user?.role}</p>
            </div>
          </div>

          {/* Role-based nav */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.to
                ? location.pathname === item.to
                : false;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.to) navigate(item.to);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full px-3 py-2.5 rounded-radius-lg font-medium text-body-sm flex items-center gap-3 transition-colors text-left",
                    isActive
                      ? "bg-brand-600 text-white shadow-shadow-sm"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-radius-lg transition-colors text-body-sm"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 -ml-1 text-slate-600 hover:bg-slate-100 rounded-radius-lg"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-heading-sm font-bold text-slate-900 truncate hidden sm:block">
                {roleLabel[user?.role ?? ''] ?? 'Dashboard'}
              </h1>
              <p className="text-caption text-slate-400 hidden lg:block truncate max-w-[200px]">
                {now.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })} · {now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border-2 border-slate-200" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-body-sm border-2 border-slate-200">
                {initials}
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-3 lg:p-6 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
