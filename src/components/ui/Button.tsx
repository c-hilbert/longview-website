import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        // Base styles
        'inline-flex items-center justify-center font-medium transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2',
        'tracking-[-0.01em]',
        // Variant styles - Editorial aesthetic
        {
          'bg-[var(--ink-black)] text-[var(--bg-primary)] border border-[var(--ink-black)] hover:bg-[var(--text-secondary)] hover:border-[var(--text-secondary)]': variant === 'primary',
          'bg-transparent text-[var(--text-primary)] border border-[var(--border-medium)] hover:bg-[var(--bg-secondary)] hover:border-[var(--border-dark)]': variant === 'secondary',
          'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]': variant === 'ghost',
        },
        // Size styles
        {
          'px-3 py-2 text-sm rounded-[var(--radius-md)]': size === 'sm',
          'px-5 py-2.5 text-sm rounded-[var(--radius-md)]': size === 'md',
          'px-6 py-3 text-base rounded-[var(--radius-md)]': size === 'lg',
        },
        className
      )}
      {...props}
    />
  )
)

Button.displayName = 'Button'
