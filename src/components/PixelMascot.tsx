'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/*
 * Tamagotchi-style pixel mascot with agent behaviors.
 * Solo animations + multi-agent scenes (spawn, chat, handoff, highfive).
 */

const B = '#C0613A'
const D = '#3A2520'
const L = '#A34E2E'
const H = '#E8453A'
const W = '#94a3b8' // speech bubble gray
const G = '#22c55e' // green (code/matrix)
const P = '#7c3aed' // purple accent
const _ = ''

type Grid = string[][]

/* ═══════════════════════════════════════════════════════
   PIXEL GRIDS — solo (13×9)
   ═══════════════════════════════════════════════════════ */

const IDLE: Grid = [
  [_,_,_,_,B,_,_,_,B,_,_,_,_],
  [_,_,_,B,B,B,B,B,B,B,_,_,_],
  [_,_,B,B,D,B,B,B,D,B,B,_,_],
  [_,_,B,B,B,B,B,B,B,B,B,_,_],
  [_,B,B,B,B,B,B,B,B,B,B,B,_],
  [_,B,B,B,B,B,B,B,B,B,B,B,_],
  [_,_,B,B,B,B,B,B,B,B,B,_,_],
  [_,_,B,B,_,B,_,B,_,B,B,_,_],
  [_,_,B,B,_,B,_,B,_,B,B,_,_],
]

const BLINK: Grid = [
  [_,_,_,_,B,_,_,_,B,_,_,_,_],
  [_,_,_,B,B,B,B,B,B,B,_,_,_],
  [_,_,B,B,B,B,B,B,B,B,B,_,_],
  [_,_,B,B,L,B,B,B,L,B,B,_,_],
  [_,B,B,B,B,B,B,B,B,B,B,B,_],
  [_,B,B,B,B,B,B,B,B,B,B,B,_],
  [_,_,B,B,B,B,B,B,B,B,B,_,_],
  [_,_,B,B,_,B,_,B,_,B,B,_,_],
  [_,_,B,B,_,B,_,B,_,B,B,_,_],
]

const WAVE_UP: Grid = [
  [_,_,_,_,B,_,_,_,B,_,_,_,_],
  [_,_,_,B,B,B,B,B,B,B,_,_,B],
  [_,_,B,B,D,B,B,B,D,B,B,_,B],
  [_,_,B,B,B,B,B,B,B,B,B,_,_],
  [_,B,B,B,B,B,B,B,B,B,B,B,_],
  [_,B,B,B,B,B,B,B,B,B,B,B,_],
  [_,_,B,B,B,B,B,B,B,B,B,_,_],
  [_,_,B,B,_,B,_,B,_,B,B,_,_],
  [_,_,B,B,_,B,_,B,_,B,B,_,_],
]

const WAVE_DOWN: Grid = [
  [_,_,_,_,B,_,_,_,B,_,_,_,_],
  [_,_,_,B,B,B,B,B,B,B,_,_,_],
  [_,_,B,B,D,B,B,B,D,B,B,_,_],
  [_,_,B,B,B,B,B,B,B,B,B,_,B],
  [_,B,B,B,B,B,B,B,B,B,B,B,B],
  [_,B,B,B,B,B,B,B,B,B,B,B,_],
  [_,_,B,B,B,B,B,B,B,B,B,_,_],
  [_,_,B,B,_,B,_,B,_,B,B,_,_],
  [_,_,B,B,_,B,_,B,_,B,B,_,_],
]

const LOOK_LEFT: Grid = [
  [_,_,_,_,B,_,_,_,B,_,_,_,_],
  [_,_,_,B,B,B,B,B,B,B,_,_,_],
  [_,_,B,D,B,B,B,D,B,B,B,_,_],
  [_,_,B,B,B,B,B,B,B,B,B,_,_],
  [_,B,B,B,B,B,B,B,B,B,B,B,_],
  [_,B,B,B,B,B,B,B,B,B,B,B,_],
  [_,_,B,B,B,B,B,B,B,B,B,_,_],
  [_,_,B,B,_,B,_,B,_,B,B,_,_],
  [_,_,B,B,_,B,_,B,_,B,B,_,_],
]

const LOOK_RIGHT: Grid = [
  [_,_,_,_,B,_,_,_,B,_,_,_,_],
  [_,_,_,B,B,B,B,B,B,B,_,_,_],
  [_,_,B,B,B,D,B,B,B,D,B,_,_],
  [_,_,B,B,B,B,B,B,B,B,B,_,_],
  [_,B,B,B,B,B,B,B,B,B,B,B,_],
  [_,B,B,B,B,B,B,B,B,B,B,B,_],
  [_,_,B,B,B,B,B,B,B,B,B,_,_],
  [_,_,B,B,_,B,_,B,_,B,B,_,_],
  [_,_,B,B,_,B,_,B,_,B,B,_,_],
]

const JUMP_CROUCH: Grid = [
  [_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,B,_,_,_,B,_,_,_,_],
  [_,_,_,B,B,B,B,B,B,B,_,_,_],
  [_,_,B,B,D,B,B,B,D,B,B,_,_],
  [_,_,B,B,B,B,B,B,B,B,B,_,_],
  [_,B,B,B,B,B,B,B,B,B,B,B,_],
  [_,B,B,B,B,B,B,B,B,B,B,B,_],
  [_,_,B,B,B,B,B,B,B,B,B,_,_],
  [_,B,B,B,_,B,_,B,_,B,B,B,_],
]

const TYPE_L: Grid = [
  [_,_,_,_,B,_,_,_,B,_,_,_,_],
  [_,_,_,B,B,B,B,B,B,B,_,_,_],
  [_,_,B,B,D,B,B,B,D,B,B,_,_],
  [_,_,B,B,B,B,B,B,B,B,B,_,_],
  [_,B,B,B,B,B,B,B,B,B,B,B,_],
  [_,B,B,B,B,B,B,B,B,B,B,B,_],
  [_,_,B,B,B,B,B,B,B,B,B,_,_],
  [_,_,_,B,_,_,_,_,_,B,_,_,_],
  [_,_,_,B,_,_,_,_,_,B,_,_,_],
]

const TYPE_R: Grid = [
  [_,_,_,_,B,_,_,_,B,_,_,_,_],
  [_,_,_,B,B,B,B,B,B,B,_,_,_],
  [_,_,B,B,D,B,B,B,D,B,B,_,_],
  [_,_,B,B,B,B,B,B,B,B,B,_,_],
  [_,B,B,B,B,B,B,B,B,B,B,B,_],
  [_,B,B,B,B,B,B,B,B,B,B,B,_],
  [_,_,B,B,B,B,B,B,B,B,B,_,_],
  [_,_,_,_,B,_,_,_,B,_,_,_,_],
  [_,_,_,_,B,_,_,_,B,_,_,_,_],
]

const HAPPY: Grid = [
  [_,_,_,_,B,_,_,_,B,_,_,_,_],
  [_,_,_,B,B,B,B,B,B,B,_,_,_],
  [_,_,B,D,B,D,B,D,B,D,B,_,_],
  [_,_,B,B,B,B,B,B,B,B,B,_,_],
  [_,B,B,B,B,B,B,B,B,B,B,B,_],
  [_,B,B,B,B,B,B,B,B,B,B,B,_],
  [_,_,B,B,B,B,B,B,B,B,B,_,_],
  [_,_,B,B,_,B,_,B,_,B,B,_,_],
  [_,_,B,B,_,B,_,B,_,B,B,_,_],
]

const SLEEP: Grid = [
  [_,_,_,_,B,_,_,_,B,_,_,_,_],
  [_,_,_,B,B,B,B,B,B,B,_,_,_],
  [_,_,B,B,B,B,B,B,B,B,B,_,_],
  [_,_,B,L,L,B,B,L,L,B,B,_,_],
  [_,B,B,B,B,B,B,B,B,B,B,B,_],
  [_,B,B,B,B,B,B,B,B,B,B,B,_],
  [_,_,B,B,B,B,B,B,B,B,B,_,_],
  [_,_,B,B,_,B,_,B,_,B,B,_,_],
  [_,_,B,B,_,B,_,B,_,B,B,_,_],
]

const DANCE_L: Grid = [
  [_,_,_,B,_,_,_,B,_,_,_,_,_],
  [_,_,B,B,B,B,B,B,B,_,_,_,_],
  [_,B,B,D,B,B,B,D,B,B,_,_,_],
  [_,B,B,B,B,B,B,B,B,B,_,_,_],
  [B,B,B,B,B,B,B,B,B,B,B,_,_],
  [B,B,B,B,B,B,B,B,B,B,B,_,_],
  [_,B,B,B,B,B,B,B,B,B,_,_,_],
  [_,B,B,_,B,_,B,_,B,B,_,_,_],
  [_,B,B,_,B,_,B,_,B,B,_,_,_],
]

const DANCE_R: Grid = [
  [_,_,_,_,_,B,_,_,_,B,_,_,_],
  [_,_,_,_,B,B,B,B,B,B,B,_,_],
  [_,_,_,B,B,D,B,B,B,D,B,B,_],
  [_,_,_,B,B,B,B,B,B,B,B,B,_],
  [_,_,B,B,B,B,B,B,B,B,B,B,B],
  [_,_,B,B,B,B,B,B,B,B,B,B,B],
  [_,_,_,B,B,B,B,B,B,B,B,B,_],
  [_,_,_,B,B,_,B,_,B,_,B,B,_],
  [_,_,_,B,B,_,B,_,B,_,B,B,_],
]

// Thinking face (eyes up)
const THINK: Grid = [
  [_,_,_,_,B,_,_,_,B,_,_,_,_],
  [_,_,_,B,B,B,B,B,B,B,_,_,_],
  [_,_,B,B,D,B,B,B,D,B,B,_,_],
  [_,_,B,D,B,B,B,D,B,B,B,_,_],
  [_,B,B,B,B,B,B,B,B,B,B,B,_],
  [_,B,B,B,B,B,B,B,B,B,B,B,_],
  [_,_,B,B,B,B,B,B,B,B,B,_,_],
  [_,_,B,B,_,B,_,B,_,B,B,_,_],
  [_,_,B,B,_,B,_,B,_,B,B,_,_],
]

/* ── Small accessories ────────────────────────────────── */

const LAPTOP: Grid = [
  [_,_,L,L,L,L,L,_,_],
  [_,L,L,L,L,L,L,L,_],
  [L,L,L,L,L,L,L,L,L],
]

const HEART: Grid = [
  [_,H,_,H,_],
  [H,H,H,H,H],
  [H,H,H,H,H],
  [_,H,H,H,_],
  [_,_,H,_,_],
]

const ZZZ: Grid = [
  [D,D,D],
  [_,_,D],
  [_,D,_],
  [D,_,_],
  [D,D,D],
]

const SPEECH: Grid = [
  [_,W,W,W,W,_],
  [W,W,W,W,W,W],
  [W,W,W,W,W,W],
  [_,W,W,W,_,_],
  [_,W,_,_,_,_],
]

const THOUGHT: Grid = [
  [_,W,W,W,W,_],
  [W,D,W,D,W,W],
  [W,W,W,W,W,W],
  [_,_,W,W,_,_],
  [_,_,_,W,_,_],
]

const DOC: Grid = [
  [W,W,W,W],
  [W,P,P,W],
  [W,P,P,W],
  [W,P,P,W],
  [W,W,W,W],
]

const SPARKLE: Grid = [
  [_,P,_],
  [P,P,P],
  [_,P,_],
]

/* ── Mirror helper (for buddy facing opposite direction) ── */
function mirror(grid: Grid): Grid {
  return grid.map(row => [...row].reverse())
}

/* ═══════════════════════════════════════════════════════
   SCENE FRAME — defines what to render each tick
   ═══════════════════════════════════════════════════════ */

interface SceneFrame {
  main: Grid
  buddy?: Grid
  accessory?: { grid: Grid; position: 'above' | 'above-right' | 'between-top' | 'between-mid' }
  laptop?: boolean
}

interface BehaviorDef {
  scenes: SceneFrame[]
  frameMs: number
  durationMs: number
  jumpAnimation?: boolean
}

/* ═══════════════════════════════════════════════════════
   BEHAVIORS
   ═══════════════════════════════════════════════════════ */

type Behavior =
  | 'idle' | 'wave' | 'look' | 'jump' | 'type'
  | 'sleep' | 'dance' | 'happy' | 'love' | 'spin'
  | 'think' | 'spawn' | 'chat' | 'handoff' | 'highfive' | 'celebrate'

// Buddy spawn: pixels gradually appear
function makeSpawnFrames(): SceneFrame[] {
  const buddy = mirror(IDLE)
  const rows = buddy.length
  const cols = buddy[0].length
  const stages = [0.15, 0.4, 0.7, 1.0]

  // Deterministic "random" reveal order
  const allPixels: [number, number][] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (buddy[r][c]) allPixels.push([r, c])
    }
  }
  // Shuffle with fixed seed
  for (let i = allPixels.length - 1; i > 0; i--) {
    const j = (i * 7 + 3) % (i + 1)
    ;[allPixels[i], allPixels[j]] = [allPixels[j], allPixels[i]]
  }

  return [
    { main: IDLE },
    { main: IDLE, accessory: { grid: SPARKLE, position: 'between-mid' } },
    ...stages.map((pct): SceneFrame => {
      const count = Math.floor(allPixels.length * pct)
      const partial: Grid = buddy.map(row => row.map(() => _))
      for (let i = 0; i < count; i++) {
        const [r, c] = allPixels[i]
        partial[r][c] = buddy[r][c]
      }
      return { main: IDLE, buddy: partial }
    }),
    { main: HAPPY, buddy: mirror(HAPPY) },
    { main: HAPPY, buddy: mirror(HAPPY) },
  ]
}

const DEFS: Record<Behavior, BehaviorDef> = {
  idle:   { scenes: [{ main: IDLE }], frameMs: 1000, durationMs: 3000 },
  wave:   { scenes: [
    { main: WAVE_UP }, { main: WAVE_DOWN }, { main: WAVE_UP },
    { main: WAVE_DOWN }, { main: WAVE_UP }, { main: IDLE },
  ], frameMs: 300, durationMs: 1800 },
  look:   { scenes: [
    { main: LOOK_LEFT }, { main: LOOK_LEFT }, { main: IDLE },
    { main: LOOK_RIGHT }, { main: LOOK_RIGHT }, { main: IDLE },
  ], frameMs: 400, durationMs: 2400 },
  jump:   { scenes: [
    { main: JUMP_CROUCH }, { main: IDLE }, { main: IDLE }, { main: JUMP_CROUCH },
  ], frameMs: 250, durationMs: 1000, jumpAnimation: true },
  type:   { scenes: [
    { main: TYPE_L, laptop: true }, { main: TYPE_R, laptop: true },
    { main: TYPE_L, laptop: true }, { main: TYPE_R, laptop: true },
    { main: TYPE_L, laptop: true }, { main: TYPE_R, laptop: true },
    { main: TYPE_L, laptop: true }, { main: TYPE_R, laptop: true },
  ], frameMs: 200, durationMs: 1600 },
  sleep:  { scenes: [
    { main: SLEEP, accessory: { grid: ZZZ, position: 'above-right' } },
    { main: BLINK }, { main: SLEEP, accessory: { grid: ZZZ, position: 'above-right' } },
    { main: SLEEP, accessory: { grid: ZZZ, position: 'above-right' } },
  ], frameMs: 800, durationMs: 3200 },
  dance:  { scenes: [
    { main: DANCE_L }, { main: DANCE_R }, { main: DANCE_L },
    { main: DANCE_R }, { main: DANCE_L }, { main: DANCE_R },
  ], frameMs: 250, durationMs: 1500 },
  happy:  { scenes: [
    { main: HAPPY }, { main: IDLE }, { main: HAPPY }, { main: IDLE }, { main: HAPPY },
  ], frameMs: 300, durationMs: 1500 },
  love:   { scenes: [
    { main: HAPPY, accessory: { grid: HEART, position: 'above' } },
  ], frameMs: 500, durationMs: 1500 },
  spin:   { scenes: [
    { main: IDLE }, { main: LOOK_LEFT }, { main: IDLE }, { main: LOOK_RIGHT },
  ], frameMs: 150, durationMs: 600 },
  think:  { scenes: [
    { main: THINK, accessory: { grid: THOUGHT, position: 'above-right' } },
    { main: THINK },
    { main: THINK, accessory: { grid: THOUGHT, position: 'above-right' } },
    { main: LOOK_RIGHT },
    { main: THINK, accessory: { grid: THOUGHT, position: 'above-right' } },
    { main: HAPPY },
  ], frameMs: 500, durationMs: 3000 },

  // ── Multi-agent scenes ──
  spawn: { scenes: makeSpawnFrames(), frameMs: 350, durationMs: 2800 },
  chat: { scenes: [
    { main: LOOK_RIGHT, buddy: mirror(LOOK_LEFT), accessory: { grid: SPEECH, position: 'above' } },
    { main: LOOK_RIGHT, buddy: mirror(LOOK_LEFT) },
    { main: IDLE, buddy: mirror(IDLE), accessory: { grid: SPEECH, position: 'between-top' } },
    { main: IDLE, buddy: mirror(IDLE) },
    { main: LOOK_RIGHT, buddy: mirror(LOOK_LEFT), accessory: { grid: SPEECH, position: 'above' } },
    { main: IDLE, buddy: mirror(HAPPY) },
  ], frameMs: 450, durationMs: 2700 },
  handoff: { scenes: [
    { main: LOOK_RIGHT, buddy: mirror(IDLE), accessory: { grid: DOC, position: 'above' } },
    { main: LOOK_RIGHT, buddy: mirror(IDLE), accessory: { grid: DOC, position: 'between-top' } },
    { main: LOOK_RIGHT, buddy: mirror(IDLE), accessory: { grid: DOC, position: 'between-mid' } },
    { main: IDLE, buddy: mirror(LOOK_LEFT), accessory: { grid: DOC, position: 'between-top' } },
    { main: IDLE, buddy: mirror(HAPPY) },
  ], frameMs: 400, durationMs: 2000 },
  highfive: { scenes: [
    { main: IDLE, buddy: mirror(IDLE) },
    { main: WAVE_DOWN, buddy: mirror(WAVE_DOWN) },
    { main: WAVE_UP, buddy: mirror(WAVE_UP), accessory: { grid: SPARKLE, position: 'between-top' } },
    { main: WAVE_UP, buddy: mirror(WAVE_UP), accessory: { grid: SPARKLE, position: 'between-top' } },
    { main: HAPPY, buddy: mirror(HAPPY) },
  ], frameMs: 350, durationMs: 1750 },
  celebrate: { scenes: [
    { main: HAPPY, buddy: mirror(HAPPY), accessory: { grid: SPARKLE, position: 'above' } },
    { main: DANCE_L, buddy: mirror(DANCE_R) },
    { main: DANCE_R, buddy: mirror(DANCE_L), accessory: { grid: HEART, position: 'between-top' } },
    { main: DANCE_L, buddy: mirror(DANCE_R) },
    { main: HAPPY, buddy: mirror(HAPPY), accessory: { grid: SPARKLE, position: 'above' } },
    { main: IDLE, buddy: mirror(IDLE) },
  ], frameMs: 300, durationMs: 1800 },
}

const AUTO_SEQ: Behavior[] = [
  'idle', 'wave', 'idle', 'look', 'idle', 'type',
  'idle', 'think', 'idle', 'spawn',
  'idle', 'chat', 'idle', 'dance',
  'idle', 'handoff', 'idle', 'sleep',
  'idle', 'highfive', 'idle', 'jump',
  'idle', 'celebrate',
]

const TAP_REACTIONS: Behavior[] = [
  'happy', 'love', 'jump', 'dance', 'wave', 'spin',
  'spawn', 'highfive', 'celebrate',
]

/* ═══════════════════════════════════════════════════════
   RENDER
   ═══════════════════════════════════════════════════════ */

function PGrid({ grid, px, className = '' }: { grid: Grid; px: number; className?: string }) {
  const cols = grid[0].length
  const rows = grid.length
  return (
    <svg
      width={cols * px} height={rows * px}
      viewBox={`0 0 ${cols * px} ${rows * px}`}
      className={`block ${className}`}
      style={{ imageRendering: 'pixelated' }}
      aria-hidden="true"
    >
      {grid.flatMap((row, ry) =>
        row.map((c, cx) => c ? (
          <rect key={`${ry}-${cx}`} x={cx * px} y={ry * px} width={px} height={px} fill={c} />
        ) : null)
      )}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */

interface Props { scale?: number; className?: string }

export function PixelMascot({ scale = 6, className = '' }: Props) {
  const [autoIdx, setAutoIdx] = useState(0)
  const [tap, setTap] = useState<Behavior | null>(null)
  const [fi, setFi] = useState(0)
  const [blinking, setBlinking] = useState(false)
  const [jumpY, setJumpY] = useState(0)
  const [spinDeg, setSpinDeg] = useState(0)
  const ftRef = useRef<ReturnType<typeof setInterval>>(null)
  const btRef = useRef<ReturnType<typeof setTimeout>>(null)

  const beh: Behavior = tap ?? AUTO_SEQ[autoIdx % AUTO_SEQ.length]
  const def = DEFS[beh]
  const scene = def.scenes[fi % def.scenes.length]
  const mainGrid = blinking && beh === 'idle' ? BLINK : scene.main
  const px = scale

  useEffect(() => {
    setFi(0)
    let i = 0
    ftRef.current = setInterval(() => { i++; setFi(i) }, def.frameMs)
    if (def.jumpAnimation) {
      setTimeout(() => setJumpY(-px * 3), 250)
      setTimeout(() => setJumpY(0), 550)
    } else setJumpY(0)
    if (beh === 'spin') { setSpinDeg(720); setTimeout(() => setSpinDeg(0), 600) }
    btRef.current = setTimeout(() => {
      if (tap) setTap(null); else setAutoIdx(i2 => i2 + 1)
    }, def.durationMs)
    return () => { if (ftRef.current) clearInterval(ftRef.current); if (btRef.current) clearTimeout(btRef.current) }
  }, [autoIdx, tap, beh, def.frameMs, def.durationMs, def.jumpAnimation, px])

  useEffect(() => {
    const b = () => { setBlinking(true); setTimeout(() => setBlinking(false), 150) }
    const id = setInterval(b, 2500 + Math.random() * 2000)
    return () => clearInterval(id)
  }, [])

  const handleTap = useCallback(() => {
    setTap(TAP_REACTIONS[Math.floor(Math.random() * TAP_REACTIONS.length)])
  }, [])

  // Accessory positioning
  const accStyle = (pos: string): React.CSSProperties => {
    switch (pos) {
      case 'above': return { position: 'absolute', top: -px * 6, left: '50%', transform: 'translateX(-50%)' }
      case 'above-right': return { position: 'absolute', top: -px * 4, right: -px * 2 }
      case 'between-top': return { position: 'absolute', top: -px * 2, left: '50%', transform: 'translateX(-50%)' }
      case 'between-mid': return { position: 'absolute', top: px * 2, left: '50%', transform: 'translateX(-50%)' }
      default: return {}
    }
  }

  return (
    <div
      className={`inline-flex cursor-pointer flex-col items-center select-none ${className}`}
      onClick={handleTap} role="button" tabIndex={0}
      aria-label="Klikni na maskota"
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleTap() }}
    >
      {/* Scene container */}
      <div
        className={beh === 'idle' ? 'animate-mascot-float' : ''}
        style={{
          transform: `translateY(${jumpY}px) rotate(${spinDeg}deg)`,
          transition: spinDeg ? 'transform 0.5s ease-in-out' : jumpY ? 'transform 0.25s ease-out' : 'transform 0.2s ease-in',
        }}
      >
        <div className="relative flex items-end" style={{ gap: px * 3 }}>
          {/* Main mascot */}
          <div className="relative">
            <PGrid grid={mainGrid} px={px} />
            {scene.laptop && (
              <div className="flex justify-center -mt-px"><PGrid grid={LAPTOP} px={px} /></div>
            )}
          </div>

          {/* Buddy (if scene has one) */}
          {scene.buddy && <PGrid grid={scene.buddy} px={px} />}

          {/* Floating accessory */}
          {scene.accessory && (
            <div style={accStyle(scene.accessory.position)} className="animate-fade-in-up pointer-events-none">
              <PGrid grid={scene.accessory.grid} px={px} />
            </div>
          )}
        </div>
      </div>

      {/* Shadow */}
      <div
        className={`mt-1 rounded-full bg-black/10 ${beh === 'idle' ? 'animate-mascot-shadow' : ''}`}
        style={{
          width: scene.buddy ? px * 22 : px * 10,
          height: px * 1.5,
          transform: jumpY ? 'scaleX(0.6)' : undefined,
          opacity: jumpY ? 0.06 : undefined,
          transition: 'all 0.3s',
        }}
      />

      <p className="mt-2 text-xs text-muted/40 animate-fade-in-up" style={{ animationDelay: '3s' }}>
        klikni na mě
      </p>
    </div>
  )
}
