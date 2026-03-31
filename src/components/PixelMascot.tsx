'use client'

import { useEffect, useRef, useState } from 'react'

/*
 * Animated pixel art mascot with multiple behaviors:
 * idle, wave, look around, jump, type on computer.
 * Pure CSS animations + React state for frame cycling.
 */

const B = '#C0613A' // body
const D = '#3A2520' // dark (eyes)
const L = '#A34E2E' // darker shade for depth
const _ = ''        // transparent

type Grid = string[][]
type Behavior = 'idle' | 'wave' | 'look' | 'jump' | 'type'

/* ── Pixel grids (13 cols × 9 rows) ──────────────────── */

const IDLE: Grid = [
  [_, _, _, _, B, _, _, _, B, _, _, _, _],
  [_, _, _, B, B, B, B, B, B, B, _, _, _],
  [_, _, B, B, D, B, B, B, D, B, B, _, _],
  [_, _, B, B, B, B, B, B, B, B, B, _, _],
  [_, B, B, B, B, B, B, B, B, B, B, B, _],
  [_, B, B, B, B, B, B, B, B, B, B, B, _],
  [_, _, B, B, B, B, B, B, B, B, B, _, _],
  [_, _, B, B, _, B, _, B, _, B, B, _, _],
  [_, _, B, B, _, B, _, B, _, B, B, _, _],
]

const WAVE_UP: Grid = [
  [_, _, _, _, B, _, _, _, B, _, _, _, _],
  [_, _, _, B, B, B, B, B, B, B, _, _, B],
  [_, _, B, B, D, B, B, B, D, B, B, _, B],
  [_, _, B, B, B, B, B, B, B, B, B, _, _],
  [_, B, B, B, B, B, B, B, B, B, B, B, _],
  [_, B, B, B, B, B, B, B, B, B, B, B, _],
  [_, _, B, B, B, B, B, B, B, B, B, _, _],
  [_, _, B, B, _, B, _, B, _, B, B, _, _],
  [_, _, B, B, _, B, _, B, _, B, B, _, _],
]

const WAVE_DOWN: Grid = [
  [_, _, _, _, B, _, _, _, B, _, _, _, _],
  [_, _, _, B, B, B, B, B, B, B, _, _, _],
  [_, _, B, B, D, B, B, B, D, B, B, _, _],
  [_, _, B, B, B, B, B, B, B, B, B, _, B],
  [_, B, B, B, B, B, B, B, B, B, B, B, B],
  [_, B, B, B, B, B, B, B, B, B, B, B, _],
  [_, _, B, B, B, B, B, B, B, B, B, _, _],
  [_, _, B, B, _, B, _, B, _, B, B, _, _],
  [_, _, B, B, _, B, _, B, _, B, B, _, _],
]

const LOOK_LEFT: Grid = [
  [_, _, _, _, B, _, _, _, B, _, _, _, _],
  [_, _, _, B, B, B, B, B, B, B, _, _, _],
  [_, _, B, D, B, B, B, D, B, B, B, _, _],
  [_, _, B, B, B, B, B, B, B, B, B, _, _],
  [_, B, B, B, B, B, B, B, B, B, B, B, _],
  [_, B, B, B, B, B, B, B, B, B, B, B, _],
  [_, _, B, B, B, B, B, B, B, B, B, _, _],
  [_, _, B, B, _, B, _, B, _, B, B, _, _],
  [_, _, B, B, _, B, _, B, _, B, B, _, _],
]

const LOOK_RIGHT: Grid = [
  [_, _, _, _, B, _, _, _, B, _, _, _, _],
  [_, _, _, B, B, B, B, B, B, B, _, _, _],
  [_, _, B, B, B, D, B, B, B, D, B, _, _],
  [_, _, B, B, B, B, B, B, B, B, B, _, _],
  [_, B, B, B, B, B, B, B, B, B, B, B, _],
  [_, B, B, B, B, B, B, B, B, B, B, B, _],
  [_, _, B, B, B, B, B, B, B, B, B, _, _],
  [_, _, B, B, _, B, _, B, _, B, B, _, _],
  [_, _, B, B, _, B, _, B, _, B, B, _, _],
]

const BLINK: Grid = [
  [_, _, _, _, B, _, _, _, B, _, _, _, _],
  [_, _, _, B, B, B, B, B, B, B, _, _, _],
  [_, _, B, B, B, B, B, B, B, B, B, _, _],
  [_, _, B, B, L, B, B, B, L, B, B, _, _],
  [_, B, B, B, B, B, B, B, B, B, B, B, _],
  [_, B, B, B, B, B, B, B, B, B, B, B, _],
  [_, _, B, B, B, B, B, B, B, B, B, _, _],
  [_, _, B, B, _, B, _, B, _, B, B, _, _],
  [_, _, B, B, _, B, _, B, _, B, B, _, _],
]

const JUMP_CROUCH: Grid = [
  [_, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, B, _, _, _, B, _, _, _, _],
  [_, _, _, B, B, B, B, B, B, B, _, _, _],
  [_, _, B, B, D, B, B, B, D, B, B, _, _],
  [_, _, B, B, B, B, B, B, B, B, B, _, _],
  [_, B, B, B, B, B, B, B, B, B, B, B, _],
  [_, B, B, B, B, B, B, B, B, B, B, B, _],
  [_, _, B, B, B, B, B, B, B, B, B, _, _],
  [_, B, B, B, _, B, _, B, _, B, B, B, _],
]

const TYPE_L: Grid = [
  [_, _, _, _, B, _, _, _, B, _, _, _, _],
  [_, _, _, B, B, B, B, B, B, B, _, _, _],
  [_, _, B, B, D, B, B, B, D, B, B, _, _],
  [_, _, B, B, B, B, B, B, B, B, B, _, _],
  [_, B, B, B, B, B, B, B, B, B, B, B, _],
  [_, B, B, B, B, B, B, B, B, B, B, B, _],
  [_, _, B, B, B, B, B, B, B, B, B, _, _],
  [_, _, _, B, _, _, _, _, _, B, _, _, _],
  [_, _, _, B, _, _, _, _, _, B, _, _, _],
]

const TYPE_R: Grid = [
  [_, _, _, _, B, _, _, _, B, _, _, _, _],
  [_, _, _, B, B, B, B, B, B, B, _, _, _],
  [_, _, B, B, D, B, B, B, D, B, B, _, _],
  [_, _, B, B, B, B, B, B, B, B, B, _, _],
  [_, B, B, B, B, B, B, B, B, B, B, B, _],
  [_, B, B, B, B, B, B, B, B, B, B, B, _],
  [_, _, B, B, B, B, B, B, B, B, B, _, _],
  [_, _, _, _, B, _, _, _, B, _, _, _, _],
  [_, _, _, _, B, _, _, _, B, _, _, _, _],
]

/* ── Laptop pixel art (9 cols × 3 rows) ─────────────── */
const LAPTOP: Grid = [
  [_, _, L, L, L, L, L, _, _],
  [_, L, L, L, L, L, L, L, _],
  [L, L, L, L, L, L, L, L, L],
]

/* ── Behavior definitions ────────────────────────────── */
interface BehaviorDef {
  frames: Grid[]
  frameMs: number
  durationMs: number
  showLaptop?: boolean
  jumpAnimation?: boolean
}

const BEHAVIOR_DEFS: Record<Behavior, BehaviorDef> = {
  idle: {
    frames: [IDLE],
    frameMs: 1000,
    durationMs: 3500,
  },
  wave: {
    frames: [WAVE_UP, WAVE_DOWN, WAVE_UP, WAVE_DOWN, WAVE_UP, IDLE],
    frameMs: 300,
    durationMs: 1800,
  },
  look: {
    frames: [LOOK_LEFT, LOOK_LEFT, IDLE, LOOK_RIGHT, LOOK_RIGHT, IDLE],
    frameMs: 400,
    durationMs: 2400,
  },
  jump: {
    frames: [JUMP_CROUCH, IDLE, IDLE, JUMP_CROUCH],
    frameMs: 250,
    durationMs: 1000,
    jumpAnimation: true,
  },
  type: {
    frames: [TYPE_L, TYPE_R, TYPE_L, TYPE_R, TYPE_L, TYPE_R, TYPE_L, TYPE_R],
    frameMs: 200,
    durationMs: 1600,
    showLaptop: true,
  },
}

const BEHAVIOR_SEQUENCE: Behavior[] = ['idle', 'wave', 'idle', 'look', 'idle', 'type', 'idle', 'jump']

const COLS = 13
const ROWS = 9
const PX = 6

/* ── Component ──────────────────────────────────────── */
export function PixelMascot({ className = '' }: { className?: string }) {
  const [behaviorIdx, setBehaviorIdx] = useState(0)
  const [frameIdx, setFrameIdx] = useState(0)
  const [isBlinking, setIsBlinking] = useState(false)
  const [jumpY, setJumpY] = useState(0)
  const frameTimer = useRef<ReturnType<typeof setInterval>>(null)
  const behaviorTimer = useRef<ReturnType<typeof setTimeout>>(null)

  const behavior = BEHAVIOR_SEQUENCE[behaviorIdx % BEHAVIOR_SEQUENCE.length]
  const def = BEHAVIOR_DEFS[behavior]
  const currentFrame = isBlinking && behavior === 'idle' ? BLINK : def.frames[frameIdx % def.frames.length]

  useEffect(() => {
    // Frame cycling
    setFrameIdx(0)
    let fi = 0
    frameTimer.current = setInterval(() => {
      fi++
      setFrameIdx(fi)
    }, def.frameMs)

    // Jump animation
    if (def.jumpAnimation) {
      setTimeout(() => setJumpY(-18), 250)
      setTimeout(() => setJumpY(0), 550)
    } else {
      setJumpY(0)
    }

    // Move to next behavior
    behaviorTimer.current = setTimeout(() => {
      setBehaviorIdx((i) => i + 1)
    }, def.durationMs)

    return () => {
      if (frameTimer.current) clearInterval(frameTimer.current)
      if (behaviorTimer.current) clearTimeout(behaviorTimer.current)
    }
  }, [behaviorIdx, def.frameMs, def.durationMs, def.jumpAnimation])

  // Blink during idle
  useEffect(() => {
    const blink = () => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 150)
    }
    const id = setInterval(blink, 2500 + Math.random() * 2000)
    return () => clearInterval(id)
  }, [])

  const w = COLS * PX
  const h = ROWS * PX

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <div
        className={behavior === 'idle' ? 'animate-mascot-float' : ''}
        style={{
          transform: `translateY(${jumpY}px)`,
          transition: jumpY !== 0 ? 'transform 0.25s ease-out' : 'transform 0.2s ease-in',
        }}
      >
        <svg
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          className="block"
          style={{ imageRendering: 'pixelated' }}
          aria-hidden="true"
        >
          {currentFrame.flatMap((row, ry) =>
            row.map((color, cx) => {
              if (!color) return null
              return (
                <rect
                  key={`${ry}-${cx}`}
                  x={cx * PX}
                  y={ry * PX}
                  width={PX}
                  height={PX}
                  fill={color}
                />
              )
            }),
          )}
        </svg>

        {/* Laptop (only during typing) */}
        {def.showLaptop && (
          <svg
            width={9 * PX}
            height={3 * PX}
            viewBox={`0 0 ${9 * PX} ${3 * PX}`}
            className="mx-auto -mt-px block"
            style={{ imageRendering: 'pixelated' }}
            aria-hidden="true"
          >
            {LAPTOP.flatMap((row, ry) =>
              row.map((color, cx) => {
                if (!color) return null
                return (
                  <rect
                    key={`l-${ry}-${cx}`}
                    x={cx * PX}
                    y={ry * PX}
                    width={PX}
                    height={PX}
                    fill={color}
                  />
                )
              }),
            )}
          </svg>
        )}
      </div>

      {/* Shadow */}
      <div
        className={`mt-1 h-1.5 rounded-full bg-black/10 ${
          behavior === 'idle' ? 'animate-mascot-shadow w-10' : 'w-10'
        }`}
        style={{
          transform: jumpY !== 0 ? 'scaleX(0.6)' : undefined,
          opacity: jumpY !== 0 ? 0.06 : undefined,
          transition: 'transform 0.2s, opacity 0.2s',
        }}
      />
    </div>
  )
}
