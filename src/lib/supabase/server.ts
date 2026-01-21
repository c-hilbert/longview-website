import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

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

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Called from Server Component - ignore
        }
      },
    },
  })
}

/**
 * Create a service role client that bypasses RLS.
 * Only use this for server-side operations like cron jobs.
 */
export function createServiceClient() {
  const url = getSupabaseUrl()
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }

  return createSupabaseClient(url, serviceKey)
}
