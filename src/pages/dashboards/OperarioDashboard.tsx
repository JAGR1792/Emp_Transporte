import { motion } from 'framer-motion';
import { DollarSign, Printer, Users, Box, ArrowRight } from 'lucide-react';

export const OperarioDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Resumen de Turno */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'Ventas Tiquetes', value: '$1,240.000', icon: <Users className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-100' },
          { title: 'Ventas Encomiendas', value: '$850.000', icon: <Box className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { title: 'Total Efectivo', value: '$2,090.000', icon: <DollarSign className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-100' },
          { title: 'Cierre de Turno', value: 'Pendiente', icon: <Printer className="w-5 h-5" />, color: 'text-slate-600', bg: 'bg-slate-100', action: true },
        ].map((stat, i) => (
          <motion.div 
            key={stat.title}
            className={`bg-white rounded-radius-xl p-5 border border-slate-200 shadow-shadow-sm ${stat.action ? 'cursor-pointer hover:border-slate-300' : ''}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
              <p className="text-body-sm font-medium text-slate-500">{stat.title}</p>
            </div>
            <div className="flex items-end justify-between">
              <h3 className="text-heading-sm font-bold text-slate-900">{stat.value}</h3>
              {stat.action && <ArrowRight className="w-4 h-4 text-slate-400" />}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Próximas Salidas */}
        <motion.div 
          className="bg-white rounded-radius-2xl border border-slate-200 shadow-shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h3 className="font-bold text-slate-900">Próximas Salidas (Terminal Bogotá)</h3>
            <button className="text-caption font-semibold text-brand-600 hover:text-brand-700">Ver todas</button>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { dest: 'Medellín', time: '14:30', bus: '402', pax: '35/40', status: 'Abordando' },
              { dest: 'Cali', time: '15:00', bus: '115', pax: '40/40', status: 'Lleno' },
              { dest: 'Bucaramanga', time: '15:45', bus: '208', pax: '12/40', status: 'Vendiendo' },
            ].map((viaje, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-bold text-slate-900">{viaje.dest}</p>
                  <p className="text-caption text-slate-500">Bus {viaje.bus} • {viaje.time}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 rounded-md text-caption font-semibold mb-1 ${viaje.status === 'Abordando' ? 'bg-amber-100 text-amber-700' : viaje.status === 'Lleno' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {viaje.status}
                  </span>
                  <p className="text-caption text-slate-600 font-medium">{viaje.pax} pax</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Acciones de Cajero */}
        <motion.div 
          className="bg-white rounded-radius-2xl p-6 border border-slate-200 shadow-shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-bold text-slate-900 mb-6">Operaciones</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-6 bg-brand-50 hover:bg-brand-100 border border-brand-100 rounded-radius-xl flex flex-col items-center justify-center text-center transition-colors group">
              <div className="w-12 h-12 bg-white rounded-full shadow-shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-brand-600" />
              </div>
              <p className="font-bold text-brand-900 text-body-sm">Vender Tiquete</p>
            </button>
            <button className="p-6 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-radius-xl flex flex-col items-center justify-center text-center transition-colors group">
              <div className="w-12 h-12 bg-white rounded-full shadow-shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Box className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="font-bold text-emerald-900 text-body-sm">Recibir Encomienda</p>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
