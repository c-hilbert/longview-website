import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { canModerate } from '@/lib/auth/admin'
import { Card } from '@/components/ui/Card'
import { SeriesForm } from '@/components/features/admin'

export default async function NewSeriesPage() {
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

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Add New Series</h1>
      <Card>
        <SeriesForm />
      </Card>
    </div>
  )
}
