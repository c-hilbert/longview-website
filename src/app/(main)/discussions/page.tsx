'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { PostCard } from '@/components/features/discussions/PostCard'

type SortOption = 'recent' | 'top' | 'unanswered'

const tabs = [
  { id: 'recent', label: 'Recent' },
  { id: 'top', label: 'Top' },
  { id: 'unanswered', label: 'Unanswered' },
]

interface Post {
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

export default function DiscussionsPage() {
  const [activeTab, setActiveTab] = useState<SortOption>('recent')
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true)

      let query = supabase
        .from('posts')
        .select(`
          id,
          title,
          slug,
          upvote_count,
          comment_count,
          created_at,
          author:profiles!posts_author_id_fkey(username),
          series:series(name, slug)
        `)

      if (activeTab === 'recent') {
        query = query.order('created_at', { ascending: false })
      } else if (activeTab === 'top') {
        query = query.order('upvote_count', { ascending: false })
      } else if (activeTab === 'unanswered') {
        query = query.eq('comment_count', 0).order('created_at', { ascending: false })
      }

      const { data, error } = await query.limit(50)

      if (!error && data) {
        const formattedPosts = data.map((post) => ({
          ...post,
          author: Array.isArray(post.author) ? post.author[0] : post.author,
          series: Array.isArray(post.series) ? post.series[0] : post.series,
        })) as Post[]
        setPosts(formattedPosts)
      }

      setIsLoading(false)
    }

    fetchPosts()
  }, [activeTab, supabase])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Discussions</h1>
        <Link
          href="/discussions/new"
          className="px-4 py-2 bg-neutral-900 text-white text-sm rounded-md hover:bg-neutral-800"
        >
          New Discussion
        </Link>
      </div>

      <Card padding="none">
        <div className="px-4 pt-2">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={(tab) => setActiveTab(tab as SortOption)}
          />
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-neutral-500">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">
            No discussions yet. Be the first to start a conversation.
          </div>
        ) : (
          <div>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
