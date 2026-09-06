/**
 * SelectorSillas — Visual bus seat picker
 *
 * Bus layout (10 rows × 4 columns, 2+aisle+2):
 *   Col 1  Col 2 | AISLE | Col 3  Col 4
 *
 * Seat SVG looks like an actual bus/airline seat viewed from above.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, CheckCircle, Info } from 'lucide-react';
import type { SeatStatus } from '@/context/ReservasContext';

/* ─────────────────── Types ── */

export interface SeatInfo {
  id: string;
  row: string;
  col: number;
  status: SeatStatus;
}

export interface SelectorSillasProps {
  /** Full seat map: { "A1": "libre" | "ocupado" | "inhabilitado" } */
  seats: Record<string, SeatStatus>;
  /** Seats already selected (for edit mode pre-fill) */
  initialSelected?: string[];
  /** If true: no selection, just display */
  readOnly?: boolean;
  /** Called whenever the selection changes */
  onChange?: (selected: string[]) => void;
  /** Bus route info for the header */
  info?: {
    numero: string;
    origen: string;
    destino: string;
    horario: string;
    tarifa: number;
  };
}

/* ─────────────────── Seat SVG icon ── */

/**
 * Bus seat viewed from above:
 *  ┌──────┐   <- headrest
 *  │      │   <- back
 *  │      │
 *  └──────┘   <- front edge (slight curve)
 */
const SeatIcon = ({
  status,
  selected,
  hovered,
  seatId,
}: {
  status: SeatStatus;
  selected: boolean;
  hovered: boolean;
  seatId: string;
}) => {
  const colors: Record<string, { fill: string; stroke: string; headrest: string; text: string }> = {
    libre: {
      fill: selected ? '#f97316' : hovered ? '#fed7aa' : '#dcfce7',
      stroke: selected ? '#ea580c' : hovered ? '#f97316' : '#16a34a',
      headrest: selected ? '#ea580c' : hovered ? '#f97316' : '#15803d',
      text: selected ? '#fff' : '#15803d',
    },
    ocupado: {
      fill: '#fee2e2',
      stroke: '#dc2626',
      headrest: '#b91c1c',
      text: '#b91c1c',
    },
    reservado: {
      fill: '#fef3c7',
      stroke: '#d97706',
      headrest: '#b45309',
      text: '#92400e',
    },
    inhabilitado: {
      fill: '#f1f5f9',
      stroke: '#cbd5e1',
      headrest: '#94a3b8',
      text: '#94a3b8',
    },
  };

  const c = colors[status] ?? colors.inhabilitado;
  const label = seatId;

  return (
    <svg
      viewBox="0 0 36 44"
      width="36"
      height="44"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      {/* Headrest */}
      <rect
        x="4" y="1" width="28" height="9"
        rx="4"
        fill={c.headrest}
        opacity={status === 'inhabilitado' ? 0.5 : 1}
      />
      {/* Backrest */}
      <rect
        x="2" y="8" width="32" height="24"
        rx="3"
        fill={c.fill}
        stroke={c.stroke}
        strokeWidth="1.5"
        opacity={status === 'inhabilitado' ? 0.5 : 1}
      />
      {/* Seat cushion (bottom part) */}
      <rect
        x="4" y="30" width="28" height="12"
        rx="3"
        fill={c.fill}
        stroke={c.stroke}
        strokeWidth="1.5"
        opacity={status === 'inhabilitado' ? 0.5 : 1}
      />
      {/* Armrests */}
      <rect x="0" y="10" width="3" height="18" rx="1.5" fill={c.stroke} opacity={0.5} />
      <rect x="33" y="10" width="3" height="18" rx="1.5" fill={c.stroke} opacity={0.5} />
      {/* Seat label */}
      <text
        x="18" y="22"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="7.5"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
        fill={status === 'inhabilitado' ? '#94a3b8' : c.text}
      >
        {label}
      </text>
      {/* Checkmark for selected */}
      {selected && (
        <text x="18" y="35" textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#fff">
          ✓
        </text>
      )}
      {/* X for occupied */}
      {status === 'ocupado' && (
        <text x="18" y="35" textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#b91c1c">
          ✕
        </text>
      )}
    </svg>
  );
};

/* ─────────────────── Driver seat ── */
const DriverSeat = () => (
  <div className="flex flex-col items-center gap-1 opacity-60">
    <svg viewBox="0 0 36 44" width="32" height="40">
      <rect x="4" y="1" width="28" height="9" rx="4" fill="#334155" />
      <rect x="2" y="8" width="32" height="24" rx="3" fill="#475569" stroke="#334155" strokeWidth="1.5" />
      <rect x="4" y="30" width="28" height="12" rx="3" fill="#475569" stroke="#334155" strokeWidth="1.5" />
      <rect x="0" y="10" width="3" height="18" rx="1.5" fill="#334155" opacity={0.5} />
      <rect x="33" y="10" width="3" height="18" rx="1.5" fill="#334155" opacity={0.5} />
      <text x="18" y="22" textAnchor="middle" dominantBaseline="middle" fontSize="8" fontWeight="700" fontFamily="system-ui" fill="#cbd5e1">
        🚌
      </text>
    </svg>
    <span className="text-caption text-slate-400 font-medium leading-none">Chófer</span>
  </div>
);

/* ─────────────────── Legend ── */
const Legend = () => (
  <div className="flex flex-wrap items-center gap-4 text-caption">
    {[
      { color: 'bg-emerald-200 border border-green-500', label: 'Libre' },
      { color: 'bg-red-100 border border-red-500', label: 'Ocupado' },
      { color: 'bg-orange-400 border border-orange-600', label: 'Seleccionado' },
      { color: 'bg-slate-100 border border-slate-300', label: 'No disponible' },
    ].map(({ color, label }) => (
      <div key={label} className="flex items-center gap-1.5">
        <div className={`w-4 h-4 rounded ${color}`} />
        <span className="text-slate-500">{label}</span>
      </div>
    ))}
  </div>
);

/* ─────────────────── Main component ── */

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export default function SelectorSillas({
  seats,
  initialSelected = [],
  readOnly = false,
  onChange,
  info,
}: SelectorSillasProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected));
  const [hovered, setHovered] = useState<string | null>(null);

  const toggle = (id: string) => {
    if (readOnly) return;
    const status = seats[id];
    if (status === 'ocupado' || status === 'inhabilitado') return;

    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      onChange?.([...next]);
      return next;
    });
  };

  const libres = Object.values(seats).filter((s) => s === 'libre').length;
  const ocupados = Object.values(seats).filter((s) => s === 'ocupado').length;
  const total = Object.keys(seats).length;

  // Are two seats in the same row and adjacent columns?
  const adjacentHint = (id: string): boolean => {
    if (!hovered || hovered === id) return false;
    const hovRow = hovered[0];
    const hovCol = Number(hovered.slice(1));
    const curRow = id[0];
    const curCol = Number(id.slice(1));
    return hovRow === curRow && Math.abs(hovCol - curCol) === 1;
  };

  return (
    <div className="w-full select-none">
      {/* Bus info header */}
      {info && (
        <div className="bg-slate-900 text-white rounded-t-radius-xl px-5 py-3 flex items-center justify-between">
          <div>
            <p className="text-caption text-slate-400 font-medium">Bus {info.numero}</p>
            <p className="font-bold text-body-sm">
              {info.origen} → {info.destino}
            </p>
          </div>
          <div className="text-right">
            <p className="text-caption text-slate-400">{info.horario}</p>
            <p className="font-bold text-brand-400">
              ${info.tarifa.toLocaleString('es-CO')} / silla
            </p>
          </div>
        </div>
      )}

      {/* Bus body */}
      <div
        className={`bg-slate-50 border-2 border-slate-200 ${info ? '' : 'rounded-t-radius-xl'} rounded-b-radius-xl p-4 md:p-5 overflow-x-auto touch-pan-x snap-x`}
        style={{ background: 'linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%)' }}
      >
        <div className="min-w-[320px] md:min-w-[360px] mx-auto px-2 pb-4">
          {/* FRENTE label + steering wheel */}
        <div className="flex items-center justify-center mb-4">
          <div className="flex-1 border-t-2 border-dashed border-slate-300" />
          <div className="px-4 flex flex-col items-center gap-1">
            <span className="text-caption font-bold text-slate-400 tracking-widest uppercase">Frente</span>
            <div className="w-10 h-10 rounded-full border-4 border-slate-400 flex items-center justify-center bg-white">
              <div className="w-1 h-5 bg-slate-400 rounded absolute" style={{ transform: 'rotate(0deg)' }} />
              <div className="w-5 h-1 bg-slate-400 rounded absolute" />
              <span className="text-slate-400 text-xs">🔵</span>
            </div>
          </div>
          <div className="flex-1 border-t-2 border-dashed border-slate-300" />
        </div>

        {/* Driver row */}
        <div className="flex justify-start mb-3 pl-2">
          <DriverSeat />
        </div>

        {/* Seat grid */}
        <div className="flex flex-col gap-2 min-w-[300px]">
          {/* Column headers */}
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 shrink-0" /> {/* row label spacer */}
            <div className="w-9 text-center text-caption text-slate-400 font-bold">A</div>
            <div className="w-9 text-center text-caption text-slate-400 font-bold">B</div>
            <div className="w-6 shrink-0" /> {/* aisle */}
            <div className="w-9 text-center text-caption text-slate-400 font-bold">C</div>
            <div className="w-9 text-center text-caption text-slate-400 font-bold">D</div>
          </div>

          {ROWS.map((row) => (
            <div key={row} className="flex items-center gap-2">
              {/* Row number */}
              <div className="w-5 text-center text-caption text-slate-400 font-semibold shrink-0">
                {ROWS.indexOf(row) + 1}
              </div>

              {/* Left pair (col 1 & 2) */}
              {[1, 2].map((col) => {
                const id = `${row}${col}`;
                const status = seats[id] ?? 'libre';
                const isSel = selected.has(id);
                const isHov = hovered === id;
                const isAdj = adjacentHint(id);

                return (
                  <motion.button
                    key={id}
                    whileHover={!readOnly && status === 'libre' ? { scale: 1.1, y: -1 } : {}}
                    whileTap={!readOnly && status === 'libre' ? { scale: 0.95 } : {}}
                    onClick={() => toggle(id)}
                    onMouseEnter={() => setHovered(id)}
                    onMouseLeave={() => setHovered(null)}
                    disabled={readOnly || status === 'ocupado' || status === 'inhabilitado'}
                    title={
                      status === 'ocupado'
                        ? `Silla ${id} — Ocupada`
                        : status === 'inhabilitado'
                        ? `Silla ${id} — No disponible`
                        : `Silla ${id} — Libre`
                    }
                    className={`relative focus:outline-none ${
                      !readOnly && status === 'libre' ? 'cursor-pointer' : 'cursor-default'
                    } ${isAdj ? 'drop-shadow-lg' : ''}`}
                    style={{
                      filter: isAdj
                        ? 'drop-shadow(0 0 6px #f97316)'
                        : undefined,
                    }}
                  >
                    <SeatIcon
                      status={status}
                      selected={isSel}
                      hovered={isHov}
                      seatId={id}
                    />
                  </motion.button>
                );
              })}

              {/* Aisle */}
              <div className="w-6 shrink-0 flex flex-col items-center gap-0.5">
                <div className="w-px h-full bg-slate-200" />
              </div>

              {/* Right pair (col 3 & 4) */}
              {[3, 4].map((col) => {
                const id = `${row}${col}`;
                const status = seats[id] ?? 'libre';
                const isSel = selected.has(id);
                const isHov = hovered === id;
                const isAdj = adjacentHint(id);

                return (
                  <motion.button
                    key={id}
                    whileHover={!readOnly && status === 'libre' ? { scale: 1.1, y: -1 } : {}}
                    whileTap={!readOnly && status === 'libre' ? { scale: 0.95 } : {}}
                    onClick={() => toggle(id)}
                    onMouseEnter={() => setHovered(id)}
                    onMouseLeave={() => setHovered(null)}
                    disabled={readOnly || status === 'ocupado' || status === 'inhabilitado'}
                    title={
                      status === 'ocupado'
                        ? `Silla ${id} — Ocupada`
                        : `Silla ${id} — Libre`
                    }
                    className={`relative focus:outline-none ${
                      !readOnly && status === 'libre' ? 'cursor-pointer' : 'cursor-default'
                    }`}
                    style={{
                      filter: isAdj
                        ? 'drop-shadow(0 0 6px #f97316)'
                        : undefined,
                    }}
                  >
                    <SeatIcon
                      status={status}
                      selected={isSel}
                      hovered={isHov}
                      seatId={id}
                    />
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>

          {/* Parte trasera */}
          <div className="flex items-center mt-6">
            <div className="flex-1 border-t-2 border-dashed border-slate-300" />
            <span className="px-4 text-caption font-bold text-slate-400 tracking-widest uppercase">
              Parte trasera
            </span>
            <div className="flex-1 border-t-2 border-dashed border-slate-300" />
          </div>
        </div>
      </div>

      {/* Footer: legend + stats + selection summary */}
      <div className="mt-3 space-y-3">
        <Legend />

        {/* Occupancy bar */}
        <div className="bg-white rounded-radius-lg border border-slate-200 p-3 space-y-2">
          <div className="flex items-center justify-between text-caption">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              Ocupación del bus
            </span>
            <span className="font-bold text-slate-700">
              {ocupados}/{total} asientos
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 to-brand-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(ocupados / total) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <div className="flex gap-4 text-caption text-slate-400">
            <span className="text-emerald-600 font-semibold">{libres} libres</span>
            <span className="text-red-500 font-semibold">{ocupados} ocupados</span>
          </div>
        </div>

        {/* Selected summary */}
        <AnimatePresence>
          {selected.size > 0 && !readOnly && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="bg-brand-50 border border-brand-200 rounded-radius-lg p-3 flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-brand-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-bold text-brand-900">
                  {selected.size} silla{selected.size > 1 ? 's' : ''} seleccionada{selected.size > 1 ? 's' : ''}
                </p>
                <p className="text-caption text-brand-600 truncate">
                  {[...selected].sort().join(' · ')}
                </p>
              </div>
              {selected.size > 1 && (
                <div className="shrink-0 flex items-start gap-1 text-caption text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                  <Info className="w-3 h-3 mt-0.5 shrink-0" />
                  <span>
                    {areSameSection([...selected])
                      ? 'Mismo lado ✓'
                      : 'Lados distintos'}
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Utility: are all seats on the same side (cols 1-2 or cols 3-4)? */
function areSameSection(ids: string[]): boolean {
  const cols = ids.map((id) => Number(id.slice(1)));
  const allLeft = cols.every((c) => c <= 2);
  const allRight = cols.every((c) => c >= 3);
  return allLeft || allRight;
}
