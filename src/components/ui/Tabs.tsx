'use client'

import { clsx } from 'clsx'

interface Tab {
  id: string
  label: string
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
  variant?: 'default' | 'editorial'
}

export function Tabs({ tabs, activeTab, onChange, variant = 'default' }: TabsProps) {
  return (
    <div 
      className={clsx(
        'flex gap-1',
        variant === 'default' && 'border-b border-[var(--border-medium)]',
        variant === 'editorial' && 'border-b border-[var(--border-light)]'
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            'px-4 py-3 text-sm font-medium -mb-px transition-all duration-200',
            'tracking-[-0.01em]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2',
            variant === 'editorial' && 'font-[family-name:var(--font-inter)]',
            activeTab === tab.id
              ? 'border-b-2 border-[var(--accent-primary)] text-[var(--text-primary)]'
              : 'border-b-2 border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
