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
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[var(--ink-black)]">
          Transcript
        </h2>
        {hasTranscript && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-medium text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-colors duration-150 font-[family-name:var(--font-inter)]"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        )}
      </div>

      {hasTranscript ? (
        <div
          data-testid="transcript-content"
          className={`text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-[var(--leading-relaxed)] font-[family-name:var(--font-inter)] ${
            isExpanded ? '' : 'max-h-64 overflow-hidden'
          }`}
        >
          {transcript}
        </div>
      ) : (
        <p className="text-sm text-[var(--text-muted)] font-[family-name:var(--font-inter)]">
          No transcript available for this episode.
        </p>
      )}

      {hasTranscript && !isExpanded && (
        <div className="mt-4 pt-4 border-t border-[var(--border-light)]">
          <button
            onClick={() => setIsExpanded(true)}
            className="text-sm font-medium text-[var(--accent-primary)] hover:text-[var(--accent-hover)] transition-colors duration-150 font-[family-name:var(--font-inter)]"
          >
            Show full transcript
          </button>
        </div>
      )}
    </Card>
  )
}
