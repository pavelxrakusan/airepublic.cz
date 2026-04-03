'use client'

import { useCallback, useEffect, useState } from 'react'
import { BSOD_LINES } from './effects'

interface MeltdownOverlayProps {
  onComplete: () => void
}

export default function MeltdownOverlay({ onComplete }: MeltdownOverlayProps) {
  const [phase, setPhase] = useState<'bsod' | 'black' | 'reveal'>('bsod')

  useEffect(() => {
    const bsodTimer = setTimeout(() => setPhase('black'), 4000)
    return () => clearTimeout(bsodTimer)
  }, [])

  useEffect(() => {
    if (phase === 'black') {
      const blackTimer = setTimeout(() => setPhase('reveal'), 3000)
      return () => clearTimeout(blackTimer)
    }
  }, [phase])

  const handleRevealComplete = useCallback(() => {
    onComplete()
  }, [onComplete])

  useEffect(() => {
    if (phase === 'reveal') {
      const timer = setTimeout(handleRevealComplete, 500)
      return () => clearTimeout(timer)
    }
  }, [phase, handleRevealComplete])

  if (phase === 'reveal') return null

  if (phase === 'black') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <div className="font-mono text-zinc-600 text-sm animate-pulse">
          Restarting...
        </div>
      </div>
    )
  }

  // BSOD phase
  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#0000AA] p-8 font-mono text-white text-sm leading-relaxed">
      <div className="mx-auto max-w-2xl pt-12">
        <div className="mb-6 inline-block bg-white px-2 text-[#0000AA] font-bold">
          airepublic.cz
        </div>
        {BSOD_LINES.map((line, i) => (
          <div key={i} className={line === '' ? 'h-4' : ''}>
            {line}
          </div>
        ))}
        <div className="mt-8 terminal-blink">
          Press any key to continue_
        </div>
      </div>
    </div>
  )
}
