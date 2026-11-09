"""
PATRÓN: STATE
PROCESO: Seguimiento y cambios de estado del envío (RF M4 a M9)

Roles del patrón
  Contexto ............. Envio (en domain)  -> guarda su estado actual y le delega
  Estado (interfaz) .... EstadoEnvio        -> declara las operaciones del ciclo de vida
  Estado base .......... EstadoBase         -> comportamiento por defecto: rechazar
  Estados concretos .... RecibidoEnOrigen, EnTransito, DescargadoEnConexion,
                         DisponibleEnDestino, Entregado, Retenido,
                         EnReclamacion, Abandonado
  Cliente .............. ProcesoSeguimientoEnvio (en services)

Por qué State: lo que se puede hacer con un envío depende de su estado
(solo se despacha en origen o en una conexión, solo se entrega en destino,
el bodegaje solo corre en destino, una PQR bloquea la guía...). Cada
estado es una clase que sabe qué operaciones acepta, qué regla revisa y a
qué estado pasa; así no hay if/elif sobre el campo estado en ningún lado.
"""
from __future__ import annotations

import datetime
import logging
from abc import ABC, abstractmethod
from collections.abc import Iterable
from typing import TYPE_CHECKING, ClassVar

if TYPE_CHECKING:
    from domain.envio import Envio, Receptor, ViajeCarga

logger = logging.getLogger("sigtva.state")

DIAS_BODEGAJE_GRATIS = 5          # los primeros 5 días no se cobran
DIAS_ABANDONO = 30                # al día 30 se declara el abandono
TARIFA_BODEGAJE_DIA = 2000.0      # valor de referencia por día (configurable)

# Nombre de cada operación tal como se muestra en los mensajes de rechazo.
OPERACIONES: dict[str, str] = {
    "despachar": "despachar",
    "descargar": "descargar",
    "entregar": "entregar",
    "revisarBodegaje": "cobrar bodegaje de",
    "registrarNovedad": "registrar una novedad en",
    "liberar": "liberar",
    "abrirReclamacion": "abrir una reclamación sobre",
    "resolverReclamacion": "resolver la reclamación de",
}


# ═══════════════════════ EXCEPCIONES DEL PROCESO ═══════════════════════
# Heredan de ValueError para que las rutas de Flask las muestren como los
# demás errores de negocio del proyecto.
class TransicionNoPermitida(ValueError):
    """La operación no existe para el estado actual del envío."""


class CapacidadExcedida(ValueError):
    """RF-03: la carga del viaje superaría la capacidad del bus."""


class ViajeNoValido(ValueError):
    """El viaje no sale de la terminal donde está el envío."""


class IdentidadNoValida(ValueError):
    """Quien retira no es el destinatario ni un tercero autorizado."""


class PagoPendiente(ValueError):
    """Falta pagar el flete contra entrega o el bodegaje."""


# ═══════════════════════ ESTADO (interfaz) ═══════════════════════
class EstadoEnvio(ABC):
    """Estado (interfaz): todas las operaciones que cambian según el estado."""

    @abstractmethod
    def setContexto(self, envio: Envio) -> None: ...

    @abstractmethod
    def despachar(self, viaje: ViajeCarga) -> None: ...

    @abstractmethod
    def descargar(self, terminal: str) -> None: ...

    @abstractmethod
    def entregar(self, receptor: Receptor) -> None: ...

    @abstractmethod
    def revisarBodegaje(self, fecha: datetime.datetime) -> float: ...

    @abstractmethod
    def registrarNovedad(self, motivo: str) -> None: ...

    @abstractmethod
    def liberar(self) -> None: ...

    @abstractmethod
    def abrirReclamacion(self, descripcion: str) -> None: ...

    @abstractmethod
    def resolverReclamacion(self) -> None: ...

    @abstractmethod
    def nombre(self) -> str: ...

    @abstractmethod
    def operacionesPermitidas(self) -> list[str]: ...


# ═══════════════════════ ESTADO BASE ═══════════════════════
class EstadoBase(EstadoEnvio):
    """Guarda el contexto y define el comportamiento por defecto:
    rechazar con TransicionNoPermitida. Excepciones a la regla:
      - abrirReclamacion se permite por defecto (una PQR se abre en cualquier
        momento, incluso después de entregado), salvo si ADMITE_RECLAMACION es False.
      - revisarBodegaje no hace nada por defecto (el bodegaje solo corre en destino).
    Cada estado concreto sobrescribe solo las operaciones que sí acepta.
    """
    NOMBRE: ClassVar[str] = ""
    ADMITE_RECLAMACION: ClassVar[bool] = True

    def __init__(self) -> None:
        self.contexto: Envio | None = None

    def setContexto(self, envio: Envio) -> None:
        self.contexto = envio

    def nombre(self) -> str:
        return self.NOMBRE

    # ── comportamiento por defecto ──
    def _rechazar(self, operacion: str) -> None:
        verbo = OPERACIONES[operacion]
        mensaje = f"No se puede {verbo} un envío en estado «{self.nombre()}»."
        logger.info("[State] Rechazado por %s: %s", type(self).__name__, mensaje)
        raise TransicionNoPermitida(mensaje)

    def despachar(self, viaje: ViajeCarga) -> None:
        self._rechazar("despachar")

    def descargar(self, terminal: str) -> None:
        self._rechazar("descargar")

    def entregar(self, receptor: Receptor) -> None:
        self._rechazar("entregar")

    def revisarBodegaje(self, fecha: datetime.datetime) -> float:
        return 0.0

    def registrarNovedad(self, motivo: str) -> None:
        self._rechazar("registrarNovedad")

    def liberar(self) -> None:
        self._rechazar("liberar")

    def abrirReclamacion(self, descripcion: str) -> None:
        if not self.ADMITE_RECLAMACION:
            self._rechazar("abrirReclamacion")
        self.contexto.cambiarEstado(EnReclamacion(self), f"PQR: {descripcion}")

    def resolverReclamacion(self) -> None:
        self._rechazar("resolverReclamacion")

    def operacionesPermitidas(self) -> list[str]:
        """Operaciones que este estado sobrescribe (las que sí acepta)."""
        permitidas = []
        for op in OPERACIONES:
            if op == "abrirReclamacion":
                if self.ADMITE_RECLAMACION:
                    permitidas.append(op)
            elif getattr(type(self), op) is not getattr(EstadoBase, op):
                permitidas.append(op)
        return permitidas

    # ── ayudas compartidas por varios estados concretos ──
    def _cargarEnViaje(self, viaje: ViajeCarga) -> None:
        """RF-03: el peso total del viaje no puede superar la capacidad del bus."""
        envio = self.contexto
        if viaje.origen != envio.terminalActual:
            raise ViajeNoValido(
                f"El viaje #{viaje.idViaje} sale de {viaje.origen}, pero el envío "
                f"está en {envio.terminalActual}.")
        carga = viaje.pesoAsignado + envio.pesoFacturable
        if carga > viaje.capacidadCarga:
            logger.info("[State] RF-03: %.1f kg superan la capacidad de %.1f kg",
                        carga, viaje.capacidadCarga)
            raise CapacidadExcedida(
                f"Con este envío el bus llevaría {carga:,.1f} kg y su capacidad "
                f"de carga es {viaje.capacidadCarga:,.1f} kg. Reasigne a otro viaje.")
        logger.info("[State] RF-03: %.1f kg de %.1f kg — se agrega a la planilla de carga",
                    carga, viaje.capacidadCarga)
        viaje.pesoAsignado = carga
        envio.idViaje = viaje.idViaje
        envio.cambiarEstado(
            EnTransito(), f"viaje #{viaje.idViaje} {viaje.origen} -> {viaje.destino}")

    def _retener(self, motivo: str) -> None:
        self.contexto.cambiarEstado(Retenido(self), f"novedad: {motivo}")


# ═══════════════════════ ESTADOS CONCRETOS ═══════════════════════
class RecibidoEnOrigen(EstadoBase):
    """El envío está en la bodega de la terminal de origen."""
    NOMBRE = "Recibido en Origen"

    def despachar(self, viaje: ViajeCarga) -> None:
        self._cargarEnViaje(viaje)

    def registrarNovedad(self, motivo: str) -> None:
        self._retener(motivo)


class EnTransito(EstadoBase):
    """El envío va en el bus; solo se puede descargar en una terminal."""
    NOMBRE = "En Tránsito"

    def descargar(self, terminal: str) -> None:
        envio = self.contexto
        envio.terminalActual = terminal
        if terminal == envio.destino():
            envio.fechaDisponible = datetime.datetime.now(tz=datetime.UTC)
            envio.cambiarEstado(DisponibleEnDestino(), f"llegó a {terminal}")
        else:
            # Trasbordo: el escaneo en la conexión es obligatorio para seguir.
            envio.cambiarEstado(DescargadoEnConexion(), f"trasbordo en {terminal}")

    def registrarNovedad(self, motivo: str) -> None:
        self._retener(motivo)


class DescargadoEnConexion(EstadoBase):
    """Trasbordo: el envío espera en una terminal intermedia el siguiente bus."""
    NOMBRE = "Descargado en Conexión"

    def despachar(self, viaje: ViajeCarga) -> None:
        self._cargarEnViaje(viaje)

    def registrarNovedad(self, motivo: str) -> None:
        self._retener(motivo)


class DisponibleEnDestino(EstadoBase):
    """El envío está en la bodega de destino esperando al destinatario."""
    NOMBRE = "Disponible en Destino"

    def entregar(self, receptor: Receptor) -> None:
        envio = self.contexto
        if not receptor.documento:
            raise IdentidadNoValida("Debe registrar el documento de quien retira.")
        if receptor.esTercero:
            if not receptor.autorizacionFirmada:
                raise IdentidadNoValida("El tercero no presenta autorización firmada.")
        elif envio.documentoDestinatario and receptor.documento != envio.documentoDestinatario:
            raise IdentidadNoValida(
                "El documento no coincide con el del destinatario de la guía.")
        if not receptor.firma:
            raise IdentidadNoValida("Falta la firma de conformidad.")
        saldo = envio.saldoPendiente()
        if receptor.pagoRecibido < saldo:
            logger.info("[State] Entrega bloqueada: saldo pendiente $%s", f"{saldo:,.0f}")
            raise PagoPendiente(
                f"Saldo pendiente de ${saldo:,.0f} (flete contra entrega + bodegaje). "
                "No se puede entregar sin el pago.")
        envio.fletePendiente = 0.0
        envio.cargoBodegaje = 0.0
        envio.cambiarEstado(Entregado(),
                            f"recibió {receptor.documento}, pagó ${receptor.pagoRecibido:,.0f}")

    def revisarBodegaje(self, fecha: datetime.datetime) -> float:
        envio = self.contexto
        inicio = envio.fechaDisponible or fecha
        dias = (fecha.date() - inicio.date()).days
        envio.cargoBodegaje = max(0, dias - DIAS_BODEGAJE_GRATIS) * TARIFA_BODEGAJE_DIA
        logger.info("[State] Bodegaje: %d días en destino, cargo $%s", dias,
                    f"{envio.cargoBodegaje:,.0f}")
        if dias >= DIAS_ABANDONO:
            envio.cambiarEstado(Abandonado(), f"{dias} días sin ser reclamado")
        return envio.cargoBodegaje

    def registrarNovedad(self, motivo: str) -> None:
        self._retener(motivo)


class Entregado(EstadoBase):
    """Fin del recorrido. Solo se permite abrir una reclamación."""
    NOMBRE = "Entregado"


class Retenido(EstadoBase):
    """Novedad: el envío queda detenido hasta que se libere."""
    NOMBRE = "Retenido"

    def __init__(self, estadoPrevio: EstadoBase) -> None:
        super().__init__()
        self.estadoPrevio = estadoPrevio

    def liberar(self) -> None:
        self.contexto.cambiarEstado(self.estadoPrevio, "novedad solucionada")


class EnReclamacion(EstadoBase):
    """PQR abierta: la guía queda bloqueada hasta que se resuelva."""
    NOMBRE = "En Reclamación"
    ADMITE_RECLAMACION = False

    def __init__(self, estadoPrevio: EstadoBase) -> None:
        super().__init__()
        self.estadoPrevio = estadoPrevio

    def resolverReclamacion(self) -> None:
        self.contexto.cambiarEstado(self.estadoPrevio, "PQR resuelta")


class Abandonado(EstadoBase):
    """Día 30 en bodega sin ser reclamado. Estado final."""
    NOMBRE = "Abandonado"
    ADMITE_RECLAMACION = False


# ═══════════════════════ RECONSTRUCCIÓN DESDE LA BD ═══════════════════════
_CLASES: tuple[type[EstadoBase], ...] = (
    RecibidoEnOrigen, EnTransito, DescargadoEnConexion, DisponibleEnDestino,
    Entregado, Retenido, EnReclamacion, Abandonado)

# Nombres que el proyecto usaba antes de State para el estado inicial.
_ALIAS = {"Registrado": RecibidoEnOrigen, "EnBodegaOrigen": RecibidoEnOrigen,
          "En Bodega": RecibidoEnOrigen, "Recibido": RecibidoEnOrigen}

_POR_NOMBRE: dict[str, type[EstadoBase]] = {
    **_ALIAS,
    **{c.NOMBRE: c for c in _CLASES},
    **{c.__name__: c for c in _CLASES},
}

ESTADOS: tuple[str, ...] = tuple(c.NOMBRE for c in _CLASES)


def claseDeEstado(nombre: str) -> type[EstadoBase]:
    try:
        return _POR_NOMBRE[nombre]
    except KeyError:
        raise ValueError(f"Estado de envío desconocido: {nombre!r}") from None


def reconstruirEstado(nombre: str,
                      historial: Iterable[tuple[str, str]] = ()) -> EstadoBase:
    """Crea el objeto de estado a partir del nombre guardado en la BD.

    historial son pares (estado_anterior, estado_nuevo) en orden cronológico.
    Retenido y EnReclamacion necesitan su estado previo: se busca el último
    cambio que llevó a ese estado y se toma el estado_anterior (recursivo).
    """
    clase = claseDeEstado(nombre)
    if clase in (Retenido, EnReclamacion):
        pasos = list(historial)
        for i in range(len(pasos) - 1, -1, -1):
            anterior, nuevo = pasos[i]
            if anterior and claseDeEstado(nuevo) is clase:
                return clase(reconstruirEstado(anterior, pasos[:i]))
        return clase(RecibidoEnOrigen())   # sin historial: valor seguro
    return clase()
