'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { clsx } from 'clsx'

// SVG Icons as components for crisp rendering
const PlayIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M8 5.14v13.72a1 1 0 001.5.86l11-6.86a1 1 0 000-1.72l-11-6.86a1 1 0 00-1.5.86z" />
  </svg>
)

const PauseIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
  </svg>
)

const SkipBackIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 20L9 12l10-8v16z" />
    <line x1="5" y1="19" x2="5" y2="5" />
  </svg>
)

const SkipForwardIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 4l10 8-10 8V4z" />
    <line x1="19" y1="5" x2="19" y2="19" />
  </svg>
)

const VolumeHighIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
  </svg>
)

const VolumeLowIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 010 7.07" />
  </svg>
)

const VolumeMuteIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
)

// Playback speed options
const PLAYBACK_RATES = [0.5, 0.8, 1, 1.2, 1.5, 2]

// Format seconds to MM:SS or HH:MM:SS
function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds === Infinity) return '0:00'
  
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

interface AudioPlayerProps {
  src: string
  title?: string
  skipBackSeconds?: number
  skipForwardSeconds?: number
  className?: string
}

export function AudioPlayer({ 
  src, 
  title,
  skipBackSeconds = 15,
  skipForwardSeconds = 30,
  className 
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLInputElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [buffered, setBuffered] = useState(0)

  // Initialize audio element
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleProgress = () => {
      if (audio.buffered.length > 0) {
        setBuffered(audio.buffered.end(audio.buffered.length - 1))
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    const handleError = () => {
      setIsLoading(false)
      console.error('Audio loading error')
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('progress', handleProgress)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    // Reset state when src changes
    setCurrentTime(0)
    setIsLoading(true)
    setIsPlaying(false)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('progress', handleProgress)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [src])

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  // Skip backward
  const skipBack = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, audio.currentTime - skipBackSeconds)
  }, [skipBackSeconds])

  // Skip forward
  const skipForward = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.min(duration, audio.currentTime + skipForwardSeconds)
  }, [duration, skipForwardSeconds])

  // Seek to position
  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    
    const newTime = parseFloat(e.target.value)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }, [])

  // Handle volume change
  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    audio.volume = newVolume
    setIsMuted(newVolume === 0)
  }, [])

  // Toggle mute
  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    
    if (isMuted) {
      audio.volume = volume || 1
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }, [isMuted, volume])

  // Change playback rate
  const cyclePlaybackRate = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    
    const currentIndex = PLAYBACK_RATES.indexOf(playbackRate)
    const nextIndex = (currentIndex + 1) % PLAYBACK_RATES.length
    const newRate = PLAYBACK_RATES[nextIndex]
    
    audio.playbackRate = newRate
    setPlaybackRate(newRate)
  }, [playbackRate])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key) {
        case ' ':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowLeft':
          e.preventDefault()
          skipBack()
          break
        case 'ArrowRight':
          e.preventDefault()
          skipForward()
          break
        case 'ArrowUp':
          e.preventDefault()
          if (audioRef.current) {
            const newVol = Math.min(1, volume + 0.1)
            audioRef.current.volume = newVol
            setVolume(newVol)
            setIsMuted(false)
          }
          break
        case 'ArrowDown':
          e.preventDefault()
          if (audioRef.current) {
            const newVol = Math.max(0, volume - 0.1)
            audioRef.current.volume = newVol
            setVolume(newVol)
            setIsMuted(newVol === 0)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [togglePlay, skipBack, skipForward, volume])

  // Calculate progress percentage for visual styling
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0
  const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0

  // Volume icon based on level
  const VolumeIcon = isMuted || volume === 0 ? VolumeMuteIcon : volume < 0.5 ? VolumeLowIcon : VolumeHighIcon

  return (
    <div 
      className={clsx(
        'bg-[var(--bg-elevated)] border border-[var(--border-light)] rounded-[var(--radius-lg)]',
        'p-5 sm:p-6 shadow-[var(--shadow-md)]',
        'select-none',
        className
      )}
      role="region"
      aria-label="Audio player"
    >
      {/* Hidden native audio element */}
      <audio ref={audioRef} preload="metadata">
        <source src={src} type="audio/mpeg" />
      </audio>

      {/* Title (optional) */}
      {title && (
        <h3 className="font-[family-name:var(--font-source-serif)] text-lg font-semibold text-[var(--text-primary)] mb-4 line-clamp-2">
          {title}
        </h3>
      )}

      {/* Main Controls Row */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 mb-5">
        {/* Skip Back Button */}
        <button
          onClick={skipBack}
          className="group relative p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2"
          aria-label={`Skip back ${skipBackSeconds} seconds`}
          title={`Skip back ${skipBackSeconds}s`}
        >
          <SkipBackIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors" />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-[var(--text-muted)]">
            {skipBackSeconds}
          </span>
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className={clsx(
            'w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center',
            'bg-[var(--ink-black)] text-[var(--bg-primary)]',
            'hover:bg-[var(--accent-primary)] hover:scale-105',
            'transition-all duration-200 ease-out',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-4',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
          )}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-[var(--bg-primary)] border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <PauseIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          ) : (
            <PlayIcon className="w-6 h-6 sm:w-7 sm:h-7 ml-0.5" />
          )}
        </button>

        {/* Skip Forward Button */}
        <button
          onClick={skipForward}
          className="group relative p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2"
          aria-label={`Skip forward ${skipForwardSeconds} seconds`}
          title={`Skip forward ${skipForwardSeconds}s`}
        >
          <SkipForwardIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors" />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-[var(--text-muted)]">
            {skipForwardSeconds}
          </span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="relative h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden cursor-pointer group">
          {/* Buffered progress */}
          <div 
            className="absolute inset-y-0 left-0 bg-[var(--border-medium)] rounded-full"
            style={{ width: `${bufferedPercent}%` }}
          />
          {/* Played progress */}
          <div 
            className="absolute inset-y-0 left-0 bg-[var(--accent-primary)] rounded-full transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
          {/* Range input overlay */}
          <input
            ref={progressRef}
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Seek"
          />
          {/* Hover tooltip indicator */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[var(--accent-primary)] rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{ left: `calc(${progressPercent}% - 6px)` }}
          />
        </div>
        
        {/* Time Display */}
        <div className="flex justify-between mt-2 text-xs font-medium text-[var(--text-muted)] font-[family-name:var(--font-inter)]">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Secondary Controls Row */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--border-light)]">
        {/* Volume Control */}
        <div className="flex items-center gap-2 group">
          <button
            onClick={toggleMute}
            className="p-1.5 rounded hover:bg-[var(--bg-secondary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            <VolumeIcon className="w-4 h-4 text-[var(--text-secondary)]" />
          </button>
          <div className="relative w-20 h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-[var(--text-secondary)] rounded-full"
              style={{ width: `${isMuted ? 0 : volume * 100}%` }}
            />
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Volume"
            />
          </div>
        </div>

        {/* Playback Speed */}
        <button
          onClick={cyclePlaybackRate}
          className="px-2.5 py-1.5 text-xs font-semibold text-[var(--text-secondary)] bg-[var(--bg-secondary)] rounded hover:bg-[var(--bg-tertiary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] font-[family-name:var(--font-inter)]"
          aria-label={`Playback speed: ${playbackRate}x`}
          title="Change playback speed"
        >
          {playbackRate === 1 ? '1x' : `${playbackRate}x`}
        </button>
      </div>

      {/* Keyboard shortcuts hint (visible on hover/focus) */}
      <div className="sr-only">
        Keyboard shortcuts: Space to play/pause, Left/Right arrows to skip, Up/Down arrows for volume
      </div>
    </div>
  )
}
