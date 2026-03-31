'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { PixelMascot } from './PixelMascot'

/* ── Context-aware speech bubbles ──────────────────────── */

const BUBBLES_BY_PATH: Record<string, string[]> = {
  '/blog': [
    'Hezký článek, co? 📖',
    'Tenhle jsem psal s Claudem!',
    'Scrolluj dál, bude to lepší.',
  ],
  '/nastroje': [
    'Claude je jasná jednička! 💜',
    'Testoval jsem všechny.',
    'Hodnocení je upřímné, fakt.',
  ],
  '/projekty': [
    'CARFAST.cz je moje pýcha!',
    'Zero dependencies ftw!',
  ],
  '/o-mne': [
    'To jsem já! 👋',
    'Napište mi, nebojte se.',
  ],
}

const GENERIC_BUBBLES = [
  'Ahoj! 👋',
  'Klikni na mě!',
  'Líbí se ti tu?',
  'Postaven s Claude Code ✨',
  'Next.js 15 je pecka.',
]

/* ── Achievements ──────────────────────────────────────── */

const ACHIEVEMENTS: Record<number, string> = {
  1: '🐣 První klik!',
  10: '🤝 Kamarád',
  25: '💪 Fanoušek',
  50: '🏆 Best Friends',
  100: '🤯 Závislák!',
  200: '👑 Legenda',
}

function getClickCount(): number {
  if (typeof window === 'undefined') return 0
  return parseInt(localStorage.getItem('mascot-clicks') ?? '0', 10)
}

function incrementClicks(): number {
  const count = getClickCount() + 1
  localStorage.setItem('mascot-clicks', count.toString())
  return count
}

/* ── Component ─────────────────────────────────────────── */

export function FloatingMascot() {
  const pathname = usePathname()
  const [bubble, setBubble] = useState<string | null>(null)
  const [achievement, setAchievement] = useState<string | null>(null)
  const [peeking, setPeeking] = useState(false)
  const [pos, setPos] = useState({ x: 16, y: 16 })
  const [isDragging, setIsDragging] = useState(false)
  const dragOrigin = useRef({ mx: 0, my: 0, px: 0, py: 0 })
  const didDrag = useRef(false)

  const isHome = pathname === '/'

  /* ── Speech bubbles ── */
  useEffect(() => {
    if (isHome) return
    const showBubble = () => {
      const pathBubbles = Object.entries(BUBBLES_BY_PATH).find(
        ([p]) => pathname.startsWith(p),
      )?.[1]
      const pool = pathBubbles ? [...pathBubbles, ...GENERIC_BUBBLES] : GENERIC_BUBBLES
      setBubble(pool[Math.floor(Math.random() * pool.length)])
      setTimeout(() => setBubble(null), 3500)
    }
    const t1 = setTimeout(showBubble, 2000)
    const t2 = setInterval(showBubble, 12000 + Math.random() * 8000)
    return () => { clearTimeout(t1); clearInterval(t2) }
  }, [pathname, isHome])

  /* ── Peek-a-boo ── */
  useEffect(() => {
    if (isHome) return
    const id = setInterval(() => {
      if (Math.random() > 0.5) return
      setPeeking(true)
      setTimeout(() => setPeeking(false), 2500)
    }, 25000 + Math.random() * 15000)
    return () => clearInterval(id)
  }, [isHome])

  /* ── Click with achievements ── */
  const handleClick = useCallback(() => {
    if (didDrag.current) return
    const count = incrementClicks()
    const ach = ACHIEVEMENTS[count]
    if (ach) {
      setAchievement(ach)
      setTimeout(() => setAchievement(null), 3000)
    }
  }, [])

  /* ── Drag (full 2D movement) ── */
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    didDrag.current = false
    dragOrigin.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y }
    setIsDragging(true)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [pos])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return
    const dx = e.clientX - dragOrigin.current.mx
    const dy = e.clientY - dragOrigin.current.my
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDrag.current = true
    setPos({
      x: Math.max(0, dragOrigin.current.px - dx),
      y: Math.max(0, dragOrigin.current.py + dy),
    })
  }, [isDragging])

  const onPointerUp = useCallback(() => {
    setIsDragging(false)
    if (!didDrag.current) handleClick()
  }, [handleClick])

  // Don't render on homepage
  if (isHome) return null

  return (
    <>
      {/* Achievement toast */}
      {achievement && (
        <div className="fixed left-1/2 top-20 z-[60] -translate-x-1/2 animate-fade-in-up rounded-lg border border-border bg-background px-4 py-2 shadow-lg">
          <p className="text-sm font-medium text-foreground">{achievement}</p>
        </div>
      )}

      {/* Peek-a-boo */}
      {peeking && (
        <div
          className="fixed right-0 z-[55] transition-transform duration-500"
          style={{ bottom: pos.y + 80, transform: 'translateX(40%)' }}
        >
          <PixelMascot scale={5} className="pointer-events-none" />
        </div>
      )}

      {/* Floating mascot */}
      <div
        className="fixed z-[55] cursor-grab select-none touch-none active:cursor-grabbing"
        style={{ right: pos.x, bottom: pos.y }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {bubble && !peeking && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground shadow-md animate-fade-in-up">
            {bubble}
            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-border bg-background" />
          </div>
        )}
        <PixelMascot scale={4} className="pointer-events-none" />
      </div>
    </>
  )
}
