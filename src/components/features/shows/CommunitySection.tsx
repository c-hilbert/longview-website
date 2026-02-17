import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { PostCard } from '@/components/features/discussions/PostCard'

interface Post {
  id: string
  title: string
  slug: string
  upvote_count: number
  comment_count: number
  created_at: string
  author: { username: string } | null
  series: { name: string; slug: string } | null
}

interface CommunitySectionProps {
  posts: Post[]
}

export function CommunitySection({ posts }: CommunitySectionProps) {
  if (posts.length === 0) {
    return null
  }

  return (
    <section className="py-16 sm:py-20 border-t border-[var(--border-light)]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-semibold text-[var(--ink-black)] mb-2">
            Community Discussions
          </h2>
          <p className="text-[var(--text-tertiary)] font-[family-name:var(--font-inter)]">
            Join the conversation with fellow listeners
          </p>
        </div>
        
        <Link
          href="/discussions"
          className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-primary)] hover:text-[var(--accent-hover)] transition-colors duration-200 font-[family-name:var(--font-inter)]"
        >
          View all
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      
      <Card padding="none" className="overflow-hidden divide-y divide-[var(--border-light)]">
        {posts.slice(0, 5).map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </Card>
      
      <div className="mt-6 text-center sm:hidden">
        <Link
          href="/discussions"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-primary)] hover:text-[var(--accent-hover)] transition-colors duration-200 font-[family-name:var(--font-inter)]"
        >
          View all discussions
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
