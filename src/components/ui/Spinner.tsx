import { cn } from '@/utils'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  label?: string
}

export const Spinner = ({ size = 'md', className, label = 'Cargando...' }: SpinnerProps) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  }

  return (
    <div className={cn('flex items-center justify-center gap-2', className)} role="status" aria-live="polite">
      <svg className={cn('animate-spin text-brand-600', sizes[size])} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      {label && <span className="sr-only">{label}</span>}
    </div>
  )
}

export const SpinnerOverlay = ({ label = 'Cargando...', className }: { label?: string; className?: string }) => (
  <div className={cn('fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm', className)}>
    <div className="bg-white p-8 rounded-radius-2xl shadow-shadow-elevated flex flex-col items-center gap-4">
      <Spinner size="lg" />
      <p className="text-body-md text-slate-600">{label}</p>
    </div>
  </div>
)

export const Skeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement> & { className?: string }) => (
  <div
    className={cn('animate-pulse bg-slate-200 rounded-radius-lg', className)}
    {...props}
  />
)

export const CardSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-radius-xl p-6 space-y-4 animate-pulse">
    <div className="h-6 w-3/4 bg-slate-200 rounded-radius-lg" />
    <div className="h-4 w-full bg-slate-200 rounded-radius-lg" />
    <div className="h-4 w-5/6 bg-slate-200 rounded-radius-lg" />
    <div className="h-4 w-4/6 bg-slate-200 rounded-radius-lg" />
    <div className="h-10 w-full bg-slate-200 rounded-radius-lg mt-4" />
  </div>
)

export const TableRowSkeleton = ({ columns = 5 }: { columns?: number }) => (
  <tr className="animate-pulse">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="py-4 px-4">
        <div className="h-4 bg-slate-200 rounded-radius-lg w-3/4" />
      </td>
    ))}
  </tr>
)