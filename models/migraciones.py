"""
Ajuste de esquema para bases de datos creadas antes del patrón State.

db.create_all() crea las tablas nuevas, pero no agrega columnas a una tabla
que ya existe. Si alguien tiene un sigtva.db anterior, aquí se agregan las
columnas de seguimiento que le faltan a «envio» (sin borrar datos).
"""
from sqlalchemy import inspect, text

from models.database import db

_COLUMNAS_ENVIO = {
    "origen": "VARCHAR(80)",
    "destino": "VARCHAR(80)",
    "terminal_actual": "VARCHAR(80)",
    "valor_declarado": "FLOAT DEFAULT 0",
    "forma_pago": "VARCHAR(20) DEFAULT 'Contado'",
    "flete_pendiente": "FLOAT DEFAULT 0",
    "cargo_bodegaje": "FLOAT DEFAULT 0",
    "fecha_disponible": "DATETIME",
    "version": "INTEGER DEFAULT 1",
}


def asegurarColumnasEnvio() -> None:
    existentes = {c["name"] for c in inspect(db.engine).get_columns("envio")}
    faltantes = {k: v for k, v in _COLUMNAS_ENVIO.items() if k not in existentes}
    if not faltantes:
        return
    with db.engine.begin() as conexion:
        for nombre, tipo in faltantes.items():
            conexion.execute(text(f"ALTER TABLE envio ADD COLUMN {nombre} {tipo}"))
