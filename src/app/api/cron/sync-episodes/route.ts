import { NextResponse } from 'next/server'
import { syncAllSeries } from '@/lib/rss/sync'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const results = await syncAllSeries()

    const totalNew = results.reduce((sum, r) => sum + r.newEpisodes, 0)
    const errors = results.filter((r) => r.error)

    return NextResponse.json({
      success: true,
      totalNewEpisodes: totalNew,
      seriesProcessed: results.length,
      results,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to sync episodes', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
