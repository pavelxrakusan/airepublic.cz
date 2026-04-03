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
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 0.6])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])

  return (
    <div ref={containerRef} className="flex w-full flex-col items-center gap-5 p-6">
      <p className="text-xs text-muted">Scrolluj stránku nahoru/dolů</p>

      {/* Progress bar */}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-border">
        <motion.div
          className="h-full rounded-full"
          style={{ width, backgroundColor: bgColor }}
        />
      </div>

      {/* Animated card */}
      <motion.div
        style={{ scale, rotate }}
        className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent text-2xl shadow-lg"
      >
        🎯
      </motion.div>

      {/* Stats that animate */}
      <div className="flex w-full gap-2">
        {['Výkon', 'Design', 'UX'].map((label, i) => (
          <div key={label} className="flex-1 rounded-lg bg-background p-2 text-center ring-1 ring-border">
            <motion.div
              className="mb-1 h-1.5 rounded-full bg-accent"
              style={{
                width: useTransform(scrollYProgress, [0, 0.5, 1], [`${20 + i * 10}%`, '100%', `${20 + i * 10}%`]),
              }}
            />
            <span className="text-[10px] font-medium text-muted">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
