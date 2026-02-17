export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 px-6 text-center bg-gradient-to-b from-[var(--color-card-bg)] to-white">
      <div className="max-w-4xl mx-auto">
        {/* Circular accent graphic - inspired by original site's red circle */}
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[var(--color-primary)] mx-auto mb-8 opacity-90 flex items-center justify-center">
          <span className="text-white font-semibold text-xl md:text-2xl">LV</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-[var(--color-foreground)] mb-6 tracking-tight leading-tight">
          Longview Investigations
        </h1>
        
        <p className="text-xl md:text-2xl text-[var(--color-primary)] font-medium mb-8 tracking-tight">
          Context is everything
        </p>
        
        <p className="text-lg md:text-xl text-[var(--color-muted)] max-w-2xl mx-auto leading-relaxed">
          In-depth investigative journalism and thoughtful conversations exploring the stories that shape our world.
        </p>
      </div>
    </section>
  )
}
