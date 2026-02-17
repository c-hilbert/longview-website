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
      <header className="flex items-center justify-between pb-4 border-b border-[var(--border-light)]">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[var(--ink-black)] tracking-[-0.02em]">
          Discussions
        </h1>
        <Link
          href="/discussions/new"
          className="px-5 py-2.5 bg-[var(--ink-black)] text-[var(--bg-primary)] text-sm font-medium rounded-[var(--radius-md)] hover:bg-[var(--text-secondary)] transition-colors duration-200 tracking-[-0.01em]"
        >
          New Discussion
        </Link>
      </header>

      <Card padding="none" className="overflow-hidden">
        <div className="px-4 pt-2">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={(tab) => setActiveTab(tab as SortOption)}
          />
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-[var(--text-muted)] font-[family-name:var(--font-inter)]">
            Loading...
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-[var(--text-muted)] font-[family-name:var(--font-inter)]">
            No discussions yet. Be the first to start a conversation.
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-light)]">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
