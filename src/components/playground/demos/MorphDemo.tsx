'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const shapes = [
  { borderRadius: '16px', width: 100, height: 100, rotate: 0 },
  { borderRadius: '50%', width: 100, height: 100, rotate: 0 },
  { borderRadius: '50% 0 50% 0', width: 100, height: 100, rotate: 45 },
  { borderRadius: '16px', width: 160, height: 60, rotate: 0 },
  { borderRadius: '50% 50% 0 0', width: 80, height: 120, rotate: 0 },
]

const colors = ['#7c3aed', '#f59e0b', '#10b981', '#f43f5e', '#3b82f6']

export function MorphDemo() {
  const [shapeIndex, setShapeIndex] = useState(0)
  const shape = shapes[shapeIndex]

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        animate={{
          borderRadius: shape.borderRadius,
          width: shape.width,
          height: shape.height,
          rotate: shape.rotate,
          backgroundColor: colors[shapeIndex],
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="shadow-lg"
      />
      <button
        onClick={() => setShapeIndex((shapeIndex + 1) % shapes.length)}
        className="rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-card"
      >
        Morph
      </button>
    </div>
  )
}
