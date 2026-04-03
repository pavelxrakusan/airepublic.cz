'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'

const colors = ['bg-accent', 'bg-amber-500', 'bg-emerald-500', 'bg-rose-500']

export function DragDemo() {
  const constraintRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={constraintRef} className="absolute inset-4">
      {colors.map((color, i) => (
        <motion.div
          key={color}
          drag
          dragConstraints={constraintRef}
          dragElastic={0.15}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
          whileDrag={{ scale: 1.15, zIndex: 10 }}
          className={`absolute h-14 w-14 cursor-grab rounded-2xl ${color} shadow-lg active:cursor-grabbing`}
          style={{
            top: `${20 + (i < 2 ? 0 : 50)}%`,
            left: `${10 + (i % 2) * 50}%`,
          }}
        />
      ))}
    </div>
  )
}
