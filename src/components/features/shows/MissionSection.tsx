import { Card } from '@/components/ui/Card'

export function MissionSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-semibold text-[var(--ink-black)] mb-6 tracking-[-0.01em]">
          Our Mission
        </h2>
        
        <p className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed font-[family-name:var(--font-source-serif)]">
          Longview is politically independent. We don't favor any party, movement, or ideology. 
          We strive to always be fair‑minded, engaging respectfully with all viewpoints — popular or not — 
          without cheap shots or dismissive rhetoric.
        </p>
      </div>
    </section>
  )
}
