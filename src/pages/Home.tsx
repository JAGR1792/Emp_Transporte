import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'
import ShapeGrid from '@/components/ui/ShapeGrid'
import { Truck, MapPin, Package, ShieldCheck, Clock, Globe } from 'lucide-react'

export const Home = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] lg:h-[700px] flex items-center overflow-hidden bg-slate-900">
        {/* Animated ShapeGrid background */}
        <div className="absolute inset-0 z-0 opacity-20">
          <ShapeGrid
            speed={0.4}
            squareSize={44}
            direction="diagonal"
            borderColor="#7c9dcc"
            hoverFillColor="#3b6fa0"
            shape="square"
            hoverTrailAmount={5}
          />
        </div>
        {/* Gradient overlay to keep text readable — pointer-events-none so hover reaches the canvas */}
        <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-br from-brand-900/70 via-slate-900/80 to-black/90" />
        
        <div className="container-page relative z-10 pt-16">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <span className="inline-block py-1.5 px-3 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-body-sm font-semibold mb-6">
                Líderes en Transporte Nacional
              </span>
              <h1 className="text-heading-2xl lg:text-[4rem] leading-tight font-bold text-white mb-6">
                Conectamos tu mundo, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-blue-400">
                  sin límites.
                </span>
              </h1>
              <p className="text-body-lg text-slate-300 mb-10 max-w-2xl leading-relaxed">
                Soluciones integrales de transporte de pasajeros y mensajería con la mayor flota y cobertura a nivel nacional. Seguridad, puntualidad y confianza en cada viaje.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/pasajeros">
                  <Button size="xl" leftIcon={<Truck className="w-5 h-5" />}>
                    Comprar Tiquetes
                  </Button>
                </Link>
                <Link to="/envios">
                  <Button variant="outline" size="xl" className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30" leftIcon={<Package className="w-5 h-5" />}>
                    Cotizar Envío
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rastrear Envío Banner (Quick Action) */}
      <div className="container-page relative z-20 -mt-12 lg:-mt-16">
        <motion.div 
          className="bg-white rounded-radius-2xl p-6 lg:p-10 shadow-shadow-elevated border border-slate-100 flex flex-col md:flex-row items-center gap-6 justify-between"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-14 h-14 bg-brand-50 rounded-full flex items-center justify-center shrink-0">
              <MapPin className="w-7 h-7 text-brand-600" />
            </div>
            <div>
              <h3 className="text-heading-sm font-bold text-slate-900">Rastrea tu paquete</h3>
              <p className="text-body-sm text-slate-500">Ingresa tu número de guía para ver el estado</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row w-full md:w-[500px] gap-3">
            <input 
              type="text" 
              placeholder="Ej: TRN-123456789" 
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-radius-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-slate-900"
            />
            <Button size="lg" className="whitespace-nowrap">
              Rastrear Ahora
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Services Section */}
      <section className="py-24 bg-slate-50">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-heading-xl font-bold text-slate-900 mb-4">Nuestros Servicios</h2>
            <p className="text-body-md text-slate-600">
              Ofrecemos una amplia gama de soluciones logísticas y de transporte diseñadas para satisfacer las necesidades de personas y empresas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Truck className="w-8 h-8 text-brand-600" />,
                title: 'Pasajeros',
                desc: 'Viaja cómodo y seguro a más de 150 destinos en todo el país con nuestra moderna flota de autobuses.',
                link: '/pasajeros'
              },
              {
                icon: <Package className="w-8 h-8 text-brand-600" />,
                title: 'Mensajería Express',
                desc: 'Envíos rápidos y seguros de documentos y paquetes pequeños puerta a puerta.',
                link: '/envios'
              },
              {
                icon: <Globe className="w-8 h-8 text-brand-600" />,
                title: 'Carga Especializada',
                desc: 'Transporte de mercancías pesadas, refrigeradas y sobredimensionadas para la industria.',
                link: '/servicios'
              }
            ].map((service, i) => (
              <motion.div
                key={service.title}
                className="bg-white p-8 rounded-radius-xl border border-slate-100 shadow-shadow-sm hover:shadow-shadow-md transition-shadow group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="w-16 h-16 bg-brand-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-normal">
                  {service.icon}
                </div>
                <h3 className="text-heading-sm font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-body-sm text-slate-600 mb-6 line-clamp-3">
                  {service.desc}
                </p>
                <Link to={service.link} className="text-brand-600 font-semibold text-body-sm flex items-center gap-1 hover:text-brand-700">
                  Conocer más 
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container-page">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-heading-xl font-bold text-slate-900 mb-6">
                  ¿Por qué viajar y enviar con nosotros?
                </h2>
                <p className="text-body-lg text-slate-600 mb-10">
                  Más de 25 años de experiencia nos respaldan. Trabajamos diariamente para mejorar nuestros procesos y ofrecerte la mejor experiencia del mercado.
                </p>

                <div className="space-y-8">
                  {[
                    {
                      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
                      bg: 'bg-emerald-50',
                      title: 'Máxima Seguridad',
                      desc: 'Monitoreo GPS 24/7 y estrictos protocolos de bioseguridad.'
                    },
                    {
                      icon: <Clock className="w-6 h-6 text-blue-600" />,
                      bg: 'bg-blue-50',
                      title: 'Puntualidad Garantizada',
                      desc: 'Cumplimiento del 98% en nuestros itinerarios y tiempos de entrega.'
                    },
                    {
                      icon: <Globe className="w-6 h-6 text-purple-600" />,
                      bg: 'bg-purple-50',
                      title: 'Cobertura Total',
                      desc: 'Llegamos a donde otros no pueden. Más de 150 terminales propias.'
                    }
                  ].map((feature) => (
                    <div key={feature.title} className="flex gap-5">
                      <div className={`w-14 h-14 ${feature.bg} rounded-radius-lg flex items-center justify-center shrink-0`}>
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="text-heading-xs font-bold text-slate-900 mb-1">{feature.title}</h4>
                        <p className="text-body-sm text-slate-600">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
            <div className="lg:w-1/2 w-full">
              {/* Premium image mockup replacement using styled divs */}
              <motion.div 
                className="relative w-full aspect-square md:aspect-video lg:aspect-square bg-slate-100 rounded-radius-3xl overflow-hidden border border-slate-200"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                 <div className="absolute inset-0 bg-gradient-to-tr from-brand-600 to-blue-400 opacity-90" />
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                      <Truck className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-heading-lg font-bold text-white mb-2">Tu mejor compañero de ruta</h3>
                    <p className="text-white/80 max-w-sm">
                      Descarga nuestra app móvil y lleva el control total de tus viajes y envíos en la palma de tu mano.
                    </p>
                 </div>
                 {/* Decorative elements */}
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl" />
                 <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-xl" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
