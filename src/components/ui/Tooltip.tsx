import { useState, type ReactNode, type HTMLAttributes } from 'react'
import { cn } from '@/utils'

export interface TooltipProps {
  content: ReactNode
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

export const Tooltip = ({ content, children, position = 'top', delay = 200 }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null)

  const show = () => {
    const id = setTimeout(() => setIsVisible(true), delay)
    setTimeoutId(id)
  }

  const hide = () => {
    if (timeoutId) clearTimeout(timeoutId)
    setIsVisible(false)
  }

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  const arrows = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-brand-900',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-brand-900',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-brand-900',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-brand-900',
  }

  return (
    <div className="relative inline-block" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      {isVisible && (
        <div
          className={cn(
            'absolute z-50 px-3 py-1.5 text-caption font-medium text-white bg-brand-900 rounded-radius-lg whitespace-nowrap animate-fade-in',
            positions[position]
          )}
          role="tooltip"
        >
          {content}
          <div className={cn('absolute w-0 h-0 border-2 border-transparent', arrows[position])} />
        </div>
      )}
    </div>
  )
}