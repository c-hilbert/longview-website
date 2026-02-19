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
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 tracking-[-0.01em]">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={clsx(
          // Base styles
          'w-full font-[family-name:var(--font-inter)] text-[var(--text-primary)]',
          'bg-[var(--bg-elevated)] border rounded-[var(--radius-md)]',
          'px-4 py-3 leading-[var(--leading-normal)]',
          // Transition
          'transition-all duration-200',
          // Placeholder
          'placeholder:text-[var(--text-muted)]',
          // States
          'hover:border-[var(--border-dark)]',
          'focus:outline-none focus:border-[var(--accent-primary)] focus:ring-3 focus:ring-[var(--accent-subtle)]',
          'disabled:bg-[var(--bg-secondary)] disabled:cursor-not-allowed disabled:text-[var(--text-muted)]',
          // Error state
          error ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-100' : 'border-[var(--border-medium)]',
          className
        )}
        {...props}
      />
      {error && <p className="mt-2 text-sm text-rose-600 font-medium">{error}</p>}
    </div>
  )
)

Input.displayName = 'Input'
