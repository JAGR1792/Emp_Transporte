import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Users, Clock, Star, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui';
import { ReservaFlow } from '@/components/ui/ReservaFlow';
import { useReservas, contarAsientos, type Salida } from '@/context/ReservasContext';

const CIUDADES = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga', 'Cartagena', 'Pereira', 'Manizales', 'Armenia', 'Ibagué'];

export const Pasajeros = () => {
  const { getSalidas } = useReservas();
  
  const [step, setStep] = useState<'search' | 'results'>('search');
  const [origen, setOrigen] = useState('Bogotá');
  const [destino, setDestino] = useState('Medellín');
  const [fecha, setFecha] = useState('2026-09-10');
  const [pasajeros, setPasajeros] = useState(1);
  
  // Guardará la salida que el usuario quiere comprar (abre el ReservaFlow)
  const [ventaSalida, setVentaSalida] = useState<Salida | null>(null);

  const handleSearch = () => setStep('results');
  
  const handleSelectRuta = (ruta: Salida) => {
    setVentaSalida(ruta);
  };

  // Filtrado de salidas (simulando API getSalidas)
  // Nota: Actualmente nuestro getSalidas() devuelve todas, aplicaremos el filtro cliente aquí 
  // para mayor precisión visual, o confiar en getSalidas({ origen, destino })
  const resultados = getSalidas({ origen, destino });

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Hero */}
      <div className="bg-slate-900 py-12 lg:py-16 px-4">
        <div className="container-page max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-heading-xl lg:text-heading-2xl font-bold text-white mb-3"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          >
            Compra tu tiquete
          </motion.h1>
          <p className="text-slate-400 mb-8 lg:mb-10 text-body-md lg:text-body-lg">Más de 150 destinos en todo el país.</p>

          {/* Search box */}
          <motion.div
            className="bg-white rounded-radius-2xl p-5 lg:p-6 shadow-shadow-elevated"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <div className="space-y-1.5">
                <label className="text-caption font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Origen
                </label>
                <select
                  value={origen}
                  onChange={e => setOrigen(e.target.value)}
                  className="w-full px-4 py-3.5 lg:py-3 bg-slate-50 border border-slate-200 rounded-radius-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 text-base"
                >
                  {CIUDADES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-caption font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Destino
                </label>
                <select
                  value={destino}
                  onChange={e => setDestino(e.target.value)}
                  className="w-full px-4 py-3.5 lg:py-3 bg-slate-50 border border-slate-200 rounded-radius-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 text-base"
                >
                  {CIUDADES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-caption font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Fecha
                </label>
                <input
                  type="date"
                  value={fecha}
                  onChange={e => setFecha(e.target.value)}
                  className="w-full px-4 py-3.5 lg:py-3 bg-slate-50 border border-slate-200 rounded-radius-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 text-base"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-caption font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Pasajeros
                </label>
                <select
                  value={pasajeros}
                  onChange={e => setPasajeros(Number(e.target.value))}
                  className="w-full px-4 py-3.5 lg:py-3 bg-slate-50 border border-slate-200 rounded-radius-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 text-base"
                >
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} pasajero{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <Button size="lg" fullWidth leftIcon={<Search className="w-5 h-5" />} onClick={handleSearch}>
                Buscar viajes disponibles
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Results */}
      {step === 'results' && (
        <div className="container-page max-w-4xl mx-auto py-8 lg:py-10 px-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-heading-md font-bold text-slate-900">{origen} → {destino}</h2>
                <p className="text-body-sm text-slate-500">{new Date(fecha + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })} · {pasajeros} pasajero{pasajeros > 1 ? 's' : ''}</p>
              </div>
              <button onClick={() => setStep('search')} className="flex items-center gap-1 text-brand-600 font-semibold text-body-sm hover:text-brand-700 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Modificar búsqueda
              </button>
            </div>

            <div className="space-y-4">
              {resultados.length === 0 ? (
                <div className="bg-white rounded-radius-xl border border-slate-200 p-8 lg:p-10 text-center shadow-shadow-sm">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-heading-sm font-bold text-slate-900 mb-2">No hay viajes disponibles</h3>
                  <p className="text-slate-500">Intenta buscar para otra fecha u otra ruta.</p>
                </div>
              ) : (
                resultados.map((ruta, i) => {
                  const { libre } = contarAsientos(ruta.seats);
                  // Calculate arrival time
                  const arrivalHour = (parseInt(ruta.horario.split(':')[0]) + parseInt(ruta.duracion.replace('h',''))) % 24;
                  const arrivalMin = ruta.horario.split(':')[1] || '00';
                  const arrivalTime = `${String(arrivalHour).padStart(2, '0')}:${arrivalMin}`;
                  return (
                    <motion.div
                      key={ruta.id}
                      className="bg-white rounded-radius-xl border border-slate-200 p-4 lg:p-5 shadow-shadow-sm hover:shadow-shadow-md hover:border-brand-200 transition-all group"
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    >
                      {/* Route info - stacked on mobile, row on desktop */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {/* Origin */}
                          <div className="text-left flex-shrink-0">
                            <p className="text-heading-sm font-bold text-slate-900">{ruta.horario}</p>
                            <p className="text-caption text-slate-500">{ruta.origen}</p>
                          </div>
                          {/* Duration & bus type */}
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="w-full h-px bg-slate-200 hidden sm:block"></div>
                            <span className="text-caption font-medium px-2 py-1 rounded border bg-brand-100 text-brand-700 border-brand-200 whitespace-nowrap flex-shrink-0">
                              Bus {ruta.busNumero}
                            </span>
                            <div className="w-full h-px bg-slate-200 hidden sm:block"></div>
                            <span className="text-caption text-slate-400 flex items-center gap-1 whitespace-nowrap flex-shrink-0">
                              <Clock className="w-3 h-3" />{ruta.duracion}
                            </span>
                          </div>
                          {/* Destination */}
                          <div className="text-right flex-shrink-0">
                            <p className="text-heading-sm font-bold text-slate-900">{arrivalTime}</p>
                            <p className="text-caption text-slate-500">{ruta.destino}</p>
                          </div>
                        </div>
                      </div>

                      {/* Bottom actions - full width buttons on mobile */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="text-center">
                            <p className="text-caption font-semibold text-slate-500 flex items-center justify-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />4.8
                            </p>
                            <p className={`text-caption ${libre === 0 ? 'text-red-500 font-bold' : 'text-emerald-600 font-medium'}`}>
                              {libre === 0 ? 'Agotado' : `${libre} sillas libres`}
                            </p>
                          </div>
                          <div className="text-slate-900">
                            <p className="text-heading-md font-bold">${ruta.tarifa.toLocaleString('es-CO')}</p>
                            <p className="text-caption text-slate-500">por pax</p>
                          </div>
                        </div>
                        <Button 
                          size="md" 
                          disabled={libre === 0}
                          onClick={() => handleSelectRuta(ruta)} 
                          className="w-full sm:w-auto whitespace-nowrap"
                        >
                          Seleccionar
                        </Button>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Global Seat/Booking Flow Component */}
      {ventaSalida && (
        <ReservaFlow
          salida={ventaSalida}
          role="cliente"
          onClose={() => setVentaSalida(null)}
          // Aquí no tenemos userEmail/userName porque es una página pública (no logueado)
          // por lo que Pasajero form estará en blanco para que lo llenen.
        />
      )}
    </div>
  );
};
