// src/models/envio.ts
// Modelo de dominio del envío + Contexto del patrón State.
// Refleja domain/envio.py de SIGTVA, pero en TypeScript.

export interface Receptor {
  documento: string;
  esTercero?: boolean;
  autorizacionFirmada?: boolean;
  firma?: string;
  pagoRecibido?: number;
}

export interface ViajeCarga {
  idViaje: number;
  origen: string;
  destino: string;
  capacidadCarga: number;
  pesoAsignado: number;
}

export interface Ruta {
  origen: string;
  destino: string;
}

export interface Cambio {
  anterior: string;
  nuevo: string;
  detalle: string;
}

export interface EstadoEnvioLike {
  setContexto(envio: Envio): void;
  getContexto(): Envio | null;
  nombre(): string;
  despachar(viaje: ViajeCarga): void;
  descargar(terminal: string): void;
  entregar(receptor: Receptor): void;
  revisarBodegaje(fecha: Date): number;
  registrarNovedad(motivo: string): void;
  liberar(): void;
  abrirReclamacion(descripcion: string): void;
  resolverReclamacion(): void;
  operacionesPermitidas(): string[];
}

// Import estático diferido: EstadoEnvio se resuelve en runtime cuando se usa.
import { reconstruirEstado as _reconstruir } from '@/controllers/state/EstadosEnvio';

export class Envio {
  pesoFacturable = 0;
  valorDeclarado = 0;
  valorFlete = 0;
  tipoServicio = '';
  estado: string | EstadoEnvioLike = 'Registrado';
  terminalActual = '';
  fechaDisponible: Date | null = null;
  documentoDestinatario = '';
  fletePendiente = 0;
  cargoBodegaje = 0;
  idViaje: number | null = null;
  cambios: Cambio[] = [];

  ruta: Ruta | null = null;

  constructor(init: Partial<Envio> = {}) {
    Object.assign(this, init);
    if (this.ruta && !this.terminalActual) this.terminalActual = this.ruta.origen;
  }

  destino(): string { return this.ruta?.destino ?? ''; }

  saldoPendiente(): number { return this.fletePendiente + this.cargoBodegaje; }

  cambiarEstado(nuevo: EstadoEnvioLike, detalle = ''): void {
    const anterior = typeof this.estado === 'string' ? this.estado : this.estado.nombre();
    if (anterior !== nuevo.nombre()) {
      this.cambios.push({ anterior, nuevo: nuevo.nombre(), detalle });
    }
    this.estado = nuevo.nombre();
    nuevo.setContexto(this);
  }

  private estadoActual(): EstadoEnvioLike {
    if (typeof this.estado === 'string') {
      const e = _reconstruir(this.estado, this.cambios);
      e.setContexto(this);
      return e;
    }
    const e = this.estado as EstadoEnvioLike;
    if (!e.getContexto()) e.setContexto(this);
    return e;
  }

  despachar(viaje: ViajeCarga): void { this.estadoActual().despachar(viaje); }
  descargar(terminal: string): void { this.estadoActual().descargar(terminal); }
  entregar(receptor: Receptor): void { this.estadoActual().entregar(receptor); }
  revisarBodegaje(fecha: Date): number { return this.estadoActual().revisarBodegaje(fecha); }
  registrarNovedad(motivo: string): void { this.estadoActual().registrarNovedad(motivo); }
  liberar(): void { this.estadoActual().liberar(); }
  abrirReclamacion(descripcion: string): void { this.estadoActual().abrirReclamacion(descripcion); }
  resolverReclamacion(): void { this.estadoActual().resolverReclamacion(); }
  operacionesPermitidas(): string[] { return this.estadoActual().operacionesPermitidas(); }
}
