import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Truck, Calendar, MapPin,
  Clock, Star, ArrowRight,
} from 'lucide-react';
import { ReservaFlow } from '@/components/ui/ReservaFlow';
import {
  useReservas, contarAsientos, type Salida,
} from '@/context/ReservasContext';
import { useAuth } from '@/context/AuthContext';

/* ─────────────────── Mock data for extra sections ── */
const ENVIOS = [
  { guia: 'ENV-99281', destino: 'Medellín', estado: 'Entregado', fecha: '04 Sep', color: 'bg-emerald-100 text-emerald-700' },
  { guia: 'TRN-481920', destino: 'Bogotá', estado: 'En tránsito', fecha: 'Est. 06 Sep', color: 'bg-brand-100 text-brand-700' },
  { guia: 'ENV-00412', destino: 'Bucaramanga', estado: 'En terminal', fecha: 'Listo para recoger', color: 'bg-amber-100 text-amber-700' },
];

/* ─────────────────── Mock data for extra sections ── */

export const ClienteDashboard = () => {
  const { user } = useAuth();
  const { salidas, getReservasPorCliente, getSalida } = useReservas();
  const [ventaSalida, setVentaSalida] = useState<Salida | null>(null);

  // Search state
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const misReservas = useMemo(
    () => getReservasPorCliente(user?.email ?? ''),
    [getReservasPorCliente, user?.email],
  );

  const upcomingReservas = misReservas.filter((r) => {
    const s = getSalida(r.salidaId);
    return s && (s.estado === 'Vendiendo' || s.estado === 'Abordando' || s.estado === 'Próximamente');
  });

  const historial = misReservas.filter((r) => !upcomingReservas.find((ur) => ur.id === r.id));

  // Filtered salidas for booking
  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    return salidas.filter((s) => {
      if (s.estado === 'En ruta') return false;
      if (origen && !s.origen.toLowerCase().includes(origen.toLowerCase())) return false;
      if (destino && !s.destino.toLowerCase().includes(destino.toLowerCase())) return false;
      return true;
    });
  }, [isSearching, origen, destino, salidas]);

  const doSearch = () => {
    setIsSearching(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-heading-md font-bold text-slate-900">Hola, {user?.name.split(' ')[0]}</h2>
        <p className="text-body-sm text-slate-500">Bienvenido a tu portal de viajes y envíos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: Search + Upcoming */}
        <div className="md:col-span-2 space-y-6">
          {/* Hero Search Box */}
          <motion.div
            className="bg-brand-600 rounded-radius-2xl p-4 md:p-6 text-white shadow-shadow-md relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="relative z-10">
              <h3 className="text-heading-sm font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" /> ¿Adónde viajas hoy?
              </h3>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex flex-col sm:flex-row flex-1 bg-white/10 md:bg-white/10 rounded-radius-lg p-1 gap-1 sm:gap-0">
                  <div className="relative flex-1 bg-white/10 sm:bg-transparent rounded-md sm:rounded-none">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-white/60" />
                    <input
                      type="text" placeholder="Origen" value={origen} onChange={(e) => setOrigen(e.target.value)}
                      className="w-full bg-transparent border-none text-white placeholder:text-white/60 focus:ring-0 pl-9 pr-3 py-2 text-body-sm"
                    />
                  </div>
                  <div className="w-full h-px sm:w-px sm:h-auto bg-white/20 mx-0 sm:mx-1 my-0 sm:my-2" />
                  <div className="relative flex-1 bg-white/10 sm:bg-transparent rounded-md sm:rounded-none">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-white/60" />
                    <input
                      type="text" placeholder="Destino" value={destino} onChange={(e) => setDestino(e.target.value)}
                      className="w-full bg-transparent border-none text-white placeholder:text-white/60 focus:ring-0 pl-9 pr-3 py-2 text-body-sm"
                    />
                  </div>
                </div>
                <button
                  onClick={doSearch}
                  className="bg-white text-brand-700 hover:bg-brand-50 w-full md:w-auto px-6 py-3 md:py-2 rounded-radius-lg font-bold text-body-sm transition-colors shadow-sm"
                >
                  Buscar
                </button>
              </div>

              {/* Search Results */}
              <AnimatePresence>
                {isSearching && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="mt-6 space-y-3"
                  >
                    <h4 className="text-caption font-semibold text-brand-100 uppercase tracking-wide">
                      {searchResults.length} salidas disponibles
                    </h4>
                    {searchResults.map((s) => {
                      const { libre } = contarAsientos(s.seats);
                      return (
                        <div key={s.id} className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-radius-xl p-3 md:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0 transition-colors">
                          <div>
                            <p className="font-bold text-body-sm md:text-base">{s.origen} → {s.destino}</p>
                            <p className="text-caption md:text-sm text-brand-100 flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 md:mt-0.5">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {s.horario}</span>
                              <span className="hidden md:inline w-1 h-1 bg-white/40 rounded-full" />
                              <span>{s.duracion}</span>
                              <span className="hidden md:inline w-1 h-1 bg-white/40 rounded-full" />
                              <span className="w-full md:w-auto font-medium">{libre} sillas libres</span>
                            </p>
                          </div>
                          <div className="flex items-center justify-between md:justify-end gap-4 border-t border-white/10 pt-2 md:border-0 md:pt-0">
                            <span className="font-bold text-body-md md:text-body-sm">${s.tarifa.toLocaleString('es-CO')}</span>
                            <button
                              disabled={libre === 0}
                              onClick={() => setVentaSalida(s)}
                              className="bg-white text-brand-700 px-6 py-2 md:px-4 md:py-1.5 rounded-radius-md font-bold text-body-sm md:text-caption hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                            >
                              {libre === 0 ? 'Agotado' : 'Comprar'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Próximos Viajes */}
          {upcomingReservas.length > 0 && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            >
              <h3 className="font-bold text-slate-900">Tus próximos viajes</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {upcomingReservas.map((r) => {
                  const s = getSalida(r.salidaId);
                  if (!s) return null;
                  return (
                    <div key={r.id} className="bg-white border border-slate-200 shadow-shadow-sm rounded-radius-2xl p-5 hover:border-brand-300 transition-colors cursor-pointer group">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-caption font-semibold text-brand-600 mb-0.5">{s.fecha} · {s.horario}</p>
                          <h4 className="font-bold text-slate-900 text-body-md">{s.origen} → {s.destino}</h4>
                        </div>
                        <div className="w-8 h-8 bg-brand-50 rounded-full flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                          <Truck className="w-4 h-4 text-brand-500" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-caption border-t border-slate-100 pt-3">
                        <span className="text-slate-500">Asientos: <strong className="text-slate-700">{r.asientos.join(', ')}</strong></span>
                        <span className="text-brand-600 font-semibold flex items-center gap-1 group-hover:underline">
                          Ver tiquete <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Col: Historial & Envíos */}
        <div className="space-y-6">
          <motion.div
            className="bg-white rounded-radius-2xl border border-slate-200 shadow-shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          >
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2"><Truck className="w-4 h-4 text-brand-500" />Mis envíos</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {ENVIOS.map((e) => (
                <div key={e.guia} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-body-sm">{e.guia}</p>
                      <p className="text-caption text-slate-500">→ {e.destino}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${e.color}`}>{e.estado}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-radius-2xl border border-slate-200 shadow-shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          >
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-500" />Historial viajes</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {historial.length === 0 ? (
                <div className="p-6 text-center text-caption text-slate-400">Aún no tienes viajes completados.</div>
              ) : (
                historial.map((r, i) => {
                  const s = getSalida(r.salidaId);
                  return (
                    <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div>
                        <p className="font-semibold text-slate-900 text-body-sm">{s ? `${s.origen} → ${s.destino}` : 'Viaje'}</p>
                        <p className="text-caption text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" />{s?.fecha}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-700 text-body-sm">${r.total.toLocaleString('es-CO')}</p>
                        <p className="flex items-center gap-0.5 text-caption text-amber-500 justify-end">
                          <Star className="w-3 h-3 fill-amber-400" />4.8
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {ventaSalida && (
        <ReservaFlow
          salida={ventaSalida}
          role="cliente"
          onClose={() => setVentaSalida(null)}
          userEmail={user?.email ?? ''}
          userName={user?.name ?? ''}
        />
      )}
    </div>
  );
};
