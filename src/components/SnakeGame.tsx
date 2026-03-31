'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface SnakeGameProps {
  onGameOver: (score: number) => void
  onClose: () => void
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
type GameStatus = 'idle' | 'playing' | 'paused' | 'dead'

interface Point {
  x: number
  y: number
}

const GRID_SIZE = 20
const INITIAL_SPEED = 150
const MIN_SPEED = 60
const SPEED_DECREMENT = 5
const SCORE_PER_FOOD = 10
const CANVAS_MAX = 500
const CANVAS_PADDING = 32

function randomPoint(exclude: Point[]): Point {
  while (true) {
    const p: Point = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    }
    if (!exclude.some((e) => e.x === p.x && e.y === p.y)) return p
  }
}

export default function SnakeGame({ onGameOver, onClose }: SnakeGameProps) {
  // Store callbacks in refs so the rAF loop never restarts due to prop identity changes
  const onGameOverRef = useRef(onGameOver)
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onGameOverRef.current = onGameOver
  }, [onGameOver])
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const statusRef = useRef<GameStatus>('idle')
  const snakeRef = useRef<Point[]>([
    { x: 12, y: 10 },
    { x: 11, y: 10 },
    { x: 10, y: 10 },
  ])
  const directionRef = useRef<Direction>('RIGHT')
  const nextDirectionRef = useRef<Direction>('RIGHT')
  const foodRef = useRef<Point>(randomPoint(snakeRef.current))
  const scoreRef = useRef(0)
  const speedRef = useRef(INITIAL_SPEED)
  const lastTickRef = useRef(0)
  const animFrameRef = useRef<number>(0)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const deadAtRef = useRef(0)

  const [score, setScore] = useState(0)
  const [status, setStatus] = useState<GameStatus>('idle')

  const cellSize = useCallback(() => {
    const size = Math.min(
      typeof window !== 'undefined'
        ? Math.min(window.innerWidth, window.innerHeight) - CANVAS_PADDING * 2
        : CANVAS_MAX,
      CANVAS_MAX
    )
    return Math.floor(size / GRID_SIZE)
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cs = cellSize()
    const canvasSize = cs * GRID_SIZE

    canvas.width = canvasSize
    canvas.height = canvasSize

    // Background
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, canvasSize, canvasSize)

    // Grid lines
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath()
      ctx.moveTo(i * cs, 0)
      ctx.lineTo(i * cs, canvasSize)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * cs)
      ctx.lineTo(canvasSize, i * cs)
      ctx.stroke()
    }

    // Food with glow
    const food = foodRef.current
    ctx.save()
    ctx.shadowColor = '#ff4444'
    ctx.shadowBlur = 12
    ctx.fillStyle = '#ff3333'
    ctx.beginPath()
    ctx.arc(
      food.x * cs + cs / 2,
      food.y * cs + cs / 2,
      cs / 2 - 2,
      0,
      Math.PI * 2
    )
    ctx.fill()
    ctx.restore()

    // Snake with gradient brightness (head brightest)
    const snake = snakeRef.current
    snake.forEach((seg, i) => {
      const ratio = 1 - i / snake.length
      const brightness = Math.floor(80 + ratio * 175)
      ctx.fillStyle = `rgb(0, ${brightness}, 0)`
      const padding = i === 0 ? 1 : 2
      ctx.fillRect(
        seg.x * cs + padding,
        seg.y * cs + padding,
        cs - padding * 2,
        cs - padding * 2
      )
    })
  }, [cellSize])

  const resetGame = useCallback(() => {
    snakeRef.current = [
      { x: 12, y: 10 },
      { x: 11, y: 10 },
      { x: 10, y: 10 },
    ]
    directionRef.current = 'RIGHT'
    nextDirectionRef.current = 'RIGHT'
    foodRef.current = randomPoint(snakeRef.current)
    scoreRef.current = 0
    speedRef.current = INITIAL_SPEED
    lastTickRef.current = 0
    setScore(0)
  }, [])

  const startGame = useCallback(() => {
    resetGame()
    statusRef.current = 'playing'
    setStatus('playing')
  }, [resetGame])

  const tick = useCallback(
    (timestamp: number) => {
      if (statusRef.current !== 'playing') {
        animFrameRef.current = requestAnimationFrame(tick)
        draw()
        return
      }

      if (timestamp - lastTickRef.current >= speedRef.current) {
        lastTickRef.current = timestamp

        directionRef.current = nextDirectionRef.current
        const head = snakeRef.current[0]
        let nx = head.x
        let ny = head.y

        if (directionRef.current === 'UP') ny--
        else if (directionRef.current === 'DOWN') ny++
        else if (directionRef.current === 'LEFT') nx--
        else nx++

        // Wall collision
        if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) {
          statusRef.current = 'dead'
          deadAtRef.current = Date.now()
          setStatus('dead')
          onGameOverRef.current(scoreRef.current)
          draw()
          return
        }

        const newHead: Point = { x: nx, y: ny }

        // Self collision
        if (snakeRef.current.some((s) => s.x === nx && s.y === ny)) {
          statusRef.current = 'dead'
          deadAtRef.current = Date.now()
          setStatus('dead')
          onGameOverRef.current(scoreRef.current)
          draw()
          return
        }

        const newSnake = [newHead, ...snakeRef.current]

        // Food collision
        if (nx === foodRef.current.x && ny === foodRef.current.y) {
          scoreRef.current += SCORE_PER_FOOD
          setScore(scoreRef.current)
          speedRef.current = Math.max(
            MIN_SPEED,
            speedRef.current - SPEED_DECREMENT
          )
          foodRef.current = randomPoint(newSnake)
        } else {
          newSnake.pop()
        }

        snakeRef.current = newSnake
      }

      draw()
      animFrameRef.current = requestAnimationFrame(tick)
    },
    [draw]
  )

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(tick)
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [tick])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current()
        return
      }

      if (statusRef.current === 'idle') {
        startGame()
        return
      }

      if (statusRef.current === 'dead') {
        // Wait 1.5s before allowing restart so player sees game over screen
        if (Date.now() - deadAtRef.current > 1500) {
          onCloseRef.current()
        }
        return
      }

      if (e.key === ' ') {
        e.preventDefault()
        if (statusRef.current === 'playing') {
          statusRef.current = 'paused'
          setStatus('paused')
        } else if (statusRef.current === 'paused') {
          statusRef.current = 'playing'
          setStatus('playing')
        }
        return
      }

      const dir = directionRef.current
      if ((e.key === 'ArrowUp' || e.key === 'w') && dir !== 'DOWN') {
        nextDirectionRef.current = 'UP'
      } else if ((e.key === 'ArrowDown' || e.key === 's') && dir !== 'UP') {
        nextDirectionRef.current = 'DOWN'
      } else if ((e.key === 'ArrowLeft' || e.key === 'a') && dir !== 'RIGHT') {
        nextDirectionRef.current = 'LEFT'
      } else if ((e.key === 'ArrowRight' || e.key === 'd') && dir !== 'LEFT') {
        nextDirectionRef.current = 'RIGHT'
      }
    },
    [startGame]
  )

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const t = e.touches[0]
    touchStartRef.current = { x: t.clientX, y: t.clientY }
  }, [])

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!touchStartRef.current) return
      const t = e.changedTouches[0]
      const dx = t.clientX - touchStartRef.current.x
      const dy = t.clientY - touchStartRef.current.y
      touchStartRef.current = null

      if (statusRef.current === 'idle') {
        startGame()
        return
      }

      if (statusRef.current === 'dead') {
        if (Date.now() - deadAtRef.current > 1500) {
          onCloseRef.current()
        }
        return
      }

      const absDx = Math.abs(dx)
      const absDy = Math.abs(dy)

      if (absDx < 20 && absDy < 20) return // too short

      const dir = directionRef.current
      if (absDx > absDy) {
        if (dx > 0 && dir !== 'LEFT') nextDirectionRef.current = 'RIGHT'
        else if (dx < 0 && dir !== 'RIGHT') nextDirectionRef.current = 'LEFT'
      } else {
        if (dy > 0 && dir !== 'UP') nextDirectionRef.current = 'DOWN'
        else if (dy < 0 && dir !== 'DOWN') nextDirectionRef.current = 'UP'
      }
    },
    [startGame]
  )

  const handlePauseToggle = useCallback(() => {
    if (statusRef.current === 'playing') {
      statusRef.current = 'paused'
      setStatus('paused')
    } else if (statusRef.current === 'paused') {
      statusRef.current = 'playing'
      setStatus('playing')
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleKeyDown, handleTouchStart, handleTouchEnd])

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
      {/* Top bar */}
      <div className="w-full flex items-center justify-between px-4 py-3 max-w-[540px]">
        <span className="text-green-400 font-mono text-lg font-bold">
          Skóre: {score}
        </span>
        <div className="flex items-center gap-3">
          {/* Mobile pause button */}
          <button
            onClick={handlePauseToggle}
            className="sm:hidden text-yellow-400 font-mono text-sm border border-yellow-400/40 px-3 py-1 rounded hover:bg-yellow-400/10 transition-colors"
          >
            {status === 'paused' ? '▶' : '⏸'}
          </button>
          <button
            onClick={() => onCloseRef.current()}
            className="text-gray-400 font-mono text-sm border border-gray-600 px-3 py-1 rounded hover:bg-white/10 transition-colors"
          >
            ESC
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div className="relative flex items-center justify-center">
        <canvas ref={canvasRef} className="rounded" />

        {/* Idle overlay */}
        {status === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-green-400 font-mono text-sm text-center animate-pulse px-4">
              Stiskni cokoliv pro start
            </p>
          </div>
        )}

        {/* Paused overlay */}
        {status === 'paused' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <p className="text-yellow-400 font-mono text-2xl font-bold tracking-widest">
              PAUZA
            </p>
          </div>
        )}

        {/* Dead overlay */}
        {status === 'dead' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 gap-2">
            <p className="text-red-400 font-mono text-xl font-bold">
              Konec hry
            </p>
            <p className="text-gray-300 font-mono text-sm">
              Skóre: {score}
            </p>
            <p className="text-green-400 font-mono text-xs animate-pulse mt-2">
              Stiskni cokoliv pro zavření
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
