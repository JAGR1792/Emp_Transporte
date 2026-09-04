import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, MapPin, CheckCircle, Clock, Truck, AlertCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui';

interface Envio {
  guia: string;
  estado: 'recibido' | 'transito' | 'terminal' | 'entregado';
  contenido: string;
  peso: string;
  origen: string;
  destino: string;
  remitente: string;
  destinatario: string;
  fechaEnvio: string;
  fechaEstimada: string;
  eventos: { fecha: string; hora: string; descripcion: string; ciudad: string; tipo: 'ok' | 'warn' | 'current' }[];
}

const ENVIOS_MOCK: Record<string, Envio> = {
  'ENV-99281': {
    guia: 'ENV-99281', estado: 'entregado', contenido: 'Documentos', peso: '0.5 kg',
    origen: 'Bogotá', destino: 'Medellín', remitente: 'Carlos Ramírez', destinatario: 'Ana Torres',
    fechaEnvio: '02 Sep 2026', fechaEstimada: '04 Sep 2026',
    eventos: [
      { fecha: '04 Sep', hora: '11:32 AM', descripcion: 'Entregado al destinatario', ciudad: 'Medellín', tipo: 'ok' },
      { fecha: '04 Sep', hora: '08:15 AM', descripcion: 'Salió para entrega final', ciudad: 'Medellín', tipo: 'ok' },
      { fecha: '03 Sep', hora: '09:45 PM', descripcion: 'Llegó a terminal destino', ciudad: 'Medellín', tipo: 'ok' },
      { fecha: '02 Sep', hora: '06:30 PM', descripcion: 'En tránsito', ciudad: 'Autopista Bogotá-Medellín', tipo: 'ok' },
      { fecha: '02 Sep', hora: '02:10 PM', descripcion: 'Recibido en terminal', ciudad: 'Bogotá', tipo: 'ok' },
    ]
  },
  'TRN-481920': {
    guia: 'TRN-481920', estado: 'transito', contenido: 'Ropa y calzado', peso: '3.2 kg',
    origen: 'Cali', destino: 'Bogotá', remitente: 'Tienda XYZ', destinatario: 'Pedro Mora',
    fechaEnvio: '03 Sep 2026', fechaEstimada: '06 Sep 2026',
    eventos: [
      { fecha: '04 Sep', hora: '03:20 PM', descripcion: 'En tránsito — última actualización', ciudad: 'Honda, Tolima', tipo: 'current' },
      { fecha: '04 Sep', hora: '07:00 AM', descripcion: 'Salió de terminal Cali', ciudad: 'Cali', tipo: 'ok' },
      { fecha: '03 Sep', hora: '04:45 PM', descripcion: 'Recibido y pesado', ciudad: 'Cali', tipo: 'ok' },
    ]
  },
  'ENV-00412': {
    guia: 'ENV-00412', estado: 'terminal', contenido: 'Electrónica', peso: '1.8 kg',
    origen: 'Barranquilla', destino: 'Bucaramanga', remitente: 'Tech Store', destinatario: 'Laura Gómez',
    fechaEnvio: '01 Sep 2026', fechaEstimada: '05 Sep 2026',
    eventos: [
      { fecha: '04 Sep', hora: '01:15 PM', descripcion: 'Disponible para reclamar en terminal', ciudad: 'Bucaramanga', tipo: 'current' },
      { fecha: '03 Sep', hora: '11:00 PM', descripcion: 'Llegó a terminal destino', ciudad: 'Bucaramanga', tipo: 'ok' },
      { fecha: '02 Sep', hora: '09:00 AM', descripcion: 'En tránsito', ciudad: 'Autopista', tipo: 'ok' },
      { fecha: '01 Sep', hora: '03:00 PM', descripcion: 'Recibido en terminal', ciudad: 'Barranquilla', tipo: 'ok' },
    ]
  },
};

const STEPS_ESTADO = ['recibido', 'transito', 'terminal', 'entregado'] as const;
const STEP_LABELS: Record<string, string> = { recibido: 'Recibido', transito: 'En tránsito', terminal: 'En terminal destino', entregado: 'Entregado' };
const STEP_ICONS: Record<string, React.ReactNode> = {
  recibido: <Package className="w-5 h-5" />,
  transito: <Truck className="w-5 h-5" />,
  terminal: <MapPin className="w-5 h-5" />,
  entregado: <Home className="w-5 h-5" />,
};

export const Rastreo = () => {
  const [guia, setGuia] = useState('');
  const [envio, setEnvio] = useState<Envio | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!guia.trim()) return;
    setLoading(true);
    setNotFound(false);
    setTimeout(() => {
      const result = ENVIOS_MOCK[guia.trim().toUpperCase()];
      if (result) { setEnvio(result); setNotFound(false); }
      else { setEnvio(null); setNotFound(true); }
      setLoading(false);
    }, 600);
  };

  const stepIdx = envio ? STEPS_ESTADO.indexOf(envio.estado) : -1;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 to-brand-900 py-14 px-4">
        <div className="container-page max-w-2xl mx-auto text-center">
          <motion.h1 className="text-heading-2xl font-bold text-white mb-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            Rastrea tu envío
          </motion.h1>
          <p className="text-slate-400 mb-8 text-body-lg">Seguimiento en tiempo real de tu paquete</p>

          <motion.div className="flex gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <input
              type="text"
              value={guia}
              onChange={e => setGuia(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Ej: ENV-99281 o TRN-481920"
              className="flex-1 px-5 py-3.5 bg-white/10 border border-white/20 rounded-radius-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/40 backdrop-blur-sm"
            />
            <Button size="lg" loading={loading} leftIcon={<Search className="w-5 h-5" />} onClick={handleSearch}>
              Rastrear
            </Button>
          </motion.div>
          <p className="text-white/40 text-caption mt-3">Prueba con: ENV-99281 · TRN-481920 · ENV-00412</p>
        </div>
      </div>

      <div className="container-page max-w-3xl mx-auto py-10 px-4">
        {/* Not found */}
        {notFound && (
          <motion.div className="bg-white rounded-radius-2xl border border-red-100 p-10 text-center shadow-shadow-sm" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
            <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
            <h2 className="text-heading-sm font-bold text-slate-900 mb-2">No encontramos tu envío</h2>
            <p className="text-body-sm text-slate-500">Verifica el número de guía. Puede tardar hasta 2 horas en aparecer después del registro.</p>
          </motion.div>
        )}

        {/* Result */}
        {envio && (
          <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Estado card */}
            <div className={`rounded-radius-2xl p-6 text-white shadow-shadow-md ${envio.estado === 'entregado' ? 'bg-emerald-600' : envio.estado === 'transito' ? 'bg-brand-600' : 'bg-slate-700'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/70 text-body-sm mb-1">Guía # {envio.guia}</p>
                  <h2 className="text-heading-md font-bold mb-1">{STEP_LABELS[envio.estado]}</h2>
                  <p className="text-white/80 text-body-sm">{envio.origen} → {envio.destino}</p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                  {envio.estado === 'entregado' ? <CheckCircle className="w-7 h-7" /> : <Truck className="w-7 h-7" />}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20 flex gap-6 text-body-sm">
                <div><p className="text-white/60">Enviado</p><p className="font-semibold">{envio.fechaEnvio}</p></div>
                <div><p className="text-white/60">Estimado</p><p className="font-semibold">{envio.fechaEstimada}</p></div>
                <div><p className="text-white/60">Contenido</p><p className="font-semibold">{envio.contenido}</p></div>
              </div>
            </div>

            {/* Progress steps */}
            <div className="bg-white rounded-radius-2xl border border-slate-200 p-6 shadow-shadow-sm">
              <h3 className="font-bold text-slate-900 mb-6">Estado del envío</h3>
              <div className="flex items-center justify-between">
                {STEPS_ESTADO.map((s, i) => (
                  <div key={s} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-2 flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${i < stepIdx ? 'bg-emerald-500 border-emerald-500 text-white' : i === stepIdx ? 'bg-brand-600 border-brand-600 text-white scale-110 shadow-shadow-md' : 'bg-white border-slate-200 text-slate-300'}`}>
                        {i < stepIdx ? <CheckCircle className="w-5 h-5" /> : STEP_ICONS[s]}
                      </div>
                      <span className={`text-caption text-center leading-tight max-w-[64px] ${i === stepIdx ? 'font-bold text-brand-600' : i < stepIdx ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>{STEP_LABELS[s]}</span>
                    </div>
                    {i < STEPS_ESTADO.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 ${i < stepIdx ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-radius-2xl border border-slate-200 p-6 shadow-shadow-sm">
              <h3 className="font-bold text-slate-900 mb-6">Historial de eventos</h3>
              <div className="space-y-0">
                {envio.eventos.map((ev, i) => (
                  <div key={i} className="flex gap-4 pb-6 last:pb-0 relative">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full border-2 z-10 flex-shrink-0 mt-0.5 ${ev.tipo === 'ok' ? 'bg-emerald-500 border-emerald-500' : ev.tipo === 'current' ? 'bg-brand-600 border-brand-600 ring-4 ring-brand-100' : 'bg-amber-400 border-amber-400'}`} />
                      {i < envio.eventos.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 mt-1" />}
                    </div>
                    <div className="pb-2">
                      <p className={`font-semibold text-body-sm ${ev.tipo === 'current' ? 'text-brand-700' : 'text-slate-900'}`}>{ev.descripcion}</p>
                      <p className="text-caption text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />{ev.fecha} {ev.hora} — <MapPin className="w-3 h-3" />{ev.ciudad}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="bg-white rounded-radius-2xl border border-slate-200 p-6 shadow-shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Detalles del envío</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-body-sm">
                {[['Remitente', envio.remitente], ['Destinatario', envio.destinatario], ['Peso', envio.peso], ['Origen', envio.origen], ['Destino', envio.destino], ['Tipo', envio.contenido]].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-slate-400 text-caption">{k}</p>
                    <p className="font-semibold text-slate-900">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Default state */}
        {!envio && !notFound && (
          <motion.div className="text-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Package className="w-20 h-20 text-slate-200 mx-auto mb-4" />
            <p className="text-body-lg font-semibold text-slate-400">Ingresa tu número de guía arriba</p>
            <p className="text-body-sm text-slate-300 mt-1">para ver el estado de tu envío</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
