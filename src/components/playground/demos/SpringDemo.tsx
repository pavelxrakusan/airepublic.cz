'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export function SpringDemo() {
  const [active, setActive] = useState(false)

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: active ? [1, 1.4, 0.9, 1.1, 1] : 1,
              borderRadius: active ? '50%' : '16px',
              rotate: active ? 360 : 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 12,
              delay: i * 0.1,
            }}
            className="h-16 w-16 bg-accent shadow-lg"
          />
        ))}
      </div>
      <button
        onClick={() => setActive(!active)}
        className="rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-card"
      >
        {active ? 'Reset' : 'Spustit'}
      </button>
    </div>
  )
}
