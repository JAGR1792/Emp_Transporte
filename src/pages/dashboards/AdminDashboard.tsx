import { motion } from 'framer-motion';
import { TrendingUp, Truck, Users, AlertTriangle, Package, Gauge, UserCheck, Building } from 'lucide-react';

const KPI = ({ title, value, change, changeType, icon, color, bg }: { title: string; value: string; change: string; changeType: 'positive' | 'negative' | 'neutral'; icon: React.ReactNode; color: string; bg: string }) => (
  <motion.div
    className="bg-white rounded-radius-xl p-5 border border-slate-200 shadow-shadow-sm relative overflow-hidden"
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
  >
    <div className={`absolute -top-4 -right-4 w-20 h-20 ${bg} rounded-full opacity-40`} />
    <div className={`w-10 h-10 ${bg} ${color} rounded-radius-lg flex items-center justify-center mb-3`}>{icon}</div>
    <p className="text-caption font-medium text-slate-500 mb-1">{title}</p>
    <p className="text-heading-md font-bold text-slate-900 mb-1">{value}</p>
    <span className={`text-caption font-semibold px-2 py-0.5 rounded-full ${changeType === 'positive' ? 'bg-emerald-100 text-emerald-700' : changeType === 'negative' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
      {change}
    </span>
  </motion.div>
);

const FLOTA = [
  { bus: 'Bus 105', ruta: 'Bogotá → Medellín', conductor: 'Carlos M.', estado: 'En ruta', pax: '38/40', eta: '18:30' },
  { bus: 'Bus 208', ruta: 'Bogotá → Cali', conductor: 'Jorge P.', estado: 'En ruta', pax: '32/40', eta: '20:15' },
  { bus: 'Bus 402', ruta: 'Medellín → Bogotá', conductor: 'Andrés L.', estado: 'Abordando', pax: '15/40', eta: '15:00' },
  { bus: 'Bus 115', ruta: '—', conductor: '—', estado: 'Mantenimiento', pax: '—', eta: '—' },
  { bus: 'Bus 319', ruta: 'Bogotá → Bucaramanga', conductor: 'Mauricio C.', estado: 'En ruta', pax: '40/40', eta: '22:00' },
];

const ALERTAS = [
  { texto: 'Bus 115 requiere cambio de frenos', nivel: 'Crítico', tiempo: 'Hace 20 min' },
  { texto: 'Conductor Juan D. reportó incapacidad', nivel: 'Alto', tiempo: 'Hace 1h' },
  { texto: 'Terminal Cali: sobrecupo previsto para las 18:00', nivel: 'Medio', tiempo: 'Hace 2h' },
];

const CHART_DATA = [
  { dia: 'Lun', ingresos: 55, encomiendas: 30 },
  { dia: 'Mar', dia2: 'Mar', ingresos: 72, encomiendas: 45 },
  { dia: 'Mié', ingresos: 48, encomiendas: 28 },
  { dia: 'Jue', ingresos: 90, encomiendas: 60 },
  { dia: 'Vie', ingresos: 68, encomiendas: 50 },
  { dia: 'Sáb', ingresos: 85, encomiendas: 72 },
  { dia: 'Dom', ingresos: 100, encomiendas: 80 },
];

const estadoColor: Record<string, string> = {
  'En ruta': 'bg-emerald-100 text-emerald-700',
  'Abordando': 'bg-amber-100 text-amber-700',
  'Mantenimiento': 'bg-red-100 text-red-700',
};

const alertaNivel: Record<string, string> = {
  'Crítico': 'bg-red-100 text-red-700 border-red-200',
  'Alto': 'bg-amber-100 text-amber-700 border-amber-200',
  'Medio': 'bg-blue-100 text-blue-700 border-blue-200',
};

export const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Saludo */}
      <div>
        <h2 className="text-heading-md font-bold text-slate-900">Vista Gerencial</h2>
        <p className="text-body-sm text-slate-500">Jueves, 4 Sep 2026 — operación en curso</p>
      </div>

      {/* KPIs row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI title="Ingresos Hoy" value="$15.4M" change="↑ 12% vs ayer" changeType="positive" icon={<TrendingUp className="w-5 h-5" />} color="text-emerald-600" bg="bg-emerald-100" />
        <KPI title="Buses en Ruta" value="142" change="84% ocupación" changeType="neutral" icon={<Truck className="w-5 h-5" />} color="text-blue-600" bg="bg-blue-100" />
        <KPI title="Pasajeros Hoy" value="4,291" change="↑ 5% vs ayer" changeType="positive" icon={<Users className="w-5 h-5" />} color="text-brand-600" bg="bg-brand-100" />
        <KPI title="Alertas Activas" value="3" change="1 crítica" changeType="negative" icon={<AlertTriangle className="w-5 h-5" />} color="text-red-600" bg="bg-red-100" />
      </div>

      {/* KPIs row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI title="Encomiendas Hoy" value="1,840" change="↑ 8% vs ayer" changeType="positive" icon={<Package className="w-5 h-5" />} color="text-purple-600" bg="bg-purple-100" />
        <KPI title="Ocupación Prom." value="81%" change="↑ vs 78% sem. ant." changeType="positive" icon={<Gauge className="w-5 h-5" />} color="text-cyan-600" bg="bg-cyan-100" />
        <KPI title="Conductores Activos" value="138" change="4 en descanso" changeType="neutral" icon={<UserCheck className="w-5 h-5" />} color="text-teal-600" bg="bg-teal-100" />
        <KPI title="Terminales Operativas" value="28/30" change="2 en mantenimiento" changeType="neutral" icon={<Building className="w-5 h-5" />} color="text-slate-600" bg="bg-slate-100" />
      </div>

      {/* Chart + Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="bg-white rounded-radius-2xl p-6 border border-slate-200 shadow-shadow-sm lg:col-span-2"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-900">Ingresos vs Encomiendas</h3>
              <p className="text-caption text-slate-400">Esta semana (índice normalizado)</p>
            </div>
            <select className="bg-slate-50 border border-slate-200 text-body-sm rounded-radius-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500">
              <option>Esta semana</option>
              <option>Mes anterior</option>
              <option>Trimestre</option>
            </select>
          </div>

          {/* Legend */}
          <div className="flex gap-4 mb-4 text-caption">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-brand-500" />Ingresos</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-purple-400" />Encomiendas</div>
          </div>

          <div className="h-52 flex items-end gap-2">
            {CHART_DATA.map((d) => (
              <div key={d.dia} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full flex items-end gap-1" style={{ height: '180px' }}>
                  <div className="flex-1 bg-brand-500 rounded-t-sm hover:bg-brand-600 transition-colors" style={{ height: `${d.ingresos}%` }} title={`Ingresos: ${d.ingresos}%`} />
                  <div className="flex-1 bg-purple-400 rounded-t-sm hover:bg-purple-500 transition-colors" style={{ height: `${d.encomiendas}%` }} title={`Encomiendas: ${d.encomiendas}%`} />
                </div>
                <span className="text-caption text-slate-400">{d.dia}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Alertas */}
        <motion.div
          className="bg-white rounded-radius-2xl p-6 border border-slate-200 shadow-shadow-sm"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        >
          <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />Alertas Activas
          </h3>
          <div className="space-y-3">
            {ALERTAS.map((a, i) => (
              <div key={i} className={`p-3 rounded-radius-lg border text-body-sm ${alertaNivel[a.nivel]}`}>
                <div className="flex justify-between items-start gap-2 mb-0.5">
                  <span className="font-semibold">{a.nivel}</span>
                  <span className="text-caption opacity-70">{a.tiempo}</span>
                </div>
                <p className="opacity-90">{a.texto}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 border border-slate-200 text-slate-600 rounded-radius-lg text-body-sm font-medium hover:bg-slate-50 transition-colors">Ver todas las alertas</button>
        </motion.div>
      </div>

      {/* Tabla de flota */}
      <motion.div
        className="bg-white rounded-radius-2xl border border-slate-200 shadow-shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
      >
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Estado de flota en tiempo real</h3>
          <button className="text-body-sm text-brand-600 font-semibold hover:text-brand-700">Ver flota completa</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['Bus', 'Ruta', 'Conductor', 'Pasajeros', 'ETA', 'Estado'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-caption font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {FLOTA.map((f) => (
                <tr key={f.bus} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-900">{f.bus}</td>
                  <td className="px-4 py-3 text-slate-600">{f.ruta}</td>
                  <td className="px-4 py-3 text-slate-600">{f.conductor}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{f.pax}</td>
                  <td className="px-4 py-3 text-slate-500">{f.eta}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-caption font-semibold ${estadoColor[f.estado] || 'bg-slate-100 text-slate-600'}`}>{f.estado}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};
