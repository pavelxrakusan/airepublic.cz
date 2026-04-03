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
  { title: 'Drag & Drop', description: 'Přetáhni elementy kamkoliv — s elastickým návratem.', component: DragDemo },
  { title: 'Spring Physics', description: 'Fyzikální pružiny reagují na kliknutí.', component: SpringDemo },
  { title: 'Layout Animace', description: 'Plynulé přeuspořádání elementů.', component: LayoutDemo },
  { title: 'Gesta', description: 'Hover, tap a složená gesta.', component: GestureDemo },
  { title: 'Scroll Progress', description: 'Animace řízené scrollem.', component: ScrollDemo },
  { title: 'Morphing', description: 'Plynulé přechody mezi tvary.', component: MorphDemo },
  { title: 'Stagger Effect', description: 'Kaskádové objevování elementů.', component: StaggerDemo },
  { title: 'Gravitace', description: 'Simulace fyziky s odrazem.', component: PhysicsDemo },
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
