'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

interface Series {
  id: string
  name: string
  slug: string
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100)
}

export default function NewDiscussionPage() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [seriesId, setSeriesId] = useState<string | null>(null)
  const [series, setSeries] = useState<Series[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function fetchSeries() {
      const { data } = await supabase.from('series').select('id, name, slug').order('name')
      if (data) setSeries(data)
    }
    fetchSeries()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('You must be logged in to create a discussion')
      setIsLoading(false)
      return
    }

    const slug = generateSlug(title) + '-' + Date.now().toString(36)

    const { error: insertError } = await supabase.from('posts').insert({
      title,
      body,
      slug,
      author_id: user.id,
      series_id: seriesId,
    })

    if (insertError) {
      setError(insertError.message)
      setIsLoading(false)
    } else {
      router.push(`/discussions/${slug}`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[var(--ink-black)] mb-6 tracking-[-0.02em]">
        Start a Discussion
      </h1>

      <Card>
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-[var(--radius-md)] font-[family-name:var(--font-inter)]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What would you like to discuss?"
            required
          />

          <Textarea
            label="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share your thoughts, questions, or insights..."
            required
          />

          {series.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 font-[family-name:var(--font-inter)] tracking-[-0.01em]">
                Related Series (optional)
              </label>
              <select
                value={seriesId || ''}
                onChange={(e) => setSeriesId(e.target.value || null)}
                className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-medium)] rounded-[var(--radius-md)] text-[var(--text-primary)] font-[family-name:var(--font-inter)] text-base focus:outline-none focus:border-[var(--accent-primary)] focus:ring-3 focus:ring-[var(--accent-subtle)] transition-all duration-200"
              >
                <option value="">None</option>
                {series.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Discussion'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
