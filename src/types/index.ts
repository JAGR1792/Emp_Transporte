export interface City {
  code: string
  name: string
  region: string
}

export interface BusType {
  id: string
  name: string
  amenities: string[]
  basePrice: number
}

export interface PackageSize {
  id: string
  name: string
  maxWeight: number
  dimensions: string
  basePrice: number
}

export interface ServiceType {
  id: string
  name: string
  days: string
  multiplier: number
}

export interface PaymentMethod {
  id: string
  name: string
  icon: string
  fee: number
}

export interface TrackingStatus {
  id: string
  label: string
  description: string
  color: string
}

export interface Route {
  id: string
  origin: City
  destination: City
  distance: number
  duration: number
  price: number
  busType: string
  departureTimes: string[]
}

export interface Booking {
  id: string
  route: Route
  date: string
  departureTime: string
  seats: number[]
  busType: string
  passengers: Passenger[]
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

export interface Passenger {
  id: string
  name: string
  documentType: 'cc' | 'ce' | 'pasaporte'
  documentNumber: string
  phone: string
  email: string
  seat?: number
}

export interface Package {
  id: string
  trackingCode: string
  sender: ContactInfo
  recipient: ContactInfo
  size: PackageSize
  serviceType: ServiceType
  weight: number
  declaredValue: number
  price: number
  status: string
  statusHistory: StatusUpdate[]
  createdAt: string
  estimatedDelivery: string
}

export interface ContactInfo {
  name: string
  phone: string
  email: string
  address: string
  city: City
}

export interface StatusUpdate {
  status: string
  location: string
  timestamp: string
  description: string
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  documentType: string
  documentNumber: string
  bookings: Booking[]
  packages: Package[]
  preferences: UserPreferences
}

export interface UserPreferences {
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
  language: 'es' | 'en'
  currency: 'COP' | 'USD'
}

export interface SearchParams {
  origin: string
  destination: string
  date: string
  passengers: number
  type: 'pasajeros' | 'paquetes'
}

export interface SearchResults {
  routes: Route[]
  availableSeats: { [key: string]: number[] }
}

export interface PriceBreakdown {
  basePrice: number
  serviceMultiplier: number
  weightSurcharge: number
  insurance: number
  fees: number
  discount: number
  total: number
}