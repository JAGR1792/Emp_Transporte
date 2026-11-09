"""
DEMO — STATE (Seguimiento y cambios de estado del envío)

Ejecutar desde la raíz del proyecto:   python demos/demo_state.py

Recorre el ciclo de vida de un envío Bogotá -> Cali con trasbordo en
Medellín y muestra cómo cada estado acepta o rechaza las operaciones.
"""
import datetime

from _comun import seccion, titulo

from domain.envio import Envio, Guia, Receptor, Ruta, ViajeCarga


def intentar(descripcion: str, operacion) -> None:
    """Ejecuta una operación y muestra si el estado la aceptó o la rechazó."""
    antes = envio.estado
    try:
        operacion()
        print(f"   OK   {descripcion}: {antes} -> {envio.estado}")
    except ValueError as e:
        print(f"   NO   {descripcion}: {type(e).__name__} -> {e}")


titulo("DEMO STATE — el envío delega cada operación a su objeto de estado")

envio = Envio(pesoFacturable=40.0, valorFlete=60000.0, tipoServicio="Corporativa",
              estado="Recibido en Origen", guia=Guia("CORP-00000042", "*CORP-00000042*"),
              ruta=Ruta("Bogotá", "Cali"), documentoDestinatario="1020304050",
              terminalActual="Bogotá", formaPago="Contra Entrega", fletePendiente=60000.0)
print(f"   Envío {envio.guia.numero} {envio.ruta.origen} -> {envio.ruta.destino}, "
      f"{envio.pesoFacturable} kg, flete contra entrega ${envio.fletePendiente:,.0f}")

seccion("1. En origen: entregar no existe todavía; despachar valida la capacidad (RF-03)")
print(f"   Permitidas en «{envio.estado}»: {envio.operacionesPermitidas()}")
intentar("entregar", lambda: envio.entregar(Receptor("1020304050", firma="ok")))
lleno = ViajeCarga(1, "Bogotá", "Medellín", capacidadCarga=500.0, pesoAsignado=480.0)
intentar("despachar en bus casi lleno", lambda: envio.despachar(lleno))
viaje1 = ViajeCarga(2, "Bogotá", "Medellín", capacidadCarga=500.0, pesoAsignado=120.0)
intentar("despachar viaje #2 Bogotá -> Medellín", lambda: envio.despachar(viaje1))

seccion("2. Trasbordo: descargar en Medellín no es el destino -> Descargado en Conexión")
intentar("despachar otra vez sin descargar", lambda: envio.despachar(viaje1))
intentar("descargar en Medellín", lambda: envio.descargar("Medellín"))
viaje2 = ViajeCarga(3, "Medellín", "Cali", capacidadCarga=500.0, pesoAsignado=0.0)
intentar("despachar viaje #3 Medellín -> Cali", lambda: envio.despachar(viaje2))
intentar("descargar en Cali", lambda: envio.descargar("Cali"))

seccion("3. Excepciones: novedad y PQR guardan el estado previo y vuelven a él")
intentar("registrar novedad (caja húmeda)", lambda: envio.registrarNovedad("caja húmeda"))
intentar("entregar estando retenido", lambda: envio.entregar(Receptor("1020304050", firma="ok")))
intentar("liberar", envio.liberar)
intentar("abrir reclamación", lambda: envio.abrirReclamacion("contenido incompleto"))
intentar("abrir otra reclamación", lambda: envio.abrirReclamacion("otra"))
intentar("resolver reclamación", envio.resolverReclamacion)

seccion("4. Bodegaje y entrega: 8 días en destino y control del pago contra entrega")
dia8 = envio.fechaDisponible + datetime.timedelta(days=8)
intentar("revisar bodegaje al día 8", lambda: envio.revisarBodegaje(dia8))
print(f"   Saldo a cobrar: ${envio.saldoPendiente():,.0f}")
intentar("entregar a otra persona sin autorización",
         lambda: envio.entregar(Receptor("999", esTercero=True, firma="ok")))
intentar("entregar sin pagar",
         lambda: envio.entregar(Receptor("1020304050", firma="ok", pagoRecibido=0)))
intentar("entregar con pago completo",
         lambda: envio.entregar(Receptor("1020304050", firma="ok",
                                         pagoRecibido=envio.saldoPendiente())))
intentar("despachar un envío entregado", lambda: envio.despachar(viaje2))
print(f"   Permitidas en «{envio.estado}»: {envio.operacionesPermitidas()}")

seccion("5. Otro envío no reclamado: al día 30 pasa a Abandonado")
otro = Envio(pesoFacturable=3.0, estado="Disponible en Destino", guia=Guia("PAQ-7", "*PAQ-7*"),
             ruta=Ruta("Cali", "Bogotá"), terminalActual="Bogotá",
             fechaDisponible=datetime.datetime(2026, 10, 1, tzinfo=datetime.UTC))
otro.revisarBodegaje(datetime.datetime(2026, 10, 31, tzinfo=datetime.UTC))
print(f"   {otro.guia.numero}: estado={otro.estado}, bodegaje=${otro.cargoBodegaje:,.0f}")

seccion("Historial del envío CORP-00000042 (lo que se guarda en la tabla Historial)")
for c in envio.cambios:
    print(f"   {c.anterior:<24} -> {c.nuevo:<24} {c.detalle}")
