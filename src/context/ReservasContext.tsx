/**
 * ReservasContext — Global in-memory store for buses, seats & reservations
 *
 * API stubs are marked with // [API] comments so they can be replaced
 * with real backend calls when ready (e.g. fetch('/api/buses'), etc.)
 */
import {
  createContext, useContext, useState, ReactNode, useCallback,
} from 'react';

/* ─────────────────────────────────── Types ── */

export type SeatStatus = 'libre' | 'ocupado' | 'reservado' | 'inhabilitado';

export interface Seat {
  id: string;      // "A1", "A2", ...
  row: string;     // "A"–"J"
  col: number;     // 1–4
  status: SeatStatus;
  reservaId?: string;
}

export interface Salida {
  id: string;
  busNumero: string;
  origen: string;
  destino: string;
  horario: string;
  duracion: string;
  tarifa: number;     // COP
  fecha: string;      // YYYY-MM-DD
  estado: 'Vendiendo' | 'Abordando' | 'Lleno' | 'Próximamente' | 'En ruta';
  seats: Record<string, SeatStatus>; // key: "A1" → status
}

export interface Pasajero {
  nombre: string;
  tipoDoc: 'CC' | 'CE' | 'PP' | 'TI';
  numDoc: string;
  telefono: string;
  email?: string;
}

export interface Reserva {
  id: string;
  salidaId: string;
  asientos: string[];       // ["A1", "A2"]
  pasajero: Pasajero;
  total: number;            // tarifa × asientos
  metodoPago: 'efectivo' | 'tarjeta';
  vendidoPor: 'cajero' | 'cliente';
  timestamp: string;        // ISO
  estado: 'confirmada' | 'cancelada';
}

/* ─────────────────────────────── Seed data ── */

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const COLS = [1, 2, 3, 4];

/** Generate a 40-seat map with some pre-occupied seats */
function makeSeatMap(ocupados: string[] = []): Record<string, SeatStatus> {
  const map: Record<string, SeatStatus> = {};
  for (const row of ROWS) {
    for (const col of COLS) {
      const id = `${row}${col}`;
      map[id] = ocupados.includes(id) ? 'ocupado' : 'libre';
    }
  }
  return map;
}

const SEED_SALIDAS: Salida[] = [
  {
    id: 'SAL-001',
    busNumero: '402',
    origen: 'Bogotá',
    destino: 'Medellín',
    horario: '14:30',
    duracion: '9h',
    tarifa: 85000,
    fecha: '2026-09-07',
    estado: 'Vendiendo',
    seats: makeSeatMap(['A1','A2','B3','B4','C1','C2','D1','D3','E2','E4','F1','F2','F3']),
  },
  {
    id: 'SAL-002',
    busNumero: '115',
    origen: 'Bogotá',
    destino: 'Cali',
    horario: '15:00',
    duracion: '10h',
    tarifa: 80000,
    fecha: '2026-09-07',
    estado: 'Abordando',
    seats: makeSeatMap(['A1','A2','A3','A4','B1','B2','B3','B4','C1','C2','C3','C4','D1','D2','D3','D4','E1','E2','E3','E4','F1','F2','F3','F4','G1','G2','G3','G4','H1','H2','H3','H4','I1','I2','I3','I4','J1','J2','J3']),
  },
  {
    id: 'SAL-003',
    busNumero: '208',
    origen: 'Bogotá',
    destino: 'Bucaramanga',
    horario: '15:45',
    duracion: '6h',
    tarifa: 95000,
    fecha: '2026-09-07',
    estado: 'Vendiendo',
    seats: makeSeatMap(['A1','B2','C3','D4','E1','F2']),
  },
  {
    id: 'SAL-004',
    busNumero: '310',
    origen: 'Bogotá',
    destino: 'Ibagué',
    horario: '16:30',
    duracion: '4h',
    tarifa: 45000,
    fecha: '2026-09-07',
    estado: 'Vendiendo',
    seats: makeSeatMap(['A1','A2','B1']),
  },
  {
    id: 'SAL-005',
    busNumero: '501',
    origen: 'Bogotá',
    destino: 'Pereira',
    horario: '18:00',
    duracion: '7h',
    tarifa: 70000,
    fecha: '2026-09-07',
    estado: 'Próximamente',
    seats: makeSeatMap([]),
  },
];

const SEED_RESERVAS: Reserva[] = [
  {
    id: 'TKT-4821',
    salidaId: 'SAL-001',
    asientos: ['A1', 'A2'],
    pasajero: { nombre: 'Carlos Rodríguez', tipoDoc: 'CC', numDoc: '12345678', telefono: '3001234567' },
    total: 170000,
    metodoPago: 'efectivo',
    vendidoPor: 'cajero',
    timestamp: '2026-09-07T14:12:00',
    estado: 'confirmada',
  },
  {
    id: 'TKT-4820',
    salidaId: 'SAL-002',
    asientos: ['B3', 'B4'],
    pasajero: { nombre: 'María López', tipoDoc: 'CC', numDoc: '98765432', telefono: '3109876543' },
    total: 160000,
    metodoPago: 'tarjeta',
    vendidoPor: 'cliente',
    timestamp: '2026-09-07T13:55:00',
    estado: 'confirmada',
  },
];

/* ──────────────────────────── Context ── */

interface ReservasContextType {
  salidas: Salida[];
  reservas: Reserva[];

  // [API] GET /api/salidas?fecha=&origen=&destino=
  getSalidas: (filtros?: { origen?: string; destino?: string }) => Salida[];

  // [API] GET /api/salidas/:id
  getSalida: (id: string) => Salida | undefined;

  // [API] POST /api/reservas
  crearReserva: (payload: Omit<Reserva, 'id' | 'timestamp' | 'estado'>) => Reserva;

  // [API] PATCH /api/reservas/:id { estado: 'cancelada' }
  cancelarReserva: (reservaId: string) => void;

  // [API] PATCH /api/reservas/:id { asientos, pasajero }
  editarReserva: (reservaId: string, asientos: string[], pasajero: Pasajero) => void;

  // Helper: get reservas for a specific salida
  getReservasPorSalida: (salidaId: string) => Reserva[];
  getReservasPorCliente: (email: string) => Reserva[];
}

const ReservasContext = createContext<ReservasContextType | undefined>(undefined);

let reservaCounter = 4819;

export const ReservasProvider = ({ children }: { children: ReactNode }) => {
  const [salidas, setSalidas] = useState<Salida[]>(SEED_SALIDAS);
  const [reservas, setReservas] = useState<Reserva[]>(SEED_RESERVAS);

  const getSalidas = useCallback(
    (filtros?: { origen?: string; destino?: string }) => {
      // [API] GET /api/salidas?origen=X&destino=Y
      return salidas.filter((s) => {
        if (filtros?.origen && s.origen !== filtros.origen) return false;
        if (filtros?.destino && s.destino !== filtros.destino) return false;
        return true;
      });
    },
    [salidas],
  );

  const getSalida = useCallback(
    (id: string) => salidas.find((s) => s.id === id),
    [salidas],
  );

  const crearReserva = useCallback(
    (payload: Omit<Reserva, 'id' | 'timestamp' | 'estado'>): Reserva => {
      // [API] POST /api/reservas → returns created reserva
      const nueva: Reserva = {
        ...payload,
        id: `TKT-${++reservaCounter}`,
        timestamp: new Date().toISOString(),
        estado: 'confirmada',
      };
      setReservas((prev) => [nueva, ...prev]);

      // Update seat status in the salida
      setSalidas((prev) =>
        prev.map((s) => {
          if (s.id !== payload.salidaId) return s;
          const newSeats = { ...s.seats };
          payload.asientos.forEach((a) => {
            newSeats[a] = 'ocupado';
          });
          const freeCount = Object.values(newSeats).filter((v) => v === 'libre').length;
          return {
            ...s,
            seats: newSeats,
            estado: freeCount === 0 ? 'Lleno' : s.estado,
          };
        }),
      );

      return nueva;
    },
    [],
  );

  const cancelarReserva = useCallback((reservaId: string) => {
    // [API] PATCH /api/reservas/:id { estado: 'cancelada' }
    setReservas((prev) =>
      prev.map((r) => (r.id === reservaId ? { ...r, estado: 'cancelada' } : r)),
    );

    // Free the seats
    const reserva = reservas.find((r) => r.id === reservaId);
    if (!reserva) return;
    setSalidas((prev) =>
      prev.map((s) => {
        if (s.id !== reserva.salidaId) return s;
        const newSeats = { ...s.seats };
        reserva.asientos.forEach((a) => {
          newSeats[a] = 'libre';
        });
        return { ...s, seats: newSeats, estado: 'Vendiendo' };
      }),
    );
  }, [reservas]);

  const editarReserva = useCallback(
    (reservaId: string, asientos: string[], pasajero: Pasajero) => {
      // [API] PATCH /api/reservas/:id
      const reserva = reservas.find((r) => r.id === reservaId);
      if (!reserva) return;

      // Free old seats, occupy new ones
      setSalidas((prev) =>
        prev.map((s) => {
          if (s.id !== reserva.salidaId) return s;
          const newSeats = { ...s.seats };
          reserva.asientos.forEach((a) => { newSeats[a] = 'libre'; });
          asientos.forEach((a) => { newSeats[a] = 'ocupado'; });
          return { ...s, seats: newSeats };
        }),
      );

      setReservas((prev) =>
        prev.map((r) =>
          r.id === reservaId
            ? { ...r, asientos, pasajero, total: asientos.length * r.total / r.asientos.length }
            : r,
        ),
      );
    },
    [reservas],
  );

  const getReservasPorSalida = useCallback(
    (salidaId: string) => reservas.filter((r) => r.salidaId === salidaId && r.estado === 'confirmada'),
    [reservas],
  );

  const getReservasPorCliente = useCallback(
    (email: string) => reservas.filter((r) => r.pasajero.email === email && r.estado === 'confirmada'),
    [reservas],
  );

  return (
    <ReservasContext.Provider value={{
      salidas, reservas,
      getSalidas, getSalida,
      crearReserva, cancelarReserva, editarReserva,
      getReservasPorSalida, getReservasPorCliente,
    }}>
      {children}
    </ReservasContext.Provider>
  );
};

export const useReservas = () => {
  const ctx = useContext(ReservasContext);
  if (!ctx) throw new Error('useReservas must be used within ReservasProvider');
  return ctx;
};

/** Utility: count libre/ocupado seats */
export function contarAsientos(seats: Record<string, SeatStatus>) {
  const values = Object.values(seats);
  return {
    libre: values.filter((v) => v === 'libre').length,
    ocupado: values.filter((v) => v === 'ocupado').length,
    total: values.length,
  };
}
