import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, X, Check, TrendingUp,
  Users, DollarSign, Percent, MapPin, Bus, Clock
} from 'lucide-react';
import SimpleGraph, { type DataPoint } from '@/components/ui/SimpleGraph';

/* ─────────────────────────── Types ─────────────────────────────── */

type EstadoRuta = 'Activa' | 'Suspendida' | 'Programada';

interface Ruta {
  id: number;
  origen: string;
  destino: string;
  horario: string;
  duracion: string;
  tarifa: number;
  capacidad: number;
  bus: string;
  estado: EstadoRuta;
  /** Pasajeros por día de la semana (lun-dom) */
  paxSemana: number[];
}

/* ─────────────────────────── Seed data ─────────────────────────── */

const SEED_RUTAS: Ruta[] = [
  { id: 1, origen: 'Bogotá', destino: 'Medellín', horario: '06:00', duracion: '9h', tarifa: 75000, capacidad: 40, bus: 'Bus 105', estado: 'Activa', paxSemana: [38, 40, 35, 39, 40, 37, 30] },
  { id: 2, origen: 'Bogotá', destino: 'Cali', horario: '08:30', duracion: '10h', tarifa: 80000, capacidad: 40, bus: 'Bus 208', estado: 'Activa', paxSemana: [28, 32, 30, 35, 40, 38, 25] },
  { id: 3, origen: 'Medellín', destino: 'Bogotá', horario: '07:00', duracion: '9h', tarifa: 75000, capacidad: 40, bus: 'Bus 402', estado: 'Activa', paxSemana: [20, 25, 22, 30, 38, 35, 18] },
  { id: 4, origen: 'Bogotá', destino: 'Bucaramanga', horario: '05:00', duracion: '6h', tarifa: 55000, capacidad: 40, bus: 'Bus 319', estado: 'Activa', paxSemana: [40, 38, 36, 40, 40, 39, 32] },
  { id: 5, origen: 'Cali', destino: 'Bogotá', horario: '09:00', duracion: '10h', tarifa: 80000, capacidad: 40, bus: 'Bus 211', estado: 'Suspendida', paxSemana: [0, 0, 0, 0, 0, 0, 0] },
  { id: 6, origen: 'Bogotá', destino: 'Cartagena', horario: '20:00', duracion: '14h', tarifa: 110000, capacidad: 44, bus: 'Bus 501', estado: 'Programada', paxSemana: [10, 15, 18, 22, 30, 40, 44] },
];

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const CIUDADES = [
  'Bogotá', 'Medellín', 'Cali', 'Bucaramanga', 'Barranquilla',
  'Cartagena', 'Manizales', 'Pereira', 'Armenia', 'Pasto',
  'Cúcuta', 'Ibagué', 'Villavicencio',
];

const BUSES = ['Bus 105', 'Bus 208', 'Bus 319', 'Bus 402', 'Bus 501', 'Bus 115', 'Bus 211'];

const ESTADO_COLORS: Record<EstadoRuta, string> = {
  Activa: 'bg-emerald-100 text-emerald-700',
  Suspendida: 'bg-red-100 text-red-700',
  Programada: 'bg-amber-100 text-amber-700',
};

/* ─────────────────────────── Sub-components ─────────────────────── */

const FormField = ({
  label, children,
}: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-caption font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
      {label}
    </label>
    {children}
  </div>
);

const inputCls =
  'w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-radius-md text-slate-900 text-body-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all';

/* ─────────────────────────── Modal ─────────────────────────────── */

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            className="bg-white rounded-radius-2xl shadow-shadow-elevated w-full max-w-lg"
            initial={{ scale: 0.95, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">{title}</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

/* ─────────────────────────── Confirm Delete ──────────────────── */

const ConfirmDelete = ({
  ruta,
  onConfirm,
  onCancel,
}: { ruta: Ruta; onConfirm: () => void; onCancel: () => void }) => (
  <Modal isOpen title="Eliminar ruta" onClose={onCancel}>
    <div className="space-y-5">
      <div className="bg-red-50 border border-red-200 rounded-radius-lg p-4 text-body-sm text-red-700">
        <p className="font-semibold mb-1">¿Estás seguro?</p>
        <p>
          Eliminarás permanentemente la ruta{' '}
          <strong>{ruta.origen} → {ruta.destino}</strong> ({ruta.horario}).
          Esta acción no se puede deshacer.
        </p>
      </div>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-slate-200 text-slate-600 rounded-radius-lg text-body-sm font-medium hover:bg-slate-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-radius-lg text-body-sm font-semibold hover:bg-red-700 transition-colors"
        >
          Sí, eliminar
        </button>
      </div>
    </div>
  </Modal>
);

/* ─────────────────────────── Ruta Form ──────────────────────────── */

type FormState = Omit<Ruta, 'id' | 'paxSemana'>;

const EMPTY_FORM: FormState = {
  origen: 'Bogotá',
  destino: 'Medellín',
  horario: '06:00',
  duracion: '8h',
  tarifa: 65000,
  capacidad: 40,
  bus: 'Bus 105',
  estado: 'Activa',
};

interface RutaFormProps {
  initial?: FormState;
  onSave: (f: FormState) => void;
  onCancel: () => void;
}

const RutaForm = ({ initial = EMPTY_FORM, onSave, onCancel }: RutaFormProps) => {
  const [form, setForm] = useState<FormState>(initial);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Origen">
          <select value={form.origen} onChange={(e) => set('origen', e.target.value)} className={inputCls}>
            {CIUDADES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </FormField>
        <FormField label="Destino">
          <select value={form.destino} onChange={(e) => set('destino', e.target.value)} className={inputCls}>
            {CIUDADES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Horario de salida">
          <input type="time" value={form.horario} onChange={(e) => set('horario', e.target.value)} className={inputCls} />
        </FormField>
        <FormField label="Duración estimada">
          <input type="text" placeholder="ej. 9h" value={form.duracion} onChange={(e) => set('duracion', e.target.value)} className={inputCls} />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Tarifa (COP)">
          <input
            type="number"
            min={0}
            step={1000}
            value={form.tarifa}
            onChange={(e) => set('tarifa', Number(e.target.value))}
            className={inputCls}
          />
        </FormField>
        <FormField label="Capacidad (pax)">
          <input
            type="number"
            min={1}
            max={60}
            value={form.capacidad}
            onChange={(e) => set('capacidad', Number(e.target.value))}
            className={inputCls}
          />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Bus asignado">
          <select value={form.bus} onChange={(e) => set('bus', e.target.value)} className={inputCls}>
            {BUSES.map((b) => <option key={b}>{b}</option>)}
          </select>
        </FormField>
        <FormField label="Estado">
          <select value={form.estado} onChange={(e) => set('estado', e.target.value as EstadoRuta)} className={inputCls}>
            <option>Activa</option>
            <option>Suspendida</option>
            <option>Programada</option>
          </select>
        </FormField>
      </div>

      <div className="flex gap-3 pt-2 justify-end">
        <button onClick={onCancel} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-radius-lg text-body-sm font-medium hover:bg-slate-50 transition-colors">
          Cancelar
        </button>
        <button
          onClick={() => onSave(form)}
          className="px-5 py-2 bg-brand-600 text-white rounded-radius-lg text-body-sm font-semibold hover:bg-brand-700 transition-colors flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          Guardar
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────── Graph Panel ──────────────────────── */

const GraphPanel = ({ ruta }: { ruta: Ruta }) => {
  const graphData: DataPoint[] = DIAS.map((d, i) => ({
    label: d,
    value: ruta.paxSemana[i],
  }));

  const totalPax = ruta.paxSemana.reduce((a, b) => a + b, 0);
  const avgPax = (totalPax / 7).toFixed(0);
  const ocupacion = ((Number(avgPax) / ruta.capacidad) * 100).toFixed(0);
  const ingSemana = (totalPax * ruta.tarifa).toLocaleString('es-CO');

  return (
    <motion.div
      key={ruta.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-radius-2xl border border-slate-200 shadow-shadow-sm p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-brand-600" />
            <h3 className="font-bold text-slate-900">
              {ruta.origen} → {ruta.destino}
            </h3>
          </div>
          <div className="flex items-center gap-3 text-caption text-slate-400">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ruta.horario}</span>
            <span className="flex items-center gap-1"><Bus className="w-3 h-3" />{ruta.bus}</span>
            <span>{ruta.duracion}</span>
          </div>
        </div>
        <span className={`text-caption font-semibold px-2.5 py-1 rounded-full ${ESTADO_COLORS[ruta.estado]}`}>
          {ruta.estado}
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {[
          { icon: <Users className="w-4 h-4" />, label: 'Pax/día prom.', value: avgPax, color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: <Percent className="w-4 h-4" />, label: 'Ocupación', value: `${ocupacion}%`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { icon: <DollarSign className="w-4 h-4" />, label: 'Ing. semana', value: `$${ingSemana}`, color: 'text-brand-600', bg: 'bg-brand-50' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-slate-50 rounded-radius-lg p-3 text-center min-w-0">
            <div className={`w-8 h-8 ${kpi.bg} ${kpi.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
              {kpi.icon}
            </div>
            <p className="text-heading-sm font-bold text-slate-900 truncate">{kpi.value}</p>
            <p className="text-caption text-slate-400">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Graph */}
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-brand-500" />
          <span className="text-body-sm font-semibold text-slate-700">Pasajeros por día (esta semana)</span>
        </div>
        <SimpleGraph
          data={graphData}
          color="#f97316"
          gradientFrom="#f97316"
          gradientTo="transparent"
          height={160}
          animated
          showDots
          showTooltip
          formatValue={(v) => `${v} pax`}
        />
      </div>
    </motion.div>
  );
};

/* ─────────────────────────── Main Page ─────────────────────────── */

let nextId = SEED_RUTAS.length + 1;

export const RutasMetricas = () => {
  const [rutas, setRutas] = useState<Ruta[]>(SEED_RUTAS);
  const [selectedId, setSelectedId] = useState<number>(SEED_RUTAS[0].id);
  const [search, setSearch] = useState('');

  // Modal states
  const [createOpen, setCreateOpen] = useState(false);
  const [editRuta, setEditRuta] = useState<Ruta | null>(null);
  const [deleteRuta, setDeleteRuta] = useState<Ruta | null>(null);

  const filteredRutas = useMemo(
    () =>
      rutas.filter(
        (r) =>
          r.origen.toLowerCase().includes(search.toLowerCase()) ||
          r.destino.toLowerCase().includes(search.toLowerCase()) ||
          r.bus.toLowerCase().includes(search.toLowerCase()),
      ),
    [rutas, search],
  );

  const selectedRuta = rutas.find((r) => r.id === selectedId) ?? rutas[0];

  /* CRUD handlers */
  const handleCreate = (form: FormState) => {
    const nueva: Ruta = {
      ...form,
      id: nextId++,
      paxSemana: [
        Math.round(form.capacidad * 0.6),
        Math.round(form.capacidad * 0.7),
        Math.round(form.capacidad * 0.65),
        Math.round(form.capacidad * 0.75),
        Math.round(form.capacidad * 0.85),
        Math.round(form.capacidad * 0.9),
        Math.round(form.capacidad * 0.55),
      ],
    };
    setRutas((prev) => [nueva, ...prev]);
    setSelectedId(nueva.id);
    setCreateOpen(false);
  };

  const handleEdit = (form: FormState) => {
    if (!editRuta) return;
    setRutas((prev) =>
      prev.map((r) => (r.id === editRuta.id ? { ...r, ...form } : r)),
    );
    setEditRuta(null);
  };

  const handleDelete = () => {
    if (!deleteRuta) return;
    setRutas((prev) => prev.filter((r) => r.id !== deleteRuta.id));
    if (selectedId === deleteRuta.id && rutas.length > 1) {
      setSelectedId(rutas.find((r) => r.id !== deleteRuta.id)!.id);
    }
    setDeleteRuta(null);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-heading-md font-bold text-slate-900">Gestión de Rutas</h2>
          <p className="text-body-sm text-slate-500">
            {rutas.length} rutas registradas · Selecciona una para ver métricas
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          id="btn-nueva-ruta"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-radius-lg text-body-sm font-semibold hover:bg-brand-700 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Nueva ruta
        </button>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* ── Left: table ── */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Buscar por ciudad o bus…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-radius-lg text-body-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-shadow-sm"
          />

          {/* Table */}
          <motion.div
            className="bg-white rounded-radius-2xl border border-slate-200 shadow-shadow-sm overflow-hidden"
            layout
          >
            <div className="overflow-x-auto">
              <table className="w-full text-body-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {['Ruta', 'Horario', 'Tarifa', 'Bus', 'Estado', ''].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-caption font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence>
                    {filteredRutas.map((r) => (
                      <motion.tr
                        key={r.id}
                        layout
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.2 }}
                        className={`cursor-pointer transition-colors ${
                          selectedId === r.id
                            ? 'bg-brand-50 border-l-2 border-l-brand-500'
                            : 'hover:bg-slate-50'
                        }`}
                        onClick={() => setSelectedId(r.id)}
                      >
                        <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                            {r.origen} → {r.destino}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{r.horario}</td>
                        <td className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">
                          ${r.tarifa.toLocaleString('es-CO')}
                        </td>
                        <td className="px-4 py-3 text-slate-500">{r.bus}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-caption font-semibold ${ESTADO_COLORS[r.estado]}`}>
                            {r.estado}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              id={`btn-edit-${r.id}`}
                              onClick={() => setEditRuta(r)}
                              title="Editar"
                              className="p-1.5 rounded-radius-md text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              id={`btn-delete-${r.id}`}
                              onClick={() => setDeleteRuta(r)}
                              title="Eliminar"
                              className="p-1.5 rounded-radius-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>

              {filteredRutas.length === 0 && (
                <div className="py-12 text-center text-body-sm text-slate-400">
                  No se encontraron rutas para "{search}"
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 text-caption text-slate-400">
              {filteredRutas.length} de {rutas.length} rutas
            </div>
          </motion.div>
        </div>

        {/* ── Right: Graph panel ── */}
        <div className="lg:col-span-2">
          {selectedRuta && <GraphPanel key={selectedRuta.id} ruta={selectedRuta} />}
        </div>
      </div>

      {/* ── Modals ── */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Nueva ruta">
        <RutaForm onSave={handleCreate} onCancel={() => setCreateOpen(false)} />
      </Modal>

      <Modal isOpen={!!editRuta} onClose={() => setEditRuta(null)} title="Editar ruta">
        {editRuta && (
          <RutaForm
            initial={{ origen: editRuta.origen, destino: editRuta.destino, horario: editRuta.horario, duracion: editRuta.duracion, tarifa: editRuta.tarifa, capacidad: editRuta.capacidad, bus: editRuta.bus, estado: editRuta.estado }}
            onSave={handleEdit}
            onCancel={() => setEditRuta(null)}
          />
        )}
      </Modal>

      {deleteRuta && (
        <ConfirmDelete
          ruta={deleteRuta}
          onConfirm={handleDelete}
          onCancel={() => setDeleteRuta(null)}
        />
      )}
    </div>
  );
};
