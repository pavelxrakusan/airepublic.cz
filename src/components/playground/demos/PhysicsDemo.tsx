'use client'

import { motion, useAnimationControls } from 'framer-motion'
import { useState, useCallback } from 'react'

export function PhysicsDemo() {
  const controls = useAnimationControls()
  const [dropping, setDropping] = useState(false)

  const drop = useCallback(async () => {
    if (dropping) return
    setDropping(true)

    await controls.start({
      y: [0, 180, 120, 180, 150, 180],
      transition: {
        duration: 1.5,
        times: [0, 0.4, 0.55, 0.7, 0.82, 0.9],
        ease: 'easeIn',
      },
    })

    await controls.start({
      scaleX: 1.4,
      scaleY: 0.6,
      transition: { duration: 0.08 },
    })

    await controls.start({
      scaleX: 1,
      scaleY: 1,
      transition: { type: 'spring', stiffness: 500, damping: 8 },
    })

    setDropping(false)
  }, [controls, dropping])

  const reset = useCallback(async () => {
    await controls.start({
      y: 0,
      scaleX: 1,
      scaleY: 1,
      transition: { type: 'spring', stiffness: 200, damping: 15 },
    })
    setDropping(false)
  }, [controls])

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="relative h-[220px] w-32">
        <motion.div
          animate={controls}
          className="absolute left-1/2 top-0 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-red-500 text-xl shadow-lg"
          style={{ marginLeft: -28 }}
        >
          🏀
        </motion.div>
        <div className="absolute bottom-0 h-0.5 w-full rounded bg-border" />
      </div>
      <div className="flex gap-2">
        <button
          onClick={drop}
          disabled={dropping}
          className="rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-card disabled:opacity-50"
        >
          Pustit
        </button>
        <button
          onClick={reset}
          className="rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-card"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
