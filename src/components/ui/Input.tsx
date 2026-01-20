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
        <label className="block text-sm font-medium text-stone-700 mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={clsx(
          'w-full px-4 py-3 border rounded-lg transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400',
          'disabled:bg-stone-100 disabled:cursor-not-allowed',
          'placeholder:text-stone-400',
          error ? 'border-rose-400' : 'border-stone-300',
          className
        )}
        {...props}
      />
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
    </div>
  )
)

Input.displayName = 'Input'
