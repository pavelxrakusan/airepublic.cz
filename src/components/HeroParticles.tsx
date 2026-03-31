'use client'

import { useEffect, useRef, useState } from 'react'

/* ── Czech flag colours ──────────────────────────────────── */
const CZ_BLUE = '#11457E'
const CZ_GRAY = '#B0B0B0'
const CZ_RED = '#D7141A'

/* ── Types ──────────────────────────────────────────────── */
interface Particle {
  x: number
  y: number
  tx: number
  ty: number
  color: string
  size: number
  ease: number
}

/* ── Helpers ────────────────────────────────────────────── */

function getCzFlagColor(rx: number, ry: number): string {
  const triW = 0.5
  if (rx < triW) {
    const topEdge = (rx / triW) * 0.5
    const botEdge = 1 - topEdge
    if (ry >= topEdge && ry <= botEdge) return CZ_BLUE
  }
  return ry < 0.5 ? CZ_GRAY : CZ_RED
}

function makeOffscreen(w: number, h: number): CanvasRenderingContext2D {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c.getContext('2d')!
}

function findBounds(data: Uint8ClampedArray, w: number, h: number, gap: number) {
  let x0 = w, y0 = h, x1 = 0, y1 = 0
  for (let y = 0; y < h; y += gap) {
    for (let x = 0; x < w; x += gap) {
      if (data[(y * w + x) * 4 + 3] > 128) {
        if (x < x0) x0 = x
        if (x > x1) x1 = x
        if (y < y0) y0 = y
        if (y > y1) y1 = y
      }
    }
  }
  return { x0, y0, x1: Math.max(x1, x0 + 1), y1: Math.max(y1, y0 + 1) }
}

function getCanvasFont(size: number): string {
  return `900 ${size}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
}

/* ── Desktop: Canvas particle animation ─────────────────── */
function DesktopParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef(0)
  const dimsRef = useRef({ w: 0, h: 0, dpr: 1 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    function setup() {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas!.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      if (w === 0 || h === 0) return
      canvas!.width = w * dpr
      canvas!.height = h * dpr
      dimsRef.current = { w, h, dpr }

      const particles: Particle[] = []
      const gap = 2
      const oc = makeOffscreen(w, h)
      const fontSize = Math.min(w * 0.11, 120)
      oc.fillStyle = '#000'
      oc.font = getCanvasFont(fontSize)
      oc.textAlign = 'center'
      oc.textBaseline = 'middle'
      oc.fillText('airepublic.cz', w / 2, h / 2)

      const imageData = oc.getImageData(0, 0, w, h).data
      const bounds = findBounds(imageData, w, h, gap)
      const bw = bounds.x1 - bounds.x0
      const bh = bounds.y1 - bounds.y0

      for (let y = 0; y < h; y += gap) {
        for (let x = 0; x < w; x += gap) {
          if (imageData[(y * w + x) * 4 + 3] > 128) {
            const rx = (x - bounds.x0) / bw
            const ry = (y - bounds.y0) / bh
            particles.push({
              x: Math.random() * w, y: Math.random() * h,
              tx: x, ty: y,
              color: getCzFlagColor(rx, ry),
              size: Math.random() * 1.2 + 0.8,
              ease: 0.012 + Math.random() * 0.035,
            })
          }
        }
      }
      particlesRef.current = particles
    }

    function loop() {
      const { w, h, dpr } = dimsRef.current
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx!.clearRect(0, 0, w, h)
      const { x: mx, y: my } = mouseRef.current
      const R = 80, R2 = R * R
      for (const p of particlesRef.current) {
        p.x += (p.tx - p.x) * p.ease
        p.y += (p.ty - p.y) * p.ease
        const dx = p.x - mx, dy = p.y - my
        const d2 = dx * dx + dy * dy
        if (d2 < R2) {
          const f = (R - Math.sqrt(d2)) / R
          p.x += dx * f * 0.4
          p.y += dy * f * 0.4
        }
        ctx!.fillStyle = p.color
        ctx!.fillRect(p.x, p.y, p.size, p.size)
      }
      rafRef.current = requestAnimationFrame(loop)
    }

    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    function onPointerLeave() {
      mouseRef.current = { x: -9999, y: -9999 }
    }

    setup()
    rafRef.current = requestAnimationFrame(loop)
    document.fonts.ready.then(setup)

    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('resize', setup)
    return () => {
      cancelAnimationFrame(rafRef.current)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('resize', setup)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
}

/* ── Mobile: CSS gradient text ──────────────────────────── */
function MobileTitle() {
  return (
    <div className="flex flex-col items-center gap-1">
      <h1
        className="text-center text-4xl font-black tracking-tight animate-fade-in-up"
        style={{
          background: `linear-gradient(135deg, ${CZ_BLUE} 0%, ${CZ_BLUE} 30%, #999 45%, #999 55%, ${CZ_RED} 70%, ${CZ_RED} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        airepublic
      </h1>
      <span
        className="text-2xl font-black tracking-tight animate-fade-in-up"
        style={{
          animationDelay: '0.3s',
          background: `linear-gradient(135deg, ${CZ_RED} 0%, #999 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        .cz
      </span>
    </div>
  )
}

/* ── Main component — switches on viewport width ────────── */
export function HeroParticles() {
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!mounted) return null

  if (isMobile) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <MobileTitle />
      </div>
    )
  }

  return <DesktopParticles />
}
