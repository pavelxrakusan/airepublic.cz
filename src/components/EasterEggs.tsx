'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

/* ═══════════════════════════════════════════════════════
   MEGA FIREWORK — full screen, multiple bursts, CZ colors
   ═══════════════════════════════════════════════════════ */

const CZ_COLORS = ['#11457E', '#FFFFFF', '#D7141A']
const ACCENT_COLORS = ['#7c3aed', '#f59e0b', '#22c55e', '#ec4899', '#C0613A']
const ALL_COLORS = [...CZ_COLORS, ...CZ_COLORS, ...ACCENT_COLORS]

interface Spark {
  id: number
  x: number
  y: number
  tx: number
  ty: number
  color: string
  size: number
  delay: number
}

function MegaFirework({ onDone }: { onDone: () => void }) {
  const [sparks, setSparks] = useState<Spark[]>([])
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const allSparks: Spark[] = []
    let id = 0

    // 5 burst points across the screen
    const bursts = [
      { x: 30, y: 35, delay: 0 },
      { x: 70, y: 30, delay: 300 },
      { x: 50, y: 25, delay: 150 },
      { x: 20, y: 45, delay: 400 },
      { x: 80, y: 40, delay: 500 },
    ]

    for (const burst of bursts) {
      const count = 25 + Math.floor(Math.random() * 15)
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3
        const speed = 80 + Math.random() * 200
        allSparks.push({
          id: id++,
          x: burst.x,
          y: burst.y,
          tx: Math.cos(angle) * speed,
          ty: Math.sin(angle) * speed,
          color: ALL_COLORS[Math.floor(Math.random() * ALL_COLORS.length)],
          size: 3 + Math.random() * 5,
          delay: burst.delay + Math.random() * 100,
        })
      }
    }

    setSparks(allSparks)

    // Phase transitions
    setTimeout(() => setPhase(1), 100)
    setTimeout(() => setPhase(2), 2500)
    setTimeout(onDone, 4000)
  }, [onDone])

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden pointer-events-none">
      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-black transition-opacity duration-500"
        style={{ opacity: phase === 0 ? 0 : phase === 2 ? 0 : 0.7 }}
      />

      {/* Title */}
      {phase >= 1 && phase < 2 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-5xl font-black tracking-tight text-white sm:text-7xl animate-fade-in-up"
             style={{ textShadow: '0 0 40px rgba(124, 58, 237, 0.8), 0 0 80px rgba(124, 58, 237, 0.4)' }}>
            KONAMI CODE
          </p>
          <p className="mt-2 text-2xl font-bold text-accent animate-fade-in-up sm:text-3xl"
             style={{ animationDelay: '0.3s', textShadow: '0 0 20px rgba(124, 58, 237, 0.6)' }}>
            UNLOCKED!
          </p>
        </div>
      )}

      {/* Sparks */}
      {sparks.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            backgroundColor: s.color,
            boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
            animation: `konami-particle 2s ease-out ${s.delay}ms forwards`,
            '--tx': `${s.tx}px`,
            '--ty': `${s.ty}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   DARK MODE TOGGLE
   ═══════════════════════════════════════════════════════ */

export function DarkModeToggle({ className = '' }: { className?: string }) {
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme')
    const isDark = stored === 'dark'
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  const toggle = useCallback(() => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }, [dark])

  if (!mounted) return null

  return (
    <button
      onClick={toggle}
      className={`flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:text-foreground ${className}`}
      aria-label={dark ? 'Světlý režim' : 'Tmavý režim'}
    >
      {dark ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 8 1zm0 11a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 8 12zm7-4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1A.5.5 0 0 1 15 8zM3 8a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1A.5.5 0 0 1 3 8zm9.354-3.354a.5.5 0 0 1 0 .708l-.708.707a.5.5 0 1 1-.707-.707l.707-.708a.5.5 0 0 1 .708 0zM5.354 11.354a.5.5 0 0 1 0 .708l-.708.707a.5.5 0 1 1-.707-.707l.707-.708a.5.5 0 0 1 .708 0zM12.354 11.354a.5.5 0 0 1-.708 0l-.707-.708a.5.5 0 0 1 .707-.707l.708.707a.5.5 0 0 1 0 .708zM5.354 4.646a.5.5 0 0 1-.708 0l-.707-.708a.5.5 0 1 1 .707-.707l.708.707a.5.5 0 0 1 0 .708zM8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
        </svg>
      )}
    </button>
  )
}

/* ═══════════════════════════════════════════════════════
   KONAMI CODE LISTENER
   ═══════════════════════════════════════════════════════ */

export function KonamiListener() {
  const [active, setActive] = useState(false)
  const seq = useRef<string[]>([])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      seq.current = [...seq.current, e.key].slice(-KONAMI.length)
      if (seq.current.length === KONAMI.length && seq.current.every((k, i) => k === KONAMI[i])) {
        setActive(true)
        seq.current = []
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  if (!active) return null
  return <MegaFirework onDone={() => setActive(false)} />
}
