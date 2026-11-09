"""
Objetos de dominio del proceso «Registro de envío».

Son las clases que el patrón Abstract Factory produce y ensambla; no tienen
nada que ver con las tablas de SQLAlchemy (esas viven en /models).
"""
import datetime
import logging
import re
from dataclasses import dataclass, field
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from mementos.recuerdos import InstantaneaEnvio
    from states.estados_envio import EstadoEnvio

logger = logging.getLogger("sigtva.state")

# cm³ por kg. Equivale a 400 kg/m³, referencia habitual del transporte terrestre de carga.
FACTOR_VOLUMETRICO = 2500


def calcularPesoFacturable(peso: float, dims: str) -> float:
    """Regla del diseño: el peso facturable es máx(peso real, peso volumétrico).

    dims llega como "LargoxAnchoxAlto" en centímetros, por ejemplo "30x30x30".
    """
    try:
        largo, ancho, alto = (float(x) for x in re.split(r"[xX*, ]+", dims.strip()))
    except (ValueError, AttributeError):
        raise ValueError("Dimensiones inválidas. Use el formato LargoxAnchoxAlto en cm (ej. 30x30x30).")
    if min(largo, ancho, alto) <= 0:
        raise ValueError("Las dimensiones deben ser mayores que cero.")
    volumetrico = (largo * ancho * alto) / FACTOR_VOLUMETRICO
    return round(max(peso, volumetrico), 2)


@dataclass
class Guia:
    numero: str
    codigoBarras: str


@dataclass
class Ruta:
    origen: str
    destino: str


@dataclass
class Cliente:
    documento: str


# ── Objetos de apoyo del patrón State (datos que reciben las operaciones) ──
@dataclass
class ViajeCarga:
    """Viaje al que se quiere subir el envío, con la carga que ya lleva el bus."""
    idViaje: int
    origen: str
    destino: str
    capacidadCarga: float
    pesoAsignado: float = 0.0


@dataclass
class Receptor:
    """Quien retira el envío en la terminal de destino."""
    documento: str
    nombre: str = ""
    esTercero: bool = False
    autorizacionFirmada: bool = False
    firma: str = ""
    pagoRecibido: float = 0.0


@dataclass
class CambioEstado:
    """Un cambio de estado pendiente de guardar en Historial y de notificar (RF-04)."""
    anterior: str
    nuevo: str
    detalle: str = ""
    fecha: datetime.datetime = field(
        default_factory=lambda: datetime.datetime.now(tz=datetime.UTC))


@dataclass
class Envio:
    """Producto final, Originador del patrón Memento y Contexto del patrón State.

    La guía es composición: nace y muere con el envío. Como originador,
    captura su propio estado con crearRecuerdo() y lo restaura con
    restaurar() sin exponer sus campos.

    Como contexto de State guarda su estado actual (estadoActual) y le
    delega todas las operaciones del ciclo de vida; el campo «estado» es
    solo el nombre de ese estado, el que se guarda en la base de datos.
    """
    pesoFacturable: float = 0.0
    valorDeclarado: float = 0.0
    valorFlete: float = 0.0
    tipoServicio: str = ""
    estado: str = "Recibido en Origen"   # estado inicial del patrón State
    guia: Guia | None = None
    ruta: Ruta | None = None
    cliente: Cliente | None = None
    # ── datos del seguimiento (patrón State) ──
    documentoDestinatario: str = ""
    terminalActual: str = ""
    formaPago: str = "Contado"
    fletePendiente: float = 0.0
    cargoBodegaje: float = 0.0
    fechaDisponible: datetime.datetime | None = None
    idViaje: int | None = None
    cambios: list[CambioEstado] = field(default_factory=list, repr=False)
    _estadoActual: "EstadoEnvio | None" = field(default=None, init=False, repr=False, compare=False)

    # ═══════════════════ Contexto del patrón State ═══════════════════
    @property
    def estadoActual(self) -> "EstadoEnvio":
        """Objeto de estado actual. Si el nombre guardado cambió por fuera
        (por ejemplo, al restaurar un Memento), se reconstruye desde el nombre."""
        from states.estados_envio import reconstruirEstado

        if self._estadoActual is None or self._estadoActual.nombre() != self.estado:
            self._estadoActual = reconstruirEstado(self.estado)
            self._estadoActual.setContexto(self)
            self.estado = self._estadoActual.nombre()
        return self._estadoActual

    def usarEstado(self, estado: "EstadoEnvio") -> None:
        """Fija el estado sin registrar un cambio (al cargar el envío desde la BD)."""
        estado.setContexto(self)
        self._estadoActual = estado
        self.estado = estado.nombre()

    def cambiarEstado(self, estado: "EstadoEnvio", detalle: str = "") -> None:
        """Único punto por donde pasa cada transición: cambia la referencia y
        deja el cambio pendiente para Historial y Notificación (RF-04)."""
        anterior = self.estado
        self.usarEstado(estado)
        self.cambios.append(CambioEstado(anterior, self.estado, detalle))
        numero = self.guia.numero if self.guia else "s/n"
        logger.info("[State] %s: %s -> %s %s", numero, anterior, self.estado,
                    f"({detalle})" if detalle else "")

    # Operaciones del ciclo de vida: el envío no decide nada, solo delega.
    def despachar(self, viaje: ViajeCarga) -> None:
        self.estadoActual.despachar(viaje)

    def descargar(self, terminal: str) -> None:
        self.estadoActual.descargar(terminal)

    def entregar(self, receptor: Receptor) -> None:
        self.estadoActual.entregar(receptor)

    def revisarBodegaje(self, fecha: datetime.datetime) -> float:
        return self.estadoActual.revisarBodegaje(fecha)

    def registrarNovedad(self, motivo: str) -> None:
        self.estadoActual.registrarNovedad(motivo)

    def liberar(self) -> None:
        self.estadoActual.liberar()

    def abrirReclamacion(self, descripcion: str) -> None:
        self.estadoActual.abrirReclamacion(descripcion)

    def resolverReclamacion(self) -> None:
        self.estadoActual.resolverReclamacion()

    def operacionesPermitidas(self) -> list[str]:
        return self.estadoActual.operacionesPermitidas()

    def saldoPendiente(self) -> float:
        """Lo que hay que cobrar antes de entregar: flete contra entrega + bodegaje."""
        return round(self.fletePendiente + self.cargoBodegaje, 2)

    def destino(self) -> str:
        return self.ruta.destino if self.ruta else ""

    def crearRecuerdo(self) -> "InstantaneaEnvio":
        """Captura estado, peso, valor y tipo de servicio en una instantánea."""
        from mementos.recuerdos import InstantaneaEnvio

        return InstantaneaEnvio(self.estado, self.pesoFacturable,
                                self.valorDeclarado, self.tipoServicio)

    def restaurar(self, r: "InstantaneaEnvio") -> None:
        """Repone los campos capturados en la instantánea."""
        self.estado = r.obtenerEstado()
        self.pesoFacturable = r.obtenerPesoFacturable()
        self.valorDeclarado = r.obtenerValorDeclarado()
        self.tipoServicio = r.obtenerTipoServicio()
