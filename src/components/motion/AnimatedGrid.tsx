'use client'

import type { ReactNode } from 'react'
import { StaggerGrid, StaggerItem } from './StaggerGrid'
import { PageHeader } from './PageHeader'

interface AnimatedPageProps {
  title: string
  description: string
  children: ReactNode
  gridClassName?: string
}

export function AnimatedPage({ title, description, children, gridClassName = 'grid gap-4 sm:grid-cols-2' }: AnimatedPageProps) {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-24 pb-16">
      <PageHeader title={title} description={description} />
      <StaggerGrid className={gridClassName}>
        {children}
      </StaggerGrid>
    </div>
  )
}

export { StaggerItem }
