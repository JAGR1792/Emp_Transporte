export const CITIES = [
  { code: 'BOG', name: 'Bogotá', region: 'Cundinamarca' },
  { code: 'MDE', name: 'Medellín', region: 'Antioquia' },
  { code: 'CLO', name: 'Cali', region: 'Valle del Cauca' },
  { code: 'BAQ', name: 'Barranquilla', region: 'Atlántico' },
  { code: 'CTG', name: 'Cartagena', region: 'Bolívar' },
  { code: 'BGA', name: 'Bucaramanga', region: 'Santander' },
  { code: 'PEI', name: 'Pereira', region: 'Risaralda' },
  { code: 'MTR', name: 'Montería', region: 'Córdoba' },
  { code: 'VUP', name: 'Villavicencio', region: 'Meta' },
  { code: 'MZL', name: 'Manizales', region: 'Caldas' },
  { code: 'CUC', name: 'Cúcuta', region: 'Norte de Santander' },
  { code: 'PSO', name: 'Pasto', region: 'Nariño' },
  { code: 'IBE', name: 'Ibagué', region: 'Tolima' },
  { code: 'ADZ', name: 'San Andrés', region: 'San Andrés' },
  { code: 'LET', name: 'Leticia', region: 'Amazonas' },
]

export const BUS_TYPES = [
  { id: 'ejecutivo', name: 'Ejecutivo', amenities: ['WiFi', 'Aire acondicionado', 'Asiento reclinable 160°', 'Cargador USB', 'Baño', 'Snack'], basePrice: 80000 },
  { id: 'premium', name: 'Premium', amenities: ['WiFi', 'Aire acondicionado', 'Asiento cama 180°', 'Cargador USB', 'Baño', 'Comida', 'Bebidas', 'Entretenimiento'], basePrice: 120000 },
  { id: 'economico', name: 'Económico', amenities: ['Aire acondicionado', 'Asiento reclinable 130°', 'Baño compartido'], basePrice: 45000 },
]

export const PACKAGE_SIZES = [
  { id: 'sobre', name: 'Sobre', maxWeight: 1, dimensions: '30x20x2 cm', basePrice: 12000 },
  { id: 'pequeno', name: 'Pequeño', maxWeight: 5, dimensions: '40x30x20 cm', basePrice: 18000 },
  { id: 'mediano', name: 'Mediano', maxWeight: 15, dimensions: '60x40x30 cm', basePrice: 28000 },
  { id: 'grande', name: 'Grande', maxWeight: 30, dimensions: '80x50x40 cm', basePrice: 42000 },
  { id: 'extra', name: 'Extra Grande', maxWeight: 50, dimensions: '100x60x50 cm', basePrice: 65000 },
]

export const SERVICE_TYPES = [
  { id: 'estandar', name: 'Estándar', days: '3-5 días hábiles', multiplier: 1.0 },
  { id: 'express', name: 'Express', days: '1-2 días hábiles', multiplier: 1.8 },
  { id: 'mismo_dia', name: 'Mismo Día', days: 'Mismo día (ciudades principales)', multiplier: 2.5 },
]

export const PAYMENT_METHODS = [
  { id: 'tarjeta', name: 'Tarjeta de crédito/débito', icon: 'credit-card', fee: 0 },
  { id: 'pse', name: 'PSE', icon: 'banknote', fee: 0 },
  { id: 'nequi', name: 'Nequi', icon: 'smartphone', fee: 0 },
  { id: 'daviplata', name: 'DaviPlata', icon: 'smartphone', fee: 0 },
  { id: 'efecty', name: 'Efecty / Baloto', icon: 'cash', fee: 2000 },
]

export const TRACKING_STATUSES = [
  { id: 'creado', label: 'Creado', description: 'Tu envío ha sido registrado', color: 'slate' },
  { id: 'recogido', label: 'Recogido', description: 'El mensajero ha recogido el paquete', color: 'blue' },
  { id: 'en_transito', label: 'En tránsito', description: 'Tu paquete está en camino', color: 'amber' },
  { id: 'en_centro', label: 'En centro de distribución', description: 'Llegó al centro de distribución', color: 'purple' },
  { id: 'en_reparto', label: 'En reparto', description: 'El mensajero está entregando', color: 'orange' },
  { id: 'entregado', label: 'Entregado', description: 'Tu paquete fue entregado', color: 'green' },
  { id: 'devuelto', label: 'Devuelto', description: 'El paquete fue devuelto al remitente', color: 'red' },
]

export const SEAT_MAP = {
  ejecutivo: { rows: 12, cols: 4, layout: [1, 0, 2, 3] },
  premium: { rows: 10, cols: 4, layout: [1, 0, 2, 3] },
  economico: { rows: 14, cols: 4, layout: [1, 2, 3, 4] },
}

export const COMPANY_INFO = {
  name: 'Transporte Nacional',
  tagline: 'Conectando Colombia',
  phone: '01 8000 123 456',
  email: 'info@transportenacional.com',
  address: 'Calle 100 # 15-45, Bogotá, Colombia',
  social: {
    facebook: 'https://facebook.com/transportenacional',
    twitter: 'https://twitter.com/transportenac',
    instagram: 'https://instagram.com/transportenacional',
    linkedin: 'https://linkedin.com/company/transportenacional',
  },
}