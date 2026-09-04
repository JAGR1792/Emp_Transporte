import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Printer, Users, Box, ArrowRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui';

const SALIDAS = [
  { dest: 'Medellín', time: '14:30', bus: '402', pax: '35/40', status: 'Abordando', libre: 5 },
  { dest: 'Cali', time: '15:00', bus: '115', pax: '40/40', status: 'Lleno', libre: 0 },
  { dest: 'Bucaramanga', time: '15:45', bus: '208', pax: '12/40', status: 'Vendiendo', libre: 28 },
  { dest: 'Ibagué', time: '16:30', bus: '310', pax: '8/40', status: 'Vendiendo', libre: 32 },
  { dest: 'Pereira', time: '18:00', bus: '501', pax: '0/40', status: 'Próximamente', libre: 40 },
];

const ENCOMIENDAS = [
  { guia: 'ENV-10291', dest: 'Medellín', remitente: 'Juan Pérez', peso: '2.4 kg', bus: '402 14:30', estado: 'Pendiente despacho' },
  { guia: 'ENV-10284', dest: 'Cali', remitente: 'María L.', peso: '1.1 kg', bus: '115 15:00', estado: 'Pendiente despacho' },
  { guia: 'ENV-10271', dest: 'Medellín', remitente: 'Almacén XYZ', peso: '5.8 kg', bus: '402 14:30', estado: 'Pendiente despacho' },
];

const TRANSACCIONES = [
  { id: 'TKT-4821', tipo: 'Tiquete', desc: 'Bogotá → Medellín / Bus 402', valor: 85000, hora: '14:12' },
  { id: 'TKT-4820', tipo: 'Tiquete', desc: 'Bogotá → Cali / Bus 115', valor: 72000, hora: '13:55' },
  { id: 'ENV-10291', tipo: 'Encomienda', desc: '2.4 kg → Medellín', valor: 18500, hora: '13:40' },
  { id: 'TKT-4819', tipo: 'Tiquete', desc: 'Bogotá → Bucaramanga / Bus 208', valor: 95000, hora: '13:28' },
  { id: 'ENV-10284', tipo: 'Encomienda', desc: '1.1 kg → Cali', valor: 12000, hora: '13:10' },
];

const totalTurno = TRANSACCIONES.reduce((a, t) => a + t.valor, 0);

const statusColor: Record<string, string> = {
  Abordando: 'bg-amber-100 text-amber-700',
  Lleno: 'bg-red-100 text-red-700',
  Vendiendo: 'bg-emerald-100 text-emerald-700',
  Próximamente: 'bg-slate-100 text-slate-500',
};

export const OperarioDashboard = () => {
  const [cierrePedido, setCierrePedido] = useState(false);
  const [cierreDone, setCierreDone] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-heading-md font-bold text-slate-900">Portal Operativo</h2>
        <p className="text-body-sm text-slate-500">Terminal Bogotá — Turno activo desde las 12:00 PM</p>
      </div>

      {/* Resumen de turno */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Ventas Tiquetes', value: '$1.240.000', icon: <Users className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-100' },
          { title: 'Ventas Encomiendas', value: '$850.000', icon: <Box className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { title: 'Total Turno', value: `$${totalTurno.toLocaleString('es-CO')}`, icon: <DollarSign className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-100' },
          { title: 'Transacciones', value: String(TRANSACCIONES.length), icon: <CheckCircle className="w-5 h-5" />, color: 'text-brand-600', bg: 'bg-brand-100' },
        ].map((s, i) => (
          <motion.div
            key={s.title}
            className="bg-white rounded-radius-xl p-5 border border-slate-200 shadow-shadow-sm"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
          >
            <div className={`w-9 h-9 ${s.bg} ${s.color} rounded-radius-lg flex items-center justify-center mb-3`}>{s.icon}</div>
            <p className="text-caption font-medium text-slate-500 mb-1">{s.title}</p>
            <p className="text-heading-sm font-bold text-slate-900">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Acciones principales */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <Users className="w-6 h-6 text-brand-600" />, label: 'Vender Tiquete', sub: 'Consulta y reserva', bg: 'bg-brand-50 border-brand-100 hover:bg-brand-100 hover:border-brand-200' },
          { icon: <Box className="w-6 h-6 text-emerald-600" />, label: 'Recibir Encomienda', sub: 'Registrar envío', bg: 'bg-emerald-50 border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200' },
          { icon: <Printer className="w-6 h-6 text-slate-600" />, label: 'Cierre de Turno', sub: 'Imprimir reporte', bg: 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300' },
        ].map(a => (
          <button
            key={a.label}
            onClick={() => a.label === 'Cierre de Turno' && setCierrePedido(true)}
            className={`p-5 ${a.bg} border rounded-radius-xl flex flex-col items-center text-center transition-colors group`}
          >
            <div className="w-12 h-12 bg-white rounded-full shadow-shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">{a.icon}</div>
            <p className="font-bold text-slate-900 text-body-sm">{a.label}</p>
            <p className="text-caption text-slate-500">{a.sub}</p>
          </button>
        ))}
      </div>

      {/* Cierre modal simple */}
      {cierrePedido && !cierreDone && (
        <motion.div
          className="bg-amber-50 border-2 border-amber-200 rounded-radius-2xl p-6"
          initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-900">Confirmar cierre de turno</h3>
              <p className="text-body-sm text-amber-800 mt-1">Se generará un reporte con {TRANSACCIONES.length} transacciones por un total de <strong>${totalTurno.toLocaleString('es-CO')}</strong>.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => setCierrePedido(false)}>Cancelar</Button>
            <Button size="sm" leftIcon={<Printer className="w-4 h-4" />} onClick={() => { setCierreDone(true); setCierrePedido(false); }}>Confirmar y cerrar turno</Button>
          </div>
        </motion.div>
      )}
      {cierreDone && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-radius-xl p-4 flex items-center gap-3 text-emerald-800">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p className="font-semibold text-body-sm">Turno cerrado exitosamente. Reporte generado e impreso.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas salidas */}
        <motion.div
          className="bg-white rounded-radius-2xl border border-slate-200 shadow-shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        >
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Próximas Salidas</h3>
            <span className="text-caption text-slate-400">Terminal Bogotá</span>
          </div>
          <div className="divide-y divide-slate-50">
            {SALIDAS.map((v) => (
              <div key={v.dest + v.time} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-bold text-slate-900 text-body-sm">{v.dest}</p>
                  <p className="text-caption text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" />{v.time} · Bus {v.bus}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-caption text-slate-600 font-medium">{v.pax} pax</p>
                  <span className={`px-2 py-0.5 rounded-full text-caption font-semibold ${statusColor[v.status]}`}>{v.status}</span>
                  {v.status === 'Vendiendo' && (
                    <button className="text-caption font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-0.5">
                      Vender <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Panel derecho: encomiendas + transacciones */}
        <div className="space-y-5">
          {/* Encomiendas pendientes */}
          <motion.div
            className="bg-white rounded-radius-2xl border border-slate-200 shadow-shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          >
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900">Encomiendas pendientes de despacho</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {ENCOMIENDAS.map((e) => (
                <div key={e.guia} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="font-bold text-slate-900 text-body-sm">{e.guia}</p>
                    <p className="text-caption text-slate-500">{e.remitente} · {e.peso} · {e.bus}</p>
                  </div>
                  <button className="text-caption font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5">
                    Despachar <CheckCircle className="w-3 h-3 ml-0.5" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Historial de turno */}
          <motion.div
            className="bg-white rounded-radius-2xl border border-slate-200 shadow-shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          >
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Transacciones del turno</h3>
              <span className="text-caption font-semibold text-emerald-600">${totalTurno.toLocaleString('es-CO')}</span>
            </div>
            <div className="divide-y divide-slate-50 max-h-52 overflow-y-auto">
              {TRANSACCIONES.map((t) => (
                <div key={t.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 text-body-sm">{t.id}</p>
                    <p className="text-caption text-slate-500">{t.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800 text-body-sm">${t.valor.toLocaleString('es-CO')}</p>
                    <p className="text-caption text-slate-400">{t.hora}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
