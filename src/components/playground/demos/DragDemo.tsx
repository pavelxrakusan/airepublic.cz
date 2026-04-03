'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'

const cards = [
  { emoji: '🎨', title: 'Design', color: 'from-violet-500 to-purple-600' },
  { emoji: '⚡', title: 'Speed', color: 'from-amber-400 to-orange-500' },
  { emoji: '🚀', title: 'Deploy', color: 'from-emerald-400 to-teal-500' },
]

export function DragDemo() {
  const constraintRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={constraintRef} className="flex h-full w-full items-center justify-center p-6">
      <div className="flex gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            drag
            dragConstraints={constraintRef}
            dragElastic={0.1}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
            whileDrag={{ scale: 1.1, zIndex: 10, rotate: i % 2 === 0 ? 5 : -5 }}
            whileHover={{ y: -4 }}
            className={`flex h-28 w-24 cursor-grab flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br ${card.color} shadow-lg active:cursor-grabbing`}
          >
            <span className="text-3xl">{card.emoji}</span>
            <span className="text-xs font-bold text-white">{card.title}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
