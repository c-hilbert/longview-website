import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'

interface PageProps {
  params: Promise<{ username: string }>
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, username, karma_posts, karma_comments, role, created_at')
    .eq('username', username)
    .single()

  if (error || !profile) {
    notFound()
  }

  const totalKarma = (profile.karma_posts || 0) + (profile.karma_comments || 0)

  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, upvote_count, comment_count, created_at')
    .eq('author_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const { data: comments } = await supabase
    .from('comments')
    .select(`
      id,
      body,
      upvote_count,
      created_at,
      post:posts(title, slug)
    `)
    .eq('author_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center text-2xl font-semibold text-neutral-600">
              {profile.username[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-2">
                {profile.username}
                {profile.role === 'staff' && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                    Staff
                  </span>
                )}
              </h1>
              <p className="text-neutral-500 text-sm">
                Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-semibold">{totalKarma}</div>
            <div className="text-sm text-neutral-500">karma</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-neutral-50 rounded-lg">
            <div className="text-xl font-semibold">{profile.karma_posts || 0}</div>
            <div className="text-sm text-neutral-500">post karma</div>
          </div>
          <div className="p-4 bg-neutral-50 rounded-lg">
            <div className="text-xl font-semibold">{profile.karma_comments || 0}</div>
            <div className="text-sm text-neutral-500">comment karma</div>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Posts</h2>
        <Card padding="none">
          {posts && posts.length > 0 ? (
            <div className="divide-y divide-neutral-200">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/discussions/${post.slug}`}
                  className="block p-4 hover:bg-neutral-50"
                >
                  <div className="font-medium">{post.title}</div>
                  <div className="text-sm text-neutral-500 mt-1">
                    {post.upvote_count} votes · {post.comment_count} comments ·{' '}
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="p-4 text-neutral-500 text-center">No posts yet.</p>
          )}
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Comments</h2>
        <Card padding="none">
          {comments && comments.length > 0 ? (
            <div className="divide-y divide-neutral-200">
              {comments.map((comment) => {
                const post = Array.isArray(comment.post) ? comment.post[0] : comment.post
                return (
                  <div key={comment.id} className="p-4">
                    {post && (
                      <Link
                        href={`/discussions/${post.slug}`}
                        className="text-sm text-neutral-500 hover:underline block mb-2"
                      >
                        on: {post.title}
                      </Link>
                    )}
                    <p className="text-neutral-800 line-clamp-3">{comment.body}</p>
                    <div className="text-sm text-neutral-500 mt-2">
                      {comment.upvote_count} votes ·{' '}
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="p-4 text-neutral-500 text-center">No comments yet.</p>
          )}
        </Card>
      </div>
    </div>
  )
}
