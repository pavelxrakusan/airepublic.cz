'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export function GestureDemo() {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(42)

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* Like button */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.85 }}
          onClick={() => {
            setLiked(!liked)
            setCount((c) => liked ? c - 1 : c + 1)
          }}
          className="flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium shadow-sm transition-colors"
        >
          <motion.span
            animate={liked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            className="text-lg"
          >
            {liked ? '❤️' : '🤍'}
          </motion.span>
          <span className="text-foreground">{count}</span>
        </motion.button>
      </div>

      {/* Interactive cards */}
      <div className="flex gap-3">
        {['🚀', '🎨', '⚡'].map((emoji, i) => (
          <motion.div
            key={emoji}
            whileHover={{
              scale: 1.08,
              y: -6,
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            }}
            whileTap={{ scale: 0.95, y: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl bg-background shadow-md ring-1 ring-border"
          >
            <span className="text-2xl">{emoji}</span>
            <span className="text-[10px] font-medium text-muted">
              {['Launch', 'Design', 'Fast'][i]}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
