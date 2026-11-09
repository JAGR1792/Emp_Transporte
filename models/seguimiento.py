"""Tablas del seguimiento del envío: Historial genérico, Notificacion y PQR."""
import datetime

from models.database import db


def _ahora() -> datetime.datetime:
    return datetime.datetime.now(tz=datetime.UTC)


class HistorialModel(db.Model):
    """Historial unificado (Tiquete o Envio) con referencia polimórfica."""
    __tablename__ = 'historial'

    id_historial = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tipo_entidad = db.Column(db.String(20), nullable=False)      # Tiquete, Envio
    id_entidad = db.Column(db.String(50), nullable=False)
    estado_anterior = db.Column(db.String(30), nullable=True)
    estado_nuevo = db.Column(db.String(30), nullable=False)
    detalle = db.Column(db.String(200), default='')
    fecha_cambio = db.Column(db.DateTime, default=_ahora)
    id_usuario = db.Column(db.String(20), nullable=True)
    terminal = db.Column(db.String(80), nullable=True)

    def __repr__(self):
        return f"<Historial {self.tipo_entidad}#{self.id_entidad}: {self.estado_anterior} -> {self.estado_nuevo}>"


class NotificacionModel(db.Model):
    """RF-04: aviso al remitente/destinatario por cada cambio de estado."""
    __tablename__ = 'notificacion'

    id_notificacion = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tipo_referencia = db.Column(db.String(30), nullable=False)
    id_referencia = db.Column(db.String(50), nullable=False)
    canal = db.Column(db.String(20), nullable=False)             # SMS, Email, WhatsApp
    destinatario = db.Column(db.String(150), nullable=False)
    mensaje = db.Column(db.String(300), nullable=False)
    fecha_generada = db.Column(db.DateTime, default=_ahora)
    estado_envio = db.Column(db.String(20), default='Pendiente')  # Pendiente, Enviada, Fallida


class PQRModel(db.Model):
    __tablename__ = 'pqr'

    id_pqr = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_envio = db.Column(db.Integer, db.ForeignKey('envio.id_envio'), nullable=False)
    fecha_reclamo = db.Column(db.DateTime, default=_ahora)
    descripcion = db.Column(db.Text, nullable=False)
    estado = db.Column(db.String(20), default='Abierta')          # Abierta, En trámite, Resuelta
    indemnizacion = db.Column(db.Float, default=0.0)
    id_usuario_responsable = db.Column(db.String(20), nullable=True)


class EntregaFinalModel(db.Model):
    """RF M7: quién retiró el envío, con su documento y firma de conformidad."""
    __tablename__ = 'entrega_final'

    id_entrega = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_envio = db.Column(db.Integer, db.ForeignKey('envio.id_envio'), nullable=False)
    fecha_entrega = db.Column(db.DateTime, default=_ahora)
    documento_quien_recibe = db.Column(db.String(20), nullable=False)
    nombre_quien_recibe = db.Column(db.String(150), default='')
    es_tercero = db.Column(db.Boolean, default=False)
    firma_digital = db.Column(db.String(255), nullable=False)
    pago_recibido = db.Column(db.Float, default=0.0)
