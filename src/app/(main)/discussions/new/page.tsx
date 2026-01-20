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
      <h1 className="text-2xl font-semibold mb-6">Start a Discussion</h1>

      <Card>
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
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
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Related Series (optional)
              </label>
              <select
                value={seriesId || ''}
                onChange={(e) => setSeriesId(e.target.value || null)}
                className="w-full px-3 py-2.5 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
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

          <div className="flex justify-end gap-3">
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
