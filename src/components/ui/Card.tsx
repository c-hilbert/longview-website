import { clsx } from 'clsx'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  variant?: 'default' | 'bordered'
}

export function Card({ children, className, padding = 'md', variant = 'default', ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-[var(--color-card-bg)] transition-all duration-200',
        {
          // Default: Subtle card with soft shadow
          'border border-[var(--color-card-border)] shadow-sm': variant === 'default',
          // Bordered: Clean editorial borders only
          'border-2 border-[var(--color-border)]': variant === 'bordered',
        },
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
