'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef } from 'react'
import Link from 'next/link'

function MiniDragDemo() {
  const constraintRef = useRef<HTMLDivElement>(null)
  return (
    <div ref={constraintRef} className="flex h-44 w-full items-center justify-center">
      <div className="flex gap-3">
        {['🎨', '⚡', '🚀'].map((emoji, i) => (
          <motion.div
            key={emoji}
            drag
            dragConstraints={constraintRef}
            dragElastic={0.1}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
            whileDrag={{ scale: 1.1, zIndex: 10 }}
            whileHover={{ y: -4 }}
            className="flex h-20 w-16 cursor-grab flex-col items-center justify-center gap-1 rounded-xl bg-gradient-to-br from-accent to-purple-600 shadow-lg active:cursor-grabbing"
            style={{ opacity: 0.8 + i * 0.1 }}
          >
            <span className="text-xl">{emoji}</span>
            <span className="text-[10px] font-bold text-white">{['Design', 'Fast', 'Ship'][i]}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function MiniNotificationDemo() {
  const [items, setItems] = useState<number[]>([])

  const notifications = [
    { icon: '✓', text: 'Deploy úspěšný', color: 'bg-emerald-500' },
    { icon: '⚡', text: 'Build hotový', color: 'bg-amber-500' },
    { icon: '🔔', text: 'Nový komentář', color: 'bg-accent' },
  ]

  return (
    <div className="flex h-44 w-full flex-col items-center gap-3 p-3">
      <button
        onClick={() => setItems((prev) => [prev.length % 3, ...prev].slice(0, 4))}
        className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-card"
      >
        Přidat notifikaci
      </button>
      <div className="flex w-full max-w-[220px] flex-col gap-1.5">
        <AnimatePresence>
          {items.map((notifIdx, i) => {
            const n = notifications[notifIdx]
            return (
              <motion.div
                key={`${notifIdx}-${i}`}
                initial={{ opacity: 0, x: 60, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onClick={() => setItems((prev) => prev.filter((_, j) => j !== i))}
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-background p-2 shadow-sm ring-1 ring-border"
              >
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${n.color} text-[10px] text-white`}>
                  {n.icon}
                </span>
                <span className="text-[11px] font-medium text-foreground">{n.text}</span>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function PlaygroundEmbed() {
  const [demo, setDemo] = useState<'drag' | 'notifications'>('drag')

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex gap-1 border-b border-border p-2">
        <button
          onClick={() => setDemo('drag')}
          className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
            demo === 'drag' ? 'bg-accent text-white' : 'text-muted hover:text-foreground'
          }`}
        >
          Drag & Drop
        </button>
        <button
          onClick={() => setDemo('notifications')}
          className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
            demo === 'notifications' ? 'bg-accent text-white' : 'text-muted hover:text-foreground'
          }`}
        >
          Notifikace
        </button>
      </div>
      <div className="min-h-[180px] p-2">
        {demo === 'drag' ? <MiniDragDemo /> : <MiniNotificationDemo />}
      </div>
      <div className="border-t border-border bg-background/50 px-4 py-2 text-center">
        <Link href="/playground" className="text-xs text-accent hover:text-accent-hover">
          Otevřít celý playground &rarr;
        </Link>
      </div>
    </div>
  )
}
