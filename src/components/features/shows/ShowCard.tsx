import Link from 'next/link'
import { Card } from '@/components/ui/Card'

interface Show {
  id: string
  name: string
  slug: string
  description: string | null
  episodeCount: number
}

interface ShowCardProps {
  show: Show
}

export function ShowCard({ show }: ShowCardProps) {
  return (
    <Link
      href={`/archive?series=${show.slug}`}
      className="group block"
    >
      <Card 
        padding="none" 
        className="overflow-hidden h-full transition-all duration-300 group-hover:shadow-[var(--shadow-lg)]"
      >
        {/* Show Art Placeholder - Editorial Style */}
        <div className="aspect-square bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)] relative overflow-hidden">
          {/* Decorative elements for visual interest */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border border-[var(--border-medium)] rounded-full" />
            <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 border border-[var(--border-dark)] rounded-full" />
          </div>
          
          {/* Initial Letter */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-[family-name:var(--font-playfair)] text-6xl sm:text-7xl font-bold text-[var(--ink-black)] opacity-20 select-none">
              {show.name.charAt(0)}
            </span>
          </div>
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-[var(--accent-primary)] opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
        </div>
        
        {/* Content */}
        <div className="p-5 sm:p-6">
          <h3 className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl font-semibold text-[var(--ink-black)] mb-2 group-hover:text-[var(--accent-primary)] transition-colors duration-200">
            {show.name}
          </h3>
          
          {show.description && (
            <p className="text-sm text-[var(--text-tertiary)] leading-relaxed mb-4 line-clamp-2 font-[family-name:var(--font-inter)]">
              {show.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider font-[family-name:var(--font-inter)]">
              {show.episodeCount} {show.episodeCount === 1 ? 'Episode' : 'Episodes'}
            </span>
            <span className="text-sm font-medium text-[var(--accent-primary)] group-hover:translate-x-1 transition-transform duration-200 font-[family-name:var(--font-inter)]">
              Listen →
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
