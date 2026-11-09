"""
Capa de LÓGICA — caso de uso «Registrar envío».

Orquesta el patrón Abstract Factory (ServicioRegistroEnvio) y la capa de datos
(DAO). Las rutas de Flask solo llaman a este proceso.
"""
from typing import ClassVar

from dao.entidades_base_dao import ClienteDAO
from dao.seguimiento_dao import HistorialDAO
from dao.transacciones_dao import EnvioDAO, FacturaDAO
from factories.fabrica_envio import FabricaCorporativa, FabricaPaqueteo, FabricaRemesa
from services.servicio_registro_envio import ServicioRegistroEnvio
from services.traza import CapturaTraza


class ProcesoRegistroEnvio:
    # Selección de la familia según la modalidad elegida en pantalla.
    FABRICAS: ClassVar[dict] = {
        "paqueteo": FabricaPaqueteo,
        "corporativa": FabricaCorporativa,
        "remesa": FabricaRemesa,
    }

    def registrar(self, modalidad: str, doc_remitente: str, nom_remitente: str,
                  doc_destinatario: str, nom_destinatario: str, peso: float, dims: str,
                  origen: str, destino: str, id_usuario: str, valor_declarado: float = 0.0,
                  forma_pago: str = "Contado") -> dict:
        clase_fabrica = self.FABRICAS.get(modalidad)
        if clase_fabrica is None:
            raise ValueError("Modalidad de envío desconocida.")

        with CapturaTraza("sigtva.envio") as traza:
            # ── Patrón: el cliente arma el envío solo con interfaces ──
            servicio = ServicioRegistroEnvio(clase_fabrica())
            servicio.fijarModalidad(modalidad.capitalize())
            envio = servicio.construir(peso, dims, origen, destino, doc_remitente, valor_declarado)

            # ── Persistencia ──
            remitente = ClienteDAO.registrarCliente(doc_remitente, "CC", nom_remitente, "", "")
            destinatario = ClienteDAO.registrarCliente(doc_destinatario, "CC", nom_destinatario, "", "")
            ok, msg, envio_db = EnvioDAO.registrarEnvio(
                id_remitente=remitente.id_cliente,
                id_destinatario=destinatario.id_cliente,
                id_usuario_registra=id_usuario,
                peso_kg=envio.pesoFacturable,
                monto_flete=envio.valorFlete,
                modalidad=envio.tipoServicio,
                numero_guia_custom=envio.guia.numero,
                origen=origen, destino=destino,
                valor_declarado=valor_declarado, forma_pago=forma_pago,
            )
            if not ok:
                raise ValueError(msg)
            # Primer registro del Historial: el envío nace en «Recibido en Origen» (State).
            HistorialDAO.registrar("Envio", envio_db.id_envio, None, envio_db.estado,
                                   "guía generada", id_usuario, origen)
            ok, msg, factura_db = FacturaDAO.registrarFactura(
                monto_total=envio.valorFlete, id_cajero=id_usuario, id_envio=envio_db.id_envio)
            if not ok:
                raise ValueError(msg)

        return {
            "tipo": "envio", "envio": envio, "envio_db": envio_db, "factura": factura_db,
            "remitente": remitente, "destinatario": destinatario,
            "peso_real": peso, "dims": dims, "traza": traza.mensajes,
            "patrones": ["Abstract Factory"],
        }
