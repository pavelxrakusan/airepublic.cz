'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface FadeInProps {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
}

function getInitial(direction: string, distance: number): Record<string, number> {
  const base: Record<string, number> = { opacity: 0 }
  switch (direction) {
    case 'up': return { ...base, y: distance }
    case 'down': return { ...base, y: -distance }
    case 'left': return { ...base, x: distance }
    case 'right': return { ...base, x: -distance }
    default: return base
  }
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  className,
  direction = 'up',
  distance = 24,
}: FadeInProps) {
  const initial = getInitial(direction, distance)

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
