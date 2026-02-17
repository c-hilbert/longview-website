import { Card } from '@/components/ui/Card'
import Link from 'next/link'

interface ShowCardProps {
  title: string
  tagline: string
  description: string
  slug?: string
  spotifyUrl?: string
  appleUrl?: string
  youtubeUrl?: string
  imageSrc?: string
}

export function ShowCard({
  title,
  tagline,
  description,
  slug,
  spotifyUrl,
  appleUrl,
  youtubeUrl,
  imageSrc,
}: ShowCardProps) {
  return (
    <Card variant="bordered" padding="lg" className="h-full hover:shadow-lg transition-shadow">
      {/* Placeholder for show artwork */}
      <div className="w-full h-48 bg-[var(--color-foreground)] mb-6 flex items-center justify-center">
        {imageSrc ? (
          <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white text-4xl font-bold">{title.charAt(0)}</span>
        )}
      </div>
      
      <h3 className="text-2xl font-bold text-[var(--color-foreground)] mb-2 tracking-tight">
        {title}
      </h3>
      
      <p className="text-[var(--color-primary)] font-medium mb-4 text-lg">
        {tagline}
      </p>
      
      <p className="text-[var(--color-muted)] leading-relaxed mb-6">
        {description}
      </p>
      
      {/* Platform links */}
      <div className="flex flex-wrap gap-3 mb-4">
        {spotifyUrl && (
          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[var(--color-foreground)] text-white text-sm font-medium rounded hover:opacity-90 transition-opacity"
          >
            Spotify
          </a>
        )}
        {appleUrl && (
          <a
            href={appleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[var(--color-foreground)] text-white text-sm font-medium rounded hover:opacity-90 transition-opacity"
          >
            Apple Podcasts
          </a>
        )}
        {youtubeUrl && (
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[var(--color-foreground)] text-white text-sm font-medium rounded hover:opacity-90 transition-opacity"
          >
            YouTube
          </a>
        )}
      </div>
      
      {slug && (
        <Link
          href={`/series/${slug}`}
          className="text-[var(--color-primary)] font-medium hover:underline text-sm"
        >
          View all episodes →
        </Link>
      )}
    </Card>
  )
}
