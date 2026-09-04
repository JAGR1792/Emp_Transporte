import { motion } from 'framer-motion';
import { Package, Truck, Calendar, MapPin, Search, CheckCircle, Clock, Star, CreditCard, Download } from 'lucide-react';
import { Button } from '@/components/ui';

const PROXIMOS_VIAJES = [
  { ruta: 'Bogotá → Medellín', fecha: 'Mañana, 08:30 AM', bus: 'Bus 402', asiento: '12A', tipo: 'Ejecutivo', precio: '$85.000' },
];

const HISTORIAL_VIAJES = [
  { ruta: 'Bogotá → Cali', fecha: '28 Ago 2026', estado: 'Completado', precio: '$72.000' },
  { ruta: 'Cartagena → Bogotá', fecha: '15 Ago 2026', estado: 'Completado', precio: '$110.000' },
  { ruta: 'Bogotá → Medellín', fecha: '02 Ago 2026', estado: 'Completado', precio: '$68.000' },
];

const ENVIOS = [
  { guia: 'ENV-99281', destino: 'Medellín', estado: 'Entregado', fecha: '04 Sep', color: 'bg-emerald-100 text-emerald-700' },
  { guia: 'TRN-481920', destino: 'Bogotá', estado: 'En tránsito', fecha: 'Est. 06 Sep', color: 'bg-brand-100 text-brand-700' },
  { guia: 'ENV-00412', destino: 'Bucaramanga', estado: 'En terminal', fecha: 'Listo para recoger', color: 'bg-amber-100 text-amber-700' },
];

const VIAJE_STEPS = ['Comprado', 'Check-in', 'Abordando', 'En camino'];

export const ClienteDashboard = () => {
  const viajeStep = 1; // Check-in

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-heading-md font-bold text-slate-900">Mi Portal</h2>
        <p className="text-body-sm text-slate-500">Bienvenido de vuelta, revisa tus viajes y envíos activos.</p>
      </div>

      {/* Top row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Próximo viaje con timeline */}
        <motion.div
          className="bg-brand-600 rounded-radius-2xl p-6 text-white shadow-shadow-md relative overflow-hidden md:col-span-2"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-brand-200 text-caption font-semibold uppercase tracking-wide mb-1">Próximo Viaje</p>
              <h3 className="text-heading-md font-bold">{PROXIMOS_VIAJES[0].ruta}</h3>
              <p className="text-brand-100 text-body-sm mt-0.5">{PROXIMOS_VIAJES[0].fecha} · Asiento {PROXIMOS_VIAJES[0].asiento}</p>
            </div>
            <div className="bg-white/20 rounded-radius-lg px-3 py-1.5 text-caption font-semibold">{PROXIMOS_VIAJES[0].tipo}</div>
          </div>

          {/* Progress timeline */}
          <div className="flex items-center mt-6 mb-5">
            {VIAJE_STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-caption font-bold border-2 transition-all ${i < viajeStep ? 'bg-white border-white text-brand-600' : i === viajeStep ? 'bg-white/30 border-white text-white' : 'bg-transparent border-white/40 text-white/50'}`}>
                    {i < viajeStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-caption text-center leading-tight max-w-[56px] ${i === viajeStep ? 'text-white font-bold' : i < viajeStep ? 'text-brand-100' : 'text-white/40'}`}>{s}</span>
                </div>
                {i < VIAJE_STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < viajeStep ? 'bg-white' : 'bg-white/30'}`} />}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button className="flex-1 py-2 bg-white/20 hover:bg-white/30 rounded-radius-lg text-body-sm font-medium transition-colors backdrop-blur-sm flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Descargar tiquete
            </button>
            <button className="flex-1 py-2 bg-white text-brand-700 hover:bg-brand-50 rounded-radius-lg text-body-sm font-bold transition-colors flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" /> Hacer check-in
            </button>
          </div>
        </motion.div>

        {/* Acciones rápidas */}
        <motion.div
          className="bg-white rounded-radius-2xl p-6 border border-slate-200 shadow-shadow-sm"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        >
          <h3 className="font-bold text-slate-900 mb-4">Acciones rápidas</h3>
          <div className="space-y-2">
            {[
              { icon: <Calendar className="w-5 h-5 text-brand-600" />, label: 'Nuevo viaje', sub: 'Comprar tiquetes', bg: 'bg-brand-50 hover:bg-brand-100 border-brand-100 hover:border-brand-200' },
              { icon: <Search className="w-5 h-5 text-purple-600" />, label: 'Rastrear paquete', sub: 'Ver estado de envío', bg: 'bg-purple-50 hover:bg-purple-100 border-purple-100 hover:border-purple-200' },
              { icon: <Package className="w-5 h-5 text-emerald-600" />, label: 'Nuevo envío', sub: 'Cotizar y enviar', bg: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-100 hover:border-emerald-200' },
              { icon: <CreditCard className="w-5 h-5 text-amber-600" />, label: 'Mis pagos', sub: 'Historial y facturas', bg: 'bg-amber-50 hover:bg-amber-100 border-amber-100 hover:border-amber-200' },
            ].map(a => (
              <button key={a.label} className={`w-full p-3 ${a.bg} border rounded-radius-lg text-left transition-colors flex items-center gap-3 group`}>
                <div className="flex-shrink-0">{a.icon}</div>
                <div>
                  <p className="font-semibold text-slate-900 text-body-sm">{a.label}</p>
                  <p className="text-caption text-slate-500">{a.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Envíos + Historial */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Mis envíos */}
        <motion.div
          className="bg-white rounded-radius-2xl border border-slate-200 shadow-shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        >
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Truck className="w-4 h-4 text-brand-500" />Mis envíos recientes</h3>
            <button className="text-caption font-semibold text-brand-600 hover:text-brand-700">Ver todos</button>
          </div>
          <div className="divide-y divide-slate-50">
            {ENVIOS.map((e) => (
              <div key={e.guia} className="px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center">
                    <Package className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-body-sm">{e.guia}</p>
                    <p className="text-caption text-slate-500">→ {e.destino}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-caption font-semibold px-2 py-0.5 rounded-full ${e.color}`}>{e.estado}</span>
                  <p className="text-caption text-slate-400 mt-1">{e.fecha}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Historial de viajes */}
        <motion.div
          className="bg-white rounded-radius-2xl border border-slate-200 shadow-shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        >
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-500" />Historial de viajes</h3>
            <button className="text-caption font-semibold text-brand-600 hover:text-brand-700">Ver todos</button>
          </div>
          <div className="divide-y divide-slate-50">
            {HISTORIAL_VIAJES.map((v, i) => (
              <div key={i} className="px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-brand-50 rounded-full flex items-center justify-center">
                    <Truck className="w-4 h-4 text-brand-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-body-sm">{v.ruta}</p>
                    <p className="text-caption text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" />{v.fecha}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-700 text-body-sm">{v.precio}</p>
                  <p className="flex items-center gap-0.5 text-caption text-amber-500 justify-end">
                    <Star className="w-3 h-3 fill-amber-400" />4.8
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-100">
            <Button variant="outline" size="sm" fullWidth>Ver historial completo</Button>
          </div>
        </motion.div>
      </div>

      {/* Rastreo rápido */}
      <motion.div
        className="bg-white rounded-radius-2xl p-6 border border-slate-200 shadow-shadow-sm"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
      >
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Search className="w-4 h-4 text-brand-500" />Rastrear un paquete
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Número de guía (Ej: ENV-99281)"
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-radius-lg focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-slate-900"
          />
          <Button size="md">Buscar</Button>
        </div>
      </motion.div>
    </div>
  );
};
