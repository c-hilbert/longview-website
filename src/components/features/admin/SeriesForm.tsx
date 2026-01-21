'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

interface Series {
  id: string
  name: string
  slug: string
  description: string | null
  rss_feed_url: string | null
}

interface SeriesFormProps {
  series?: Series
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function SeriesForm({ series }: SeriesFormProps) {
  const [name, setName] = useState(series?.name || '')
  const [slug, setSlug] = useState(series?.slug || '')
  const [description, setDescription] = useState(series?.description || '')
  const [rssFeedUrl, setRssFeedUrl] = useState(series?.rss_feed_url || '')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!series)
  const router = useRouter()

  useEffect(() => {
    if (!slugManuallyEdited && name) {
      setSlug(generateSlug(name))
    }
  }, [name, slugManuallyEdited])

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true)
    setSlug(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const method = series ? 'PUT' : 'POST'
    const url = series ? `/api/admin/series/${series.id}` : '/api/admin/series'

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          description: description || null,
          rss_feed_url: rssFeedUrl || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to save series')
        setIsLoading(false)
        return
      }

      router.push('/admin')
    } catch {
      setError('Failed to save series')
      setIsLoading(false)
    }
  }

  const isEditing = !!series

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      <Input
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Series name"
        required
      />

      <Input
        label="Slug"
        value={slug}
        onChange={handleSlugChange}
        placeholder="series-slug"
        required
      />

      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Brief description"
      />

      <Input
        label="RSS Feed URL"
        type="url"
        value={rssFeedUrl}
        onChange={(e) => setRssFeedUrl(e.target.value)}
        placeholder="https://example.com/feed.xml"
      />

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? isEditing ? 'Updating...' : 'Creating...'
            : isEditing ? 'Update Series' : 'Create Series'}
        </Button>
      </div>
    </form>
  )
}
