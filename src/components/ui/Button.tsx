import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, fullWidth, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-shadow-md hover:shadow-shadow-lg',
      secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300',
      outline: 'border-2 border-slate-300 text-slate-700 hover:bg-slate-50 active:bg-slate-100 hover:border-slate-400',
      ghost: 'text-slate-600 hover:bg-slate-100 active:bg-slate-200',
      danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-shadow-md hover:shadow-shadow-lg',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-body-sm gap-1.5 rounded-radius-md',
      md: 'px-5 py-2.5 text-body-md gap-2 rounded-radius-lg',
      lg: 'px-7 py-3.5 text-body-lg gap-2.5 rounded-radius-xl',
      xl: 'px-10 py-4.5 text-heading-sm gap-3 rounded-radius-2xl',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], fullWidth && 'w-full', className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'