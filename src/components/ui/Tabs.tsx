import { createContext, useContext, useState, type ReactNode, type HTMLAttributes } from 'react'
import { cn } from '@/utils'

interface TabsContextValue {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

export interface TabsProps {
  defaultTab: string
  children: ReactNode
  className?: string
  onChange?: (tab: string) => void
}

export const Tabs = ({ defaultTab, children, className, onChange }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab)

  const handleSetActiveTab = (tab: string) => {
    setActiveTab(tab)
    onChange?.(tab)
  }

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleSetActiveTab }}>
      <div className={cn(className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {}

export const TabList = forwardRef<HTMLDivElement, TabListProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      role="tablist"
      className={cn('flex gap-1 p-1 bg-slate-100 rounded-radius-xl', className)}
      {...props}
    >
      {children}
    </div>
  )
)
TabList.displayName = 'TabList'

export interface TabProps extends HTMLAttributes<HTMLButtonElement> {
  id: string
  disabled?: boolean
}

export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  ({ id, disabled, className, children, ...props }, ref) => {
    const context = useContext(TabsContext)
    if (!context) throw new Error('Tab must be used within Tabs')

    const { activeTab, setActiveTab } = context
    const isActive = activeTab === id

    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isActive}
        aria-controls={`${id}-panel`}
        id={`${id}-trigger`}
        disabled={disabled}
        onClick={() => !disabled && setActiveTab(id)}
        className={cn(
          'relative px-4 py-2.5 text-body-sm font-medium rounded-radius-lg transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
          isActive
            ? 'bg-white text-brand-600 shadow-shadow-sm'
            : 'text-slate-600 hover:text-slate-900',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Tab.displayName = 'Tab'

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  id: string
}

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ id, className, children, ...props }, ref) => {
    const context = useContext(TabsContext)
    if (!context) throw new Error('TabPanel must be used within Tabs')

    const { activeTab } = context
    const isActive = activeTab === id

    if (!isActive) return null

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-trigger`}
        className={cn('animate-fade-in', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TabPanel.displayName = 'TabPanel'