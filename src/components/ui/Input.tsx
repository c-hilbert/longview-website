import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-[var(--color-foreground)] mb-2 tracking-tight">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={clsx(
          'w-full px-4 py-3 border-2 rounded transition-all',
          'bg-white text-[var(--color-foreground)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-[var(--color-primary)]',
          'disabled:bg-[var(--color-hover-bg)] disabled:cursor-not-allowed disabled:text-[var(--color-muted)]',
          'placeholder:text-[var(--color-muted)]',
          error ? 'border-red-500' : 'border-[var(--color-border)] hover:border-[var(--color-muted)]',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  )
)

Input.displayName = 'Input'
