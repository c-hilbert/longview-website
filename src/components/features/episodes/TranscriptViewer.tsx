'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'

interface TranscriptViewerProps {
  transcript: string | null
}

export function TranscriptViewer({ transcript }: TranscriptViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const hasTranscript = transcript && transcript.trim().length > 0

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Transcript</h2>
        {hasTranscript && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-stone-600 hover:text-stone-900"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        )}
      </div>

      {hasTranscript ? (
        <div
          data-testid="transcript-content"
          className={`text-sm text-stone-700 whitespace-pre-wrap ${
            isExpanded ? '' : 'max-h-64 overflow-hidden'
          }`}
        >
          {transcript}
        </div>
      ) : (
        <p className="text-sm text-stone-500">
          No transcript available for this episode.
        </p>
      )}

      {hasTranscript && !isExpanded && (
        <div className="mt-2 pt-2 border-t border-stone-200">
          <button
            onClick={() => setIsExpanded(true)}
            className="text-sm text-stone-600 hover:text-stone-900"
          >
            Show full transcript
          </button>
        </div>
      )}
    </Card>
  )
}
