'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const items = Array.from({ length: 12 }, (_, i) => i)

export function StaggerDemo() {
  const [visible, setVisible] = useState(true)

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <motion.div
        className="grid grid-cols-4 gap-2"
        initial={false}
        animate={visible ? 'visible' : 'hidden'}
        variants={{
          visible: { transition: { staggerChildren: 0.04 } },
          hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
        }}
      >
        {items.map((i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, scale: 0.3, y: 20 },
              visible: { opacity: 1, scale: 1, y: 0 },
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className="h-10 w-10 rounded-lg bg-accent shadow-sm"
            style={{ opacity: 0.5 + (i / 12) * 0.5 }}
          />
        ))}
      </motion.div>
      <button
        onClick={() => setVisible(!visible)}
        className="rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-card"
      >
        {visible ? 'Skrýt' : 'Zobrazit'}
      </button>
    </div>
  )
}
