import datetime

from models.database import db


class TiqueteModel(db.Model):
    __tablename__ = 'tiquete'

    id_tiquete = db.Column(db.Integer, primary_key=True, autoincrement=True)
    numero_tiquete = db.Column(db.String(20), unique=True, nullable=False)
    id_viaje = db.Column(db.Integer, db.ForeignKey('viaje.id_viaje'), nullable=False)
    id_cliente = db.Column(db.String(20), db.ForeignKey('cliente.id_cliente'), nullable=False)
    id_usuario_registra = db.Column(db.String(20), db.ForeignKey('empleado.id_empleado'), nullable=False)
    numero_silla = db.Column(db.Integer, nullable=False)
    precio_total = db.Column(db.Float, nullable=False)
    canal_venta = db.Column(db.String(20), nullable=False) # Taquilla, Web
    estado = db.Column(db.String(20), default='Vendido')

    def __repr__(self):
        return f"<Tiquete {self.numero_tiquete} | Silla {self.numero_silla} | ${self.precio_total:,.0f}>"


class EnvioModel(db.Model):
    __tablename__ = 'envio'

    id_envio = db.Column(db.Integer, primary_key=True, autoincrement=True)
    numero_guia = db.Column(db.String(20), unique=True, nullable=False)
    id_remitente = db.Column(db.String(20), db.ForeignKey('cliente.id_cliente'), nullable=False)
    id_destinatario = db.Column(db.String(20), db.ForeignKey('cliente.id_cliente'), nullable=False)
    id_usuario_registra = db.Column(db.String(20), db.ForeignKey('empleado.id_empleado'), nullable=False)
    id_viaje = db.Column(db.Integer, db.ForeignKey('viaje.id_viaje'), nullable=True)
    peso_kg = db.Column(db.Float, nullable=False)
    monto_flete = db.Column(db.Float, nullable=False)
    modalidad = db.Column(db.String(20), nullable=False) # Paqueteo, Remesa
    estado = db.Column(db.String(30), default='Recibido en Origen')
    # ── Seguimiento (patrón State) ──
    origen = db.Column(db.String(80), nullable=True)
    destino = db.Column(db.String(80), nullable=True)
    terminal_actual = db.Column(db.String(80), nullable=True)
    valor_declarado = db.Column(db.Float, default=0.0)
    forma_pago = db.Column(db.String(20), default='Contado')        # Contado, Contra Entrega
    flete_pendiente = db.Column(db.Float, default=0.0)
    cargo_bodegaje = db.Column(db.Float, default=0.0)
    fecha_disponible = db.Column(db.DateTime, nullable=True)
    version = db.Column(db.Integer, default=1)                      # concurrencia optimista

    def __repr__(self):
        return f"<Guía Envio {self.numero_guia} | {self.peso_kg}kg | ${self.monto_flete:,.0f}>"


class FacturaModel(db.Model):
    __tablename__ = 'factura'

    id_factura = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cufe = db.Column(db.String(96), unique=True, nullable=False)
    fecha_emision = db.Column(db.DateTime, default=datetime.datetime.now)
    id_tiquete = db.Column(db.Integer, db.ForeignKey('tiquete.id_tiquete'), nullable=True)
    id_envio = db.Column(db.Integer, db.ForeignKey('envio.id_envio'), nullable=True)
    monto_total = db.Column(db.Float, nullable=False)
    id_cajero = db.Column(db.String(20), db.ForeignKey('empleado.id_empleado'), nullable=False)

    def __repr__(self):
        return f"<Factura #{self.id_factura} | Total: ${self.monto_total:,.0f} | CUFE: {self.cufe[:10]}...>"