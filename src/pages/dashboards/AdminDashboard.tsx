import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Truck, Users, AlertTriangle, Package, Gauge, UserCheck, Building, X } from 'lucide-react';
import SimpleGraph from '@/components/ui/SimpleGraph';
import SelectorSillas from '@/components/ui/SelectorSillas';
import { useReservas, contarAsientos, type Salida } from '@/context/ReservasContext';

/* ─────────────────── KPI ── */
const KPI = ({ title, value, change, changeType, icon, color, bg }: { title: string; value: string; change: string; changeType: 'positive' | 'negative' | 'neutral'; icon: React.ReactNode; color: string; bg: string }) => (
  <motion.div
    className="bg-white rounded-radius-xl p-4 lg:p-5 border border-slate-200 shadow-shadow-sm relative overflow-hidden min-w-0"
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
  >
    <div className={`absolute -top-3 -right-3 w-16 h-16 lg:w-20 lg:h-20 ${bg} rounded-full opacity-40 hidden sm:block`} />
    <div className={`w-9 h-9 lg:w-10 lg:h-10 ${bg} ${color} rounded-radius-lg flex items-center justify-center mb-3`}>{icon}</div>
    <p className="text-caption font-medium text-slate-500 mb-1 truncate">{title}</p>
    <p className="text-heading-sm lg:text-heading-md font-bold text-slate-900 mb-1 truncate">{value}</p>
    <span className={`text-caption font-semibold px-2 py-0.5 rounded-full ${changeType === 'positive' ? 'bg-emerald-100 text-emerald-700' : changeType === 'negative' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'} whitespace-nowrap`}>
      {change}
    </span>
  </motion.div>
);

/* ─────────────────── Mock Data for KPIs & Alerts ── */
const ALERTAS = [
  { texto: 'Bus 115 requiere cambio de frenos', nivel: 'Crítico', tiempo: 'Hace 20 min' },
  { texto: 'Conductor Juan D. reportó incapacidad', nivel: 'Alto', tiempo: 'Hace 1h' },
  { texto: 'Terminal Cali: sobrecupo previsto para las 18:00', nivel: 'Medio', tiempo: 'Hace 2h' },
];

const alertaNivel: Record<string, string> = {
  'Crítico': 'bg-red-100 text-red-700 border-red-200',
  'Alto': 'bg-amber-100 text-amber-700 border-amber-200',
  'Medio': 'bg-blue-100 text-blue-700 border-blue-200',
};

const CHART_DATA = [
  { dia: 'Lun', ingresos: 55, encomiendas: 30 },
  { dia: 'Mar', ingresos: 72, encomiendas: 45 },
  { dia: 'Mié', ingresos: 48, encomiendas: 28 },
  { dia: 'Jue', ingresos: 90, encomiendas: 60 },
  { dia: 'Vie', ingresos: 68, encomiendas: 50 },
  { dia: 'Sáb', ingresos: 85, encomiendas: 72 },
  { dia: 'Dom', ingresos: 100, encomiendas: 80 },
];

const SERIES = ['Ingresos', 'Encomiendas'] as const;
type Serie = typeof SERIES[number];

const SERIE_CFG: Record<Serie, { color: string; gradientFrom: string; format: (v: number) => string }> = {
  Ingresos:     { color: '#f97316', gradientFrom: '#f97316', format: (v) => `${v}%` },
  Encomiendas:  { color: '#a855f7', gradientFrom: '#a855f7', format: (v) => `${v}%` },
};

/* ─────────────────── ChartCard ── */
const ChartCard = () => {
  const [serie, setSerie] = useState<Serie>('Ingresos');
  const cfg = SERIE_CFG[serie];

  const graphData = CHART_DATA.map((d) => ({
    label: d.dia,
    value: serie === 'Ingresos' ? d.ingresos : d.encomiendas,
  }));

  return (
    <motion.div
      className="bg-white rounded-radius-2xl p-6 border border-slate-200 shadow-shadow-sm lg:col-span-2"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-bold text-slate-900">Tendencia Semanal</h3>
          <p className="text-caption text-slate-400">Esta semana (índice normalizado)</p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 rounded-radius-lg p-1">
          {SERIES.map((s) => (
            <button
              key={s}
              onClick={() => setSerie(s)}
              className={`px-3 py-1 rounded-radius-md text-caption font-semibold transition-all ${
                serie === s
                  ? 'bg-white shadow text-slate-900'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <SimpleGraph
        key={serie}
        data={graphData}
        color={cfg.color}
        gradientFrom={cfg.gradientFrom}
        gradientTo="transparent"
        height={200}
        animated
        showDots
        showTooltip
        formatValue={cfg.format}
      />
    </motion.div>
  );
};

/* ─────────────────── Helper ── */
const statusColor: Record<string, string> = {
  'En ruta': 'bg-emerald-100 text-emerald-700',
  'Abordando': 'bg-amber-100 text-amber-700',
  'Vendiendo': 'bg-blue-100 text-blue-700',
  'Lleno': 'bg-red-100 text-red-700',
  'Próximamente': 'bg-slate-100 text-slate-500',
};

/* ─────────────────── Main Admin Dashboard ── */
export const AdminDashboard = () => {
  const { salidas } = useReservas();
  const [selectedSalida, setSelectedSalida] = useState<Salida | null>(null);

  // Overall occupancy
  const totalSeats = salidas.reduce((acc, s) => acc + Object.keys(s.seats).length, 0);
  const totalOccupied = salidas.reduce((acc, s) => acc + contarAsientos(s.seats).ocupado, 0);
  const occupancyRate = totalSeats > 0 ? Math.round((totalOccupied / totalSeats) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Saludo */}
      <div>
        <h2 className="text-heading-md font-bold text-slate-900">Vista Gerencial</h2>
        <p className="text-body-sm text-slate-500">Jueves, 4 Sep 2026 — operación en curso</p>
      </div>

      {/* KPIs row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI title="Ingresos Hoy" value="$15.4M" change="↑ 12% vs ayer" changeType="positive" icon={<TrendingUp className="w-5 h-5" />} color="text-emerald-600" bg="bg-emerald-100" />
        <KPI title="Buses en Ruta" value={String(salidas.length)} change={`${occupancyRate}% ocupación`} changeType="neutral" icon={<Truck className="w-5 h-5" />} color="text-blue-600" bg="bg-blue-100" />
        <KPI title="Pasajeros Hoy" value={String(totalOccupied)} change="↑ 5% vs ayer" changeType="positive" icon={<Users className="w-5 h-5" />} color="text-brand-600" bg="bg-brand-100" />
        <KPI title="Alertas Activas" value="3" change="1 crítica" changeType="negative" icon={<AlertTriangle className="w-5 h-5" />} color="text-red-600" bg="bg-red-100" />
      </div>

      {/* KPIs row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI title="Encomiendas Hoy" value="1,840" change="↑ 8% vs ayer" changeType="positive" icon={<Package className="w-5 h-5" />} color="text-purple-600" bg="bg-purple-100" />
        <KPI title="Ocupación Prom." value={`${occupancyRate}%`} change="↑ vs 78% sem. ant." changeType="positive" icon={<Gauge className="w-5 h-5" />} color="text-cyan-600" bg="bg-cyan-100" />
        <KPI title="Conductores Activos" value="138" change="4 en descanso" changeType="neutral" icon={<UserCheck className="w-5 h-5" />} color="text-teal-600" bg="bg-teal-100" />
        <KPI title="Terminales Operativas" value="28/30" change="2 en mantenimiento" changeType="neutral" icon={<Building className="w-5 h-5" />} color="text-slate-600" bg="bg-slate-100" />
      </div>

      {/* Chart + Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard />

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

      {/* Tabla de flota real */}
      <motion.div
        className="bg-white rounded-radius-2xl border border-slate-200 shadow-shadow-sm overflow-hidden min-w-0"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
      >
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Estado de flota en tiempo real (Haz click para ver asientos)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['Bus', 'Ruta', 'Horario', 'Ocupación', 'Estado'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-caption font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {salidas.map((s) => {
                const { ocupado, total } = contarAsientos(s.seats);
                const pct = total > 0 ? Math.round((ocupado / total) * 100) : 0;
                
                return (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedSalida(s)}
                  >
                    <td className="px-4 py-3 font-bold text-slate-900">Bus {s.busNumero}</td>
                    <td className="px-4 py-3 text-slate-600">{s.origen} → {s.destino}</td>
                    <td className="px-4 py-3 text-slate-600">{s.horario}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-700 w-12">{ocupado}/{total}</span>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${pct > 80 ? 'bg-red-400' : 'bg-brand-400'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-caption font-semibold ${statusColor[s.estado] || 'bg-slate-100 text-slate-600'}`}>
                        {s.estado}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal View SelectorSillas */}
      <AnimatePresence>
        {selectedSalida && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedSalida(null)}
          >
            <motion.div
              className="bg-white rounded-radius-2xl p-6 shadow-shadow-elevated max-w-lg w-full max-h-screen overflow-y-auto"
              initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-body-md">Ocupación del Bus {selectedSalida.busNumero}</h3>
                  <p className="text-caption text-slate-500">{selectedSalida.origen} → {selectedSalida.destino} · {selectedSalida.horario}</p>
                </div>
                <button onClick={() => setSelectedSalida(null)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="border border-slate-200 rounded-radius-xl p-2 bg-slate-50">
                <SelectorSillas
                  seats={selectedSalida.seats}
                  readOnly
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
