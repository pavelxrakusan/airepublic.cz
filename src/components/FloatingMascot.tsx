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
    'Víš že tohle všechno napsal AI?',
  ],
  '/nastroje': [
    'Claude je jasná jednička! 💜',
    'Testoval jsem všechny.',
    'Hodnocení je upřímné, fakt.',
    'Midjourney dělá krásu.',
  ],
  '/projekty': [
    'CARFAST.cz je moje pýcha!',
    'Zero dependencies ftw!',
    'Vibe coding v praxi 🚀',
  ],
  '/o-mne': [
    'To jsem já! 👋',
    'Pavel je fajn člověk.',
    'Napište mu, nebojte se.',
  ],
}

const GENERIC_BUBBLES = [
  'Ahoj! 👋',
  'Klikni na mě!',
  'Líbí se ti tu?',
  'Postaven s Claude Code ✨',
  'Next.js 15 je pecka.',
  'Znáš Konami kód? 🎮',
  'Zkus tmavý režim! 🌙',
]

/* ── Achievement system ────────────────────────────────── */

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
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null)
  const [position, setPosition] = useState({ right: 16, bottom: 16 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const posStart = useRef({ right: 16, bottom: 16 })
  const bubbleTimer = useRef<ReturnType<typeof setTimeout>>(null)
  const peekTimer = useRef<ReturnType<typeof setInterval>>(null)

  // Hide on homepage (hero mascot is already there)
  const isHome = pathname === '/'
  if (isHome) return null

  /* ── Random speech bubbles ── */
  useEffect(() => {
    const showBubble = () => {
      const pathBubbles = Object.entries(BUBBLES_BY_PATH).find(
        ([path]) => pathname.startsWith(path),
      )?.[1]
      const pool = pathBubbles
        ? [...pathBubbles, ...GENERIC_BUBBLES]
        : GENERIC_BUBBLES
      const text = pool[Math.floor(Math.random() * pool.length)]
      setBubble(text)
      setTimeout(() => setBubble(null), 3500)
    }

    // Show first bubble after 2s
    const initial = setTimeout(showBubble, 2000)
    // Then every 12-20s
    const recurring = setInterval(showBubble, 12000 + Math.random() * 8000)

    return () => {
      clearTimeout(initial)
      clearInterval(recurring)
    }
  }, [pathname])

  /* ── Peek-a-boo ── */
  useEffect(() => {
    peekTimer.current = setInterval(() => {
      if (Math.random() > 0.5) return // 50% chance to skip
      setPeeking(true)
      setTimeout(() => setPeeking(false), 2500)
    }, 25000 + Math.random() * 15000)

    return () => { if (peekTimer.current) clearInterval(peekTimer.current) }
  }, [])

  /* ── Click handler with achievements ── */
  const handleClick = useCallback(() => {
    if (dragging) return
    const count = incrementClicks()
    const ach = ACHIEVEMENTS[count]
    if (ach) {
      setAchievement(ach)
      setTimeout(() => setAchievement(null), 3000)
    }
  }, [dragging])

  /* ── Drag handlers ── */
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setDragging(false)
    dragStart.current = { x: e.clientX, y: e.clientY }
    posStart.current = { ...position }
    setDragOffset({ x: e.clientX, y: e.clientY })
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [position])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragOffset) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) setDragging(true)
    setPosition({
      right: Math.max(0, posStart.current.right - dx),
      bottom: Math.max(0, posStart.current.bottom + dy),
    })
  }, [dragOffset])

  const handlePointerUp = useCallback(() => {
    setDragOffset(null)
    // Trigger click only if we didn't drag
    if (!dragging) handleClick()
    setTimeout(() => setDragging(false), 50)
  }, [dragging, handleClick])

  return (
    <>
      {/* Achievement toast */}
      {achievement && (
        <div className="fixed left-1/2 top-20 z-[60] -translate-x-1/2 animate-fade-in-up rounded-lg border border-border bg-white px-4 py-2 shadow-lg">
          <p className="text-sm font-medium text-foreground">{achievement}</p>
        </div>
      )}

      {/* Peek-a-boo from right edge */}
      {peeking && (
        <div
          className="fixed right-0 z-[55] transition-transform duration-500"
          style={{ bottom: position.bottom + 80, transform: 'translateX(40%)' }}
        >
          <PixelMascot scale={5} className="pointer-events-none" />
        </div>
      )}

      {/* Main floating mascot */}
      <div
        className="fixed z-[55] cursor-grab select-none active:cursor-grabbing"
        style={{ right: position.right, bottom: position.bottom }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Speech bubble */}
        {bubble && !peeking && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-white px-3 py-1.5 text-xs text-foreground shadow-md animate-fade-in-up">
            {bubble}
            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-border bg-white" />
          </div>
        )}

        <PixelMascot scale={4} className="pointer-events-none" />
      </div>
    </>
  )
}
