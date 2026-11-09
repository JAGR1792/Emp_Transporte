"""DAO del seguimiento del envío: Historial genérico, Notificacion y PQR."""
from models.database import db
from models.seguimiento import (
    EntregaFinalModel,
    HistorialModel,
    NotificacionModel,
    PQRModel,
)


class HistorialDAO:
    @staticmethod
    def registrar(tipo_entidad, id_entidad, estado_anterior, estado_nuevo,
                  detalle="", id_usuario=None, terminal=None, fecha=None):
        registro = HistorialModel(
            tipo_entidad=tipo_entidad, id_entidad=str(id_entidad),
            estado_anterior=estado_anterior, estado_nuevo=estado_nuevo,
            detalle=detalle[:200], id_usuario=id_usuario, terminal=terminal)
        if fecha is not None:
            registro.fecha_cambio = fecha
        db.session.add(registro)
        db.session.commit()
        return registro

    @staticmethod
    def listar(tipo_entidad, id_entidad):
        """Cambios de estado de una entidad en orden cronológico."""
        return (HistorialModel.query
                .filter_by(tipo_entidad=tipo_entidad, id_entidad=str(id_entidad))
                .order_by(HistorialModel.fecha_cambio, HistorialModel.id_historial)
                .all())


class NotificacionDAO:
    @staticmethod
    def registrar(tipo_referencia, id_referencia, canal, destinatario, mensaje,
                  estado_envio="Enviada"):
        aviso = NotificacionModel(
            tipo_referencia=tipo_referencia, id_referencia=str(id_referencia),
            canal=canal, destinatario=destinatario[:150], mensaje=mensaje[:300],
            estado_envio=estado_envio)
        db.session.add(aviso)
        db.session.commit()
        return aviso

    @staticmethod
    def listar(tipo_referencia, id_referencia):
        return (NotificacionModel.query
                .filter_by(tipo_referencia=tipo_referencia, id_referencia=str(id_referencia))
                .order_by(NotificacionModel.id_notificacion).all())


class PQRDAO:
    @staticmethod
    def abrir(id_envio, descripcion, id_usuario=None):
        pqr = PQRModel(id_envio=id_envio, descripcion=descripcion,
                       estado="Abierta", id_usuario_responsable=id_usuario)
        db.session.add(pqr)
        db.session.commit()
        return pqr

    @staticmethod
    def consultarAbierta(id_envio):
        return (PQRModel.query.filter(PQRModel.id_envio == id_envio,
                                      PQRModel.estado != "Resuelta")
                .order_by(PQRModel.id_pqr.desc()).first())

    @staticmethod
    def resolver(id_pqr, indemnizacion=0.0):
        pqr = PQRModel.query.get(id_pqr)
        if pqr:
            pqr.estado = "Resuelta"
            pqr.indemnizacion = indemnizacion
            db.session.commit()
        return pqr


class EntregaFinalDAO:
    @staticmethod
    def registrar(id_envio, documento, nombre, es_tercero, firma, pago_recibido):
        entrega = EntregaFinalModel(
            id_envio=id_envio, documento_quien_recibe=documento, nombre_quien_recibe=nombre,
            es_tercero=es_tercero, firma_digital=firma, pago_recibido=pago_recibido)
        db.session.add(entrega)
        db.session.commit()
        return entrega
