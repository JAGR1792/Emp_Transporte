import { QRCodeSVG } from 'qrcode.react';
import { Bus, Calendar, Clock, User, Hash } from 'lucide-react';
import type { Reserva, Salida } from '@/context/ReservasContext';

export const TicketCard = ({ reserva, salida }: { reserva: Reserva; salida: Salida }) => {
  return (
    <div className="bg-white rounded-radius-2xl border border-slate-200 shadow-shadow-md overflow-hidden w-full max-w-sm font-sans mx-auto flex flex-col relative">
      {/* Decorative top edge */}
      <div className="h-2 bg-brand-600 w-full" />
      
      {/* Header */}
      <div className="p-5 border-b border-dashed border-slate-300 relative bg-slate-50">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2 text-brand-600">
            <Bus className="w-5 h-5" />
            <span className="font-bold text-body-sm tracking-wide">EMP TRANSPORTE</span>
          </div>
          <span className="text-caption font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded-radius-md text-slate-500">
            TKT
          </span>
        </div>
        
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-heading-sm font-black text-slate-900">{salida.origen.toUpperCase()}</h2>
          <Bus className="w-4 h-4 text-slate-300" />
          <h2 className="text-heading-sm font-black text-slate-900">{salida.destino.toUpperCase()}</h2>
        </div>
        <div className="flex justify-between text-caption font-medium text-slate-500">
          <span>ORIGEN</span>
          <span>DESTINO</span>
        </div>
        
        {/* Cutout circles */}
        <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-slate-900 rounded-full border-t border-r border-slate-200" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 50%, 50% 50%)' }} />
        <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-slate-900 rounded-full border-t border-l border-slate-200" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 50%, 0 50%)' }} />
      </div>

      {/* Body details */}
      <div className="p-5 grid grid-cols-2 gap-y-4 gap-x-2 relative bg-white">
        <div>
          <p className="text-caption text-slate-400 font-semibold mb-0.5 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> FECHA
          </p>
          <p className="font-bold text-slate-900 text-body-sm">{salida.fecha}</p>
        </div>
        <div>
          <p className="text-caption text-slate-400 font-semibold mb-0.5 flex items-center gap-1">
            <Clock className="w-3 h-3" /> HORA
          </p>
          <p className="font-bold text-slate-900 text-body-sm">{salida.horario}</p>
        </div>
        
        <div>
          <p className="text-caption text-slate-400 font-semibold mb-0.5 flex items-center gap-1">
            <User className="w-3 h-3" /> PASAJERO
          </p>
          <p className="font-bold text-slate-900 text-body-sm truncate" title={reserva.pasajero.nombre}>
            {reserva.pasajero.nombre}
          </p>
        </div>
        <div>
          <p className="text-caption text-slate-400 font-semibold mb-0.5 flex items-center gap-1">
            <Hash className="w-3 h-3" /> DOC
          </p>
          <p className="font-bold text-slate-900 text-body-sm truncate">
            {reserva.pasajero.tipoDoc} {reserva.pasajero.numDoc}
          </p>
        </div>
        
        <div className="col-span-2 mt-2 p-3 bg-slate-50 border border-slate-200 rounded-radius-lg flex justify-between items-center">
          <div>
            <p className="text-caption text-slate-400 font-semibold mb-0.5">BUS</p>
            <p className="font-black text-slate-900 text-body-md">{salida.busNumero}</p>
          </div>
          <div className="h-8 w-px bg-slate-300" />
          <div className="text-right">
            <p className="text-caption text-slate-400 font-semibold mb-0.5">ASIENTOS</p>
            <p className="font-black text-brand-600 text-body-md">{reserva.asientos.sort().join(', ')}</p>
          </div>
        </div>
      </div>
      
      {/* Footer / QR */}
      <div className="p-5 bg-slate-50 border-t border-dashed border-slate-300 flex items-center justify-between">
        <div>
          <p className="text-caption text-slate-500 font-medium mb-1">CÓDIGO DE RESERVA</p>
          <p className="font-mono font-bold text-slate-900 tracking-wider">{reserva.id}</p>
          <p className="text-caption text-slate-400 mt-2 font-medium">TOTAL PAGO: <span className="text-slate-700">${reserva.total.toLocaleString('es-CO')}</span></p>
        </div>
        <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
          <QRCodeSVG value={reserva.id} size={64} level="M" />
        </div>
      </div>
    </div>
  );
};
