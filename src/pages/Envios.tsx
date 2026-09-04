import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, MapPin, Weight, ChevronRight, CheckCircle, Clock, Truck } from 'lucide-react';
import { Button } from '@/components/ui';

const CIUDADES = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga', 'Cartagena', 'Pereira', 'Manizales'];

interface Cotizacion {
  servicio: string;
  descripcion: string;
  dias: string;
  precio: number;
  destacado: boolean;
}

const calcularCotizaciones = (peso: number, distanciaFactor: number): Cotizacion[] => [
  { servicio: 'Express', descripcion: 'Entrega garantizada al día siguiente antes de las 2 PM', dias: '1 día hábil', precio: Math.round((peso * 4200 + 12000) * distanciaFactor), destacado: true },
  { servicio: 'Estándar', descripcion: 'Entrega en puerta en el plazo indicado', dias: '2-3 días hábiles', precio: Math.round((peso * 2800 + 7000) * distanciaFactor), destacado: false },
  { servicio: 'Económico', descripcion: 'Recoger en terminal destino', dias: '3-5 días hábiles', precio: Math.round((peso * 1800 + 4500) * distanciaFactor), destacado: false },
];

const STEPS = ['Datos del envío', 'Cotización', 'Confirmación'];

export const Envios = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ origen: 'Bogotá', destino: 'Medellín', peso: '2', largo: '30', ancho: '20', alto: '15', contenido: 'Documentos', remitente: '', destinatario: '', celular: '' });
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [servicioSel, setServicioSel] = useState<Cotizacion | null>(null);

  const handleCotizar = () => {
    const peso = parseFloat(form.peso) || 1;
    const distFactor = form.origen !== form.destino ? 1.2 : 0.8;
    setCotizaciones(calcularCotizaciones(peso, distFactor));
    setStep(1);
  };

  const handleSeleccionar = (c: Cotizacion) => {
    setServicioSel(c);
    setStep(2);
  };

  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 py-14 px-4">
        <div className="container-page max-w-3xl mx-auto text-center">
          <motion.h1 className="text-heading-2xl font-bold text-white mb-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            Cotiza y envía tu paquete
          </motion.h1>
          <p className="text-slate-400 text-body-lg">Rápido, seguro y con cobertura nacional.</p>
        </div>
      </div>

      <div className="container-page max-w-3xl mx-auto py-10 px-4">
        {/* Stepper */}
        <div className="flex items-center justify-center mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center gap-2 ${i <= step ? 'text-brand-600' : 'text-slate-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-body-sm font-bold border-2 transition-colors ${i < step ? 'bg-brand-600 border-brand-600 text-white' : i === step ? 'bg-white border-brand-600 text-brand-600' : 'bg-white border-slate-200 text-slate-400'}`}>
                  {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-body-sm font-semibold hidden sm:inline ${i === step ? 'text-brand-600' : i < step ? 'text-brand-500' : 'text-slate-400'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`w-12 sm:w-20 h-0.5 mx-2 ${i < step ? 'bg-brand-500' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>

        {/* Step 0: Form */}
        {step === 0 && (
          <motion.div className="bg-white rounded-radius-2xl border border-slate-200 shadow-shadow-sm p-8" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-heading-sm font-bold text-slate-900 mb-6 flex items-center gap-2"><Package className="w-5 h-5 text-brand-600" />Datos del envío</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-body-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-brand-500" />Ciudad Origen</label>
                <select value={form.origen} onChange={e => update('origen', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-radius-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900">
                  {CIUDADES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-body-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-red-400" />Ciudad Destino</label>
                <select value={form.destino} onChange={e => update('destino', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-radius-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900">
                  {CIUDADES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-body-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"><Weight className="w-3.5 h-3.5 text-slate-500" />Peso (kg)</label>
                <input type="number" min="0.1" step="0.1" value={form.peso} onChange={e => update('peso', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-radius-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900" />
              </div>
              <div>
                <label className="text-body-sm font-semibold text-slate-700 mb-1.5">Tipo de contenido</label>
                <select value={form.contenido} onChange={e => update('contenido', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-radius-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900">
                  {['Documentos', 'Ropa y calzado', 'Electrónica', 'Alimentos', 'Medicamentos', 'Otros'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-body-sm font-semibold text-slate-700 mb-1.5">Dimensiones (cm) — Largo × Ancho × Alto</label>
                <div className="grid grid-cols-3 gap-3">
                  {[['largo','Largo'],['ancho','Ancho'],['alto','Alto']].map(([k,l]) => (
                    <input key={k} type="number" placeholder={l} value={form[k as keyof typeof form]} onChange={e => update(k, e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-radius-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900" />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-body-sm font-semibold text-slate-700 mb-1.5">Nombre remitente</label>
                <input type="text" placeholder="Tu nombre" value={form.remitente} onChange={e => update('remitente', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-radius-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900" />
              </div>
              <div>
                <label className="text-body-sm font-semibold text-slate-700 mb-1.5">Nombre destinatario</label>
                <input type="text" placeholder="Nombre de quien recibe" value={form.destinatario} onChange={e => update('destinatario', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-radius-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900" />
              </div>
            </div>

            <div className="mt-8">
              <Button size="lg" fullWidth leftIcon={<ChevronRight className="w-5 h-5" />} onClick={handleCotizar}>
                Ver opciones de envío
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 1: Cotizaciones */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-heading-sm font-bold text-slate-900 mb-2">Elige tu servicio</h2>
            <p className="text-body-sm text-slate-500 mb-6">{form.origen} → {form.destino} · {form.peso} kg · {form.contenido}</p>
            <div className="space-y-4">
              {cotizaciones.map((c) => (
                <div
                  key={c.servicio}
                  onClick={() => handleSeleccionar(c)}
                  className={`relative bg-white rounded-radius-xl border-2 p-6 cursor-pointer transition-all hover:shadow-shadow-md group ${c.destacado ? 'border-brand-500' : 'border-slate-200 hover:border-brand-300'}`}
                >
                  {c.destacado && <span className="absolute -top-3 left-6 bg-brand-600 text-white text-caption font-bold px-3 py-0.5 rounded-full">Recomendado</span>}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-body-lg">{c.servicio}</h3>
                      <p className="text-body-sm text-slate-500 mt-1">{c.descripcion}</p>
                      <p className="text-caption text-slate-400 mt-2 flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{c.dias}</p>
                    </div>
                    <div className="text-right ml-6">
                      <p className="text-heading-md font-bold text-slate-900">${c.precio.toLocaleString('es-CO')}</p>
                      <p className="text-caption text-slate-400">COP</p>
                      <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-brand-600 font-semibold text-body-sm">Seleccionar →</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(0)} className="mt-4 text-body-sm text-slate-500 hover:text-slate-700">← Volver</button>
          </motion.div>
        )}

        {/* Step 2: Confirmación */}
        {step === 2 && servicioSel && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="bg-white rounded-radius-2xl border border-slate-200 shadow-shadow-sm overflow-hidden">
              <div className="bg-emerald-50 border-b border-emerald-100 p-6 text-center">
                <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-3" />
                <h2 className="text-heading-md font-bold text-slate-900 mb-1">¡Listo para enviar!</h2>
                <p className="text-body-sm text-slate-600">Revisa el resumen y confirma tu envío</p>
              </div>
              <div className="p-8">
                <div className="space-y-3 text-body-sm">
                  {[
                    ['Servicio', servicioSel.servicio],
                    ['Ruta', `${form.origen} → ${form.destino}`],
                    ['Contenido', form.contenido],
                    ['Peso', `${form.peso} kg`],
                    ['Tiempo estimado', servicioSel.dias],
                    ['Remitente', form.remitente || 'No especificado'],
                    ['Destinatario', form.destinatario || 'No especificado'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2 border-b border-slate-50">
                      <span className="text-slate-500">{k}</span>
                      <span className="font-semibold text-slate-900">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-slate-50 rounded-radius-xl flex items-center justify-between">
                  <span className="font-bold text-slate-700">Total a pagar</span>
                  <span className="text-heading-md font-bold text-brand-600">${servicioSel.precio.toLocaleString('es-CO')} COP</span>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={() => setStep(1)}>Modificar</Button>
                  <Button leftIcon={<Truck className="w-5 h-5" />}>Confirmar envío</Button>
                </div>
                <p className="text-caption text-center text-slate-400 mt-4">🔒 Pago 100% seguro · Número de guía generado al confirmar</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
