#!/usr/bin/env node
/**
 * Seed script to create series with RSS feeds
 * Usage: npx tsx scripts/seed-series.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables:')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  console.error('  - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const seriesToCreate = [
  {
    name: 'Reflector',
    slug: 'reflector',
    description: 'A Longview Investigations podcast',
    rss_feed_url: 'https://feeds.megaphone.fm/reflector',
  },
  {
    name: 'The Last Invention',
    slug: 'the-last-invention',
    description: 'A Longview Investigations podcast',
    rss_feed_url: 'https://feeds.megaphone.fm/thelastinvention',
  },
]

async function seedSeries() {
  console.log('Seeding series...\n')

  for (const series of seriesToCreate) {
    // Check if series already exists
    const { data: existing } = await supabase
      .from('series')
      .select('id, name')
      .eq('slug', series.slug)
      .maybeSingle()

    if (existing) {
      console.log(`Series "${series.name}" already exists, updating RSS feed...`)
      const { error } = await supabase
        .from('series')
        .update({ rss_feed_url: series.rss_feed_url })
        .eq('id', existing.id)

      if (error) {
        console.error(`  ❌ Failed to update: ${error.message}`)
      } else {
        console.log(`  ✅ Updated RSS feed: ${series.rss_feed_url}`)
      }
    } else {
      console.log(`Creating series "${series.name}"...`)
      const { data, error } = await supabase
        .from('series')
        .insert(series)
        .select('id')
        .single()

      if (error) {
        console.error(`  ❌ Failed to create: ${error.message}`)
      } else {
        console.log(`  ✅ Created with ID: ${data.id}`)
        console.log(`     RSS feed: ${series.rss_feed_url}`)
      }
    }
  }

  console.log('\nDone!')
}

seedSeries().catch(console.error)
