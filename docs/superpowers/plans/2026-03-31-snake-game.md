# Snake Game Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a playable Snake game as an easter egg on airepublic.cz, embedded in a blog article with an interactive terminal launcher and a persistent leaderboard.

**Architecture:** Canvas-based Snake game in a fullscreen modal, triggered from an interactive terminal component in an MDX blog post. Scores persisted via Vercel Blob JSON file, served through a Next.js API route. All game components are `'use client'` and passed to MDXRemote via a components map.

**Tech Stack:** Next.js App Router, Canvas API, Vercel Blob (`@vercel/blob`), Touch Events API, `next-mdx-remote/rsc`

---

### Task 1: Install @vercel/blob and enable MDX custom components

**Files:**
- Modify: `package.json` (add dependency)
- Modify: `src/app/blog/[slug]/page.tsx:142` (add components prop to MDXRemote)
- Create: `src/lib/mdx-components.tsx` (shared components map)

- [ ] **Step 1: Install @vercel/blob**

```bash
npm install @vercel/blob
```

- [ ] **Step 2: Create MDX components map**

Create `src/lib/mdx-components.tsx`:

```tsx
import dynamic from 'next/dynamic'

const SnakeTerminal = dynamic(() => import('@/components/SnakeTerminal'), { ssr: false })
const SnakeLeaderboard = dynamic(() => import('@/components/SnakeLeaderboard'), { ssr: false })

export const mdxComponents = {
  SnakeTerminal,
  SnakeLeaderboard,
}
```

Using `dynamic` with `ssr: false` because these are canvas/interactive components that need the browser.

- [ ] **Step 3: Pass components to MDXRemote**

In `src/app/blog/[slug]/page.tsx`, import and pass components:

```tsx
// Add import at top
import { mdxComponents } from '@/lib/mdx-components'

// Change line 142 from:
<MDXRemote source={post.content} />
// To:
<MDXRemote source={post.content} components={mdxComponents} />
```

- [ ] **Step 4: Verify existing blog posts still render**

```bash
npm run dev
```

Open any existing blog post (e.g., `/blog/leadforge-architektura`) and confirm it renders correctly.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/lib/mdx-components.tsx src/app/blog/\\[slug\\]/page.tsx
git commit -m "feat: add @vercel/blob and MDX custom components support"
```

---

### Task 2: Snake game engine (SnakeGame.tsx)

**Files:**
- Create: `src/components/SnakeGame.tsx`

This is the core game — canvas rendering, game loop, input handling, collision detection.

- [ ] **Step 1: Create SnakeGame component**

Create `src/components/SnakeGame.tsx`:

```tsx
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const GRID = 20
const CELL = 0 // calculated dynamically from canvas size
const INITIAL_SPEED = 150
const SPEED_INCREMENT = 5
const MIN_SPEED = 60
const SCORE_PER_FOOD = 10

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
type Point = { x: number; y: number }

interface SnakeGameProps {
  onGameOver: (score: number) => void
  onClose: () => void
}

export default function SnakeGame({ onGameOver, onClose }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [paused, setPaused] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  // Game state refs (to avoid stale closures in game loop)
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }])
  const dirRef = useRef<Direction>('RIGHT')
  const nextDirRef = useRef<Direction>('RIGHT')
  const foodRef = useRef<Point>({ x: 15, y: 10 })
  const scoreRef = useRef(0)
  const speedRef = useRef(INITIAL_SPEED)
  const gameOverRef = useRef(false)
  const pausedRef = useRef(false)
  const lastTickRef = useRef(0)
  const rafRef = useRef<number>(0)

  // Touch handling for swipe
  const touchStartRef = useRef<Point | null>(null)

  const spawnFood = useCallback(() => {
    const snake = snakeRef.current
    let pos: Point
    do {
      pos = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) }
    } while (snake.some(s => s.x === pos.x && s.y === pos.y))
    foodRef.current = pos
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cell = canvas.width / GRID

    // Background
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Grid lines (subtle)
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath()
      ctx.moveTo(i * cell, 0)
      ctx.lineTo(i * cell, canvas.height)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * cell)
      ctx.lineTo(canvas.width, i * cell)
      ctx.stroke()
    }

    // Food
    const food = foodRef.current
    ctx.fillStyle = '#ef4444'
    ctx.shadowColor = '#ef4444'
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.arc(food.x * cell + cell / 2, food.y * cell + cell / 2, cell * 0.4, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0

    // Snake
    const snake = snakeRef.current
    snake.forEach((seg, i) => {
      const brightness = 1 - (i / snake.length) * 0.5
      ctx.fillStyle = `rgb(${Math.round(34 * brightness)}, ${Math.round(197 * brightness)}, ${Math.round(94 * brightness)})`
      ctx.fillRect(seg.x * cell + 1, seg.y * cell + 1, cell - 2, cell - 2)
    })
  }, [])

  const tick = useCallback(() => {
    if (gameOverRef.current || pausedRef.current) return

    const snake = [...snakeRef.current]
    const dir = nextDirRef.current
    dirRef.current = dir

    const head = { ...snake[0] }
    if (dir === 'UP') head.y--
    if (dir === 'DOWN') head.y++
    if (dir === 'LEFT') head.x--
    if (dir === 'RIGHT') head.x++

    // Wall collision
    if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
      gameOverRef.current = true
      onGameOver(scoreRef.current)
      return
    }

    // Self collision
    if (snake.some(s => s.x === head.x && s.y === head.y)) {
      gameOverRef.current = true
      onGameOver(scoreRef.current)
      return
    }

    snake.unshift(head)

    // Food collision
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      scoreRef.current += SCORE_PER_FOOD
      setScore(scoreRef.current)
      speedRef.current = Math.max(MIN_SPEED, speedRef.current - SPEED_INCREMENT)
      spawnFood()
    } else {
      snake.pop()
    }

    snakeRef.current = snake
    draw()
  }, [draw, onGameOver, spawnFood])

  const gameLoop = useCallback((timestamp: number) => {
    if (gameOverRef.current) return

    if (timestamp - lastTickRef.current >= speedRef.current) {
      lastTickRef.current = timestamp
      tick()
    }

    rafRef.current = requestAnimationFrame(gameLoop)
  }, [tick])

  const startGame = useCallback(() => {
    setGameStarted(true)
    draw()
    rafRef.current = requestAnimationFrame(gameLoop)
  }, [draw, gameLoop])

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }

      if (e.key === ' ') {
        e.preventDefault()
        pausedRef.current = !pausedRef.current
        setPaused(pausedRef.current)
        if (!pausedRef.current) {
          lastTickRef.current = performance.now()
          rafRef.current = requestAnimationFrame(gameLoop)
        }
        return
      }

      if (!gameStarted) { startGame(); return }

      const dir = dirRef.current
      if ((e.key === 'ArrowUp' || e.key === 'w') && dir !== 'DOWN') nextDirRef.current = 'UP'
      if ((e.key === 'ArrowDown' || e.key === 's') && dir !== 'UP') nextDirRef.current = 'DOWN'
      if ((e.key === 'ArrowLeft' || e.key === 'a') && dir !== 'RIGHT') nextDirRef.current = 'LEFT'
      if ((e.key === 'ArrowRight' || e.key === 'd') && dir !== 'LEFT') nextDirRef.current = 'RIGHT'
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [gameStarted, startGame, gameLoop, onClose])

  // Touch controls (swipe)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      if (!gameStarted) { startGame(); return }
      const touch = e.touches[0]
      touchStartRef.current = { x: touch.clientX, y: touch.clientY }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault()
      if (!touchStartRef.current) return
      const touch = e.changedTouches[0]
      const dx = touch.clientX - touchStartRef.current.x
      const dy = touch.clientY - touchStartRef.current.y
      touchStartRef.current = null

      const minSwipe = 20
      if (Math.abs(dx) < minSwipe && Math.abs(dy) < minSwipe) return

      const dir = dirRef.current
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && dir !== 'LEFT') nextDirRef.current = 'RIGHT'
        if (dx < 0 && dir !== 'RIGHT') nextDirRef.current = 'LEFT'
      } else {
        if (dy > 0 && dir !== 'UP') nextDirRef.current = 'DOWN'
        if (dy < 0 && dir !== 'DOWN') nextDirRef.current = 'UP'
      }
    }

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false })
    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchend', handleTouchEnd)
    }
  }, [gameStarted, startGame])

  // Canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const size = Math.min(window.innerWidth - 32, window.innerHeight - 160, 500)
    canvas.width = size
    canvas.height = size
    draw()
  }, [draw])

  // Cleanup
  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90"
      onClick={(e) => { if (e.target === e.currentTarget && !gameStarted) onClose() }}
    >
      {/* Header */}
      <div className="mb-4 flex w-full max-w-[500px] items-center justify-between px-4">
        <span className="font-mono text-lg text-green-400">Skóre: {score}</span>
        <button
          onClick={onClose}
          className="text-sm text-zinc-500 transition-colors hover:text-white"
        >
          ESC
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="rounded-lg border border-zinc-800"
      />

      {/* Instructions */}
      {!gameStarted && (
        <p className="mt-4 animate-pulse font-mono text-sm text-zinc-500">
          Stiskni cokoliv pro start
        </p>
      )}
      {paused && (
        <p className="mt-4 font-mono text-sm text-yellow-400">
          PAUZA — mezerník pro pokračování
        </p>
      )}

      {/* Mobile pause */}
      {gameStarted && !paused && (
        <button
          onClick={() => {
            pausedRef.current = true
            setPaused(true)
          }}
          className="mt-4 font-mono text-sm text-zinc-600 sm:hidden"
        >
          ⏸ Pauza
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify game renders**

```bash
npm run dev
```

Temporarily import and render `<SnakeGame onGameOver={console.log} onClose={() => {}} />` on any page to test. Remove after verification.

- [ ] **Step 3: Commit**

```bash
git add src/components/SnakeGame.tsx
git commit -m "feat: add Snake game engine with canvas rendering and touch controls"
```

---

### Task 3: API route for leaderboard scores

**Files:**
- Create: `src/app/api/snake-scores/route.ts`

- [ ] **Step 1: Create the API route**

Create `src/app/api/snake-scores/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { put, head } from '@vercel/blob'

interface ScoreEntry {
  name: string
  score: number
  date: string
}

const BLOB_KEY = 'snake-scores.json'
const MAX_SCORES = 10
const RATE_LIMIT_MS = 60_000

// Simple in-memory rate limit (resets on cold start — fine for this scale)
const lastSubmit = new Map<string, number>()

async function getScores(): Promise<ScoreEntry[]> {
  try {
    const blob = await head(BLOB_KEY)
    if (!blob) return []
    const res = await fetch(blob.url)
    return await res.json()
  } catch {
    return []
  }
}

async function saveScores(scores: ScoreEntry[]) {
  await put(BLOB_KEY, JSON.stringify(scores), {
    access: 'public',
    addRandomSuffix: false,
  })
}

export async function GET() {
  const scores = await getScores()
  return NextResponse.json(scores)
}

export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
  const now = Date.now()
  const last = lastSubmit.get(ip)
  if (last && now - last < RATE_LIMIT_MS) {
    return NextResponse.json(
      { error: 'Počkej chvíli před dalším zápisem' },
      { status: 429 }
    )
  }

  const body = await req.json()
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 12) : ''
  const score = typeof body.score === 'number' ? body.score : 0

  if (!name || score <= 0) {
    return NextResponse.json({ error: 'Neplatné údaje' }, { status: 400 })
  }

  lastSubmit.set(ip, now)

  const scores = await getScores()
  scores.push({ name, score, date: new Date().toISOString() })
  scores.sort((a, b) => b.score - a.score)
  const top = scores.slice(0, MAX_SCORES)

  await saveScores(top)
  return NextResponse.json(top)
}
```

- [ ] **Step 2: Set up BLOB_READ_WRITE_TOKEN**

Vercel Blob needs a token. In Vercel dashboard → Storage → Create Blob Store → connect to project. Then:

```bash
vercel env pull
```

This pulls `BLOB_READ_WRITE_TOKEN` to `.env.local`.

- [ ] **Step 3: Test locally**

```bash
npm run dev
# In another terminal:
curl http://localhost:3000/api/snake-scores
# Expected: []

curl -X POST http://localhost:3000/api/snake-scores \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","score":100}'
# Expected: [{"name":"Test","score":100,"date":"..."}]
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/snake-scores/route.ts
git commit -m "feat: add snake leaderboard API with Vercel Blob storage"
```

---

### Task 4: Snake Terminal component

**Files:**
- Create: `src/components/SnakeTerminal.tsx`

- [ ] **Step 1: Create the interactive terminal**

Create `src/components/SnakeTerminal.tsx`:

```tsx
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'

const SnakeGame = dynamic(() => import('./SnakeGame'), { ssr: false })

interface Line {
  text: string
  type: 'input' | 'output' | 'error' | 'success'
}

export default function SnakeTerminal() {
  const [lines, setLines] = useState<Line[]>([
    { text: 'airepublic.cz terminal v1.0', type: 'output' },
    { text: 'Napiš "snake" pro spuštění hry.', type: 'output' },
  ])
  const [input, setInput] = useState('')
  const [playing, setPlaying] = useState(false)
  const [gameOverScore, setGameOverScore] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight)
  }, [lines])

  const addLine = useCallback((text: string, type: Line['type']) => {
    setLines(prev => [...prev, { text, type }])
  }, [])

  const handleCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    addLine(`$ ${cmd}`, 'input')

    if (trimmed === 'snake' || trimmed === 'run snake.exe') {
      addLine('Spouštím snake.exe...', 'success')
      setTimeout(() => setPlaying(true), 500)
    } else if (trimmed === 'help') {
      addLine('Dostupné příkazy: snake, help, clear', 'output')
    } else if (trimmed === 'clear') {
      setLines([])
    } else if (trimmed === '') {
      // empty
    } else {
      addLine(`command not found: ${cmd.trim()}`, 'error')
    }

    setInput('')
  }, [addLine])

  const handleGameOver = useCallback((score: number) => {
    setPlaying(false)
    setGameOverScore(score)
    addLine(`Game over! Skóre: ${score}`, 'success')
  }, [addLine])

  const handleSubmitScore = useCallback(async () => {
    if (!name.trim() || gameOverScore === null) return
    setSubmitting(true)
    try {
      await fetch('/api/snake-scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), score: gameOverScore }),
      })
      addLine(`Skóre ${gameOverScore} uloženo jako "${name.trim()}"!`, 'success')
    } catch {
      addLine('Nepodařilo se uložit skóre.', 'error')
    }
    setGameOverScore(null)
    setName('')
    setSubmitting(false)
  }, [name, gameOverScore, addLine])

  return (
    <>
      <div
        className="my-8 overflow-hidden rounded-lg border border-zinc-800 bg-[#0a0a0a] font-mono text-sm"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-2">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="h-3 w-3 rounded-full bg-green-500" />
          <span className="ml-2 text-xs text-zinc-600">terminal</span>
        </div>

        {/* Output */}
        <div ref={scrollRef} className="max-h-64 overflow-y-auto p-4">
          {lines.map((line, i) => (
            <div
              key={i}
              className={
                line.type === 'input' ? 'text-zinc-300' :
                line.type === 'error' ? 'text-red-400' :
                line.type === 'success' ? 'text-green-400' :
                'text-zinc-500'
              }
            >
              {line.text}
            </div>
          ))}

          {/* Score submit form */}
          {gameOverScore !== null && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-yellow-400">Přezdívka:</span>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value.slice(0, 12))}
                onKeyDown={e => e.key === 'Enter' && handleSubmitScore()}
                className="border-b border-zinc-700 bg-transparent text-white outline-none"
                placeholder="max 12 znaků"
                maxLength={12}
                autoFocus
                disabled={submitting}
              />
              <button
                onClick={handleSubmitScore}
                disabled={submitting || !name.trim()}
                className="text-green-400 hover:text-green-300 disabled:text-zinc-600"
              >
                [Enter]
              </button>
            </div>
          )}

          {/* Input line */}
          {gameOverScore === null && (
            <div className="mt-1 flex items-center">
              <span className="text-green-400">$&nbsp;</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCommand(input)}
                className="flex-1 bg-transparent text-zinc-300 caret-green-400 outline-none"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          )}
        </div>
      </div>

      {/* Game modal */}
      {playing && (
        <SnakeGame
          onGameOver={handleGameOver}
          onClose={() => { setPlaying(false); addLine('Hra ukončena.', 'output') }}
        />
      )}
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SnakeTerminal.tsx
git commit -m "feat: add interactive terminal component for launching Snake"
```

---

### Task 5: Leaderboard component

**Files:**
- Create: `src/components/SnakeLeaderboard.tsx`

- [ ] **Step 1: Create the leaderboard**

Create `src/components/SnakeLeaderboard.tsx`:

```tsx
'use client'

import { useEffect, useState } from 'react'

interface ScoreEntry {
  name: string
  score: number
  date: string
}

export default function SnakeLeaderboard() {
  const [scores, setScores] = useState<ScoreEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/snake-scores')
      .then(r => r.json())
      .then(setScores)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="my-4 text-sm text-zinc-500">Načítám leaderboard...</p>
  if (scores.length === 0) return <p className="my-4 text-sm text-zinc-500">Zatím žádné skóre. Buď první!</p>

  return (
    <div className="my-8 overflow-hidden rounded-lg border border-zinc-800">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-800 bg-zinc-900/50">
          <tr>
            <th className="px-4 py-2 font-mono text-zinc-500">#</th>
            <th className="px-4 py-2 font-mono text-zinc-500">Hráč</th>
            <th className="px-4 py-2 text-right font-mono text-zinc-500">Skóre</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((entry, i) => (
            <tr key={i} className="border-b border-zinc-800/50 last:border-0">
              <td className="px-4 py-2 font-mono text-zinc-600">{i + 1}</td>
              <td className="px-4 py-2 font-mono text-zinc-300">{entry.name}</td>
              <td className="px-4 py-2 text-right font-mono text-green-400">{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SnakeLeaderboard.tsx
git commit -m "feat: add snake leaderboard component"
```

---

### Task 6: Blog article (MDX)

**Files:**
- Create: `src/content/blog/snake-game.mdx`

- [ ] **Step 1: Write the article**

Create `src/content/blog/snake-game.mdx`:

```mdx
---
title: "Skrytý Snake v blogu — jak jsem postavil hru za odpoledne"
description: "Interaktivní Snake přímo v článku. Canvas API, swipe gesta, leaderboard přes Vercel Blob. Spusť si ho přímo tady."
date: "2026-03-31"
tags: ["projekt", "vibe coding", "hry", "Canvas API", "easter egg"]
---

Každý tech blog potřebuje easter egg. Tenhle má Snake.

## Proč zrovna Snake

Protože je jednoduchý na pochopení, těžký na zvládnutí a ideální na procvičení Canvas API. Plus — kdo nehrál Snake na Nokii?

## Jak to funguje

### Canvas rendering

Celá hra běží na HTML5 Canvas — žádný DOM, žádné CSS animace. Herní pole je mřížka 20×20 buněk, had se pohybuje po buňkách, ne po pixelech.

```ts
// Game loop — každý tick posune hada o jedno pole
const tick = () => {
  const head = { ...snake[0] }
  if (dir === 'UP') head.y--
  if (dir === 'DOWN') head.y++

  // Kolize se zdí nebo se sebou = game over
  if (head.x < 0 || head.x >= GRID) return gameOver()
  if (snake.some(s => s.x === head.x && s.y === head.y)) return gameOver()

  snake.unshift(head)
  if (head.x === food.x && head.y === food.y) {
    score += 10
    spawnFood()
  } else {
    snake.pop()
  }
}
```

### Ovládání na mobilu

Na desktopu šipky, na mobilu swipe gesta. Detekce je jednoduchá — porovnám pozici prstu na `touchstart` a `touchend`:

```ts
const dx = touchEnd.x - touchStart.x
const dy = touchEnd.y - touchStart.y

if (Math.abs(dx) > Math.abs(dy)) {
  // Horizontální swipe
  direction = dx > 0 ? 'RIGHT' : 'LEFT'
} else {
  // Vertikální swipe
  direction = dy > 0 ? 'DOWN' : 'UP'
}
```

Hra běží ve fullscreen modalu, takže swipe nekoliduje se scrollem stránky.

### Leaderboard

Skóre se ukládá přes API do Vercel Blob — jednoduchý JSON soubor s top 10. Žádná databáze, žádný setup. Rate limit 1 zápis za minutu per IP, aby nikdo nespamoval.

## Zkus to

Otevři terminál a napiš `snake`:

<SnakeTerminal />

## Leaderboard — Top 10

<SnakeLeaderboard />

## Co jsem se naučil

**Canvas API je překvapivě příjemný.** `requestAnimationFrame` + jednoduchý state machine = plynulá hra. Žádný framework, žádná knihovna.

**Touch eventy nejsou složité.** Dva event listenery a trocha matematiky. Swipe detekce za 15 řádků kódu.

**Vercel Blob je ideální pro small data.** JSON soubor s 10 záznamy? Perfektní use case. Žádný Postgres, žádný Redis.
```

- [ ] **Step 2: Verify the article renders with terminal and leaderboard**

```bash
npm run dev
```

Open `/blog/snake-game`, confirm:
- Article renders
- Terminal shows with blinking cursor
- Typing `snake` launches the game
- Game works with keyboard
- Game over shows score submit form
- Leaderboard renders below

- [ ] **Step 3: Commit**

```bash
git add src/content/blog/snake-game.mdx
git commit -m "feat: add snake game blog article with interactive terminal"
```

---

### Task 7: Final integration test and polish

**Files:**
- Possibly modify: `src/components/SnakeGame.tsx` (minor tweaks)
- Possibly modify: `src/components/SnakeTerminal.tsx` (minor tweaks)

- [ ] **Step 1: Test full flow on desktop**

1. Open `/blog/snake-game`
2. Click into terminal, type `snake`, press Enter
3. Game opens fullscreen, play with arrow keys
4. Die, enter name, submit score
5. Leaderboard updates
6. Type `help` → shows help
7. Type `gibberish` → shows "command not found"

- [ ] **Step 2: Test mobile flow**

Use Chrome DevTools device emulation (iPhone 14 / Pixel 7):
1. Terminal input works with soft keyboard
2. Game opens, swipe controls work
3. Score submit works on mobile
4. Canvas sizes correctly

- [ ] **Step 3: Test edge cases**

- Empty name submission → rejected
- Rapid double submit → rate limited
- ESC closes game
- Pause/unpause with spacebar

- [ ] **Step 4: Final commit and push**

```bash
git add -A
git commit -m "feat: snake game easter egg with leaderboard

Interactive Snake game embedded in a blog article. Features:
- Canvas-based rendering with grid movement
- Keyboard (arrows/WASD) and touch (swipe) controls
- Interactive terminal launcher (type 'snake' to play)
- Persistent leaderboard via Vercel Blob (top 10)
- Rate-limited score submission (1/min per IP)"

git push
```
