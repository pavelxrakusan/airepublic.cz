'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const layouts = [
  { grid: 'grid-cols-4 grid-rows-1', items: 4 },
  { grid: 'grid-cols-2 grid-rows-2', items: 4 },
  { grid: 'grid-cols-1 grid-rows-4', items: 4 },
  { grid: 'grid-cols-3 grid-rows-1', items: 4 },
]

export function LayoutDemo() {
  const [layoutIndex, setLayoutIndex] = useState(0)
  const layout = layouts[layoutIndex]

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className={`grid ${layout.grid} gap-3`}>
        {Array.from({ length: layout.items }, (_, i) => (
          <motion.div
            key={i}
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="h-14 w-14 rounded-xl bg-accent shadow-md"
            style={{ opacity: 0.6 + i * 0.13 }}
          />
        ))}
      </div>
      <button
        onClick={() => setLayoutIndex((layoutIndex + 1) % layouts.length)}
        className="rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-card"
      >
        Změnit layout
      </button>
    </div>
  )
}
