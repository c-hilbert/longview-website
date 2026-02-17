import { Card } from '@/components/ui/Card'

export function MissionSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-semibold text-[var(--ink-black)] mb-6 tracking-[-0.01em]">
          Our Mission
        </h2>
        
        <p className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed font-[family-name:var(--font-source-serif)] mb-8">
          Longview is politically independent. We don't favor any party, movement, or ideology. 
          We strive to always be fair‑minded, engaging respectfully with all viewpoints — popular or not — 
          without cheap shots or dismissive rhetoric.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
          {[
            {
              title: 'Intellectual Humility',
              description: 'We practice transparency about what we know and, just as importantly, what we don\'t.'
            },
            {
              title: 'Opposing Perspectives',
              description: 'We believe opposing views are essential to converge on truth — the tension sharpens insights and challenges blind spots.'
            },
            {
              title: 'Prizing Curiosity',
              description: 'The lifeblood of our work — driving us to question, explore, and look beyond the surface to uncover what others may miss.'
            }
          ].map((item, index) => (
            <Card key={index} variant="subtle" className="p-6 text-left">
              <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[var(--ink-black)] mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-[var(--text-tertiary)] leading-relaxed font-[family-name:var(--font-inter)]">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
