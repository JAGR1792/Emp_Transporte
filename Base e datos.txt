IF DB_ID(N'ViaAndinaDB') IS NULL CREATE DATABASE ViaAndinaDB;
GO
USE ViaAndinaDB;
GO

-- ==========================================
-- MÓDULO 1: PASAJEROS
-- ==========================================
CREATE TABLE Cliente (
    id_cliente VARCHAR(20) NOT NULL PRIMARY KEY,
    tipo_documento VARCHAR(10) NOT NULL,
    nombre_completo VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(120) NOT NULL,
    fecha_nacimiento DATE NULL,
    es_corporativo BIT NOT NULL DEFAULT 0,
    tipo_cliente VARCHAR(20) NULL,
    consentimiento_tratamiento_datos BIT NOT NULL DEFAULT 0,
    fecha_autorizacion_datos DATETIME NULL,
    inactivo BIT NOT NULL DEFAULT 0
);
GO

CREATE TABLE TipoLista (
    id_tipo_lista INT IDENTITY PRIMARY KEY,
    nombre VARCHAR(40) NOT NULL,
    descripcion VARCHAR(150) NULL
);
GO

CREATE TABLE ListaBlanca (
    id_lista_blanca INT IDENTITY PRIMARY KEY,
    id_tipo_lista INT NOT NULL,
    tipo_entidad VARCHAR(20) NOT NULL,
    id_entidad VARCHAR(50) NOT NULL,
    fecha_inclusion DATETIME NOT NULL DEFAULT GETDATE(),
    motivo VARCHAR(150) NOT NULL,
    activo BIT NOT NULL DEFAULT 1
);
GO

CREATE TABLE Ruta (
    id_ruta INT IDENTITY PRIMARY KEY,
    origen VARCHAR(80) NOT NULL,
    destino VARCHAR(80) NOT NULL,
    distancia_km DECIMAL(6,2) NOT NULL
);
GO

CREATE TABLE Trayecto (
    id_trayecto INT IDENTITY PRIMARY KEY,
    id_ruta INT NOT NULL,
    ciudad_paso VARCHAR(80) NOT NULL,
    orden INT NOT NULL
);
GO

CREATE TABLE Itinerario (
    id_itinerario INT IDENTITY PRIMARY KEY,
    id_ruta INT NOT NULL,
    tipo_servicio VARCHAR(20) NOT NULL,
    hora_salida TIME NOT NULL,
    hora_llegada_estimada TIME NOT NULL
);
GO

CREATE TABLE Viaje (
    id_viaje INT IDENTITY PRIMARY KEY,
    id_itinerario INT NOT NULL,
    fecha DATE NOT NULL,
    id_bus VARCHAR(10) NOT NULL,
    estado VARCHAR(20) NOT NULL,
    hora_salida_real DATETIME NULL,
    hora_llegada_real DATETIME NULL
);
GO

CREATE TABLE ListaEspera (
    id_espera INT IDENTITY PRIMARY KEY,
    id_viaje INT NOT NULL,
    id_cliente VARCHAR(20) NOT NULL,
    fecha_registro DATETIME NOT NULL DEFAULT GETDATE(),
    prioridad INT NOT NULL DEFAULT 0,
    posicion INT NOT NULL,
    estado VARCHAR(20) NOT NULL
);
GO

CREATE TABLE Silla (
    id_silla INT IDENTITY PRIMARY KEY,
    id_bus VARCHAR(10) NOT NULL,
    numero INT NOT NULL,
    ubicacion VARCHAR(20) NOT NULL,
    version INT NOT NULL DEFAULT 1
);
GO

CREATE TABLE CierreTurno (
    id_cierre INT IDENTITY PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_hora DATETIME NOT NULL DEFAULT GETDATE(),
    total_efectivo DECIMAL(10,2) NOT NULL,
    total_tarjetas DECIMAL(10,2) NOT NULL,
    total_transferencias DECIMAL(10,2) NOT NULL,
    faltante DECIMAL(10,2) NOT NULL DEFAULT 0,
    sobrante DECIMAL(10,2) NOT NULL DEFAULT 0
);
GO

CREATE TABLE Tiquete (
    id_tiquete UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    numero_tiquete VARCHAR(20) NOT NULL UNIQUE,
    id_viaje INT NOT NULL,
    id_silla INT NULL,
    id_cliente VARCHAR(20) NOT NULL,
    id_usuario_reserva INT NOT NULL,
    fecha_emision DATETIME NOT NULL DEFAULT GETDATE(),
    precio_base DECIMAL(10,2) NOT NULL,
    descuento_aplicado DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_pagado DECIMAL(10,2) NOT NULL,
    estado VARCHAR(20) NOT NULL,
    fecha_expiracion_reserva DATETIME NULL,
    fecha_limite_abierto DATE NULL,
    penalidad_reprogramacion DECIMAL(10,2) NOT NULL DEFAULT 0,
    metodo_pago VARCHAR(20) NULL,
    numero_voucher VARCHAR(30) NULL,
    version INT NOT NULL DEFAULT 1,
    id_cierre INT NULL
);
GO

CREATE TABLE Maleta (
    id_maleta INT IDENTITY PRIMARY KEY,
    id_tiquete UNIQUEIDENTIFIER NOT NULL,
    numero_ficho VARCHAR(20) NOT NULL UNIQUE,
    peso DECIMAL(6,2) NOT NULL,
    estado VARCHAR(20) NOT NULL
);
GO

CREATE TABLE Devolucion (
    id_devolucion INT IDENTITY PRIMARY KEY,
    id_tiquete UNIQUEIDENTIFIER NOT NULL,
    monto_reembolsado DECIMAL(10,2) NOT NULL,
    motivo VARCHAR(150) NOT NULL,
    fecha_aprobacion DATETIME NOT NULL,
    id_usuario_autoriza INT NOT NULL
);
GO

-- ==========================================
-- MÓDULO 2: VEHÍCULOS Y FLOTA
-- ==========================================
CREATE TABLE Bus (
    id_bus VARCHAR(10) NOT NULL PRIMARY KEY,
    numero_interno VARCHAR(10) NOT NULL UNIQUE,
    placa VARCHAR(10) NOT NULL UNIQUE,
    marca VARCHAR(40) NOT NULL,
    linea VARCHAR(40) NOT NULL,
    tipo_bus VARCHAR(20) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    fecha_fabricacion DATE NULL,
    fecha_compra DATE NULL,
    capacidad_sillas INT NOT NULL,
    capacidad_carga DECIMAL(8,2) NOT NULL,
    kilometraje_actual INT NOT NULL DEFAULT 0,
    datos_tecnicos NVARCHAR(MAX) NULL,
    estado VARCHAR(20) NOT NULL,
    inactivo BIT NOT NULL DEFAULT 0
);
GO

CREATE TABLE DocumentoVehiculo (
    id_documento INT IDENTITY PRIMARY KEY,
    id_bus VARCHAR(10) NOT NULL,
    tipo_documento VARCHAR(30) NOT NULL,
    numero_documento VARCHAR(30) NULL,
    fecha_expedicion DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    estado VARCHAR(20) NOT NULL,
    observaciones VARCHAR(200) NULL
);
GO

CREATE TABLE TipoMantenimiento (
    id_tipo_mantenimiento INT IDENTITY PRIMARY KEY,
    nombre VARCHAR(40) NOT NULL,
    descripcion VARCHAR(150) NULL
);
GO

CREATE TABLE Mantenimiento (
    id_mantenimiento INT IDENTITY PRIMARY KEY,
    id_bus VARCHAR(10) NOT NULL,
    id_tipo_mantenimiento INT NOT NULL,
    fecha_mantenimiento DATE NOT NULL,
    descripcion VARCHAR(250) NULL,
    costo DECIMAL(10,2) NOT NULL,
    proveedor VARCHAR(100) NOT NULL,
    kilometraje_al_momento INT NOT NULL,
    estado VARCHAR(20) NOT NULL
);
GO

CREATE TABLE Propiedad (
    id_propiedad INT IDENTITY PRIMARY KEY,
    id_cliente VARCHAR(20) NOT NULL,
    id_bus VARCHAR(10) NOT NULL,
    porcentaje_propiedad DECIMAL(5,2) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NULL
);
GO

CREATE TABLE HistorialPlaca (
    id_historial_placa INT IDENTITY PRIMARY KEY,
    id_bus VARCHAR(10) NOT NULL,
    placa VARCHAR(10) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NULL,
    motivo_cambio VARCHAR(150) NULL
);
GO

CREATE TABLE Seguro (
    id_seguro INT IDENTITY PRIMARY KEY,
    tipo_entidad_asegurada VARCHAR(10) NOT NULL,
    id_entidad_asegurada VARCHAR(20) NOT NULL,
    poliza_numero VARCHAR(30) NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    cobertura_monto DECIMAL(12,2) NOT NULL,
    aseguradora_nombre VARCHAR(100) NOT NULL
);
GO

-- ==========================================
-- MÓDULO 3: MENSAJERÍA Y BODEGA
-- ==========================================
CREATE TABLE Terminal (
    id_terminal INT IDENTITY PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL,
    ciudad VARCHAR(60) NOT NULL,
    direccion VARCHAR(150) NOT NULL
);
GO

CREATE TABLE Bodega (
    id_bodega INT IDENTITY PRIMARY KEY,
    id_terminal INT NOT NULL,
    nombre VARCHAR(80) NOT NULL,
    capacidad_maxima DECIMAL(10,2) NOT NULL,
    ubicacion_interna VARCHAR(100) NULL,
    inactivo BIT NOT NULL DEFAULT 0
);
GO

CREATE TABLE CategoriaMercancia (
    id_categoria INT IDENTITY PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL,
    restricciones VARCHAR(200) NULL,
    requiere_manejo_especial BIT NOT NULL DEFAULT 0
);
GO

CREATE TABLE Remesa (
    id_remesa INT IDENTITY PRIMARY KEY,
    numero_remesa VARCHAR(20) NOT NULL UNIQUE,
    fecha_creacion DATETIME NOT NULL DEFAULT GETDATE(),
    descripcion_carga VARCHAR(200) NULL,
    peso_total DECIMAL(8,2) NOT NULL DEFAULT 0,
    bultos_cantidad INT NOT NULL DEFAULT 0,
    monto_total DECIMAL(12,2) NOT NULL DEFAULT 0
);
GO

CREATE TABLE ClienteRemesa (
    id_cliente_remesa INT IDENTITY PRIMARY KEY,
    id_remesa INT NOT NULL,
    id_cliente VARCHAR(20) NOT NULL,
    tipo VARCHAR(20) NOT NULL
);
GO

CREATE TABLE Envio (
    id_envio UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    numero_guia VARCHAR(10) NOT NULL UNIQUE,
    id_remesa INT NULL,
    tipo_envio VARCHAR(20) NOT NULL,
    id_categoria_mercancia INT NOT NULL,
    id_remitente VARCHAR(20) NOT NULL,
    id_destinatario VARCHAR(20) NOT NULL,
    id_terminal_origen INT NOT NULL,
    id_terminal_destino INT NOT NULL,
    id_bodega_actual INT NULL,
    fecha_recepcion DATETIME NOT NULL,
    fecha_entrega_real DATETIME NULL,
    peso_real DECIMAL(6,2) NOT NULL,
    alto DECIMAL(6,2) NULL,
    ancho DECIMAL(6,2) NULL,
    largo DECIMAL(6,2) NULL,
    peso_volumetrico DECIMAL(6,2) NULL,
    valor_declarado DECIMAL(12,2) NOT NULL,
    seguro DECIMAL(10,2) NOT NULL,
    tipo_servicio VARCHAR(20) NOT NULL,
    recargo_prioritario DECIMAL(10,2) NOT NULL DEFAULT 0,
    embalaje_deficiente BIT NOT NULL DEFAULT 0,
    monto_flete DECIMAL(10,2) NOT NULL,
    monto_total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(30) NOT NULL,
    version INT NOT NULL DEFAULT 1,
    forma_pago VARCHAR(20) NOT NULL,
    estado_pago VARCHAR(20) NOT NULL,
    fecha_limite_pago DATE NULL
);
GO

CREATE TABLE Tula (
    id_tula INT IDENTITY PRIMARY KEY,
    precinto_numero VARCHAR(20) NOT NULL UNIQUE,
    id_terminal_origen INT NOT NULL,
    id_bodega INT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT GETDATE(),
    estado VARCHAR(20) NOT NULL
);
GO

CREATE TABLE TulaEnvio (
    id_tula_envio INT IDENTITY PRIMARY KEY,
    id_tula INT NOT NULL,
    id_envio UNIQUEIDENTIFIER NOT NULL
);
GO

CREATE TABLE TulaViaje (
    id_tula_viaje INT IDENTITY PRIMARY KEY,
    id_tula INT NOT NULL,
    id_viaje INT NOT NULL,
    fecha_asociacion DATETIME NOT NULL DEFAULT GETDATE()
);
GO

CREATE TABLE CargaEnvio (
    id_carga INT IDENTITY PRIMARY KEY,
    id_envio UNIQUEIDENTIFIER NOT NULL,
    id_viaje INT NOT NULL,
    fecha_asignacion DATETIME NOT NULL DEFAULT GETDATE(),
    estado_carga VARCHAR(20) NOT NULL
);
GO

CREATE TABLE EntregaFinal (
    id_entrega INT IDENTITY PRIMARY KEY,
    id_envio UNIQUEIDENTIFIER NOT NULL,
    id_destinatario_entrega VARCHAR(20) NULL,
    fecha_entrega DATETIME NOT NULL,
    documento_quien_recibe VARCHAR(20) NULL,
    firma_digital VARBINARY(MAX) NULL
);
GO

CREATE TABLE Bodegaje (
    id_bodegaje INT IDENTITY PRIMARY KEY,
    id_envio UNIQUEIDENTIFIER NOT NULL,
    dias_almacenados INT NOT NULL,
    tarifa_diaria DECIMAL(10,2) NOT NULL,
    total_cargo DECIMAL(10,2) NOT NULL,
    fecha_cobro DATE NOT NULL
);
GO

CREATE TABLE PQR (
    id_pqr INT IDENTITY PRIMARY KEY,
    id_envio UNIQUEIDENTIFIER NOT NULL,
    fecha_reclamo DATETIME NOT NULL,
    descripcion TEXT NOT NULL,
    estado VARCHAR(20) NOT NULL,
    indemnizacion DECIMAL(12,2) NOT NULL DEFAULT 0,
    id_usuario_responsable INT NOT NULL
);
GO

-- ==========================================
-- MÓDULO 4: TRANSVERSAL
-- ==========================================
CREATE TABLE Historial (
    id_historial INT IDENTITY PRIMARY KEY,
    tipo_entidad VARCHAR(20) NOT NULL,
    id_entidad VARCHAR(50) NOT NULL,
    estado_anterior VARCHAR(30) NOT NULL,
    estado_nuevo VARCHAR(30) NOT NULL,
    fecha_cambio DATETIME NOT NULL DEFAULT GETDATE(),
    id_usuario INT NOT NULL,
    id_terminal INT NULL
);
GO

CREATE TABLE ClienteCorporativo (
    id_cliente_corporativo VARCHAR(20) NOT NULL PRIMARY KEY,
    nit VARCHAR(20) NOT NULL,
    razon_social VARCHAR(150) NOT NULL,
    dias_credito INT NOT NULL DEFAULT 30,
    cupo_credito DECIMAL(12,2) NOT NULL,
    contacto_financiero VARCHAR(120) NULL
);
GO

CREATE TABLE MovimientoCredito (
    id_mov INT IDENTITY PRIMARY KEY,
    id_cliente_corporativo VARCHAR(20) NOT NULL,
    tipo VARCHAR(10) NOT NULL,
    monto DECIMAL(12,2) NOT NULL,
    referencia_transaccion VARCHAR(50) NULL,
    fecha_hora DATETIME NOT NULL DEFAULT GETDATE()
);
GO

CREATE TABLE Factura (
    id_factura INT IDENTITY PRIMARY KEY,
    id_tiquete UNIQUEIDENTIFIER NULL,
    id_envio UNIQUEIDENTIFIER NULL,
    id_movimiento_credito INT NULL,
    id_cajero INT NOT NULL,
    fecha_emision DATETIME NOT NULL DEFAULT GETDATE(),
    fecha_vencimiento DATE NULL,
    monto_total DECIMAL(12,2) NOT NULL,
    CUFE VARCHAR(96) NOT NULL UNIQUE,
    estado VARCHAR(20) NOT NULL
);
GO

CREATE TABLE DetalleFactura (
    id_detalle INT IDENTITY PRIMARY KEY,
    id_factura INT NOT NULL,
    concepto VARCHAR(60) NOT NULL,
    cantidad INT NOT NULL,
    valor_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);
GO

CREATE TABLE AnulacionFactura (
    id_anulacion INT IDENTITY PRIMARY KEY,
    id_factura INT NOT NULL UNIQUE,
    motivo_anulacion VARCHAR(200) NOT NULL,
    fecha_anulacion DATETIME NOT NULL DEFAULT GETDATE(),
    cufe_nota_credito VARCHAR(96) NOT NULL UNIQUE
);
GO

CREATE TABLE Rol (
    id_rol INT IDENTITY PRIMARY KEY,
    nombre VARCHAR(40) NOT NULL UNIQUE,
    descripcion VARCHAR(200) NULL,
    nivel_acceso INT NULL
);
GO

CREATE TABLE Permiso (
    id_permiso INT IDENTITY PRIMARY KEY,
    codigo_recurso VARCHAR(60) NOT NULL,
    accion VARCHAR(20) NOT NULL
);
GO

CREATE TABLE RolPermiso (
    id_rol_permiso INT IDENTITY PRIMARY KEY,
    id_rol INT NOT NULL,
    id_permiso INT NOT NULL
);
GO

CREATE TABLE Usuario (
    id_usuario INT IDENTITY PRIMARY KEY,
    id_contrato INT NOT NULL UNIQUE,
    login VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    id_terminal INT NULL,
    activo BIT NOT NULL DEFAULT 1
);
GO

CREATE TABLE Auditoria (
    id_auditoria INT IDENTITY PRIMARY KEY,
    id_usuario INT NOT NULL,
    accion VARCHAR(30) NOT NULL,
    tabla_afectada VARCHAR(50) NOT NULL,
    id_registro_afectado VARCHAR(50) NOT NULL,
    fecha_hora DATETIME NOT NULL DEFAULT GETDATE(),
    ip_origen VARCHAR(45) NULL
);
GO

CREATE TABLE AuditoriaDetalle (
    id_det_aud INT IDENTITY PRIMARY KEY,
    id_auditoria INT NOT NULL,
    campo_afectado VARCHAR(60) NOT NULL,
    valor_anterior VARCHAR(255) NULL,
    valor_nuevo VARCHAR(255) NULL
);
GO

CREATE TABLE ConfiguracionAlerta (
    id_configuracion INT IDENTITY PRIMARY KEY,
    tipo_documento VARCHAR(30) NOT NULL,
    dias_anticipacion INT NOT NULL
);
GO

CREATE TABLE Notificacion (
    id_notificacion INT IDENTITY PRIMARY KEY,
    tipo_referencia VARCHAR(30) NOT NULL,
    id_referencia VARCHAR(50) NOT NULL,
    canal VARCHAR(20) NOT NULL,
    mensaje VARCHAR(300) NOT NULL,
    fecha_generada DATETIME NOT NULL DEFAULT GETDATE(),
    estado_envio VARCHAR(20) NOT NULL
);
GO

CREATE TABLE SincronizacionPendiente (
    id_pend INT IDENTITY PRIMARY KEY,
    tabla_afectada VARCHAR(50) NOT NULL,
    operacion VARCHAR(10) NOT NULL,
    datos_json NVARCHAR(MAX) NOT NULL,
    reintentos_cont INT NOT NULL DEFAULT 0,
    error_log VARCHAR(300) NULL
);
GO

-- ==========================================
-- MÓDULO 5: TALENTO HUMANO, NOVEDADES Y NÓMINA
-- ==========================================
CREATE TABLE Departamento (
    id_departamento INT IDENTITY PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL,
    responsable_id VARCHAR(20) NULL
);
GO

CREATE TABLE Cargo (
    id_cargo INT IDENTITY PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL,
    nivel_jerarquico INT NOT NULL,
    salario_base_minimo DECIMAL(10,2) NOT NULL,
    salario_base_maximo DECIMAL(10,2) NOT NULL
);
GO

CREATE TABLE Empleado (
    id_empleado VARCHAR(20) NOT NULL PRIMARY KEY,
    tipo_documento VARCHAR(10) NOT NULL,
    nombre_completo VARCHAR(150) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    direccion VARCHAR(150) NOT NULL,
    telefono_personal VARCHAR(20) NOT NULL,
    telefono_emergencia VARCHAR(20) NOT NULL,
    email_personal VARCHAR(120) NOT NULL,
    fecha_contratacion DATE NOT NULL,
    fecha_terminacion DATE NULL,
    estado VARCHAR(20) NOT NULL,
    id_departamento INT NOT NULL,
    id_jefe_directo VARCHAR(20) NULL,
    inactivo BIT NOT NULL DEFAULT 0
);
GO

CREATE TABLE Licencia (
    id_licencia INT IDENTITY PRIMARY KEY,
    id_empleado VARCHAR(20) NOT NULL,
    numero_licencia VARCHAR(30) NOT NULL UNIQUE,
    categoria_licencia VARCHAR(5) NOT NULL,
    fecha_expedicion DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    fecha_ultimo_examen_medico DATE NOT NULL,
    vigente BIT NOT NULL DEFAULT 1
);
GO

CREATE TABLE TipoAsignacion (
    id_tipo_asignacion INT IDENTITY PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL,
    descripcion VARCHAR(150) NULL
);
GO

CREATE TABLE AsignacionViaje (
    id_asignacion INT IDENTITY PRIMARY KEY,
    id_viaje INT NOT NULL,
    id_empleado VARCHAR(20) NOT NULL,
    id_tipo_asignacion INT NOT NULL,
    fecha_asignacion DATETIME NOT NULL DEFAULT GETDATE()
);
GO

CREATE TABLE Horario (
    id_horario INT IDENTITY PRIMARY KEY,
    nombre VARCHAR(40) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    tipo_turno VARCHAR(10) NOT NULL
);
GO

CREATE TABLE JornadaConductor (
    id_jornada INT IDENTITY PRIMARY KEY,
    id_empleado VARCHAR(20) NOT NULL,
    id_horario INT NOT NULL,
    fecha DATE NOT NULL,
    estado VARCHAR(20) NOT NULL
);
GO

CREATE TABLE DescansoConductor (
    id_descanso INT IDENTITY PRIMARY KEY,
    id_empleado VARCHAR(20) NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    lugar_descanso VARCHAR(100) NULL
);
GO

CREATE TABLE Asistencia (
    id_asistencia INT IDENTITY PRIMARY KEY,
    id_empleado VARCHAR(20) NOT NULL,
    fecha DATE NOT NULL,
    hora_entrada TIME NOT NULL,
    hora_salida TIME NULL
);
GO

CREATE TABLE Novedad (
    id_novedad INT IDENTITY PRIMARY KEY,
    id_empleado VARCHAR(20) NOT NULL,
    id_asistencia INT NULL,
    tipo_novedad VARCHAR(40) NOT NULL,
    fecha_novedad DATE NOT NULL,
    minutos_retraso INT NULL,
    horas_extra DECIMAL(4,2) NULL,
    justificada BIT NOT NULL DEFAULT 0,
    observacion VARCHAR(250) NULL,
    afecta_nomina BIT NOT NULL DEFAULT 1,
    id_usuario_registra INT NOT NULL
);
GO

CREATE TABLE Incapacidad (
    id_incapacidad INT IDENTITY PRIMARY KEY,
    id_empleado VARCHAR(20) NOT NULL,
    tipo_cie10 VARCHAR(10) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    soporte_pdf VARCHAR(255) NULL
);
GO

CREATE TABLE Vacacion (
    id_vacacion INT IDENTITY PRIMARY KEY,
    id_empleado VARCHAR(20) NOT NULL,
    dias_solicitados INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_retorno DATE NOT NULL,
    pagada BIT NOT NULL DEFAULT 0
);
GO

CREATE TABLE Contrato (
    id_contrato INT IDENTITY PRIMARY KEY,
    id_empleado VARCHAR(20) NOT NULL,
    id_cargo INT NOT NULL,
    tipo_contrato VARCHAR(30) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NULL,
    jornada VARCHAR(20) NOT NULL,
    periodo_pago VARCHAR(20) NOT NULL,
    salario_base DECIMAL(10,2) NOT NULL
);
GO

CREATE TABLE RenovacionContrato (
    id_renovacion INT IDENTITY PRIMARY KEY,
    id_contrato INT NOT NULL,
    fecha_nueva_terminacion DATE NOT NULL,
    aumento_salarial DECIMAL(10,2) NULL,
    anexo_pdf VARCHAR(255) NULL
);
GO

CREATE TABLE ConceptoNomina (
    id_concepto INT IDENTITY PRIMARY KEY,
    nombre_concepto VARCHAR(60) NOT NULL,
    tipo VARCHAR(20) NOT NULL
);
GO

CREATE TABLE Nomina (
    id_nomina INT IDENTITY PRIMARY KEY,
    id_empleado VARCHAR(20) NOT NULL,
    periodo_inicio DATE NOT NULL,
    periodo_fin DATE NOT NULL,
    dias_laborados INT NOT NULL,
    total_devengado DECIMAL(10,2) NOT NULL,
    total_deducido DECIMAL(10,2) NOT NULL,
    salario_neto DECIMAL(10,2) NOT NULL,
    fecha_pago DATE NULL,
    estado VARCHAR(20) NOT NULL
);
GO

CREATE TABLE DetalleNomina (
    id_det_nom INT IDENTITY PRIMARY KEY,
    id_nomina INT NOT NULL,
    id_concepto INT NOT NULL,
    valor_periodo DECIMAL(10,2) NOT NULL,
    referencia_origen VARCHAR(50) NULL
);
GO

-- ==========================================
-- RELACIONES (FOREIGN KEYS)
-- ==========================================
ALTER TABLE ListaBlanca ADD CONSTRAINT FK_ListaBlanca_id_tipo_lista FOREIGN KEY (id_tipo_lista) REFERENCES TipoLista(id_tipo_lista);
GO
ALTER TABLE Trayecto ADD CONSTRAINT FK_Trayecto_id_ruta FOREIGN KEY (id_ruta) REFERENCES Ruta(id_ruta);
GO
ALTER TABLE Itinerario ADD CONSTRAINT FK_Itinerario_id_ruta FOREIGN KEY (id_ruta) REFERENCES Ruta(id_ruta);
GO
ALTER TABLE Viaje ADD CONSTRAINT FK_Viaje_id_itinerario FOREIGN KEY (id_itinerario) REFERENCES Itinerario(id_itinerario);
GO
ALTER TABLE Viaje ADD CONSTRAINT FK_Viaje_id_bus FOREIGN KEY (id_bus) REFERENCES Bus(id_bus);
GO
ALTER TABLE ListaEspera ADD CONSTRAINT FK_ListaEspera_id_viaje FOREIGN KEY (id_viaje) REFERENCES Viaje(id_viaje);
GO
ALTER TABLE ListaEspera ADD CONSTRAINT FK_ListaEspera_id_cliente FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente);
GO
ALTER TABLE Silla ADD CONSTRAINT FK_Silla_id_bus FOREIGN KEY (id_bus) REFERENCES Bus(id_bus);
GO
ALTER TABLE CierreTurno ADD CONSTRAINT FK_CierreTurno_id_usuario FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario);
GO
ALTER TABLE Tiquete ADD CONSTRAINT FK_Tiquete_id_viaje FOREIGN KEY (id_viaje) REFERENCES Viaje(id_viaje);
GO
ALTER TABLE Tiquete ADD CONSTRAINT FK_Tiquete_id_silla FOREIGN KEY (id_silla) REFERENCES Silla(id_silla);
GO
ALTER TABLE Tiquete ADD CONSTRAINT FK_Tiquete_id_cliente FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente);
GO
ALTER TABLE Tiquete ADD CONSTRAINT FK_Tiquete_id_cierre FOREIGN KEY (id_cierre) REFERENCES CierreTurno(id_cierre);
GO
ALTER TABLE Tiquete ADD CONSTRAINT FK_Tiquete_id_usuario_reserva FOREIGN KEY (id_usuario_reserva) REFERENCES Usuario(id_usuario);
GO
ALTER TABLE Maleta ADD CONSTRAINT FK_Maleta_id_tiquete FOREIGN KEY (id_tiquete) REFERENCES Tiquete(id_tiquete);
GO
ALTER TABLE Devolucion ADD CONSTRAINT FK_Devolucion_id_tiquete FOREIGN KEY (id_tiquete) REFERENCES Tiquete(id_tiquete);
GO
ALTER TABLE Devolucion ADD CONSTRAINT FK_Devolucion_id_usuario_autoriza FOREIGN KEY (id_usuario_autoriza) REFERENCES Usuario(id_usuario);
GO
ALTER TABLE DocumentoVehiculo ADD CONSTRAINT FK_DocumentoVehiculo_id_bus FOREIGN KEY (id_bus) REFERENCES Bus(id_bus);
GO
ALTER TABLE Mantenimiento ADD CONSTRAINT FK_Mantenimiento_id_bus FOREIGN KEY (id_bus) REFERENCES Bus(id_bus);
GO
ALTER TABLE Mantenimiento ADD CONSTRAINT FK_Mantenimiento_id_tipo_mantenimiento FOREIGN KEY (id_tipo_mantenimiento) REFERENCES TipoMantenimiento(id_tipo_mantenimiento);
GO
ALTER TABLE Propiedad ADD CONSTRAINT FK_Propiedad_id_cliente FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente);
GO
ALTER TABLE Propiedad ADD CONSTRAINT FK_Propiedad_id_bus FOREIGN KEY (id_bus) REFERENCES Bus(id_bus);
GO
ALTER TABLE HistorialPlaca ADD CONSTRAINT FK_HistorialPlaca_id_bus FOREIGN KEY (id_bus) REFERENCES Bus(id_bus);
GO
ALTER TABLE Bodega ADD CONSTRAINT FK_Bodega_id_terminal FOREIGN KEY (id_terminal) REFERENCES Terminal(id_terminal);
GO
ALTER TABLE ClienteRemesa ADD CONSTRAINT FK_ClienteRemesa_id_remesa FOREIGN KEY (id_remesa) REFERENCES Remesa(id_remesa);
GO
ALTER TABLE ClienteRemesa ADD CONSTRAINT FK_ClienteRemesa_id_cliente FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente);
GO
ALTER TABLE Envio ADD CONSTRAINT FK_Envio_id_remesa FOREIGN KEY (id_remesa) REFERENCES Remesa(id_remesa);
GO
ALTER TABLE Envio ADD CONSTRAINT FK_Envio_id_categoria_mercancia FOREIGN KEY (id_categoria_mercancia) REFERENCES CategoriaMercancia(id_categoria);
GO
ALTER TABLE Envio ADD CONSTRAINT FK_Envio_id_remitente FOREIGN KEY (id_remitente) REFERENCES Cliente(id_cliente);
GO
ALTER TABLE Envio ADD CONSTRAINT FK_Envio_id_destinatario FOREIGN KEY (id_destinatario) REFERENCES Cliente(id_cliente);
GO
ALTER TABLE Envio ADD CONSTRAINT FK_Envio_id_terminal_origen FOREIGN KEY (id_terminal_origen) REFERENCES Terminal(id_terminal);
GO
ALTER TABLE Envio ADD CONSTRAINT FK_Envio_id_terminal_destino FOREIGN KEY (id_terminal_destino) REFERENCES Terminal(id_terminal);
GO
ALTER TABLE Envio ADD CONSTRAINT FK_Envio_id_bodega_actual FOREIGN KEY (id_bodega_actual) REFERENCES Bodega(id_bodega);
GO
ALTER TABLE Tula ADD CONSTRAINT FK_Tula_id_terminal_origen FOREIGN KEY (id_terminal_origen) REFERENCES Terminal(id_terminal);
GO
ALTER TABLE Tula ADD CONSTRAINT FK_Tula_id_bodega FOREIGN KEY (id_bodega) REFERENCES Bodega(id_bodega);
GO
ALTER TABLE TulaEnvio ADD CONSTRAINT FK_TulaEnvio_id_tula FOREIGN KEY (id_tula) REFERENCES Tula(id_tula);
GO
ALTER TABLE TulaEnvio ADD CONSTRAINT FK_TulaEnvio_id_envio FOREIGN KEY (id_envio) REFERENCES Envio(id_envio);
GO
ALTER TABLE TulaViaje ADD CONSTRAINT FK_TulaViaje_id_tula FOREIGN KEY (id_tula) REFERENCES Tula(id_tula);
GO
ALTER TABLE TulaViaje ADD CONSTRAINT FK_TulaViaje_id_viaje FOREIGN KEY (id_viaje) REFERENCES Viaje(id_viaje);
GO
ALTER TABLE CargaEnvio ADD CONSTRAINT FK_CargaEnvio_id_envio FOREIGN KEY (id_envio) REFERENCES Envio(id_envio);
GO
ALTER TABLE CargaEnvio ADD CONSTRAINT FK_CargaEnvio_id_viaje FOREIGN KEY (id_viaje) REFERENCES Viaje(id_viaje);
GO
ALTER TABLE EntregaFinal ADD CONSTRAINT FK_EntregaFinal_id_envio FOREIGN KEY (id_envio) REFERENCES Envio(id_envio);
GO
ALTER TABLE Bodegaje ADD CONSTRAINT FK_Bodegaje_id_envio FOREIGN KEY (id_envio) REFERENCES Envio(id_envio);
GO
ALTER TABLE PQR ADD CONSTRAINT FK_PQR_id_envio FOREIGN KEY (id_envio) REFERENCES Envio(id_envio);
GO
ALTER TABLE PQR ADD CONSTRAINT FK_PQR_id_usuario_responsable FOREIGN KEY (id_usuario_responsable) REFERENCES Usuario(id_usuario);
GO
ALTER TABLE Historial ADD CONSTRAINT FK_Historial_id_usuario FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario);
GO
ALTER TABLE Historial ADD CONSTRAINT FK_Historial_id_terminal FOREIGN KEY (id_terminal) REFERENCES Terminal(id_terminal);
GO
ALTER TABLE ClienteCorporativo ADD CONSTRAINT FK_ClienteCorporativo_id_cliente_corporativo FOREIGN KEY (id_cliente_corporativo) REFERENCES Cliente(id_cliente);
GO
ALTER TABLE MovimientoCredito ADD CONSTRAINT FK_MovimientoCredito_id_cliente_corporativo FOREIGN KEY (id_cliente_corporativo) REFERENCES ClienteCorporativo(id_cliente_corporativo);
GO
ALTER TABLE Factura ADD CONSTRAINT FK_Factura_id_tiquete FOREIGN KEY (id_tiquete) REFERENCES Tiquete(id_tiquete);
GO
ALTER TABLE Factura ADD CONSTRAINT FK_Factura_id_envio FOREIGN KEY (id_envio) REFERENCES Envio(id_envio);
GO
ALTER TABLE Factura ADD CONSTRAINT FK_Factura_id_movimiento_credito FOREIGN KEY (id_movimiento_credito) REFERENCES MovimientoCredito(id_mov);
GO
ALTER TABLE Factura ADD CONSTRAINT FK_Factura_id_cajero FOREIGN KEY (id_cajero) REFERENCES Usuario(id_usuario);
GO
ALTER TABLE DetalleFactura ADD CONSTRAINT FK_DetalleFactura_id_factura FOREIGN KEY (id_factura) REFERENCES Factura(id_factura);
GO
ALTER TABLE AnulacionFactura ADD CONSTRAINT FK_AnulacionFactura_id_factura FOREIGN KEY (id_factura) REFERENCES Factura(id_factura);
GO
ALTER TABLE RolPermiso ADD CONSTRAINT FK_RolPermiso_id_rol FOREIGN KEY (id_rol) REFERENCES Rol(id_rol);
GO
ALTER TABLE RolPermiso ADD CONSTRAINT FK_RolPermiso_id_permiso FOREIGN KEY (id_permiso) REFERENCES Permiso(id_permiso);
GO
ALTER TABLE Usuario ADD CONSTRAINT FK_Usuario_id_contrato FOREIGN KEY (id_contrato) REFERENCES Contrato(id_contrato);
GO
ALTER TABLE Usuario ADD CONSTRAINT FK_Usuario_id_rol FOREIGN KEY (id_rol) REFERENCES Rol(id_rol);
GO
ALTER TABLE Usuario ADD CONSTRAINT FK_Usuario_id_terminal FOREIGN KEY (id_terminal) REFERENCES Terminal(id_terminal);
GO
ALTER TABLE Auditoria ADD CONSTRAINT FK_Auditoria_id_usuario FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario);
GO
ALTER TABLE AuditoriaDetalle ADD CONSTRAINT FK_AuditoriaDetalle_id_auditoria FOREIGN KEY (id_auditoria) REFERENCES Auditoria(id_auditoria);
GO
ALTER TABLE Departamento ADD CONSTRAINT FK_Departamento_responsable_id FOREIGN KEY (responsable_id) REFERENCES Empleado(id_empleado);
GO
ALTER TABLE Empleado ADD CONSTRAINT FK_Empleado_id_departamento FOREIGN KEY (id_departamento) REFERENCES Departamento(id_departamento);
GO
ALTER TABLE Empleado ADD CONSTRAINT FK_Empleado_id_jefe_directo FOREIGN KEY (id_jefe_directo) REFERENCES Empleado(id_empleado);
GO
ALTER TABLE Licencia ADD CONSTRAINT FK_Licencia_id_empleado FOREIGN KEY (id_empleado) REFERENCES Empleado(id_empleado);
GO
ALTER TABLE AsignacionViaje ADD CONSTRAINT FK_AsignacionViaje_id_viaje FOREIGN KEY (id_viaje) REFERENCES Viaje(id_viaje);
GO
ALTER TABLE AsignacionViaje ADD CONSTRAINT FK_AsignacionViaje_id_empleado FOREIGN KEY (id_empleado) REFERENCES Empleado(id_empleado);
GO
ALTER TABLE AsignacionViaje ADD CONSTRAINT FK_AsignacionViaje_id_tipo_asignacion FOREIGN KEY (id_tipo_asignacion) REFERENCES TipoAsignacion(id_tipo_asignacion);
GO
ALTER TABLE JornadaConductor ADD CONSTRAINT FK_JornadaConductor_id_empleado FOREIGN KEY (id_empleado) REFERENCES Empleado(id_empleado);
GO
ALTER TABLE JornadaConductor ADD CONSTRAINT FK_JornadaConductor_id_horario FOREIGN KEY (id_horario) REFERENCES Horario(id_horario);
GO
ALTER TABLE DescansoConductor ADD CONSTRAINT FK_DescansoConductor_id_empleado FOREIGN KEY (id_empleado) REFERENCES Empleado(id_empleado);
GO
ALTER TABLE Asistencia ADD CONSTRAINT FK_Asistencia_id_empleado FOREIGN KEY (id_empleado) REFERENCES Empleado(id_empleado);
GO
ALTER TABLE Novedad ADD CONSTRAINT FK_Novedad_id_empleado FOREIGN KEY (id_empleado) REFERENCES Empleado(id_empleado);
GO
ALTER TABLE Novedad ADD CONSTRAINT FK_Novedad_id_asistencia FOREIGN KEY (id_asistencia) REFERENCES Asistencia(id_asistencia);
GO
ALTER TABLE Novedad ADD CONSTRAINT FK_Novedad_id_usuario_registra FOREIGN KEY (id_usuario_registra) REFERENCES Usuario(id_usuario);
GO
ALTER TABLE Incapacidad ADD CONSTRAINT FK_Incapacidad_id_empleado FOREIGN KEY (id_empleado) REFERENCES Empleado(id_empleado);
GO
ALTER TABLE Vacacion ADD CONSTRAINT FK_Vacacion_id_empleado FOREIGN KEY (id_empleado) REFERENCES Empleado(id_empleado);
GO
ALTER TABLE Contrato ADD CONSTRAINT FK_Contrato_id_empleado FOREIGN KEY (id_empleado) REFERENCES Empleado(id_empleado);
GO
ALTER TABLE Contrato ADD CONSTRAINT FK_Contrato_id_cargo FOREIGN KEY (id_cargo) REFERENCES Cargo(id_cargo);
GO
ALTER TABLE RenovacionContrato ADD CONSTRAINT FK_RenovacionContrato_id_contrato FOREIGN KEY (id_contrato) REFERENCES Contrato(id_contrato);
GO
ALTER TABLE Nomina ADD CONSTRAINT FK_Nomina_id_empleado FOREIGN KEY (id_empleado) REFERENCES Empleado(id_empleado);
GO
ALTER TABLE DetalleNomina ADD CONSTRAINT FK_DetalleNomina_id_nomina FOREIGN KEY (id_nomina) REFERENCES Nomina(id_nomina);
GO
ALTER TABLE DetalleNomina ADD CONSTRAINT FK_DetalleNomina_id_concepto FOREIGN KEY (id_concepto) REFERENCES ConceptoNomina(id_concepto);
GO