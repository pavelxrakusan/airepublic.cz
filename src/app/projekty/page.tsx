import type { Metadata } from 'next'
import { getAllContent } from '@/lib/mdx'
import type { Project } from '@/lib/types'
import { ProjectCard } from '@/components/ProjectCard'
import { AnimatedPage, StaggerItem } from '@/components/motion/AnimatedGrid'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://airepublic.cz'

export const metadata: Metadata = {
  title: 'Projekty',
  description: 'Vibe coding projekty — reálné aplikace vytvořené s pomocí AI.',
  alternates: { canonical: `${baseUrl}/projekty` },
  openGraph: {
    title: 'Projekty | airepublic.cz',
    description: 'Reálné projekty vytvořené s pomocí AI — od nápadu po produkci.',
    url: `${baseUrl}/projekty`,
    images: [{ url: `${baseUrl}/api/og?title=Projekty&description=${encodeURIComponent('Vibe coding projekty s AI')}`, width: 1200, height: 630 }],
  },
}

export default function ProjektyPage() {
  const projects = getAllContent<Project>('projekty')

  return (
    <AnimatedPage
      title="Projekty"
      description="Reálné projekty vytvořené s pomocí AI — od nápadu po produkci."
    >
      {projects.map((project) => (
        <StaggerItem key={project.slug}>
          <ProjectCard project={project} />
        </StaggerItem>
      ))}
    </AnimatedPage>
  )
}
