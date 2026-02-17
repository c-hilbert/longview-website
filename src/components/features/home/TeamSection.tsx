export function TeamSection() {
  const team = [
    { name: 'Andy Mills', role: 'Host & Creator' },
    { name: 'Megan Phelps-Roper', role: 'Host' },
    { name: 'Carmen Hilbert', role: 'Revenue & Business' },
    { name: 'Jake Gorst', role: 'Visual Director' },
    { name: 'Andrew Mast', role: 'Branding' },
  ]

  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-foreground)] mb-12 tracking-tight text-center">
          Team
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member) => (
            <div key={member.name} className="text-center">
              {/* Placeholder for team photo */}
              <div className="w-32 h-32 rounded-full bg-[var(--color-card-bg)] border-2 border-[var(--color-border)] mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-[var(--color-muted)]">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              
              <h3 className="font-semibold text-[var(--color-foreground)] text-lg">
                {member.name}
              </h3>
              <p className="text-[var(--color-muted)] text-sm">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
