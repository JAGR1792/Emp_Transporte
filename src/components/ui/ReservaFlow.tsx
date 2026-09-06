import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, CheckCircle, Printer, Banknote, CreditCard,
  UserCircle, Hash, Phone,
} from 'lucide-react';
import { Button } from '@/components/ui';
import SelectorSillas from './SelectorSillas';
import { TicketCard } from './TicketCard';
import { useReservas, type Salida, type Pasajero, type Reserva } from '@/context/ReservasContext';

/* ─────────────────── Pasajero Form ── */
const PasajeroForm = ({
  value, onChange,
}: { value: Pasajero; onChange: (p: Pasajero) => void }) => {
  const set = <K extends keyof Pasajero>(k: K, v: Pasajero[K]) =>
    onChange({ ...value, [k]: v });

  const inputCls = 'w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-radius-md text-slate-900 text-body-sm md:text-base focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all';
  const labelCls = 'text-caption font-semibold text-slate-500 uppercase tracking-wide block mb-1.5';

  return (
    <div className="space-y-5">
      <div>
        <label className={labelCls}>Nombre completo</label>
        <div className="relative">
          <UserCircle className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
          <input
            className={`${inputCls} pl-11`}
            placeholder="Nombre y apellido"
            value={value.nombre}
            onChange={(e) => set('nombre', e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Tipo doc.</label>
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
          <label className={labelCls}>Número doc.</label>
          <div className="relative">
            <Hash className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text" inputMode="numeric"
              className={`${inputCls} pl-11`}
              placeholder="00000000"
              value={value.numDoc}
              onChange={(e) => set('numDoc', e.target.value)}
            />
          </div>
        </div>
      </div>
      <div>
        <label className={labelCls}>Teléfono</label>
        <div className="relative">
          <Phone className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="tel" inputMode="tel"
            className={`${inputCls} pl-11`}
            placeholder="300 000 0000"
            value={value.telefono}
            onChange={(e) => set('telefono', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

/* ─────────────────── Main Flow Component ── */

type FlowStep = 'sillas' | 'datos' | 'pago';
type Role = 'cajero' | 'cliente';

export interface ReservaFlowProps {
  salida: Salida;
  role: Role;
  onClose: () => void;
  // Para modo cliente:
  userEmail?: string;
  userName?: string;
  // Para modo cajero:
  editReserva?: Reserva | null;
}

export function ReservaFlow({
  salida, role, onClose, userEmail = '', userName = '', editReserva,
}: ReservaFlowProps) {
  const { crearReserva, editarReserva } = useReservas();
  
  const [step, setStep] = useState<FlowStep>('sillas');
  const [selectedSeats, setSelectedSeats] = useState<string[]>(editReserva?.asientos ?? []);
  const [pasajero, setPasajero] = useState<Pasajero>(
    editReserva?.pasajero ?? { nombre: userName, tipoDoc: 'CC', numDoc: '', telefono: '', email: userEmail }
  );
  
  // Por defecto tarjeta para cliente, efectivo para cajero
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'tarjeta'>(
    editReserva?.metodoPago ?? (role === 'cliente' ? 'tarjeta' : 'efectivo')
  );
  
  const [doneReserva, setDoneReserva] = useState<Reserva | null>(null);

  const total = selectedSeats.length * salida.tarifa;

  const confirmar = () => {
    if (editReserva) {
      editarReserva(editReserva.id, selectedSeats, pasajero);
      setDoneReserva({ ...editReserva, asientos: selectedSeats, pasajero, total });
    } else {
      const r = crearReserva({
        salidaId: salida.id,
        asientos: selectedSeats,
        pasajero,
        total,
        metodoPago,
        vendidoPor: role,
      });
      setDoneReserva(r);
    }
  };

  const canNext = step === 'sillas'
    ? selectedSeats.length > 0
    : step === 'datos'
    ? pasajero.nombre.trim() !== '' && pasajero.numDoc.trim() !== '' && pasajero.telefono.trim() !== ''
    : true;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-stretch md:items-center md:justify-end"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

        {/* Modal / Drawer 
            Mobile: 100vw, 100vh, fixed inset
            Desktop: max-w-2xl, h-full, slide from right
        */}
        <motion.div
          className="relative w-full h-full md:max-w-2xl bg-white shadow-shadow-elevated flex flex-col md:h-full overflow-hidden"
          initial={{ x: '100%', y: 0 }} 
          animate={{ x: 0, y: 0 }} 
          exit={{ x: '100%', y: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50 z-10 shrink-0">
            <div>
              <h3 className="font-bold text-slate-900 text-body-md md:text-heading-sm">
                {editReserva ? 'Editar Reserva' : role === 'cajero' ? 'Vender Tiquete' : 'Comprar Tiquetes'}
              </h3>
              <p className="text-caption md:text-body-sm text-slate-500 mt-0.5">
                {salida.origen} → {salida.destino} <span className="hidden sm:inline">· {salida.fecha} · Bus {salida.busNumero}</span>
              </p>
            </div>
            <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Stepper */}
          {!doneReserva && (
            <div className="flex bg-white border-b border-slate-200 z-10 shrink-0">
              {(['sillas', 'datos', 'pago'] as FlowStep[]).map((s, i) => (
                <div
                  key={s}
                  className={`flex-1 py-3 px-2 text-center text-caption md:text-body-sm font-semibold transition-colors ${
                    step === s
                      ? 'text-brand-600 border-b-2 border-brand-600 bg-brand-50'
                      : i < (['sillas', 'datos', 'pago'] as FlowStep[]).indexOf(step)
                      ? 'text-emerald-600'
                      : 'text-slate-400'
                  }`}
                >
                  <span className="md:hidden">{i + 1}. {s === 'sillas' ? 'Asientos' : s === 'datos' ? 'Datos' : 'Pago'}</span>
                  <span className="hidden md:inline">{i + 1}. {s === 'sillas' ? 'Selección de Asientos' : s === 'datos' ? 'Datos del Pasajero' : 'Confirmación y Pago'}</span>
                </div>
              ))}
            </div>
          )}

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 bg-slate-50 md:bg-white relative">
            <AnimatePresence mode="wait">
              {doneReserva ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center min-h-full py-4 space-y-6"
                >
                  <div className="flex items-center gap-3 text-emerald-600">
                    <CheckCircle className="w-8 h-8 md:w-10 md:h-10" />
                    <h3 className="text-heading-md md:text-heading-lg font-bold text-slate-900">
                      {editReserva ? '¡Actualizada!' : role === 'cliente' ? '¡Compra Exitosa!' : '¡Venta Exitosa!'}
                    </h3>
                  </div>
                  
                  {role === 'cliente' ? (
                    <div className="w-full max-w-sm">
                      <TicketCard reserva={doneReserva} salida={salida} />
                    </div>
                  ) : (
                    <div className="text-center bg-white p-6 rounded-radius-xl border border-slate-200 shadow-sm w-full max-w-sm">
                      <p className="text-caption text-slate-500 uppercase tracking-wide mb-1">Código de reserva</p>
                      <p className="font-mono text-heading-md font-bold text-slate-900 mb-4">{doneReserva.id}</p>
                      <div className="space-y-1.5 text-body-sm text-slate-600 border-t border-slate-100 pt-4 mb-6">
                        <p className="flex justify-between"><span>Pasajero:</span> <span className="font-semibold text-slate-900">{pasajero.nombre}</span></p>
                        <p className="flex justify-between"><span>Sillas:</span> <span className="font-semibold text-slate-900">{selectedSeats.join(', ')}</span></p>
                        <p className="flex justify-between font-bold text-slate-900 mt-2 pt-2 border-t border-slate-100">
                          <span>Total cobrado:</span> <span className="text-brand-600">${total.toLocaleString('es-CO')}</span>
                        </p>
                      </div>
                      <Button fullWidth leftIcon={<Printer className="w-4 h-4"/>}>Imprimir tiquete</Button>
                    </div>
                  )}

                  {role === 'cliente' && (
                    <Button onClick={onClose} size="lg" className="w-full max-w-sm">
                      Ir a mis viajes
                    </Button>
                  )}
                  {role === 'cajero' && (
                    <Button variant="outline" onClick={onClose} size="lg" className="w-full max-w-sm mt-2">
                      Cerrar
                    </Button>
                  )}
                </motion.div>
              ) : step === 'sillas' ? (
                <motion.div key="sillas" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <p className="text-body-sm text-slate-600 mb-4 font-medium hidden md:block">
                    Selecciona las sillas. Las sillas resaltadas al pasar el cursor son adyacentes.
                  </p>
                  <div className="bg-white md:bg-transparent rounded-radius-xl shadow-sm md:shadow-none p-2 md:p-0">
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
                  </div>
                </motion.div>
              ) : step === 'datos' ? (
                <motion.div key="datos" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-md mx-auto bg-white md:bg-transparent p-5 md:p-0 rounded-radius-2xl border border-slate-200 md:border-none shadow-sm md:shadow-none">
                  <h3 className="font-bold text-slate-900 mb-4 hidden md:block">Datos del pasajero principal</h3>
                  <PasajeroForm value={pasajero} onChange={setPasajero} />
                </motion.div>
              ) : (
                <motion.div key="pago" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-md mx-auto space-y-6">
                  {/* Order Summary */}
                  <div className="bg-white rounded-radius-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-900 p-4 text-white">
                      <h4 className="font-bold text-body-sm mb-1">Resumen</h4>
                      <p className="text-caption text-slate-400">{salida.origen} → {salida.destino}</p>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between text-body-sm">
                        <span className="text-slate-500">Pasajero</span>
                        <span className="font-semibold text-slate-800">{pasajero.nombre}</span>
                      </div>
                      <div className="flex justify-between text-body-sm">
                        <span className="text-slate-500">Asientos ({selectedSeats.length})</span>
                        <span className="font-semibold text-slate-800">{selectedSeats.sort().join(', ')}</span>
                      </div>
                      <div className="flex justify-between text-body-sm border-t border-slate-100 pt-3 mt-1">
                        <span className="font-bold text-slate-900">Total</span>
                        <span className="font-bold text-heading-sm text-brand-600">
                          ${total.toLocaleString('es-CO')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-white rounded-radius-2xl border border-slate-200 shadow-sm p-4">
                    <h4 className="font-bold text-slate-900 mb-4 text-body-sm">Método de pago</h4>
                    
                    {role === 'cajero' ? (
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'efectivo', label: 'Efectivo', icon: <Banknote className="w-5 h-5" /> },
                          { id: 'tarjeta', label: 'Tarjeta', icon: <CreditCard className="w-5 h-5" /> },
                        ].map(({ id, label, icon }) => (
                          <button
                            key={id}
                            onClick={() => setMetodoPago(id as 'efectivo' | 'tarjeta')}
                            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-radius-xl border-2 transition-all ${
                              metodoPago === id
                                ? 'border-brand-500 bg-brand-50 text-brand-700'
                                : 'border-slate-200 hover:border-slate-300 text-slate-600'
                            }`}
                          >
                            {icon}
                            <span className="font-semibold text-body-sm">{label}</span>
                            {metodoPago === id && <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-brand-600 hidden" />}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-brand-600 font-semibold mb-2">
                          <CreditCard className="w-5 h-5" /> Tarjeta de crédito/débito
                        </div>
                        <input type="text" placeholder="Número de tarjeta" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-radius-md text-slate-900 text-body-sm" defaultValue="**** **** **** 4242" />
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-radius-md text-slate-900 text-body-sm" defaultValue="12/28" />
                          <input type="text" placeholder="CVC" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-radius-md text-slate-900 text-body-sm" defaultValue="***" />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          {!doneReserva && (
            <div className="px-5 py-4 border-t border-slate-200 bg-white flex justify-between items-center z-10 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <Button variant="ghost" onClick={() => {
                if (step === 'sillas') onClose();
                else if (step === 'datos') setStep('sillas');
                else setStep('datos');
              }}>
                {step === 'sillas' ? 'Cancelar' : 'Atrás'}
              </Button>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline font-bold text-brand-600 text-body-md">
                  ${total.toLocaleString('es-CO')}
                </span>
                <Button 
                  disabled={!canNext} 
                  size="lg"
                  className="px-6 md:px-8"
                  onClick={() => {
                    if (step === 'sillas') setStep('datos');
                    else if (step === 'datos') setStep('pago');
                    else confirmar();
                  }}
                >
                  {step === 'pago' ? (editReserva ? 'Guardar Cambios' : role === 'cajero' ? 'Confirmar Venta' : 'Pagar Tiquetes') : 'Continuar'}
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
