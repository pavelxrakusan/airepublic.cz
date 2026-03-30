import type { Metadata } from 'next'
import { getAllContent } from '@/lib/mdx'
import type { Project } from '@/lib/types'
import { ProjectCard } from '@/components/ProjectCard'

export const metadata: Metadata = {
  title: 'Projekty',
  description: 'Vibe coding projekty — reálné aplikace vytvořené s pomocí AI.',
}

export default function ProjektyPage() {
  const projects = getAllContent<Project>('projekty')

  return (
    <div className="mx-auto max-w-5xl px-6 pt-24 pb-16">
      <header className="mb-12">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Projekty</h1>
        <p className="text-lg text-muted">
          Reálné projekty vytvořené s pomocí AI — od nápadu po produkci.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  )
}
