import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, Printer, Users, ArrowRight, Clock,
  CheckCircle, AlertCircle, X, Pencil, Trash2,
  CreditCard, Banknote, Search, UserCircle, Phone, Hash,
} from 'lucide-react';
import { Button } from '@/components/ui';
import SelectorSillas from '@/components/ui/SelectorSillas';
import SimpleGraph from '@/components/ui/SimpleGraph';
import {
  useReservas, contarAsientos, type Salida, type Pasajero, type Reserva,
} from '@/context/ReservasContext';

/* ─────────────────── KPI card ── */
const KPI = ({ title, value, icon, color, bg, sub }: {
  title: string; value: string; icon: React.ReactNode;
  color: string; bg: string; sub?: string;
}) => (
  <motion.div
    className="bg-white rounded-radius-xl p-5 border border-slate-200 shadow-shadow-sm"
    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
  >
    <div className={`w-10 h-10 ${bg} ${color} rounded-radius-lg flex items-center justify-center mb-3`}>
      {icon}
    </div>
    <p className="text-caption font-medium text-slate-500 mb-0.5">{title}</p>
    <p className="text-heading-sm font-bold text-slate-900">{value}</p>
    {sub && <p className="text-caption text-slate-400 mt-0.5">{sub}</p>}
  </motion.div>
);

/* ─────────────────── Pasajero form ── */
const PasajeroForm = ({
  value, onChange,
}: { value: Pasajero; onChange: (p: Pasajero) => void }) => {
  const set = <K extends keyof Pasajero>(k: K, v: Pasajero[K]) =>
    onChange({ ...value, [k]: v });

  const inputCls = 'w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-radius-md text-slate-900 text-body-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent';

  return (
    <div className="space-y-4">
      <div>
        <label className="text-caption font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
          Nombre completo
        </label>
        <div className="relative">
          <UserCircle className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            className={`${inputCls} pl-9`}
            placeholder="Nombre y apellido"
            value={value.nombre}
            onChange={(e) => set('nombre', e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-caption font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
            Tipo doc.
          </label>
          <select
            className={inputCls}
            value={value.tipoDoc}
            onChange={(e) => set('tipoDoc', e.target.value as Pasajero['tipoDoc'])}
          >
            <option value="CC">Cédula (CC)</option>
            <option value="CE">Cédula Extranjer.</option>
            <option value="PP">Pasaporte (PP)</option>
            <option value="TI">T. Identidad</option>
          </select>
        </div>
        <div>
          <label className="text-caption font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
            Número doc.
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              className={`${inputCls} pl-9`}
              placeholder="00000000"
              value={value.numDoc}
              onChange={(e) => set('numDoc', e.target.value)}
            />
          </div>
        </div>
      </div>
      <div>
        <label className="text-caption font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
          Teléfono
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            className={`${inputCls} pl-9`}
            placeholder="300 000 0000"
            value={value.telefono}
            onChange={(e) => set('telefono', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

/* ─────────────────── Venta modal (drawer-style) ── */
type VentaStep = 'sillas' | 'datos' | 'pago';

const EMPTY_PAX: Pasajero = { nombre: '', tipoDoc: 'CC', numDoc: '', telefono: '' };

const VentaDrawer = ({
  salida, onClose, editReserva,
}: {
  salida: Salida;
  onClose: () => void;
  editReserva?: Reserva | null;
}) => {
  const { crearReserva, editarReserva } = useReservas();
  const [step, setStep] = useState<VentaStep>('sillas');
  const [selectedSeats, setSelectedSeats] = useState<string[]>(editReserva?.asientos ?? []);
  const [pasajero, setPasajero] = useState<Pasajero>(editReserva?.pasajero ?? EMPTY_PAX);
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'tarjeta'>('efectivo');
  const [done, setDone] = useState(false);
  const [confirmId, setConfirmId] = useState('');

  const total = selectedSeats.length * salida.tarifa;

  const confirmar = () => {
    if (editReserva) {
      editarReserva(editReserva.id, selectedSeats, pasajero);
      setConfirmId(editReserva.id);
    } else {
      const r = crearReserva({
        salidaId: salida.id,
        asientos: selectedSeats,
        pasajero,
        total,
        metodoPago,
        vendidoPor: 'cajero',
      });
      setConfirmId(r.id);
    }
    setDone(true);
  };

  const canNext = step === 'sillas'
    ? selectedSeats.length > 0
    : step === 'datos'
    ? pasajero.nombre.trim() !== '' && pasajero.numDoc.trim() !== '' && pasajero.telefono.trim() !== ''
    : true;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

        {/* Drawer */}
        <motion.div
          className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-shadow-elevated flex flex-col overflow-hidden"
          initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
            <div>
              <h3 className="font-bold text-slate-900">
                {editReserva ? 'Editar Reserva' : 'Vender Tiquete'}
              </h3>
              <p className="text-caption text-slate-500">
                {salida.origen} → {salida.destino} · Bus {salida.busNumero} · {salida.horario}
              </p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step indicator */}
          {!done && (
            <div className="flex border-b border-slate-100">
              {(['sillas', 'datos', 'pago'] as VentaStep[]).map((s, i) => (
                <div
                  key={s}
                  className={`flex-1 py-3 text-center text-caption font-semibold transition-colors ${
                    step === s
                      ? 'text-brand-600 border-b-2 border-brand-600 bg-brand-50'
                      : i < (['sillas', 'datos', 'pago'] as VentaStep[]).indexOf(step)
                      ? 'text-emerald-600'
                      : 'text-slate-400'
                  }`}
                >
                  {i + 1}. {s === 'sillas' ? 'Sillas' : s === 'datos' ? 'Pasajero' : 'Pago'}
                </div>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center gap-4"
                >
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-heading-md font-bold text-slate-900 mb-1">
                      {editReserva ? '¡Reserva actualizada!' : '¡Venta exitosa!'}
                    </h4>
                    <p className="text-body-sm text-slate-500">Código: <strong>{confirmId}</strong></p>
                    <p className="text-body-sm text-slate-500 mt-1">
                      {pasajero.nombre} · {selectedSeats.join(', ')}
                    </p>
                    <p className="text-heading-sm font-bold text-brand-600 mt-2">
                      Total: ${total.toLocaleString('es-CO')}
                    </p>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" leftIcon={<Printer className="w-4 h-4" />}>
                      Imprimir tiquete
                    </Button>
                    <Button onClick={onClose}>Cerrar</Button>
                  </div>
                </motion.div>
              ) : step === 'sillas' ? (
                <motion.div key="sillas" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <p className="text-body-sm text-slate-600 mb-4 font-medium">
                    Selecciona las sillas que deseas vender. Las sillas resaltadas al pasar el cursor son adyacentes.
                  </p>
                  <SelectorSillas
                    seats={salida.seats}
                    initialSelected={selectedSeats}
                    onChange={setSelectedSeats}
                    info={{
                      numero: salida.busNumero,
                      origen: salida.origen,
                      destino: salida.destino,
                      horario: salida.horario,
                      tarifa: salida.tarifa,
                    }}
                  />
                </motion.div>
              ) : step === 'datos' ? (
                <motion.div key="datos" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <p className="text-body-sm text-slate-600 mb-6 font-medium">
                    Datos del pasajero — sillas: <strong>{selectedSeats.sort().join(', ')}</strong>
                  </p>
                  <PasajeroForm value={pasajero} onChange={setPasajero} />
                </motion.div>
              ) : (
                <motion.div key="pago" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="space-y-5">
                    <div className="bg-slate-50 rounded-radius-xl border border-slate-200 p-4 space-y-2">
                      <div className="flex justify-between text-body-sm">
                        <span className="text-slate-500">Ruta</span>
                        <span className="font-semibold text-slate-800">{salida.origen} → {salida.destino}</span>
                      </div>
                      <div className="flex justify-between text-body-sm">
                        <span className="text-slate-500">Sillas</span>
                        <span className="font-semibold text-slate-800">{selectedSeats.sort().join(', ')}</span>
                      </div>
                      <div className="flex justify-between text-body-sm">
                        <span className="text-slate-500">Pasajero</span>
                        <span className="font-semibold text-slate-800">{pasajero.nombre}</span>
                      </div>
                      <div className="flex justify-between text-body-sm border-t border-slate-200 pt-2 mt-2">
                        <span className="font-bold text-slate-700">Total</span>
                        <span className="font-bold text-heading-sm text-brand-600">
                          ${total.toLocaleString('es-CO')}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-caption font-semibold text-slate-500 uppercase tracking-wide mb-3">Método de pago</p>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'efectivo', label: 'Efectivo', icon: <Banknote className="w-5 h-5" /> },
                          { id: 'tarjeta', label: 'Tarjeta', icon: <CreditCard className="w-5 h-5" /> },
                        ].map(({ id, label, icon }) => (
                          <button
                            key={id}
                            onClick={() => setMetodoPago(id as 'efectivo' | 'tarjeta')}
                            className={`flex items-center gap-3 p-4 rounded-radius-xl border-2 transition-all ${
                              metodoPago === id
                                ? 'border-brand-500 bg-brand-50 text-brand-700'
                                : 'border-slate-200 hover:border-slate-300 text-slate-600'
                            }`}
                          >
                            {icon}
                            <span className="font-semibold text-body-sm">{label}</span>
                            {metodoPago === id && <CheckCircle className="w-4 h-4 ml-auto text-brand-600" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer nav */}
          {!done && (
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => {
                  if (step === 'sillas') onClose();
                  else if (step === 'datos') setStep('sillas');
                  else setStep('datos');
                }}
              >
                {step === 'sillas' ? 'Cancelar' : 'Atrás'}
              </Button>
              <div className="flex items-center gap-3">
                {selectedSeats.length > 0 && (
                  <span className="text-body-sm font-bold text-brand-600">
                    ${total.toLocaleString('es-CO')}
                  </span>
                )}
                <Button
                  disabled={!canNext}
                  leftIcon={step === 'pago' ? <CheckCircle className="w-4 h-4" /> : undefined}
                  onClick={() => {
                    if (step === 'sillas') setStep('datos');
                    else if (step === 'datos') setStep('pago');
                    else confirmar();
                  }}
                >
                  {step === 'pago' ? 'Confirmar venta' : 'Continuar'}
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─────────────────── Ventas graph data ── */
const VENTAS_HORA = [
  { label: '08h', value: 3 },
  { label: '09h', value: 7 },
  { label: '10h', value: 5 },
  { label: '11h', value: 12 },
  { label: '12h', value: 9 },
  { label: '13h', value: 15 },
  { label: '14h', value: 11 },
];

const statusColor: Record<string, string> = {
  Abordando: 'bg-amber-100 text-amber-700',
  Lleno: 'bg-red-100 text-red-700',
  Vendiendo: 'bg-emerald-100 text-emerald-700',
  Próximamente: 'bg-slate-100 text-slate-500',
};

/* ─────────────────── Main ── */

export const OperarioDashboard = () => {
  const { salidas, reservas, cancelarReserva } = useReservas();
  const [ventaSalida, setVentaSalida] = useState<Salida | null>(null);
  const [editReserva, setEditReserva] = useState<Reserva | null>(null);
  const [cierrePedido, setCierrePedido] = useState(false);
  const [cierreDone, setCierreDone] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  // Reservas del turno (solo cajero, solo hoy)
  const misTxns = useMemo(
    () => reservas.filter((r) => r.vendidoPor === 'cajero' && r.estado === 'confirmada'),
    [reservas],
  );

  const totalTurno = misTxns.reduce((a, r) => a + r.total, 0);

  const filteredSalidas = useMemo(
    () =>
      salidas.filter(
        (s) =>
          s.destino.toLowerCase().includes(busqueda.toLowerCase()) ||
          s.busNumero.includes(busqueda),
      ),
    [salidas, busqueda],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-heading-md font-bold text-slate-900">Portal del Cajero</h2>
          <p className="text-body-sm text-slate-500">Terminal Bogotá · Turno activo desde las 12:00 PM</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Printer className="w-4 h-4" />}
          onClick={() => setCierrePedido(true)}
        >
          Cierre de turno
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI title="Ventas tiquetes" value={`$${misTxns.filter(r=>r.metodoPago==='efectivo').reduce((a,r)=>a+r.total,0).toLocaleString('es-CO')}`} icon={<Users className="w-5 h-5"/>} color="text-blue-600" bg="bg-blue-100" sub="Efectivo" />
        <KPI title="Ventas tarjeta" value={`$${misTxns.filter(r=>r.metodoPago==='tarjeta').reduce((a,r)=>a+r.total,0).toLocaleString('es-CO')}`} icon={<CreditCard className="w-5 h-5"/>} color="text-purple-600" bg="bg-purple-100" sub="Tarjeta" />
        <KPI title="Total turno" value={`$${totalTurno.toLocaleString('es-CO')}`} icon={<DollarSign className="w-5 h-5"/>} color="text-amber-600" bg="bg-amber-100" />
        <KPI title="Transacciones" value={String(misTxns.length)} icon={<CheckCircle className="w-5 h-5"/>} color="text-brand-600" bg="bg-brand-100" sub={`${misTxns.reduce((a,r)=>a+r.asientos.length,0)} sillas`} />
      </div>

      {/* Chart + Salidas */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Ventas por hora */}
        <div className="lg:col-span-2 bg-white rounded-radius-2xl border border-slate-200 shadow-shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900">Ventas por hora</h3>
              <p className="text-caption text-slate-400">Tiquetes vendidos hoy</p>
            </div>
            <span className="text-heading-sm font-bold text-brand-600">
              {misTxns.reduce((a,r)=>a+r.asientos.length,0)} tiquetes
            </span>
          </div>
          <SimpleGraph
            data={VENTAS_HORA}
            color="#f97316"
            gradientFrom="#f97316"
            height={140}
            animated
            showDots
            showTooltip
            formatValue={(v) => `${v} tkt`}
          />
        </div>

        {/* Próximas salidas */}
        <div className="lg:col-span-3 bg-white rounded-radius-2xl border border-slate-200 shadow-shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
            <h3 className="font-bold text-slate-900 shrink-0">Próximas Salidas</h3>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar destino o bus…"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-radius-lg text-body-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
          <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
            {filteredSalidas.map((s) => {
              const { libre, ocupado, total } = contarAsientos(s.seats);
              const pct = Math.round((ocupado / total) * 100);
              return (
                <div key={s.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-body-sm">{s.destino}</p>
                    <p className="text-caption text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />{s.horario} · Bus {s.busNumero} · {s.duracion}
                    </p>
                    {/* Mini occupancy bar */}
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-400 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-caption text-slate-400 shrink-0">{libre} libres</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-caption font-semibold ${statusColor[s.estado] ?? 'bg-slate-100 text-slate-500'}`}>
                      {s.estado}
                    </span>
                    {s.estado !== 'Lleno' && s.estado !== 'En ruta' && (
                      <button
                        id={`btn-vender-${s.id}`}
                        onClick={() => { setEditReserva(null); setVentaSalida(s); }}
                        className="flex items-center gap-1 text-caption font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-radius-md transition-colors"
                      >
                        Vender <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Transacciones del turno */}
      <div className="bg-white rounded-radius-2xl border border-slate-200 shadow-shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Transacciones del turno</h3>
          <span className="text-body-sm font-bold text-brand-600">${totalTurno.toLocaleString('es-CO')}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['Código', 'Ruta', 'Pasajero', 'Sillas', 'Pago', 'Total', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-caption font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {misTxns.map((r) => {
                  const sal = salidas.find((s) => s.id === r.salidaId);
                  return (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">{r.id}</td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {sal ? `${sal.origen} → ${sal.destino}` : r.salidaId}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{r.pasajero.nombre}</td>
                      <td className="px-4 py-3 font-medium text-slate-700">{r.asientos.sort().join(', ')}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-caption font-semibold ${r.metodoPago === 'efectivo' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'}`}>
                          {r.metodoPago}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-800 whitespace-nowrap">
                        ${r.total.toLocaleString('es-CO')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            title="Editar reserva"
                            onClick={() => { setEditReserva(r); setVentaSalida(sal ?? null); }}
                            className="p-1.5 rounded-radius-md text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Cancelar reserva"
                            onClick={() => cancelarReserva(r.id)}
                            className="p-1.5 rounded-radius-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
          {misTxns.length === 0 && (
            <div className="py-10 text-center text-body-sm text-slate-400">
              No hay ventas en este turno todavía.
            </div>
          )}
        </div>
      </div>

      {/* Cierre modal */}
      <AnimatePresence>
        {cierrePedido && !cierreDone && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setCierrePedido(false)}
          >
            <motion.div
              className="bg-white rounded-radius-2xl p-6 shadow-shadow-elevated max-w-md w-full mx-4"
              initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900">Confirmar cierre de turno</h3>
                  <p className="text-body-sm text-slate-600 mt-1">
                    Se generará un reporte con <strong>{misTxns.length}</strong> transacciones por un total de{' '}
                    <strong>${totalTurno.toLocaleString('es-CO')}</strong>.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setCierrePedido(false)}>Cancelar</Button>
                <Button leftIcon={<Printer className="w-4 h-4" />} onClick={() => { setCierreDone(true); setCierrePedido(false); }}>
                  Confirmar y cerrar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {cierreDone && (
        <motion.div
          className="bg-emerald-50 border border-emerald-200 rounded-radius-xl p-4 flex items-center gap-3"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        >
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="font-semibold text-body-sm text-emerald-800">
            Turno cerrado exitosamente. Reporte generado.
          </p>
        </motion.div>
      )}

      {/* Venta drawer */}
      {ventaSalida && (
        <VentaDrawer
          salida={ventaSalida}
          onClose={() => { setVentaSalida(null); setEditReserva(null); }}
          editReserva={editReserva}
        />
      )}
    </div>
  );
};
