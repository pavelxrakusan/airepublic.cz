'use client'

import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import Link from 'next/link'

function MiniDragDemo() {
  const constraintRef = useRef<HTMLDivElement>(null)
  return (
    <div ref={constraintRef} className="relative h-40 w-full">
      <motion.div
        drag
        dragConstraints={constraintRef}
        dragElastic={0.15}
        whileDrag={{ scale: 1.15 }}
        className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-2xl bg-accent shadow-lg active:cursor-grabbing"
      />
    </div>
  )
}

function MiniSpringDemo() {
  const [active, setActive] = useState(false)
  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="flex gap-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: active ? [1, 1.3, 0.9, 1.05, 1] : 1,
              borderRadius: active ? '50%' : '8px',
            }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 12,
              delay: i * 0.06,
            }}
            className="h-10 w-10 bg-accent shadow-md"
          />
        ))}
      </div>
      <button
        onClick={() => setActive(!active)}
        className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-card"
      >
        {active ? 'Reset' : 'Klikni'}
      </button>
    </div>
  )
}

export default function PlaygroundEmbed() {
  const [demo, setDemo] = useState<'drag' | 'spring'>('drag')

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex gap-1 border-b border-border p-2">
        <button
          onClick={() => setDemo('drag')}
          className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
            demo === 'drag' ? 'bg-accent text-white' : 'text-muted hover:text-foreground'
          }`}
        >
          Drag
        </button>
        <button
          onClick={() => setDemo('spring')}
          className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
            demo === 'spring' ? 'bg-accent text-white' : 'text-muted hover:text-foreground'
          }`}
        >
          Spring
        </button>
      </div>
      <div className="min-h-[180px] p-4">
        {demo === 'drag' ? <MiniDragDemo /> : <MiniSpringDemo />}
      </div>
      <div className="border-t border-border bg-background/50 px-4 py-2 text-center">
        <Link href="/playground" className="text-xs text-accent hover:text-accent-hover">
          Otevřít celý playground &rarr;
        </Link>
      </div>
    </div>
  )
}
