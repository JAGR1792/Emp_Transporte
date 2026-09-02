import { motion } from 'framer-motion';
import { Package, Truck, Calendar, MapPin, Search } from 'lucide-react';

export const ClienteDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Próximo Viaje */}
        <motion.div 
          className="bg-brand-600 rounded-radius-2xl p-6 text-white shadow-shadow-md relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
          <div className="flex items-center gap-3 mb-4 opacity-90">
            <Truck className="w-5 h-5" />
            <h3 className="font-semibold text-body-sm">Mi próximo viaje</h3>
          </div>
          <p className="text-heading-md font-bold mb-1">Bogotá → Medellín</p>
          <p className="text-brand-100 text-body-sm mb-6">Mañana, 08:30 AM • Bus 402</p>
          
          <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-radius-lg text-body-sm font-medium transition-colors backdrop-blur-sm">
            Ver Tiquete
          </button>
        </motion.div>

        {/* Rastreo Rápido */}
        <motion.div 
          className="bg-white rounded-radius-2xl p-6 border border-slate-200 shadow-shadow-sm md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-6 text-slate-700">
            <Search className="w-5 h-5 text-brand-600" />
            <h3 className="font-semibold">Rastreo de encomiendas</h3>
          </div>
          
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="Número de guía (Ej: ENV-99281)"
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-radius-lg focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
            <button className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-radius-lg font-medium transition-colors">
              Buscar
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <h4 className="text-caption font-semibold text-slate-400 uppercase tracking-wider mb-4">Envíos Recientes</h4>
            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-radius-lg transition-colors border border-transparent hover:border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-body-sm">ENV-48291</p>
                  <p className="text-caption text-slate-500">Documentos • Entregado</p>
                </div>
              </div>
              <span className="text-caption text-slate-400">Hace 2 días</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Historial o Acciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          className="bg-white rounded-radius-2xl p-6 border border-slate-200 shadow-shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-bold text-slate-900 mb-6">Acciones Rápidas</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-slate-50 hover:bg-brand-50 border border-slate-100 hover:border-brand-200 rounded-radius-xl text-left transition-colors group">
              <Calendar className="w-6 h-6 text-brand-600 mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-slate-900 text-body-sm">Nuevo Viaje</p>
              <p className="text-caption text-slate-500">Comprar tiquetes</p>
            </button>
            <button className="p-4 bg-slate-50 hover:bg-brand-50 border border-slate-100 hover:border-brand-200 rounded-radius-xl text-left transition-colors group">
              <MapPin className="w-6 h-6 text-brand-600 mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-slate-900 text-body-sm">Mis Direcciones</p>
              <p className="text-caption text-slate-500">Gestionar envíos</p>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
