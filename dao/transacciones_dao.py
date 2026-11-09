import datetime
import uuid

from models.database import db
from models.transacciones import EnvioModel, FacturaModel, TiqueteModel


class TiqueteDAO:
    @staticmethod
    def registrarTiquete(id_viaje, id_cliente, id_usuario_registra, numero_silla, precio_total, canal_venta="Web", numero_tiquete=None):
        # Prevención de duplicado / overbooking: verificar si la silla ya está vendida para ese viaje
        silla_ocupada = TiqueteModel.query.filter_by(
            id_viaje=id_viaje,
            numero_silla=numero_silla,
            estado='Vendido'
        ).first()

        if silla_ocupada:
            return False, f"La silla {numero_silla} ya está ocupada para este viaje.", None

        try:
            # Si el Builder ya numeró el tiquete, se conserva ese número.
            num_tiquete = numero_tiquete or f"TQ-{uuid.uuid4().hex[:6].upper()}"
            tiquete = TiqueteModel(
                numero_tiquete=num_tiquete,
                id_viaje=id_viaje,
                id_cliente=id_cliente,
                id_usuario_registra=id_usuario_registra,
                numero_silla=numero_silla,
                precio_total=precio_total,
                canal_venta=canal_venta,
                estado='Vendido'
            )
            db.session.add(tiquete)
            db.session.commit()
            return True, "Tiquete registrado exitosamente.", tiquete
        except Exception as e:  # noqa: BLE001 - contrato DAO: rollback siempre + tupla (ok, msg)
            db.session.rollback()
            return False, f"Error al registrar tiquete: {e!s}", None

    @staticmethod
    def consultarTiquete(id_tiquete):
        return TiqueteModel.query.get(id_tiquete)

    @staticmethod
    def cancelarTiquete(id_tiquete):
        tiquete = TiqueteModel.query.get(id_tiquete)
        if tiquete:
            tiquete.estado = 'Cancelado'
            db.session.commit()
        return tiquete


class EnvioDAO:
    @staticmethod
    def registrarEnvio(id_remitente, id_destinatario, id_usuario_registra, peso_kg, monto_flete, modalidad="Contado", numero_guia_custom=None,
                       origen=None, destino=None, valor_declarado=0.0, forma_pago="Contado"):
        try:
            # Si el Builder/Fábrica nos pasó una guía con prefijo (PAQ-, CORP-, etc.), usamos esa:
            if numero_guia_custom:
                numero_guia = numero_guia_custom
            else:
                # Fallback en caso de no pasar guía
                import random
                numero_guia = f"GUIA-{random.randint(100000, 999999)}"

            nuevo_envio = EnvioModel(
                numero_guia=numero_guia,
                id_remitente=id_remitente,
                id_destinatario=id_destinatario,
                id_usuario_registra=id_usuario_registra,
                peso_kg=peso_kg,
                monto_flete=monto_flete,
                modalidad=modalidad,
                estado="Recibido en Origen",   # estado inicial del patrón State
                origen=origen,
                destino=destino,
                terminal_actual=origen,
                valor_declarado=valor_declarado,
                forma_pago=forma_pago,
                flete_pendiente=monto_flete if forma_pago == "Contra Entrega" else 0.0,
                version=1,
            )
            db.session.add(nuevo_envio)
            db.session.commit()
            return True, "Envío registrado exitosamente.", nuevo_envio
        except Exception as e:  # noqa: BLE001 - contrato DAO: rollback siempre + tupla (ok, msg)
            db.session.rollback()
            return False, f"Error al registrar envío: {e!s}", None

    @staticmethod
    def consultarEnvio(numero_guia):
        """Permite rastrear el envío por su número de guía."""
        return EnvioModel.query.filter_by(numero_guia=numero_guia).first()

    @staticmethod
    def actualizarSeguimiento(id_envio, version_leida, **campos):
        """Guarda el nuevo estado con control de concurrencia optimista.

        Solo actualiza si nadie más cambió el envío desde que se leyó
        (version_leida); así dos terminales no pisan el mismo envío.
        """
        try:
            filas = (EnvioModel.query
                     .filter_by(id_envio=id_envio, version=version_leida)
                     .update({**campos, "version": version_leida + 1}))
            if filas == 0:
                db.session.rollback()
                return False, "Otra terminal modificó este envío. Vuelva a consultarlo."
            db.session.commit()
            return True, "Seguimiento actualizado."
        except Exception as e:  # noqa: BLE001 - contrato DAO: rollback siempre + tupla (ok, msg)
            db.session.rollback()
            return False, f"Error al actualizar el envío: {e!s}"

    @staticmethod
    def pesoEnTransito(id_viaje):
        """Kg que ya lleva el viaje (envíos asignados que siguen en el bus)."""
        envios = EnvioModel.query.filter_by(id_viaje=id_viaje, estado="En Tránsito").all()
        return round(sum(e.peso_kg for e in envios), 2)


class FacturaDAO:
    @staticmethod
    def registrarFactura(monto_total, id_cajero, id_tiquete=None, id_envio=None, cufe=None):
        try:
            # Si el Builder ya emitió el CUFE de la factura, se conserva.
            cufe = cufe or uuid.uuid4().hex
            factura = FacturaModel(
                cufe=cufe,
                fecha_emision=datetime.datetime.now(tz=datetime.UTC),
                id_tiquete=id_tiquete,
                id_envio=id_envio,
                monto_total=monto_total,
                id_cajero=id_cajero
            )
            db.session.add(factura)
            db.session.commit()
            return True, "Factura emitida correctamente.", factura
        except Exception as e:  # noqa: BLE001 - contrato DAO: rollback siempre + tupla (ok, msg)
            db.session.rollback()
            return False, f"Error en facturación: {e!s}", None

    @staticmethod
    def consultarFactura(id_factura):
        return FacturaModel.query.get(id_factura)