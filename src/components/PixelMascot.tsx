'use client'

import { useEffect, useState } from 'react'

/*
 * Pixel art mascot — matches the reference screenshot.
 * Pure CSS animations: float, blink, walk cycle.
 * No external dependencies.
 */

const B = '#C0613A' // body (terracotta)
const D = '#3A2520' // dark (eyes)
const _ = ''        // transparent

// 11 columns × 10 rows pixel grid
const GRID = [
  // ears
  [_, _, _, B, _, _, _, B, _, _, _],
  // head top
  [_, _, B, B, B, B, B, B, B, _, _],
  // eyes row
  [_, B, B, D, B, B, B, D, B, B, _],
  // face
  [_, B, B, B, B, B, B, B, B, B, _],
  // body (wide)
  [B, B, B, B, B, B, B, B, B, B, B],
  // body
  [B, B, B, B, B, B, B, B, B, B, B],
  // body lower
  [_, B, B, B, B, B, B, B, B, B, _],
  // leg tops
  [_, B, B, _, B, _, B, _, B, B, _],
  // feet
  [_, B, B, _, B, _, B, _, B, B, _],
]

const COLS = GRID[0].length
const ROWS = GRID.length
const PX = 6 // pixel size

interface PixelMascotProps {
  className?: string
}

export function PixelMascot({ className = '' }: PixelMascotProps) {
  const [blinking, setBlinking] = useState(false)

  useEffect(() => {
    const blink = () => {
      setBlinking(true)
      setTimeout(() => setBlinking(false), 150)
    }
    const id = setInterval(blink, 3000 + Math.random() * 2000)
    return () => clearInterval(id)
  }, [])

  const w = COLS * PX
  const h = ROWS * PX

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      {/* Mascot with float animation */}
      <div className="animate-mascot-float">
        <svg
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          className="block"
          style={{ imageRendering: 'pixelated' }}
          aria-hidden="true"
        >
          {GRID.flatMap((row, ry) =>
            row.map((color, cx) => {
              if (!color) return null
              // Blink: hide eye pixels
              const isEye = color === D
              if (isEye && blinking) {
                return (
                  <rect
                    key={`${ry}-${cx}`}
                    x={cx * PX}
                    y={ry * PX}
                    width={PX}
                    height={PX}
                    fill={B}
                  />
                )
              }
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
      </div>
      {/* Shadow */}
      <div className="animate-mascot-shadow mt-1 h-1.5 w-10 rounded-full bg-black/10" />
    </div>
  )
}
