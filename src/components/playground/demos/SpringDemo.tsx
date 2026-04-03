'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const notifications = [
  { icon: '✓', text: 'Deploy úspěšný', color: 'bg-emerald-500' },
  { icon: '⚡', text: 'Build hotový za 2.3s', color: 'bg-amber-500' },
  { icon: '🔔', text: 'Nový komentář', color: 'bg-accent' },
]

export function SpringDemo() {
  const [items, setItems] = useState<number[]>([])

  const addNotification = () => {
    const next = items.length % notifications.length
    setItems((prev) => [next, ...prev].slice(0, 5))
  }

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="flex w-full flex-col items-center gap-4 p-4">
      <button
        onClick={addNotification}
        className="rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-card"
      >
        Přidat notifikaci
      </button>
      <div className="flex w-full max-w-[240px] flex-col gap-2">
        {items.map((notifIndex, i) => {
          const notif = notifications[notifIndex]
          return (
            <motion.div
              key={`${notifIndex}-${i}`}
              initial={{ opacity: 0, x: 80, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => removeItem(i)}
              className="flex cursor-pointer items-center gap-3 rounded-xl bg-background p-3 shadow-md ring-1 ring-border transition-colors hover:bg-card"
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${notif.color} text-sm text-white`}>
                {notif.icon}
              </span>
              <span className="text-xs font-medium text-foreground">{notif.text}</span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
