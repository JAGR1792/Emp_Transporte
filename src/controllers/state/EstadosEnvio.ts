// src/controllers/state/EstadosEnvio.ts
// Patrón State: ciclo de vida del envío. Refleja states/estados_envio.py de SIGTVA.

import type { Envio, Receptor, ViajeCarga, EstadoEnvioLike } from '@/models/envio';

// Alias para mantener el nombre usado en el código.
type EstadoEnvio = EstadoEnvioLike;

// (EstadoEnvio se importa como type alias arriba)

export class TransicionNoPermitida extends Error {}
export class CapacidadExcedida extends Error {}
export class ViajeNoValido extends Error {}
export class IdentidadNoValida extends Error {}
export class PagoPendiente extends Error {}

const OPERACIONES: Record<string, string> = {
  despachar: 'despachar', descargar: 'descargar', entregar: 'entregar',
  revisarBodegaje: 'cobrar bodegaje de', registrarNovedad: 'registrar una novedad en',
  liberar: 'liberar', abrirReclamacion: 'abrir una reclamación sobre',
  resolverReclamacion: 'resolver la reclamación de',
};

export abstract class EstadoBase implements EstadoEnvio {
  static NOMBRE = '';
  static ADMITE_RECLAMACION = true;
  protected contexto: Envio | null = null;

  setContexto(envio: Envio): void { this.contexto = envio; }
  getContexto(): Envio | null { return this.contexto; }
  nombre(): string { return (this.constructor as unknown as { NOMBRE: string }).NOMBRE; }

  protected rechazar(op: string): never {
    const verbo = OPERACIONES[op];
    throw new TransicionNoPermitida(`No se puede ${verbo} un envío en estado «${this.nombre()}».`);
  }

  despachar(_viaje: ViajeCarga): void { this.rechazar('despachar'); }
  descargar(_terminal: string): void { this.rechazar('descargar'); }
  entregar(_receptor: Receptor): void { this.rechazar('entregar'); }
  revisarBodegaje(_fecha: Date): number { return 0; }
  registrarNovedad(_motivo: string): void { this.rechazar('registrarNovedad'); }
  liberar(): void { this.rechazar('liberar'); }
  abrirReclamacion(descripcion: string): void {
    if (!(this.constructor as unknown as { ADMITE_RECLAMACION: boolean }).ADMITE_RECLAMACION) {
      this.rechazar('abrirReclamacion');
    }
    this.contexto!.cambiarEstado(new EnReclamacion(this as EstadoBase), `PQR: ${descripcion}`);
  }
  resolverReclamacion(): void { this.rechazar('resolverReclamacion'); }
  operacionesPermitidas(): string[] {
    const permitidas: string[] = [];
    for (const op of Object.keys(OPERACIONES)) {
      if (op === 'abrirReclamacion') {
        if ((this.constructor as unknown as { ADMITE_RECLAMACION: boolean }).ADMITE_RECLAMACION) permitidas.push(op);
      } else if ((this as unknown as Record<string, unknown>)[op] !== (EstadoBase.prototype as unknown as Record<string, unknown>)[op]) {
        permitidas.push(op);
      }
    }
    return permitidas;
  }

  protected cargarEnViaje(viaje: ViajeCarga): void {
    const envio = this.contexto!;
    if (viaje.origen !== envio.terminalActual) {
      throw new ViajeNoValido(`El viaje #${viaje.idViaje} sale de ${viaje.origen}, pero el envío está en ${envio.terminalActual}.`);
    }
    const carga = viaje.pesoAsignado + envio.pesoFacturable;
    if (carga > viaje.capacidadCarga) {
      throw new CapacidadExcedida(`Con este envío el bus llevaría ${carga.toFixed(1)} kg y su capacidad de carga es ${viaje.capacidadCarga.toFixed(1)} kg. Reasigne a otro viaje.`);
    }
    viaje.pesoAsignado = carga;
    envio.idViaje = viaje.idViaje;
    envio.cambiarEstado(new EnTransito(), `viaje #${viaje.idViaje} ${viaje.origen} -> ${viaje.destino}`);
  }

  protected retener(motivo: string): void {
    this.contexto!.cambiarEstado(new Retenido(this as EstadoBase), `novedad: ${motivo}`);
  }
}

// --- Estados concretos ---
export class RecibidoEnOrigen extends EstadoBase {
  static NOMBRE = 'Recibido en Origen';
  despachar(viaje: ViajeCarga): void { this.cargarEnViaje(viaje); }
  registrarNovedad(motivo: string): void { this.retener(motivo); }
}

export class EnTransito extends EstadoBase {
  static NOMBRE = 'En Tránsito';
  descargar(terminal: string): void {
    const envio = this.contexto!;
    envio.terminalActual = terminal;
    if (terminal === envio.destino()) {
      envio.fechaDisponible = new Date();
      envio.cambiarEstado(new DisponibleEnDestino(), `llegó a ${terminal}`);
    } else {
      envio.cambiarEstado(new DescargadoEnConexion(), `trasbordo en ${terminal}`);
    }
  }
  registrarNovedad(motivo: string): void { this.retener(motivo); }
}

export class DescargadoEnConexion extends EstadoBase {
  static NOMBRE = 'Descargado en Conexión';
  despachar(viaje: ViajeCarga): void { this.cargarEnViaje(viaje); }
  registrarNovedad(motivo: string): void { this.retener(motivo); }
}

export class DisponibleEnDestino extends EstadoBase {
  static NOMBRE = 'Disponible en Destino';
  entregar(receptor: Receptor): void {
    const envio = this.contexto!;
    if (!receptor.documento) throw new IdentidadNoValida('Debe registrar el documento de quien retira.');
    if (receptor.esTercero) {
      if (!receptor.autorizacionFirmada) throw new IdentidadNoValida('El tercero no presenta autorización firmada.');
    } else if (envio.documentoDestinatario && receptor.documento !== envio.documentoDestinatario) {
      throw new IdentidadNoValida('El documento no coincide con el del destinatario de la guía.');
    }
    if (!receptor.firma) throw new IdentidadNoValida('Falta la firma de conformidad.');
    const saldo = envio.saldoPendiente();
    if ((receptor.pagoRecibido ?? 0) < saldo) throw new PagoPendiente(`Saldo pendiente de $${saldo.toLocaleString('es-CO')} (flete contra entrega + bodegaje). No se puede entregar sin el pago.`);
    envio.fletePendiente = 0;
    envio.cargoBodegaje = 0;
    envio.cambiarEstado(new Entregado(), `recibió ${receptor.documento}, pagó $${(receptor.pagoRecibido ?? 0).toLocaleString('es-CO')}`);
  }
  revisarBodegaje(fecha: Date): number {
    const envio = this.contexto!;
    const inicio = envio.fechaDisponible ?? fecha;
    const dias = Math.floor((fecha.getTime() - inicio.getTime()) / 86400000);
    envio.cargoBodegaje = Math.max(0, dias - 5) * 2000;
    if (dias >= 30) envio.cambiarEstado(new Abandonado(), `${dias} días sin ser reclamado`);
    return envio.cargoBodegaje;
  }
  registrarNovedad(motivo: string): void { this.retener(motivo); }
}

export class Entregado extends EstadoBase {
  static NOMBRE = 'Entregado';
  static ADMITE_RECLAMACION = true;
}

export class Retenido extends EstadoBase {
  static NOMBRE = 'Retenido';
  constructor(public estadoPrevio: EstadoBase) { super(); }
  liberar(): void {
    if (this.estadoPrevio.getContexto() === null) this.estadoPrevio.setContexto(this.getContexto()!);
    this.contexto!.cambiarEstado(this.estadoPrevio, 'novedad solucionada');
  }
}

export class EnReclamacion extends EstadoBase {
  static NOMBRE = 'En Reclamación';
  static ADMITE_RECLAMACION = false;
  constructor(public estadoPrevio: EstadoBase) { super(); }
  resolverReclamacion(): void {
    if (this.estadoPrevio.getContexto() === null) this.estadoPrevio.setContexto(this.getContexto()!);
    this.contexto!.cambiarEstado(this.estadoPrevio, 'PQR resuelta');
  }
}

export class Abandonado extends EstadoBase {
  static NOMBRE = 'Abandonado';
  static ADMITE_RECLAMACION = false;
}

// --- Reconstrucción desde la BD ---
const CLASES = [RecibidoEnOrigen, EnTransito, DescargadoEnConexion, DisponibleEnDestino,
  Entregado, Retenido, EnReclamacion, Abandonado];

const ALIAS: Record<string, new () => EstadoBase> = {
  Registrado: RecibidoEnOrigen, EnBodegaOrigen: RecibidoEnOrigen,
  'En Bodega': RecibidoEnOrigen, Recibido: RecibidoEnOrigen,
};

const POR_NOMBRE: Record<string, any> = {
  ...Object.fromEntries(CLASES.map((c) => [c.NOMBRE, c])),
  ...Object.fromEntries(CLASES.map((c) => [c.name, c])),
  ...ALIAS,
};

export const ESTADOS = CLASES.map((c) => c.NOMBRE);

export function claseDeEstado(nombre: string): new (prev?: EstadoBase) => EstadoBase {
  const c = POR_NOMBRE[nombre];
  if (!c) throw new Error(`Estado de envío desconocido: ${nombre}`);
  return c;
}

export function reconstruirEstado(nombre: string, historial: { anterior: string; nuevo: string }[] = []): EstadoBase {
  const clase = claseDeEstado(nombre);
  if (clase === Retenido || clase === EnReclamacion) {
    for (let i = historial.length - 1; i >= 0; i--) {
      const { anterior, nuevo } = historial[i];
      if (anterior && claseDeEstado(nuevo) === clase) {
        return new clase(reconstruirEstado(anterior, historial.slice(0, i)));
      }
    }
    return new clase(new RecibidoEnOrigen());
  }
  return new clase();
}
