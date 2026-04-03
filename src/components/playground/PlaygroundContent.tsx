'use client'

import { PageHeader } from '@/components/motion/PageHeader'
import { FadeIn } from '@/components/motion/FadeIn'
import { DragDemo } from './demos/DragDemo'
import { SpringDemo } from './demos/SpringDemo'
import { LayoutDemo } from './demos/LayoutDemo'
import { GestureDemo } from './demos/GestureDemo'
import { ScrollDemo } from './demos/ScrollDemo'
import { MorphDemo } from './demos/MorphDemo'
import { StaggerDemo } from './demos/StaggerDemo'
import { PhysicsDemo } from './demos/PhysicsDemo'

const demos = [
  { title: 'Drag & Drop', description: 'Přetahuj karty po ploše — s fyzikálním návratem a rotací.', component: DragDemo },
  { title: 'Notifikace', description: 'Spring animace pro toast notifikace. Klikni pro přidání.', component: SpringDemo },
  { title: 'Tabs s indikátorem', description: 'Layout animace pro plynulý přesun tab indikátoru.', component: LayoutDemo },
  { title: 'Gesta & Interakce', description: 'Like button, hover karty — reálné UI patterny.', component: GestureDemo },
  { title: 'Scroll Progress', description: 'Progress bar a elementy řízené pozicí scrollu.', component: ScrollDemo },
  { title: 'Stavový přechod', description: 'Plynulé přechody mezi stavy deploy pipeline.', component: MorphDemo },
  { title: 'Feature Grid', description: 'Kaskádové zobrazení feature karet.', component: StaggerDemo },
  { title: 'Gravitace', description: 'Simulace pádu s odrazem a squash efektem.', component: PhysicsDemo },
]

export function PlaygroundContent() {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-24 pb-16">
      <PageHeader
        title="Playground"
        description="Interaktivní showcase Framer Motion animací. Klikej, přetahuj, scrolluj."
      />

      <div className="grid gap-8 sm:grid-cols-2">
        {demos.map(({ title, description, component: Component }, i) => (
          <FadeIn key={title} delay={i * 0.08} className="flex flex-col">
            <div className="mb-3">
              <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
              <p className="text-sm text-muted">{description}</p>
            </div>
            <div className="relative flex min-h-[280px] flex-1 items-center justify-center overflow-hidden rounded-xl border border-border bg-card">
              <Component />
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  )
}
