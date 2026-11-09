"""
CAPA DE PRESENTACIÓN (controlador MVC).

Las rutas solo leen el formulario, llaman al proceso de la capa de lógica
(services/) y muestran el resultado. Los patrones de diseño viven en:
  - factories/  (Abstract Factory de envíos, Factory Method de tarifas)
  - builders/   (Builder del tiquete)
  - states/     (State del seguimiento del envío)
"""
import datetime
from functools import wraps

from flask import Flask, flash, redirect, render_template, request, session, url_for

from dao.entidades_base_dao import BusDAO
from dao.operaciones_dao import ViajeDAO
from dao.seguimiento_dao import HistorialDAO
from dao.transacciones_dao import EnvioDAO
from datos_demo import cargar_datos_demo
from models.database import db
from models.migraciones import asegurarColumnasEnvio
from models.operaciones import ViajeModel
from services.proceso_registro_envio import ProcesoRegistroEnvio
from services.proceso_seguimiento_envio import ProcesoSeguimientoEnvio
from services.proceso_venta_tiquete import ProcesoVentaTiquete

app = Flask(__name__)
app.secret_key = 'clave_secreta_transporte_nacional'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sigtva.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.create_all()
    asegurarColumnasEnvio()
    cargar_datos_demo()


def requiere_rol(*roles_permitidos):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if session.get('rol', 'invitado') not in roles_permitidos:
                flash(f"Acceso denegado. Se requiere rol: {', '.join(roles_permitidos)}", "error")
                return redirect(url_for('index'))
            return f(*args, **kwargs)
        return decorated_function
    return decorator


def usuario_actual() -> str:
    return str(session.get('user_id', '1'))


@app.route('/')
def index():
    return render_template('index.html')


# ───────────── Venta de tiquetes: Factory Method + Builder ─────────────
@app.route('/pasajeros', methods=['GET', 'POST'])
def pasajeros():
    origen = request.form.get('origen') if request.method == 'POST' else None
    destino = request.form.get('destino') if request.method == 'POST' else None
    fecha_raw = request.form.get('fecha', '') if request.method == 'POST' else ''

    query = ViajeModel.query
    if origen:
        query = query.filter_by(origen=origen)
    if destino:
        query = query.filter_by(destino=destino)

    return render_template(
        'pasajeros.html', viajes=query.order_by(ViajeModel.fecha_salida).all(),
        origen=origen, destino=destino, fecha_raw=fecha_raw, fecha_formateada=fecha_raw,
        precio_base=ProcesoVentaTiquete.PRECIO_BASE,
        tarifas=ProcesoVentaTiquete.opciones_tarifa(),
    )


@app.route('/comprar/<int:viaje_id>', methods=['POST'])
def comprar_tiquete(viaje_id):
    try:
        resultado = ProcesoVentaTiquete().vender(
            id_viaje=viaje_id,
            documento=request.form.get('documento', '').strip(),
            nombre=request.form.get('nombre_completo', '').strip(),
            numero_silla=int(request.form.get('numero_silla', 1)),
            tipo_tarifa=request.form.get('tipo_tarifa', 'ordinaria'),
            metodo_pago=request.form.get('metodo_pago', 'Tarjeta'),
            id_usuario=usuario_actual(),
        )
    except (ValueError, TypeError) as e:
        flash(f"No se pudo completar la compra: {e}", "error")
        return redirect(url_for('pasajeros'))
    return render_template('factura.html', **resultado)


# ───────────── Registro de envíos: Abstract Factory ─────────────
@app.route('/envios', methods=['GET', 'POST'])
def gestionar_envios():
    if request.method == 'GET':
        return render_template('envios.html', form={})

    f = request.form
    try:
        resultado = ProcesoRegistroEnvio().registrar(
            modalidad=f.get('tipo_servicio', 'paqueteo'),
            doc_remitente=f.get('doc_remitente', '').strip(),
            nom_remitente=f.get('nom_remitente', '').strip(),
            doc_destinatario=f.get('doc_destinatario', '').strip(),
            nom_destinatario=f.get('nom_destinatario', '').strip(),
            peso=float(f.get('peso_kg', 1.0)),
            dims=f.get('dimensiones', '30x30x30'),
            origen=f.get('origen', 'Bogotá'),
            destino=f.get('destino', 'Medellín'),
            id_usuario=usuario_actual(),
            valor_declarado=float(f.get('valor_declarado') or 0),
            forma_pago=f.get('forma_pago', 'Contado'),
        )
    except (ValueError, TypeError) as e:
        flash(f"No se pudo registrar el envío: {e}", "error")
        return render_template('envios.html', form=f)
    return render_template('factura.html', **resultado)


@app.route('/rastrear', methods=['GET'])
def rastrear_envio():
    numero_guia = request.args.get('numero_guia', '').strip().upper()
    envio = None
    if numero_guia:
        envio = EnvioDAO.consultarEnvio(numero_guia)
        if not envio:
            flash(f"No se encontró la guía: {numero_guia}", "error")
    historial = HistorialDAO.listar("Envio", envio.id_envio) if envio else []
    return render_template('rastrear.html', envio=envio, numero_guia=numero_guia,
                           historial=historial)


# ───────────── Seguimiento del envío: State ─────────────
@app.route('/seguimiento', methods=['GET'])
@requiere_rol('admin', 'operador')
def seguimiento_envio():
    numero_guia = request.args.get('numero_guia', '').strip().upper()
    datos = None
    if numero_guia:
        datos = ProcesoSeguimientoEnvio().consultar(numero_guia)
        if datos is None:
            flash(f"No se encontró la guía: {numero_guia}", "error")
    return render_template('seguimiento.html', numero_guia=numero_guia, datos=datos,
                           resultado=session.pop('resultado_state', None))


@app.route('/seguimiento/<numero_guia>', methods=['POST'])
@requiere_rol('admin', 'operador')
def operar_envio(numero_guia):
    operacion = request.form.get('operacion', '')
    try:
        resultado = ProcesoSeguimientoEnvio().ejecutar(
            numero_guia, operacion, request.form.to_dict(), usuario_actual())
    except (ValueError, TypeError) as e:
        resultado = {"ok": False, "mensaje": str(e), "traza": []}
    resultado["operacion"] = operacion
    flash(resultado["mensaje"], "success" if resultado["ok"] else "error")
    session['resultado_state'] = resultado
    return redirect(url_for('seguimiento_envio', numero_guia=numero_guia))


# ───────────── Administración ─────────────
@app.route('/crear-viaje', methods=['GET', 'POST'])
@requiere_rol('admin', 'operador')
def crear_viaje():
    if request.method == 'POST':
        buses = BusDAO.listarBuses()
        if not buses:
            flash("No hay buses registrados.", "error")
            return redirect(url_for('crear_viaje'))
        ViajeDAO.registrarViaje(
            origen=request.form.get('origen'), destino=request.form.get('destino'),
            fecha_salida=datetime.datetime.now(tz=datetime.UTC), id_bus=buses[0].id_bus)
        flash("Viaje programado correctamente.", "success")
        return redirect(url_for('pasajeros'))
    return render_template('crear_viaje.html')


@app.route('/cambiar-rol/<nuevo_rol>')
def cambiar_rol(nuevo_rol):
    session['rol'] = nuevo_rol
    session['user_id'] = '1'
    flash(f"Rol actualizado a: {nuevo_rol}", "success")
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(debug=True, port=5000)
