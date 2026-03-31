'use client'

import { useEffect, useRef } from 'react'

/* ── Czech flag colours (white → light gray for visibility on white bg) ── */
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

/**
 * Build a font string that works reliably on mobile.
 * Mobile Safari sometimes ignores custom fonts on offscreen canvas,
 * so we use a robust system font stack as fallback.
 */
function getCanvasFont(size: number): string {
  return `900 ${size}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
}

/* ── Component ──────────────────────────────────────────── */
export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef(0)
  const dimsRef = useRef({ w: 0, h: 0, dpr: 1 })
  const loopStarted = useRef(false)

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
      if (w === 0 || h === 0) return // not visible yet
      canvas!.width = w * dpr
      canvas!.height = h * dpr
      dimsRef.current = { w, h, dpr }
      buildParticles(w, h)
    }

    function buildParticles(w: number, h: number) {
      const particles: Particle[] = []
      const isMobile = w < 640
      const gap = isMobile ? 3 : 2

      const oc = makeOffscreen(w, h)
      oc.fillStyle = '#000'
      oc.textAlign = 'center'
      oc.textBaseline = 'middle'

      if (isMobile) {
        const fontSize = Math.min(w * 0.12, 44)
        oc.font = getCanvasFont(fontSize)
        oc.fillText('airepublic', w / 2, h * 0.42)
        oc.fillText('.cz', w / 2, h * 0.42 + fontSize * 1.15)
      } else {
        const fontSize = Math.min(w * 0.11, 120)
        oc.font = getCanvasFont(fontSize)
        oc.fillText('airepublic.cz', w / 2, h / 2)
      }

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
              x: Math.random() * w,
              y: Math.random() * h,
              tx: x,
              ty: y,
              color: getCzFlagColor(rx, ry),
              size: Math.random() * 1.2 + 0.8,
              ease: 0.012 + Math.random() * 0.035,
            })
          }
        }
      }

      // If no particles were generated (font issue), retry after delay
      if (particles.length === 0) {
        setTimeout(setup, 300)
        return
      }

      particlesRef.current = particles
    }

    function loop() {
      const { w, h, dpr } = dimsRef.current
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx!.clearRect(0, 0, w, h)

      const { x: mx, y: my } = mouseRef.current
      const R = 80
      const R2 = R * R

      for (const p of particlesRef.current) {
        p.x += (p.tx - p.x) * p.ease
        p.y += (p.ty - p.y) * p.ease

        const dx = p.x - mx
        const dy = p.y - my
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

    function startLoop() {
      if (!loopStarted.current) {
        loopStarted.current = true
        rafRef.current = requestAnimationFrame(loop)
      }
    }

    // Try immediately with system fonts (always available)
    setup()
    startLoop()

    // Retry once fonts are loaded (might improve rendering)
    document.fonts.ready.then(() => {
      setup()
    })

    // Extra retry for slow mobile connections
    setTimeout(setup, 800)

    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('resize', setup)

    return () => {
      cancelAnimationFrame(rafRef.current)
      loopStarted.current = false
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('resize', setup)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  )
}
