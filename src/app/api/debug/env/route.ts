import { NextResponse } from 'next/server'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET'
  const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return NextResponse.json({
    supabaseUrl: supabaseUrl.includes('placeholder')
      ? 'PLACEHOLDER (not configured)'
      : supabaseUrl.substring(0, 30) + '...',
    hasAnonKey,
    isConfigured: !supabaseUrl.includes('placeholder') && hasAnonKey,
    nodeEnv: process.env.NODE_ENV,
  })
}
