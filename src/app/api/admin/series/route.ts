import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { canModerate } from '@/lib/auth/admin'

async function getModeratorProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', user.id)
    .single()

  return profile
}

export async function POST(request: Request) {
  const profile = await getModeratorProfile()

  if (!canModerate(profile)) {
    return NextResponse.json(
      { error: 'Unauthorized: moderator access required' },
      { status: 403 }
    )
  }

  const body = await request.json()
  const { name, slug, description, rss_feed_url } = body

  if (!name || !slug) {
    return NextResponse.json(
      { error: 'Name and slug are required' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('series')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  if (existing) {
    return NextResponse.json(
      { error: 'Series with this slug already exists' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('series')
    .insert({ name, slug, description, rss_feed_url })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json(
      { error: 'Failed to create series', details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, id: data.id })
}
