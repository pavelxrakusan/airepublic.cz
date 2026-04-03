'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const states = [
  {
    icon: '📦',
    title: 'Nový',
    subtitle: 'Čeká na zpracování',
    color: 'from-slate-400 to-slate-500',
    bg: 'bg-slate-50 dark:bg-slate-900/30',
  },
  {
    icon: '🔄',
    title: 'Zpracovává se',
    subtitle: 'Build probíhá...',
    color: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
  },
  {
    icon: '✅',
    title: 'Hotovo',
    subtitle: 'Deploy úspěšný!',
    color: 'from-emerald-400 to-teal-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    icon: '❌',
    title: 'Chyba',
    subtitle: 'Build selhal',
    color: 'from-rose-400 to-red-500',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
  },
]

export function MorphDemo() {
  const [stateIndex, setStateIndex] = useState(0)
  const state = states[stateIndex]

  return (
    <div className="flex flex-col items-center gap-5 p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={stateIndex}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={`flex w-56 items-center gap-3 rounded-2xl p-4 ${state.bg} ring-1 ring-border`}
        >
          <motion.div
            initial={{ rotate: -90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${state.color} text-xl shadow-sm`}
          >
            {state.icon}
          </motion.div>
          <div>
            <motion.p
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="text-sm font-semibold text-foreground"
            >
              {state.title}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xs text-muted"
            >
              {state.subtitle}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={() => setStateIndex((stateIndex + 1) % states.length)}
        className="rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-card"
      >
        Další stav
      </button>
    </div>
  )
}
