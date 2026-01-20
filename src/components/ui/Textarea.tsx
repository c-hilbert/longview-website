import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={clsx(
          'w-full px-3 py-2.5 border rounded-md min-h-[120px] resize-y',
          'focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent',
          'disabled:bg-neutral-100 disabled:cursor-not-allowed',
          error ? 'border-red-500' : 'border-neutral-300',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  )
)

Textarea.displayName = 'Textarea'
