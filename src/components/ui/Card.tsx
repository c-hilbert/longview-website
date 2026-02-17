import { clsx } from 'clsx'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  variant?: 'default' | 'subtle' | 'elevated'
}

export function Card({ 
  children, 
  className, 
  padding = 'md', 
  variant = 'default',
  ...props 
}: CardProps) {
  return (
    <div
      className={clsx(
        // Base styles
        'transition-shadow duration-200',
        // Variant styles
        {
          'bg-[var(--bg-elevated)] border border-[var(--border-light)] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)]': variant === 'default',
          'bg-[var(--bg-secondary)] rounded-[var(--radius-md)]': variant === 'subtle',
          'bg-[var(--bg-elevated)] border border-[var(--border-light)] rounded-[var(--radius-md)] shadow-[var(--shadow-md)]': variant === 'elevated',
        },
        // Padding styles
        {
          'p-0': padding === 'none',
          'p-4': padding === 'sm',
          'p-6': padding === 'md',
          'p-8': padding === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
