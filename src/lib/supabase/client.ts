import { createBrowserClient } from '@supabase/ssr'

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
  }
  if (url.includes('placeholder')) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL contains placeholder value - configure your environment variables')
  }
  return url
}

function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')
  }
  if (key === 'placeholder-key') {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY contains placeholder value - configure your environment variables')
  }
  return key
}

export function createClient() {
  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey())
}
