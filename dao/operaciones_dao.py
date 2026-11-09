from models.database import db
from models.operaciones import ViajeModel


class ViajeDAO:
    @staticmethod
    def registrarViaje(origen, destino, fecha_salida, id_bus):
        # Validar si ya existe un viaje programado con el mismo bus en la misma fecha/hora exacta
        existente = ViajeModel.query.filter_by(
            id_bus=id_bus, 
            fecha_salida=fecha_salida,
            estado='Programado'
        ).first()

        if existente:
            return existente

        viaje = ViajeModel(
            origen=origen,
            destino=destino,
            fecha_salida=fecha_salida,
            id_bus=id_bus,
            estado='Programado'
        )
        db.session.add(viaje)
        db.session.commit()
        return viaje

    @staticmethod
    def consultarViaje(id_viaje):
        return ViajeModel.query.get(id_viaje)

    @staticmethod
    def listarSalidas(origen):
        """Viajes programados que salen de una terminal (para despachar envíos)."""
        return (ViajeModel.query.filter_by(origen=origen, estado='Programado')
                .order_by(ViajeModel.fecha_salida).all())

    @staticmethod
    def modificarViaje(id_viaje, **kwargs):
        viaje = ViajeModel.query.get(id_viaje)
        if viaje:
            for clave, valor in kwargs.items():
                if hasattr(viaje, clave):
                    setattr(viaje, clave, valor)
            db.session.commit()
        return viaje