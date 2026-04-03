'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const features = [
  { icon: '🚀', title: 'Rychlý deploy', desc: 'Pod 3 sekundy' },
  { icon: '🔒', title: 'Bezpečnost', desc: 'HTTPS automaticky' },
  { icon: '📊', title: 'Analytics', desc: 'Real-time data' },
  { icon: '🌍', title: 'Edge síť', desc: '40+ regionů' },
  { icon: '⚡', title: 'Fluid Compute', desc: 'Sdílené instance' },
  { icon: '🎯', title: 'Preview', desc: 'Každý commit' },
]

export function StaggerDemo() {
  const [visible, setVisible] = useState(true)

  return (
    <div className="flex w-full flex-col items-center gap-4 p-4">
      <motion.div
        className="grid w-full grid-cols-2 gap-2"
        initial={false}
        animate={visible ? 'visible' : 'hidden'}
        variants={{
          visible: { transition: { staggerChildren: 0.06 } },
          hidden: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
        }}
      >
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={{
              hidden: { opacity: 0, scale: 0.8, y: 16 },
              visible: { opacity: 1, scale: 1, y: 0 },
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className="flex items-center gap-2.5 rounded-xl bg-background p-3 shadow-sm ring-1 ring-border"
          >
            <span className="text-lg">{feature.icon}</span>
            <div>
              <p className="text-xs font-semibold text-foreground">{feature.title}</p>
              <p className="text-[10px] text-muted">{feature.desc}</p>
            </div>
          </motion.div>
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
