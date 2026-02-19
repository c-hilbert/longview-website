import { Card } from '@/components/ui/Card'

const TEAM_MEMBERS = [
  {
    name: 'Andy Mills',
    role: 'Editor in Chief',
    initial: 'A'
  },
  {
    name: 'Matthew Boll',
    role: 'Editor in Chief',
    initial: 'M'
  },
  {
    name: 'Simon Adler',
    role: 'Head of Studio',
    initial: 'S'
  },
  {
    name: 'Carmen Hilbert',
    role: 'Research Producer',
    initial: 'C'
  }
]

export function TeamSection() {
  return (
    <section className="py-16 sm:py-20 border-t border-[var(--border-light)]">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-semibold text-[var(--ink-black)] mb-4 tracking-[-0.01em]">
          Team
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {TEAM_MEMBERS.map((member, index) => (
          <Card key={index} className="p-6 flex items-start gap-4">
            {/* Avatar placeholder */}
            <div className="w-16 h-16 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center flex-shrink-0">
              <span className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[var(--text-muted)]">
                {member.initial}
              </span>
            </div>
            
            <div>
              <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[var(--ink-black)]">
                {member.name}
              </h3>
              <p className="text-sm font-medium text-[var(--accent-primary)] font-[family-name:var(--font-inter)]">
                {member.role}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
