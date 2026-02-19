import { PlatformLinks } from './PlatformLinks'

export function HeroSection() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24">
      <div className="max-w-4xl">
        {/* Tagline */}
        <p className="text-sm font-medium text-[var(--accent-primary)] uppercase tracking-[0.15em] mb-6 font-[family-name:var(--font-inter)]">
          Longview Podcast Network
        </p>
        
        {/* Main Headline */}
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl lg:text-6xl font-semibold text-[var(--ink-black)] leading-[1.1] tracking-[-0.02em] mb-6">
          How did we get here?
        </h1>
        
        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl mb-8 font-[family-name:var(--font-source-serif)]">
          Longview is for the curious and open minded. We investigate the surprising stories 
          behind the most fascinating debates and pressing issues facing society today. 
          By looking into how we got here, we aim to understand more deeply where we may be headed next.
        </p>
        
        {/* Platform Links */}
        <PlatformLinks />
      </div>
      
      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none hidden lg:block">
        <div className="w-full h-full bg-gradient-to-l from-[var(--border-medium)] to-transparent" />
      </div>
    </section>
  )
}
