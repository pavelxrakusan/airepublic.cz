'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string | ReactNode
  className?: string
}

export function PageHeader({ title, description, className = '' }: PageHeaderProps) {
  return (
    <header className={`mb-12 ${className}`}>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="mb-4 text-4xl font-bold tracking-tight"
      >
        {title}
      </motion.h1>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-lg text-muted"
        >
          {description}
        </motion.p>
      )}
    </header>
  )
}
