import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface PostCardProps {
  post: {
    id: string
    title: string
    slug: string
    upvote_count: number
    comment_count: number
    created_at: string
    author?: {
      username: string
    } | null
    series?: {
      name: string
      slug: string
    } | null
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="flex gap-4 p-5 border-b border-[var(--border-light)] last:border-b-0 hover:bg-[var(--bg-secondary)]/50 transition-colors duration-150">
      {/* Vote count */}
      <div className="flex flex-col items-center gap-1 min-w-[48px]">
        <span className="text-base font-semibold text-[var(--text-primary)] font-[family-name:var(--font-inter)]">
          {post.upvote_count}
        </span>
        <span className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">votes</span>
      </div>

      {/* Comment count */}
      <div className="flex flex-col items-center gap-1 min-w-[48px]">
        <span className="text-base font-semibold text-[var(--text-primary)] font-[family-name:var(--font-inter)]">
          {post.comment_count}
        </span>
        <span className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">replies</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-[family-name:var(--font-source-serif)] font-semibold text-lg leading-[var(--leading-snug)]">
          <Link
            href={`/discussions/${post.slug}`}
            className="text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors duration-150 line-clamp-2"
          >
            {post.title}
          </Link>
        </h3>

        <div className="mt-2 flex items-center gap-2 text-sm text-[var(--text-muted)] font-[family-name:var(--font-inter)]">
          {post.series && (
            <>
              <Link
                href={`/series/${post.series.slug}`}
                className="text-[var(--accent-primary)] hover:text-[var(--accent-hover)] font-medium transition-colors duration-150"
              >
                {post.series.name}
              </Link>
              <span className="text-[var(--border-dark)]">·</span>
            </>
          )}
          {post.author ? (
            <Link 
              href={`/u/${post.author.username}`} 
              className="hover:text-[var(--text-primary)] transition-colors duration-150"
            >
              {post.author.username}
            </Link>
          ) : (
            <span>Anonymous</span>
          )}
          <span className="text-[var(--border-dark)]">·</span>
          <time dateTime={post.created_at}>
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </time>
        </div>
      </div>
    </article>
  )
}
