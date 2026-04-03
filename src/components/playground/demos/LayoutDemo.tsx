'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const tabs = ['Přehled', 'Aktivita', 'Nastavení']

const tabContent: Record<string, { items: string[] }> = {
  'Přehled': { items: ['📊 Dashboard', '📈 Statistiky', '🎯 Cíle'] },
  'Aktivita': { items: ['✅ Deploy v 14:30', '🔄 Merge PR #42', '💬 Code review'] },
  'Nastavení': { items: ['👤 Profil', '🔒 Bezpečnost'] },
}

export function LayoutDemo() {
  const [activeTab, setActiveTab] = useState('Přehled')

  return (
    <div className="flex w-full flex-col p-4">
      {/* Tabs */}
      <div className="relative mb-4 flex gap-1 rounded-xl bg-background p-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="relative z-10 flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors"
            style={{ color: activeTab === tab ? 'var(--color-foreground)' : 'var(--color-muted)' }}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-0 rounded-lg bg-card shadow-sm ring-1 ring-border"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-2"
        >
          {tabContent[activeTab].items.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-lg bg-background p-3 text-xs font-medium text-foreground ring-1 ring-border"
            >
              {item}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
