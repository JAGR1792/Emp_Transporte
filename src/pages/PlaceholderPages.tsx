import { motion } from 'framer-motion'

export const PlaceholderPage = ({ title, description }: { title: string, description: string }) => {
  return (
    <div className="min-h-[60vh] container-page flex items-center justify-center py-20">
      <motion.div 
        className="max-w-2xl mx-auto text-center bg-white p-12 rounded-radius-2xl shadow-shadow-sm border border-slate-100"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h1 className="text-heading-xl font-bold text-slate-900 mb-4">{title}</h1>
        <p className="text-body-lg text-slate-600 mb-8">
          {description}
        </p>
        <div className="inline-block px-4 py-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-radius-lg text-body-sm font-medium">
          Módulo en construcción
        </div>
      </motion.div>
    </div>
  )
}
