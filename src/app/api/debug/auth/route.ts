import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    return NextResponse.json({
      hasUser: !!user,
      userId: user?.id ?? null,
      userEmail: user?.email ?? null,
      hasSession: !!session,
      sessionExpiry: session?.expires_at ?? null,
      userError: userError?.message ?? null,
      sessionError: sessionError?.message ?? null,
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to check auth',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
