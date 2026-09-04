import { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Snowflake, Weight, Users, Building2, CheckCircle, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { Button } from '@/components/ui';

const SERVICIOS = [
  {
    id: 'masiva',
    icon: <Truck className="w-8 h-8" />,
    color: 'text-brand-600', bg: 'bg-brand-50', border: 'border-brand-200',
    titulo: 'Carga Masiva',
    tagline: 'Para grandes volúmenes con frecuencia constante',
    descripcion: 'Soluciones de transporte terrestre para mercancías de alto volumen con programación fija y rutas dedicadas.',
    beneficios: ['Tarifas preferenciales por volumen', 'Conductor asignado exclusivo', 'Monitoreo GPS 24/7', 'Seguro de carga incluido', 'Facturación mensual consolidada'],
    capacidad: 'Hasta 15 toneladas',
  },
  {
    id: 'refrigerada',
    icon: <Snowflake className="w-8 h-8" />,
    color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200',
    titulo: 'Carga Refrigerada',
    tagline: 'Cadena de frío garantizada en todo el trayecto',
    descripcion: 'Transporte especializado con temperatura controlada para alimentos, medicamentos y productos perecederos.',
    beneficios: ['Control de temperatura entre -18°C y +8°C', 'Registro de temperatura en tiempo real', 'Certificados INVIMA', 'Personal capacitado en manipulación', 'Alertas automáticas de desviación'],
    capacidad: 'Hasta 8 toneladas',
  },
  {
    id: 'sobredimensionada',
    icon: <Weight className="w-8 h-8" />,
    color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200',
    titulo: 'Carga Sobredimensionada',
    tagline: 'Cuando el tamaño y el peso no son un límite',
    descripcion: 'Transportamos maquinaria pesada, estructuras metálicas y cargas indivisibles con permisos y escoltas incluidas.',
    beneficios: ['Gestión de permisos de circulación', 'Escoltas de seguridad', 'Plataformas especiales disponibles', 'Estudios de ruta previos', 'Grúas y equipo auxiliar'],
    capacidad: '+40 toneladas',
  },
  {
    id: 'dedicada',
    icon: <Users className="w-8 h-8" />,
    color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200',
    titulo: 'Flota Dedicada',
    tagline: 'Tu propio equipo de transporte, sin la inversión',
    descripcion: 'Asignación exclusiva de vehículos y conductores para tu empresa. Flexibilidad total en rutas y horarios.',
    beneficios: ['Branding con imagen corporativa', 'Conductores entrenados para tu operación', 'Gestión de mantenimiento incluida', 'Reporte de KPIs mensual', 'Contratos desde 6 meses'],
    capacidad: 'Flota personalizada',
  },
];

const CLIENTES = [
  { nombre: 'Almacenes XYZ', sector: 'Retail', envios: '+2.400 envíos/mes' },
  { nombre: 'FarmaCo S.A.', sector: 'Farmacéutico', envios: '+800 entregas/mes' },
  { nombre: 'Constructora Norte', sector: 'Construcción', envios: '+120 despachos/mes' },
  { nombre: 'Alimentos Frescos', sector: 'Alimentos', envios: '+1.200 envíos/mes' },
  { nombre: 'Tech Imports', sector: 'Tecnología', envios: '+550 envíos/mes' },
  { nombre: 'Grupo Textil', sector: 'Moda', envios: '+900 envíos/mes' },
];

export const Servicios = () => {
  const [expandido, setExpandido] = useState<string | null>(null);
  const [form, setForm] = useState({ empresa: '', nit: '', nombre: '', cargo: '', email: '', celular: '', servicio: '', mensaje: '' });
  const [enviado, setEnviado] = useState(false);

  const toggle = (id: string) => setExpandido(prev => prev === id ? null : id);
  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const handleSubmit = () => { setEnviado(true); };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900 py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-500 rounded-full blur-3xl -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500 rounded-full blur-3xl translate-y-1/2" />
        </div>
        <div className="relative container-page">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 bg-brand-500/20 border border-brand-400/30 text-brand-300 text-body-sm font-semibold rounded-full mb-6">
              Soluciones Corporativas
            </span>
            <h1 className="text-heading-2xl lg:text-5xl font-bold text-white mb-4">
              Transporte que se adapta<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-blue-400">a tu empresa</span>
            </h1>
            <p className="text-slate-400 text-body-lg max-w-2xl mx-auto mb-8">
              Diseñamos soluciones logísticas a la medida para empresas que mueven el país. Con 25 años de experiencia y la mayor flota nacional.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" leftIcon={<Send className="w-5 h-5" />} onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}>
                Solicitar cotización
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Ver casos de éxito
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-slate-100">
        <div className="container-page py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[['25+', 'Años de experiencia'], ['1,200+', 'Vehículos en flota'], ['150+', 'Terminales propias'], ['98%', 'Puntualidad']].map(([v, l]) => (
              <div key={l}>
                <p className="text-heading-xl font-bold text-brand-600">{v}</p>
                <p className="text-body-sm text-slate-500">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="container-page py-16 px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-heading-xl font-bold text-slate-900 mb-3">Nuestros servicios corporativos</h2>
          <p className="text-body-md text-slate-600">Haz clic en cada servicio para conocer todos los detalles.</p>
        </div>
        <div className="space-y-4 max-w-3xl mx-auto">
          {SERVICIOS.map((s, i) => (
            <motion.div
              key={s.id}
              className={`bg-white rounded-radius-xl border-2 ${expandido === s.id ? s.border : 'border-slate-200'} shadow-shadow-sm overflow-hidden transition-all`}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            >
              <button
                onClick={() => toggle(s.id)}
                className="w-full p-6 flex items-center gap-4 text-left hover:bg-slate-50 transition-colors"
              >
                <div className={`w-14 h-14 ${s.bg} ${s.color} rounded-radius-xl flex items-center justify-center flex-shrink-0`}>
                  {s.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-slate-900 text-body-lg">{s.titulo}</h3>
                    <span className={`hidden sm:inline text-caption ${s.color} font-medium px-2 py-0.5 ${s.bg} rounded-full`}>{s.capacidad}</span>
                  </div>
                  <p className="text-body-sm text-slate-500 mt-0.5">{s.tagline}</p>
                </div>
                <div className="text-slate-400 flex-shrink-0">
                  {expandido === s.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {expandido === s.id && (
                <motion.div
                  className={`border-t ${s.border} px-6 pb-6`}
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                >
                  <p className="text-body-sm text-slate-600 mt-4 mb-4">{s.descripcion}</p>
                  <ul className="space-y-2">
                    {s.beneficios.map(b => (
                      <li key={b} className="flex items-center gap-2 text-body-sm text-slate-700">
                        <CheckCircle className={`w-4 h-4 flex-shrink-0 ${s.color}`} />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5">
                    <Button size="sm" onClick={() => { update('servicio', s.titulo); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }); }}>
                      Cotizar este servicio
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Clients */}
      <div className="bg-slate-900 py-16 px-4">
        <div className="container-page">
          <div className="text-center mb-10">
            <h2 className="text-heading-xl font-bold text-white mb-2">Empresas que confían en nosotros</h2>
            <p className="text-slate-400 text-body-md">Más de 800 clientes corporativos activos en todo el país</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {CLIENTES.map((c) => (
              <div key={c.nombre} className="bg-white/5 border border-white/10 rounded-radius-xl p-5 text-center hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building2 className="w-6 h-6 text-brand-400" />
                </div>
                <p className="font-bold text-white text-body-sm">{c.nombre}</p>
                <p className="text-slate-400 text-caption">{c.sector}</p>
                <p className="text-brand-400 text-caption font-medium mt-1">{c.envios}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div id="contacto" className="container-page max-w-2xl mx-auto py-16 px-4">
        <div className="text-center mb-10">
          <h2 className="text-heading-xl font-bold text-slate-900 mb-2">Solicita una cotización</h2>
          <p className="text-body-md text-slate-600">Un ejecutivo comercial te contactará en menos de 24 horas.</p>
        </div>

        {enviado ? (
          <motion.div className="bg-emerald-50 border border-emerald-200 rounded-radius-2xl p-12 text-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-heading-md font-bold text-slate-900 mb-2">¡Solicitud enviada!</h3>
            <p className="text-body-sm text-slate-600">Te contactaremos a <strong>{form.email}</strong> en las próximas 24 horas.</p>
          </motion.div>
        ) : (
          <div className="bg-white rounded-radius-2xl border border-slate-200 shadow-shadow-sm p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[['empresa','Empresa','Tu empresa S.A.S'],['nit','NIT','900.123.456-7'],['nombre','Nombre de contacto','Tu nombre completo'],['cargo','Cargo','Gerente Logístico'],['email','Correo corporativo','contacto@empresa.com'],['celular','Celular','310 000 0000']].map(([k,l,ph]) => (
                <div key={k}>
                  <label className="text-body-sm font-semibold text-slate-700 mb-1.5 block">{l}</label>
                  <input type="text" placeholder={ph} value={form[k as keyof typeof form]} onChange={e => update(k, e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-radius-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900" />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="text-body-sm font-semibold text-slate-700 mb-1.5 block">Servicio de interés</label>
                <select value={form.servicio} onChange={e => update('servicio', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-radius-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900">
                  <option value="">Selecciona un servicio</option>
                  {SERVICIOS.map(s => <option key={s.id}>{s.titulo}</option>)}
                  <option>Más de un servicio</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-body-sm font-semibold text-slate-700 mb-1.5 block">Mensaje adicional</label>
                <textarea value={form.mensaje} onChange={e => update('mensaje', e.target.value)} rows={4} placeholder="Cuéntanos sobre tu operación, volumen estimado, rutas..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-radius-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 resize-none" />
              </div>
            </div>
            <div className="mt-6">
              <Button fullWidth size="lg" leftIcon={<Send className="w-5 h-5" />} onClick={handleSubmit}>
                Enviar solicitud
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
