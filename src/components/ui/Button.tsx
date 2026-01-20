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
        'inline-flex items-center justify-center font-medium rounded-md transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-neutral-900 text-white hover:bg-neutral-800': variant === 'primary',
          'bg-white border border-neutral-300 hover:bg-neutral-50': variant === 'secondary',
          'hover:bg-neutral-100': variant === 'ghost',
        },
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-sm': size === 'md',
          'px-6 py-3': size === 'lg',
        },
        className
      )}
      {...props}
    />
  )
)

Button.displayName = 'Button'
