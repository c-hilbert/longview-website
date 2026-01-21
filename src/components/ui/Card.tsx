import { clsx } from 'clsx'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  padding?: 'none' | 'sm' | 'md'
}

export function Card({ children, className, padding = 'md', ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white border border-stone-200/80 rounded-xl shadow-sm',
        {
          'p-0': padding === 'none',
          'p-4': padding === 'sm',
          'p-6': padding === 'md',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
