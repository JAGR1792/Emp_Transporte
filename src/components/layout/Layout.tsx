import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils'
import { Button } from '@/components/ui'
import { Menu, X, Truck, MapPin, Phone, Mail, Users } from 'lucide-react'

const NAV_ITEMS = [
  { path: '/', label: 'Inicio' },
  { path: '/pasajeros', label: 'Pasajeros' },
  { path: '/envios', label: 'Envíos' },
  { path: '/rastreo', label: 'Rastreo' },
  { path: '/servicios', label: 'Servicios' },
]

const FOOTER_LINKS = {
  empresa: [
    { label: 'Nosotros', href: '#' },
    { label: 'Cobertura', href: '#' },
    { label: 'Flota', href: '#' },
    { label: 'Trabaja con nosotros', href: '#' },
  ],
  ayuda: [
    { label: 'Preguntas frecuentes', href: '#' },
    { label: 'Contacto', href: '#' },
    { label: 'Términos y condiciones', href: '#' },
    { label: 'Política de privacidad', href: '#' },
  ],
  pasajeros: [
    { label: 'Comprar tiquetes', href: '/pasajeros' },
    { label: 'Mis viajes', href: '#' },
    { label: 'Cambios y devoluciones', href: '#' },
    { label: 'Equipaje', href: '#' },
  ],
  envios: [
    { label: 'Cotizar envío', href: '/envios' },
    { label: 'Rastrear paquete', href: '/rastreo' },
    { label: 'Puntos de recolección', href: '#' },
    { label: 'Embalaje', href: '#' },
  ],
}

const CONTACT_INFO = {
  phone: '01 8000 123 456',
  email: 'info@transportenacional.com',
  address: 'Calle 100 # 15-45, Bogotá, Colombia',
}

export const Header = () => {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-normal',
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-shadow-sm' : 'bg-transparent'
      )}
    >
      <nav className="container-page" aria-label="Navegación principal">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 z-50" aria-label="Transporte Nacional - Inicio">
            <div className="relative">
              <div className="w-10 h-10 rounded-radius-xl bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <motion.span
                className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 20 }}
              />
            </div>
            <span className="font-display font-bold text-heading-lg text-slate-900 hidden sm:block">
              Transporte Nacional
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'px-4 py-2.5 text-body-md font-medium rounded-radius-lg transition-all duration-fast',
                  location.pathname === item.path
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
                aria-current={location.pathname === item.path ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/rastreo">
              <Button variant="ghost" size="sm" leftIcon={<MapPin className="w-4 h-4" />}>
                Rastrear
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="sm" leftIcon={<Users className="w-4 h-4" />}>
                Ingresar
              </Button>
            </Link>
            <Link to="/pasajeros">
              <Button size="sm" leftIcon={<Truck className="w-4 h-4" />}>
                Comprar tiquetes
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-radius-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              className="lg:hidden overflow-hidden bg-white border-t border-slate-100"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="py-4 space-y-1">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'block px-4 py-3 text-body-md font-medium rounded-radius-lg transition-colors',
                      location.pathname === item.path
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    )}
                    aria-current={location.pathname === item.path ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center">
                    <Button variant="outline" fullWidth leftIcon={<Users className="w-4 h-4" />}>
                      Ingresar
                    </Button>
                  </Link>
                  <Link to="/rastreo" onClick={() => setMobileMenuOpen(false)} className="text-center">
                    <Button variant="outline" fullWidth leftIcon={<MapPin className="w-4 h-4" />}>
                      Rastrear envío
                    </Button>
                  </Link>
                  <Link to="/pasajeros" onClick={() => setMobileMenuOpen(false)} className="text-center">
                    <Button fullWidth leftIcon={<Truck className="w-4 h-4" />}>
                      Comprar tiquetes
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300" role="contentinfo">
      <div className="container-page py-16 lg:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6" aria-label="Transporte Nacional - Inicio">
              <div className="w-10 h-10 rounded-radius-xl bg-gradient-to-br from-brand-500 to-brand-400 flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-heading-lg text-white">Transporte Nacional</span>
            </Link>
            <p className="text-body-sm text-slate-400 mb-6 leading-relaxed">
              Conectando Colombia desde 1995. Transporte de pasajeros, mensajería y paquetes a nivel nacional con la mejor calidad y seguridad.
            </p>
          </div>

          {/* Empresa */}
          <nav aria-label="Empresa">
            <h3 className="font-semibold text-white mb-4">Empresa</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.empresa.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-body-sm text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Ayuda */}
          <nav aria-label="Ayuda">
            <h3 className="font-semibold text-white mb-4">Ayuda</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.ayuda.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-body-sm text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Pasajeros */}
          <nav aria-label="Pasajeros">
            <h3 className="font-semibold text-white mb-4">Pasajeros</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.pasajeros.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-body-sm text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Envíos */}
          <nav aria-label="Envíos">
            <h3 className="font-semibold text-white mb-4">Envíos</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.envios.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-body-sm text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 lg:mt-16 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-body-sm text-slate-500">
              © 2026 Transporte Nacional. Todos los derechos reservados.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-body-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">
                  {CONTACT_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-white transition-colors">
                  {CONTACT_INFO.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{CONTACT_INFO.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 pt-16 lg:pt-20" id="main-content">
      {children}
    </main>
    <Footer />
  </div>
)