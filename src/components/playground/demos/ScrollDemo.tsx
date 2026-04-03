'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function ScrollDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const width = useTransform(scrollYProgress, [0, 0.5, 1], ['5%', '100%', '5%'])
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ['#7c3aed', '#f59e0b', '#10b981', '#f43f5e', '#7c3aed']
  )
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])

  return (
    <div ref={containerRef} className="flex w-full flex-col items-center gap-4 p-6">
      <p className="text-xs text-muted">Scrolluj stránku nahoru/dolů</p>

      <motion.div
        className="h-3 rounded-full"
        style={{ width, backgroundColor: bgColor }}
      />

      <motion.div
        className="h-12 w-12 rounded-xl bg-accent shadow-md"
        style={{ rotate }}
      />

      <motion.div
        className="h-2 w-full rounded-full bg-border"
      >
        <motion.div
          className="h-full rounded-full bg-accent"
          style={{ width }}
        />
      </motion.div>
    </div>
  )
}
