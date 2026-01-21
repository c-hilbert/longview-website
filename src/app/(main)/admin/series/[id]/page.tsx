import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { canModerate } from '@/lib/auth/admin'
import { Card } from '@/components/ui/Card'
import { SeriesForm } from '@/components/features/admin'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditSeriesPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!canModerate(profile)) {
    redirect('/')
  }

  const { data: series, error } = await supabase
    .from('series')
    .select('id, name, slug, description, rss_feed_url')
    .eq('id', id)
    .single()

  if (error || !series) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Edit Series</h1>
      <Card>
        <SeriesForm series={series} />
      </Card>
    </div>
  )
}
