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
        'inline-flex items-center justify-center font-medium rounded transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        {
          // Primary: Editorial Red
          'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] focus:ring-[var(--color-primary)] shadow-sm': variant === 'primary',
          // Secondary: Clean outlined
          'bg-white border-2 border-[var(--color-foreground)] text-[var(--color-foreground)] hover:bg-[var(--color-foreground)] hover:text-white focus:ring-[var(--color-foreground)]': variant === 'secondary',
          // Ghost: Subtle hover
          'text-[var(--color-foreground)] hover:bg-[var(--color-hover-bg)] focus:ring-[var(--color-muted)]': variant === 'ghost',
        },
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-5 py-2.5 text-base': size === 'md',
          'px-7 py-3.5 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    />
  )
)

Button.displayName = 'Button'
