import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Users, ArrowRight, Clock, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';

// --- Mock data ---
const RUTAS = [
  { id: 1, origen: 'Bogotá', destino: 'Medellín', salida: '06:00 AM', llegada: '12:30 PM', duracion: '6h 30m', precio: 85000, disponibles: 14, tipo: 'Premium', rating: 4.8 },
  { id: 2, origen: 'Bogotá', destino: 'Medellín', salida: '08:30 AM', llegada: '03:15 PM', duracion: '6h 45m', precio: 72000, disponibles: 3, tipo: 'Ejecutivo', rating: 4.6 },
  { id: 3, origen: 'Bogotá', destino: 'Medellín', salida: '10:00 AM', llegada: '04:30 PM', duracion: '6h 30m', precio: 68000, disponibles: 28, tipo: 'Estándar', rating: 4.4 },
  { id: 4, origen: 'Bogotá', destino: 'Medellín', salida: '01:00 PM', llegada: '07:30 PM', duracion: '6h 30m', precio: 72000, disponibles: 22, tipo: 'Ejecutivo', rating: 4.7 },
  { id: 5, origen: 'Bogotá', destino: 'Medellín', salida: '09:00 PM', llegada: '03:30 AM', duracion: '6h 30m', precio: 60000, disponibles: 35, tipo: 'Estándar', rating: 4.3 },
];

const ASIENTOS = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  ocupado: [3, 7, 8, 12, 19, 20, 21, 25, 32, 38].includes(i + 1),
  seleccionado: false,
}));

const CIUDADES = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga', 'Cartagena', 'Pereira', 'Manizales', 'Armenia', 'Ibagué'];

export const Pasajeros = () => {
  const [step, setStep] = useState<'search' | 'results' | 'seats'>('search');
  const [origen, setOrigen] = useState('Bogotá');
  const [destino, setDestino] = useState('Medellín');
  const [fecha, setFecha] = useState('2026-09-10');
  const [pasajeros, setPasajeros] = useState(1);
  const [rutaSeleccionada, setRutaSeleccionada] = useState<typeof RUTAS[0] | null>(null);
  const [asientos] = useState(ASIENTOS);
  const [seleccionados, setSeleccionados] = useState<number[]>([]);

  const handleSearch = () => setStep('results');
  const handleSelectRuta = (ruta: typeof RUTAS[0]) => {
    setRutaSeleccionada(ruta);
    setStep('seats');
  };
  const handleToggleSeat = (id: number) => {
    const seat = asientos.find(a => a.id === id);
    if (seat?.ocupado) return;
    setSeleccionados(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : prev.length < pasajeros ? [...prev, id] : prev
    );
  };

  const tipoColor: Record<string, string> = {
    Premium: 'bg-amber-100 text-amber-700 border-amber-200',
    Ejecutivo: 'bg-brand-100 text-brand-700 border-brand-200',
    Estándar: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-slate-900 py-16 px-4">
        <div className="container-page max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-heading-2xl font-bold text-white mb-3"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          >
            Compra tu tiquete
          </motion.h1>
          <p className="text-slate-400 mb-10 text-body-lg">Más de 150 destinos en todo el país.</p>

          {/* Search box */}
          <motion.div
            className="bg-white rounded-radius-2xl p-6 shadow-shadow-elevated"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-caption font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Origen
                </label>
                <select
                  value={origen}
                  onChange={e => setOrigen(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-radius-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
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
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-radius-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
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
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-radius-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-caption font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Pasajeros
                </label>
                <select
                  value={pasajeros}
                  onChange={e => setPasajeros(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-radius-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
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
        <div className="container-page max-w-4xl mx-auto py-10 px-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-heading-md font-bold text-slate-900">{origen} → {destino}</h2>
                <p className="text-body-sm text-slate-500">{new Date(fecha + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })} · {pasajeros} pasajero{pasajeros > 1 ? 's' : ''}</p>
              </div>
              <button onClick={() => setStep('search')} className="flex items-center gap-1 text-brand-600 font-semibold text-body-sm hover:text-brand-700">
                <ChevronLeft className="w-4 h-4" /> Modificar búsqueda
              </button>
            </div>

            <div className="space-y-4">
              {RUTAS.map((ruta, i) => (
                <motion.div
                  key={ruta.id}
                  className="bg-white rounded-radius-xl border border-slate-200 p-6 shadow-shadow-sm hover:shadow-shadow-md hover:border-brand-200 transition-all group"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-6 flex-1">
                      {/* Time */}
                      <div className="text-center">
                        <p className="text-heading-sm font-bold text-slate-900">{ruta.salida}</p>
                        <p className="text-caption text-slate-500">{ruta.origen}</p>
                      </div>
                      <div className="flex flex-col items-center gap-1 flex-1 max-w-[120px]">
                        <p className="text-caption text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{ruta.duracion}</p>
                        <div className="w-full h-px bg-slate-200 relative">
                          <ArrowRight className="w-3 h-3 text-slate-400 absolute -right-1.5 -top-1.5" />
                        </div>
                        <span className={`text-caption font-medium px-2 py-0.5 rounded border ${tipoColor[ruta.tipo]}`}>{ruta.tipo}</span>
                      </div>
                      <div className="text-center">
                        <p className="text-heading-sm font-bold text-slate-900">{ruta.llegada}</p>
                        <p className="text-caption text-slate-500">{ruta.destino}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 md:gap-8">
                      <div className="text-center">
                        <p className="text-caption text-slate-500 flex items-center gap-0.5 justify-center mb-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{ruta.rating}
                        </p>
                        <p className="text-caption text-slate-400">{ruta.disponibles} asientos</p>
                      </div>
                      <div className="text-right">
                        <p className="text-heading-md font-bold text-slate-900">${(ruta.precio * pasajeros).toLocaleString('es-CO')}</p>
                        <p className="text-caption text-slate-500">por {pasajeros} pax</p>
                      </div>
                      <Button size="md" onClick={() => handleSelectRuta(ruta)} className="whitespace-nowrap">
                        Seleccionar
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Seat picker */}
      {step === 'seats' && rutaSeleccionada && (
        <div className="container-page max-w-3xl mx-auto py-10 px-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button onClick={() => setStep('results')} className="flex items-center gap-1 text-brand-600 font-semibold text-body-sm hover:text-brand-700 mb-6">
              <ChevronLeft className="w-4 h-4" /> Volver a resultados
            </button>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white rounded-radius-2xl border border-slate-200 p-6 shadow-shadow-sm">
                <h2 className="font-bold text-slate-900 mb-1">Elige tus asientos</h2>
                <p className="text-body-sm text-slate-500 mb-6">Selecciona {pasajeros} asiento{pasajeros > 1 ? 's' : ''}</p>

                {/* Legend */}
                <div className="flex gap-4 mb-6 text-caption text-slate-500">
                  {[{c:'bg-slate-100 border-slate-200',l:'Disponible'},{c:'bg-brand-500 border-brand-600',l:'Seleccionado'},{c:'bg-slate-400 border-slate-500',l:'Ocupado'}].map(({c,l}) => (
                    <div key={l} className="flex items-center gap-1.5">
                      <div className={`w-5 h-5 rounded-md border-2 ${c}`} />
                      {l}
                    </div>
                  ))}
                </div>

                {/* Bus front */}
                <div className="flex justify-center mb-4">
                  <div className="bg-slate-200 rounded-t-3xl w-16 h-8 flex items-center justify-center text-caption text-slate-500">🚌</div>
                </div>

                {/* Seat grid */}
                <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
                  {asientos.map((asiento) => {
                    const isSel = seleccionados.includes(asiento.id);
                    return (
                      <button
                        key={asiento.id}
                        onClick={() => handleToggleSeat(asiento.id)}
                        disabled={asiento.ocupado}
                        title={`Asiento ${asiento.id}`}
                        className={`
                          w-full aspect-square rounded-md border-2 text-caption font-bold transition-all
                          ${asiento.ocupado ? 'bg-slate-300 border-slate-400 cursor-not-allowed text-slate-500' : ''}
                          ${isSel ? 'bg-brand-500 border-brand-600 text-white scale-105 shadow-shadow-md' : ''}
                          ${!asiento.ocupado && !isSel ? 'bg-slate-50 border-slate-200 hover:border-brand-400 hover:bg-brand-50 text-slate-600' : ''}
                          ${asiento.id % 5 === 3 ? 'opacity-0 pointer-events-none' : ''}
                        `}
                      >
                        {asiento.id % 5 === 3 ? '' : asiento.id}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white rounded-radius-2xl border border-slate-200 p-6 shadow-shadow-sm h-fit space-y-4 sticky top-4">
                <h3 className="font-bold text-slate-900">Resumen</h3>
                <div className="space-y-2 text-body-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Ruta</span><span className="font-medium text-slate-900">{rutaSeleccionada.origen} → {rutaSeleccionada.destino}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Salida</span><span className="font-medium text-slate-900">{rutaSeleccionada.salida}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Tipo</span><span className="font-medium text-slate-900">{rutaSeleccionada.tipo}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Asientos</span><span className="font-medium text-slate-900">{seleccionados.length > 0 ? seleccionados.join(', ') : '—'}</span></div>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-700">Total</span>
                    <span className="text-heading-md font-bold text-slate-900">${(rutaSeleccionada.precio * pasajeros).toLocaleString('es-CO')}</span>
                  </div>
                </div>
                <Button
                  fullWidth size="lg"
                  disabled={seleccionados.length < pasajeros}
                  leftIcon={<ChevronRight className="w-5 h-5" />}
                >
                  Continuar al pago
                </Button>
                <p className="text-caption text-center text-slate-400">🔒 Pago seguro · Cancelación gratuita 24h</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
