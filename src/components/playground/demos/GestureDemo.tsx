'use client'

import { motion } from 'framer-motion'

export function GestureDemo() {
  return (
    <div className="flex gap-6">
      <motion.div
        whileHover={{ scale: 1.2, rotate: 5 }}
        whileTap={{ scale: 0.85, rotate: -5 }}
        className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-2xl bg-accent font-mono text-xs font-bold text-white shadow-lg"
      >
        Hover
      </motion.div>

      <motion.div
        whileHover={{
          boxShadow: '0 0 0 4px rgba(124, 58, 237, 0.3)',
        }}
        whileTap={{
          scale: 0.9,
          boxShadow: '0 0 0 8px rgba(124, 58, 237, 0.5)',
        }}
        className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-2xl bg-emerald-500 font-mono text-xs font-bold text-white shadow-lg"
      >
        Tap
      </motion.div>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ y: 20, scale: 0.9 }}
        className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-2xl bg-rose-500 font-mono text-xs font-bold text-white shadow-lg"
      >
        Bounce
      </motion.div>
    </div>
  )
}
