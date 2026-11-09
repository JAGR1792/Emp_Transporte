"""
Capa de LÓGICA — CLIENTE del patrón State.

Proceso: Seguimiento y cambios de estado del envío. Cuando el Auxiliar de
Encomiendas escanea una guía y elige un evento (despachar, descargar,
entregar...), este proceso:
  1. carga el envío y reconstruye su objeto de estado desde la BD,
  2. llama la operación SIN preguntar en qué estado está (el Envio delega),
  3. si el estado la acepta, guarda el nuevo estado (con control de version),
     cada cambio en el Historial genérico y una Notificación (RF-04).
Si el estado la rechaza, no se toca la base de datos.
"""
import datetime
import logging
from typing import ClassVar

from dao.entidades_base_dao import ClienteDAO
from dao.operaciones_dao import ViajeDAO
from dao.seguimiento_dao import PQRDAO, EntregaFinalDAO, HistorialDAO, NotificacionDAO
from dao.transacciones_dao import EnvioDAO
from domain.envio import Cliente, Envio, Guia, Receptor, Ruta, ViajeCarga
from services.traza import CapturaTraza
from states.estados_envio import OPERACIONES, reconstruirEstado

logger = logging.getLogger("sigtva.state")


def _utc(fecha: datetime.datetime | None) -> datetime.datetime | None:
    """SQLite devuelve fechas sin zona; en el proyecto todas se guardan en UTC."""
    if fecha is not None and fecha.tzinfo is None:
        return fecha.replace(tzinfo=datetime.UTC)
    return fecha


class ProcesoSeguimientoEnvio:
    TERMINALES: ClassVar[list[str]] = ["Bogotá", "Medellín", "Cali", "Barranquilla", "Bucaramanga"]

    # ───────────────────────── consulta ─────────────────────────
    def consultar(self, numero_guia: str) -> dict | None:
        envio_db = EnvioDAO.consultarEnvio(numero_guia)
        if envio_db is None:
            return None
        historial = HistorialDAO.listar("Envio", envio_db.id_envio)
        envio = self._aDominio(envio_db, historial)
        salidas = [
            {"viaje": v, "carga": EnvioDAO.pesoEnTransito(v.id_viaje),
             "capacidad": v.bus.capacidad_carga}
            for v in ViajeDAO.listarSalidas(envio.terminalActual)
        ]
        return {
            "envio": envio, "envio_db": envio_db, "historial": historial,
            "estado_clase": type(envio.estadoActual).__name__,
            "permitidas": envio.operacionesPermitidas(),
            "salidas": salidas, "terminales": self.TERMINALES,
            "notificaciones": NotificacionDAO.listar("Envio", envio_db.id_envio),
            "pqr": PQRDAO.consultarAbierta(envio_db.id_envio),
        }

    # ───────────────────────── operación ─────────────────────────
    def ejecutar(self, numero_guia: str, operacion: str, datos: dict, id_usuario: str) -> dict:
        if operacion not in OPERACIONES:
            raise ValueError("Operación desconocida.")
        with CapturaTraza("sigtva.state") as traza:
            envio_db = EnvioDAO.consultarEnvio(numero_guia)
            if envio_db is None:
                raise ValueError(f"No se encontró la guía {numero_guia}.")
            envio = self._aDominio(envio_db, HistorialDAO.listar("Envio", envio_db.id_envio))
            logger.info("[State] Contexto Envio %s en estado %s: delega %s()",
                        numero_guia, type(envio.estadoActual).__name__, operacion)
            try:
                self._aplicar(envio, operacion, datos)
            except ValueError as e:
                return {"ok": False, "mensaje": str(e), "traza": traza.mensajes}
            ok, mensaje = self._guardar(envio_db, envio, operacion, datos, id_usuario)
        return {"ok": ok, "mensaje": mensaje, "traza": traza.mensajes}

    def _aplicar(self, envio: Envio, operacion: str, datos: dict) -> None:
        """Arma los datos que necesita cada operación y la llama en el contexto."""
        if operacion == "despachar":
            envio.despachar(self._viajeCarga(datos.get("id_viaje")))
        elif operacion == "descargar":
            envio.descargar(datos.get("terminal", "").strip())
        elif operacion == "entregar":
            envio.entregar(Receptor(
                documento=datos.get("documento", "").strip(),
                nombre=datos.get("nombre", "").strip(),
                esTercero=bool(datos.get("es_tercero")),
                autorizacionFirmada=bool(datos.get("autorizacion")),
                firma=datos.get("firma", "").strip(),
                pagoRecibido=float(datos.get("pago_recibido") or 0)))
        elif operacion == "revisarBodegaje":
            envio.revisarBodegaje(self._fecha(datos.get("fecha")))
        elif operacion == "registrarNovedad":
            envio.registrarNovedad(self._requerido(datos, "motivo", "el motivo de la novedad"))
        elif operacion == "liberar":
            envio.liberar()
        elif operacion == "abrirReclamacion":
            envio.abrirReclamacion(self._requerido(datos, "descripcion", "la descripción de la PQR"))
        elif operacion == "resolverReclamacion":
            envio.resolverReclamacion()   # primero decide el estado; nada se guarda aún
            if float(datos.get("indemnizacion") or 0) > envio.valorDeclarado:
                raise ValueError("La indemnización no puede superar el valor declarado "
                                 f"(${envio.valorDeclarado:,.0f}).")

    def _guardar(self, envio_db, envio: Envio, operacion: str, datos: dict,
                 id_usuario: str) -> tuple[bool, str]:
        ok, mensaje = EnvioDAO.actualizarSeguimiento(
            envio_db.id_envio, envio_db.version or 1,
            estado=envio.estado, terminal_actual=envio.terminalActual,
            id_viaje=envio.idViaje, flete_pendiente=envio.fletePendiente,
            cargo_bodegaje=envio.cargoBodegaje, fecha_disponible=envio.fechaDisponible)
        if not ok:
            return False, mensaje
        for cambio in envio.cambios:
            HistorialDAO.registrar("Envio", envio_db.id_envio, cambio.anterior, cambio.nuevo,
                                   cambio.detalle, id_usuario, envio.terminalActual, cambio.fecha)
            self._notificar(envio_db, cambio.nuevo)
        if envio.cambios and operacion == "entregar":
            EntregaFinalDAO.registrar(
                envio_db.id_envio, datos.get("documento", "").strip(), datos.get("nombre", "").strip(),
                bool(datos.get("es_tercero")), datos.get("firma", "").strip(),
                float(datos.get("pago_recibido") or 0))
        if envio.cambios and operacion == "abrirReclamacion":
            PQRDAO.abrir(envio_db.id_envio, datos.get("descripcion", ""), id_usuario)
        if envio.cambios and operacion == "resolverReclamacion":
            pqr = PQRDAO.consultarAbierta(envio_db.id_envio)
            if pqr:
                PQRDAO.resolver(pqr.id_pqr, float(datos.get("indemnizacion") or 0))
        if not envio.cambios:
            return True, f"Sin cambio de estado. Bodegaje acumulado: ${envio.cargoBodegaje:,.0f}."
        primero, ultimo = envio.cambios[0], envio.cambios[-1]
        return True, f"{primero.anterior} → {ultimo.nuevo}"

    def _notificar(self, envio_db, nuevo_estado: str) -> None:
        """RF-04: un aviso al remitente y otro al destinatario por cada cambio."""
        mensaje = f"Transporte Nacional: su envío {envio_db.numero_guia} cambió a «{nuevo_estado}»."
        for rol, documento in (("remitente", envio_db.id_remitente),
                               ("destinatario", envio_db.id_destinatario)):
            cliente = ClienteDAO.consultarCliente(documento)
            if cliente is None:
                continue
            canal = "Email" if cliente.email else "SMS"
            contacto = cliente.email or cliente.telefono or cliente.nombre_completo
            NotificacionDAO.registrar("Envio", envio_db.id_envio, canal, contacto, mensaje)
            logger.info("[State] RF-04: aviso por %s al %s %s", canal, rol, cliente.nombre_completo)

    # ───────────────────────── utilidades ─────────────────────────
    @staticmethod
    def _aDominio(envio_db, historial) -> Envio:
        """Convierte la fila de la BD en el contexto Envio con su estado actual."""
        envio = Envio(
            pesoFacturable=envio_db.peso_kg, valorDeclarado=envio_db.valor_declarado or 0.0,
            valorFlete=envio_db.monto_flete, tipoServicio=envio_db.modalidad,
            guia=Guia(envio_db.numero_guia, f"*{envio_db.numero_guia}*"),
            ruta=Ruta(envio_db.origen or "", envio_db.destino or ""),
            cliente=Cliente(envio_db.id_remitente),
            documentoDestinatario=envio_db.id_destinatario,
            terminalActual=envio_db.terminal_actual or envio_db.origen or "",
            formaPago=envio_db.forma_pago or "Contado",
            fletePendiente=envio_db.flete_pendiente or 0.0,
            cargoBodegaje=envio_db.cargo_bodegaje or 0.0,
            fechaDisponible=_utc(envio_db.fecha_disponible),
            idViaje=envio_db.id_viaje)
        pasos = [(h.estado_anterior, h.estado_nuevo) for h in historial]
        envio.usarEstado(reconstruirEstado(envio_db.estado, pasos))
        return envio

    @staticmethod
    def _viajeCarga(id_viaje) -> ViajeCarga:
        try:
            viaje = ViajeDAO.consultarViaje(int(id_viaje))
        except (TypeError, ValueError):
            viaje = None
        if viaje is None:
            raise ValueError("Seleccione un viaje válido para despachar.")
        return ViajeCarga(viaje.id_viaje, viaje.origen, viaje.destino,
                          viaje.bus.capacidad_carga, EnvioDAO.pesoEnTransito(viaje.id_viaje))

    @staticmethod
    def _fecha(texto: str | None) -> datetime.datetime:
        if not texto:
            return datetime.datetime.now(tz=datetime.UTC)
        try:
            return datetime.datetime.strptime(texto, "%Y-%m-%d").replace(tzinfo=datetime.UTC)
        except ValueError:
            raise ValueError("Fecha inválida; use el formato AAAA-MM-DD.") from None

    @staticmethod
    def _requerido(datos: dict, clave: str, descripcion: str) -> str:
        valor = (datos.get(clave) or "").strip()
        if not valor:
            raise ValueError(f"Debe escribir {descripcion}.")
        return valor
