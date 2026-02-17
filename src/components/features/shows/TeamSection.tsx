import { Card } from '@/components/ui/Card'

const TEAM_MEMBERS = [
  {
    name: 'Andy Mills',
    role: 'Editor in Chief',
    bio: 'Co-founder and editor leading Longview\'s investigative journalism.',
    initial: 'A'
  },
  {
    name: 'Matthew Boll',
    role: 'Editor in Chief',
    bio: 'Co-founder and editor shaping Longview\'s editorial vision.',
    initial: 'M'
  },
  {
    name: 'Simon Adler',
    role: 'Head of Studio',
    bio: 'Overseeing production and studio operations.',
    initial: 'S'
  },
  {
    name: 'Carmen Hilbert',
    role: 'Research Producer',
    bio: 'Research and production for investigative stories.',
    initial: 'C'
  }
]

export function TeamSection() {
  return (
    <section className="py-16 sm:py-20 border-t border-[var(--border-light)]">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-semibold text-[var(--ink-black)] mb-4 tracking-[-0.01em]">
          Behind the Mic
        </h2>
        <p className="text-[var(--text-tertiary)] font-[family-name:var(--font-inter)]">
          The people making the conversations happen
        </p>
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
              <p className="text-sm font-medium text-[var(--accent-primary)] mb-2 font-[family-name:var(--font-inter)]">
                {member.role}
              </p>
              <p className="text-sm text-[var(--text-tertiary)] leading-relaxed font-[family-name:var(--font-inter)]">
                {member.bio}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
