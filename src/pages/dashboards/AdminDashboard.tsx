import { motion } from 'framer-motion';
import { TrendingUp, Truck, Users, AlertTriangle } from 'lucide-react';

export const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Ingresos Hoy', value: '$15.4M', change: '+12%', icon: <TrendingUp className="w-6 h-6" />, color: 'text-emerald-600' },
          { title: 'Buses en Ruta', value: '142', change: '84% ocup.', icon: <Truck className="w-6 h-6" />, color: 'text-blue-600' },
          { title: 'Pasajeros Hoy', value: '4,291', change: '+5%', icon: <Users className="w-6 h-6" />, color: 'text-brand-600' },
          { title: 'Alertas Activas', value: '3', change: 'Mantenimiento', icon: <AlertTriangle className="w-6 h-6" />, color: 'text-red-600' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.title}
            className="bg-white rounded-radius-xl p-6 border border-slate-200 shadow-shadow-sm relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-current opacity-[0.03] rounded-bl-full -mr-4 -mt-4 ${stat.color}`} />
            
            <div className={`w-12 h-12 rounded-radius-lg flex items-center justify-center mb-4 bg-slate-50 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-body-sm font-medium text-slate-500 mb-1">{stat.title}</p>
            <div className="flex items-end gap-3">
              <h3 className="text-heading-lg font-bold text-slate-900">{stat.value}</h3>
              <span className={`text-caption font-semibold mb-1 ${stat.title === 'Alertas Activas' ? 'text-red-500' : 'text-emerald-500'}`}>
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico Simulado */}
        <motion.div 
          className="bg-white rounded-radius-2xl p-6 border border-slate-200 shadow-shadow-sm lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Ingresos vs Pasajeros (Semana)</h3>
            <select className="bg-slate-50 border border-slate-200 text-body-sm rounded-radius-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500">
              <option>Esta semana</option>
              <option>Mes anterior</option>
            </select>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
              <div key={i} className="w-full flex flex-col items-center gap-2 group">
                <div className="w-full bg-brand-100 rounded-t-md relative flex items-end justify-center group-hover:bg-brand-200 transition-colors" style={{ height: `${h}%` }}>
                  <div className="w-full bg-brand-500 rounded-t-md" style={{ height: `${h * 0.7}%` }} />
                </div>
                <span className="text-caption text-slate-400">
                  {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'][i]}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Novedades Recientes */}
        <motion.div 
          className="bg-white rounded-radius-2xl p-6 border border-slate-200 shadow-shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-bold text-slate-900 mb-6">Novedades Recientes</h3>
          <div className="space-y-4">
            {[
              { user: 'Juan D. (Cond)', type: 'Incapacidad', date: 'Hoy', color: 'bg-red-100 text-red-600' },
              { user: 'Bus 105', type: 'Mantenimiento Preventivo', date: 'Hoy', color: 'bg-amber-100 text-amber-600' },
              { user: 'Terminal Cali', type: 'Cierre Exitoso', date: 'Ayer', color: 'bg-emerald-100 text-emerald-600' },
              { user: 'Bus 402', type: 'Asignación de Ruta', date: 'Ayer', color: 'bg-blue-100 text-blue-600' },
            ].map((n, i) => (
              <div key={i} className="flex gap-3 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${n.color.split(' ')[0]}`} />
                <div>
                  <p className="text-body-sm font-semibold text-slate-900">{n.user}</p>
                  <p className="text-caption text-slate-500">{n.type} • {n.date}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 border border-slate-200 text-slate-600 rounded-radius-lg text-body-sm font-medium hover:bg-slate-50 transition-colors">
            Ver todas las novedades
          </button>
        </motion.div>
      </div>
    </div>
  );
};
