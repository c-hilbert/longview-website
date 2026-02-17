'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'

export function EmailSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setStatus('loading')
    
    // Simulate API call - in production, integrate with email service
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setStatus('success')
    setEmail('')
    
    // Reset after 3 seconds
    setTimeout(() => setStatus('idle'), 3000)
  }

  return (
    <Card variant="elevated" className="bg-[var(--ink-black)] border-[var(--ink-black)]">
      <div className="p-6 sm:p-8 lg:p-10">
        <h3 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-semibold text-white mb-3">
          Stay in the loop
        </h3>
        <p className="text-[var(--text-tertiary)] mb-6 font-[family-name:var(--font-inter)] leading-relaxed">
          Get new episodes and exclusive content delivered to your inbox. No spam, unsubscribe anytime.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-[var(--radius-md)] text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent font-[family-name:var(--font-inter)] transition-all duration-200"
            required
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="px-6 py-3 bg-white text-[var(--ink-black)] font-medium rounded-[var(--radius-md)] hover:bg-[var(--bg-secondary)] transition-colors duration-200 disabled:opacity-70 font-[family-name:var(--font-inter)] whitespace-nowrap"
          >
            {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
          </button>
        </form>
        
        {status === 'success' && (
          <p className="mt-4 text-sm text-green-400 font-[family-name:var(--font-inter)]">
            Thanks for subscribing! Check your inbox for confirmation.
          </p>
        )}
        
        <p className="mt-4 text-xs text-white/40 font-[family-name:var(--font-inter)]">
          Join 5,000+ listeners. We respect your privacy.
        </p>
      </div>
    </Card>
  )
}
