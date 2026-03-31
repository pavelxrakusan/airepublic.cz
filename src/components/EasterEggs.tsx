'use client'

import { useCallback, useEffect, useState } from 'react'

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

/* ── Firework particle ─────────────────────────────────── */
function Firework({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500)
    return () => clearTimeout(t)
  }, [onDone])

  const colors = ['#D7141A', '#11457E', '#7c3aed', '#f59e0b', '#22c55e', '#C0613A']
  const particles = Array.from({ length: 40 }, (_, i) => {
    const angle = (i / 40) * Math.PI * 2
    const speed = 60 + Math.random() * 100
    const color = colors[i % colors.length]
    return { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed, color, size: 4 + Math.random() * 6 }
  })

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
      <p className="absolute top-1/3 text-2xl font-black text-foreground animate-fade-in-up">
        🎉 Konami kód aktivován! 🎉
      </p>
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute h-2 w-2 rounded-full"
          style={{
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            animation: `konami-particle 2s ease-out forwards`,
            animationDelay: `${Math.random() * 0.3}s`,
            // @ts-expect-error CSS custom properties for particle direction
            '--tx': `${p.x}px`,
            '--ty': `${p.y}px`,
          }}
        />
      ))}
    </div>
  )
}

/* ── Dark mode toggle component (used in Navigation) ──── */
export function DarkModeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
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

  return (
    <button
      onClick={toggle}
      className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:text-foreground"
      aria-label={dark ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim'}
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

/* ── Konami code listener ──────────────────────────────── */
export function KonamiListener() {
  const [showFirework, setShowFirework] = useState(false)
  const [sequence, setSequence] = useState<string[]>([])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      setSequence(prev => {
        const next = [...prev, e.key].slice(-KONAMI.length)
        if (next.length === KONAMI.length && next.every((k, i) => k === KONAMI[i])) {
          setShowFirework(true)
          return []
        }
        return next
      })
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  if (!showFirework) return null
  return <Firework onDone={() => setShowFirework(false)} />
}
