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
    author: {
      username: string
    }
    series?: {
      name: string
      slug: string
    } | null
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <div className="flex gap-4 p-4 border-b border-neutral-200 last:border-b-0">
      <div className="flex flex-col items-center gap-1 min-w-[48px]">
        <span className="text-lg font-medium">{post.upvote_count}</span>
        <span className="text-xs text-neutral-500">votes</span>
      </div>

      <div className="flex flex-col items-center gap-1 min-w-[48px]">
        <span className="text-lg font-medium">{post.comment_count}</span>
        <span className="text-xs text-neutral-500">replies</span>
      </div>

      <div className="flex-1 min-w-0">
        <Link
          href={`/discussions/${post.slug}`}
          className="text-base font-medium hover:text-neutral-600 line-clamp-2"
        >
          {post.title}
        </Link>

        <div className="mt-1.5 flex items-center gap-2 text-sm text-neutral-500">
          {post.series && (
            <>
              <Link
                href={`/series/${post.series.slug}`}
                className="text-red-600 hover:underline"
              >
                {post.series.name}
              </Link>
              <span>·</span>
            </>
          )}
          <Link href={`/u/${post.author.username}`} className="hover:underline">
            {post.author.username}
          </Link>
          <span>·</span>
          <span>
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  )
}
