'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/*
 * Tamagotchi-style pixel art mascot.
 * Auto-cycles through behaviors + reacts to taps.
 * Scales via `size` prop (pixel multiplier).
 */

const B = '#C0613A'
const D = '#3A2520'
const L = '#A34E2E'
const H = '#E8453A' // heart red
const _ = ''

type Grid = string[][]
type Behavior =
  | 'idle' | 'wave' | 'look' | 'jump' | 'type'
  | 'sleep' | 'dance' | 'happy' | 'love' | 'spin'

/* ═══════════════════════════════════════════════════════
   PIXEL GRIDS (13 cols × 9 rows)
   ═══════════════════════════════════════════════════════ */

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

// Happy face (^ ^ eyes)
const HAPPY: Grid = [
  [_, _, _, _, B, _, _, _, B, _, _, _, _],
  [_, _, _, B, B, B, B, B, B, B, _, _, _],
  [_, _, B, D, B, D, B, D, B, D, B, _, _],
  [_, _, B, B, B, B, B, B, B, B, B, _, _],
  [_, B, B, B, B, B, B, B, B, B, B, B, _],
  [_, B, B, B, B, B, B, B, B, B, B, B, _],
  [_, _, B, B, B, B, B, B, B, B, B, _, _],
  [_, _, B, B, _, B, _, B, _, B, B, _, _],
  [_, _, B, B, _, B, _, B, _, B, B, _, _],
]

// Sleep (eyes closed, mouth line)
const SLEEP: Grid = [
  [_, _, _, _, B, _, _, _, B, _, _, _, _],
  [_, _, _, B, B, B, B, B, B, B, _, _, _],
  [_, _, B, B, B, B, B, B, B, B, B, _, _],
  [_, _, B, L, L, B, B, L, L, B, B, _, _],
  [_, B, B, B, B, B, B, B, B, B, B, B, _],
  [_, B, B, B, B, B, B, B, B, B, B, B, _],
  [_, _, B, B, B, B, B, B, B, B, B, _, _],
  [_, _, B, B, _, B, _, B, _, B, B, _, _],
  [_, _, B, B, _, B, _, B, _, B, B, _, _],
]

// Dance left (body shifted)
const DANCE_L: Grid = [
  [_, _, _, B, _, _, _, B, _, _, _, _, _],
  [_, _, B, B, B, B, B, B, B, _, _, _, _],
  [_, B, B, D, B, B, B, D, B, B, _, _, _],
  [_, B, B, B, B, B, B, B, B, B, _, _, _],
  [B, B, B, B, B, B, B, B, B, B, B, _, _],
  [B, B, B, B, B, B, B, B, B, B, B, _, _],
  [_, B, B, B, B, B, B, B, B, B, _, _, _],
  [_, B, B, _, B, _, B, _, B, B, _, _, _],
  [_, B, B, _, B, _, B, _, B, B, _, _, _],
]

const DANCE_R: Grid = [
  [_, _, _, _, _, B, _, _, _, B, _, _, _],
  [_, _, _, _, B, B, B, B, B, B, B, _, _],
  [_, _, _, B, B, D, B, B, B, D, B, B, _],
  [_, _, _, B, B, B, B, B, B, B, B, B, _],
  [_, _, B, B, B, B, B, B, B, B, B, B, B],
  [_, _, B, B, B, B, B, B, B, B, B, B, B],
  [_, _, _, B, B, B, B, B, B, B, B, B, _],
  [_, _, _, B, B, _, B, _, B, _, B, B, _],
  [_, _, _, B, B, _, B, _, B, _, B, B, _],
]

// Love (same as happy, heart rendered separately)
const LOVE: Grid = HAPPY

/* ── Laptop (9×3) ─────────────────────────────────────── */
const LAPTOP: Grid = [
  [_, _, L, L, L, L, L, _, _],
  [_, L, L, L, L, L, L, L, _],
  [L, L, L, L, L, L, L, L, L],
]

/* ── Heart (5×5) ──────────────────────────────────────── */
const HEART: Grid = [
  [_, H, _, H, _],
  [H, H, H, H, H],
  [H, H, H, H, H],
  [_, H, H, H, _],
  [_, _, H, _, _],
]

/* ── Zzz letters ──────────────────────────────────────── */
const ZZZ: Grid = [
  [D, D, D],
  [_, _, D],
  [_, D, _],
  [D, _, _],
  [D, D, D],
]

/* ═══════════════════════════════════════════════════════
   BEHAVIOR DEFINITIONS
   ═══════════════════════════════════════════════════════ */

interface BehaviorDef {
  frames: Grid[]
  frameMs: number
  durationMs: number
  showLaptop?: boolean
  jumpAnimation?: boolean
  overlay?: 'heart' | 'zzz'
}

const BEHAVIOR_DEFS: Record<Behavior, BehaviorDef> = {
  idle:  { frames: [IDLE], frameMs: 1000, durationMs: 3500 },
  wave:  { frames: [WAVE_UP, WAVE_DOWN, WAVE_UP, WAVE_DOWN, WAVE_UP, IDLE], frameMs: 300, durationMs: 1800 },
  look:  { frames: [LOOK_LEFT, LOOK_LEFT, IDLE, LOOK_RIGHT, LOOK_RIGHT, IDLE], frameMs: 400, durationMs: 2400 },
  jump:  { frames: [JUMP_CROUCH, IDLE, IDLE, JUMP_CROUCH], frameMs: 250, durationMs: 1000, jumpAnimation: true },
  type:  { frames: [TYPE_L, TYPE_R, TYPE_L, TYPE_R, TYPE_L, TYPE_R, TYPE_L, TYPE_R], frameMs: 200, durationMs: 1600, showLaptop: true },
  sleep: { frames: [SLEEP, BLINK, SLEEP, SLEEP], frameMs: 800, durationMs: 3200, overlay: 'zzz' },
  dance: { frames: [DANCE_L, DANCE_R, DANCE_L, DANCE_R, DANCE_L, DANCE_R], frameMs: 250, durationMs: 1500 },
  happy: { frames: [HAPPY, IDLE, HAPPY, IDLE, HAPPY], frameMs: 300, durationMs: 1500 },
  love:  { frames: [LOVE], frameMs: 500, durationMs: 1500, overlay: 'heart' },
  spin:  { frames: [IDLE, LOOK_LEFT, IDLE, LOOK_RIGHT], frameMs: 150, durationMs: 600 },
}

const AUTO_SEQUENCE: Behavior[] = [
  'idle', 'wave', 'idle', 'look', 'idle', 'type',
  'idle', 'sleep', 'idle', 'dance', 'idle', 'jump',
]

const TAP_REACTIONS: Behavior[] = ['happy', 'love', 'jump', 'dance', 'wave', 'spin']

/* ═══════════════════════════════════════════════════════
   RENDER HELPERS
   ═══════════════════════════════════════════════════════ */

function PixelGrid({ grid, px, className = '' }: { grid: Grid; px: number; className?: string }) {
  const cols = grid[0].length
  const rows = grid.length
  return (
    <svg
      width={cols * px}
      height={rows * px}
      viewBox={`0 0 ${cols * px} ${rows * px}`}
      className={`block ${className}`}
      style={{ imageRendering: 'pixelated' }}
      aria-hidden="true"
    >
      {grid.flatMap((row, ry) =>
        row.map((color, cx) =>
          color ? (
            <rect key={`${ry}-${cx}`} x={cx * px} y={ry * px} width={px} height={px} fill={color} />
          ) : null,
        ),
      )}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */

interface Props {
  /** Pixel size multiplier. Default 6 (desktop), use 10+ for mobile hero. */
  scale?: number
  className?: string
}

export function PixelMascot({ scale = 6, className = '' }: Props) {
  const [autoIdx, setAutoIdx] = useState(0)
  const [tapBehavior, setTapBehavior] = useState<Behavior | null>(null)
  const [frameIdx, setFrameIdx] = useState(0)
  const [isBlinking, setIsBlinking] = useState(false)
  const [jumpY, setJumpY] = useState(0)
  const [spinDeg, setSpinDeg] = useState(0)
  const frameTimer = useRef<ReturnType<typeof setInterval>>(null)
  const behaviorTimer = useRef<ReturnType<typeof setTimeout>>(null)

  const behavior: Behavior = tapBehavior ?? AUTO_SEQUENCE[autoIdx % AUTO_SEQUENCE.length]
  const def = BEHAVIOR_DEFS[behavior]
  const showFrame = isBlinking && behavior === 'idle' ? BLINK : def.frames[frameIdx % def.frames.length]

  const px = scale

  // ── Behavior cycling ──
  useEffect(() => {
    setFrameIdx(0)
    let fi = 0
    frameTimer.current = setInterval(() => { fi++; setFrameIdx(fi) }, def.frameMs)

    if (def.jumpAnimation) {
      setTimeout(() => setJumpY(-px * 3), 250)
      setTimeout(() => setJumpY(0), 550)
    } else {
      setJumpY(0)
    }

    if (behavior === 'spin') {
      setSpinDeg(720)
      setTimeout(() => setSpinDeg(0), 600)
    }

    behaviorTimer.current = setTimeout(() => {
      if (tapBehavior) {
        setTapBehavior(null)
      } else {
        setAutoIdx((i) => i + 1)
      }
    }, def.durationMs)

    return () => {
      if (frameTimer.current) clearInterval(frameTimer.current)
      if (behaviorTimer.current) clearTimeout(behaviorTimer.current)
    }
  }, [autoIdx, tapBehavior, behavior, def.frameMs, def.durationMs, def.jumpAnimation, px])

  // ── Blink ──
  useEffect(() => {
    const blink = () => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 150)
    }
    const id = setInterval(blink, 2500 + Math.random() * 2000)
    return () => clearInterval(id)
  }, [])

  // ── Tap handler ──
  const handleTap = useCallback(() => {
    const reaction = TAP_REACTIONS[Math.floor(Math.random() * TAP_REACTIONS.length)]
    setTapBehavior(reaction)
  }, [])

  return (
    <div
      className={`inline-flex cursor-pointer flex-col items-center select-none ${className}`}
      onClick={handleTap}
      role="button"
      tabIndex={0}
      aria-label="Klikni na maskota"
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTap() }}
    >
      {/* Overlay: heart or zzz */}
      <div className="relative flex justify-center" style={{ height: def.overlay ? px * 6 : 0 }}>
        {def.overlay === 'heart' && (
          <div className="absolute bottom-0 animate-fade-in-up">
            <PixelGrid grid={HEART} px={px} />
          </div>
        )}
        {def.overlay === 'zzz' && (
          <div
            className="absolute bottom-0 right-0 animate-fade-in-up"
            style={{ transform: `translate(${px * 5}px, ${px * -1}px)` }}
          >
            <PixelGrid grid={ZZZ} px={Math.max(3, px - 2)} />
          </div>
        )}
      </div>

      {/* Body */}
      <div
        className={behavior === 'idle' ? 'animate-mascot-float' : ''}
        style={{
          transform: `translateY(${jumpY}px) rotate(${spinDeg}deg)`,
          transition: spinDeg !== 0
            ? 'transform 0.5s ease-in-out'
            : jumpY !== 0
              ? 'transform 0.25s ease-out'
              : 'transform 0.2s ease-in',
        }}
      >
        <PixelGrid grid={showFrame} px={px} />

        {def.showLaptop && (
          <div className="flex justify-center -mt-px">
            <PixelGrid grid={LAPTOP} px={px} />
          </div>
        )}
      </div>

      {/* Shadow */}
      <div
        className={`mt-1 rounded-full bg-black/10 ${behavior === 'idle' ? 'animate-mascot-shadow' : ''}`}
        style={{
          width: px * 10,
          height: px * 1.5,
          transform: jumpY !== 0 ? 'scaleX(0.6)' : undefined,
          opacity: jumpY !== 0 ? 0.06 : undefined,
          transition: 'transform 0.2s, opacity 0.2s',
        }}
      />

      {/* Tap hint (shows briefly then fades) */}
      <p className="mt-2 text-xs text-muted/50 animate-fade-in-up" style={{ animationDelay: '3s' }}>
        klikni na mě
      </p>
    </div>
  )
}
