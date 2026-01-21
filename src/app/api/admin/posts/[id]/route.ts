import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { canModerate } from '@/lib/auth/admin'

interface RouteParams {
  params: Promise<{ id: string }>
}

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

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params

  const profile = await getModeratorProfile()

  if (!canModerate(profile)) {
    return NextResponse.json(
      { error: 'Unauthorized: moderator access required' },
      { status: 403 }
    )
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json(
      { error: 'Failed to delete post', details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params

  const profile = await getModeratorProfile()

  if (!canModerate(profile)) {
    return NextResponse.json(
      { error: 'Unauthorized: moderator access required' },
      { status: 403 }
    )
  }

  const body = await request.json()
  const { locked } = body

  if (typeof locked !== 'boolean') {
    return NextResponse.json(
      { error: 'Invalid request: locked must be a boolean' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('posts')
    .update({ locked })
    .eq('id', id)

  if (error) {
    return NextResponse.json(
      { error: 'Failed to update post', details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, locked })
}
