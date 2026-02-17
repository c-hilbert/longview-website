export function MissionSection() {
  return (
    <section className="py-16 md:py-24 px-6 bg-[var(--color-card-bg)]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-foreground)] mb-8 tracking-tight text-center">
          Our Mission
        </h2>
        
        <div className="prose prose-lg mx-auto">
          <p className="text-[var(--color-muted)] leading-relaxed text-center">
            Longview Investigations produces in-depth, investigative journalism that provides 
            essential context for understanding the complex forces shaping our world. We believe 
            that rigorous reporting, paired with thoughtful analysis, is vital to an informed 
            society.
          </p>
          
          <p className="text-[var(--color-muted)] leading-relaxed text-center mt-6">
            Through our podcast series and written work, we explore stories that matter — 
            from emerging technologies to social movements, from policy decisions to cultural shifts. 
            We're committed to editorial independence, thorough research, and storytelling that 
            respects both the complexity of the issues and the intelligence of our audience.
          </p>
        </div>
      </div>
    </section>
  )
}
