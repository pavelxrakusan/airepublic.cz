import Image from 'next/image'
import { getStatusLabel } from '@/lib/mdx'
import type { Project, ContentItem } from '@/lib/types'

const statusColors: Record<string, string> = {
  hotovo: 'border-green-200 bg-green-50 text-green-700',
  rozpracovano: 'border-amber-200 bg-amber-50 text-amber-700',
  planovano: 'border-border bg-background text-muted',
}

export function ProjectCard({ project }: { project: ContentItem<Project> }) {
  return (
    <div className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:border-border-hover hover:shadow-md">
      {project.frontmatter.image && (
        <div className="relative aspect-[2/1] overflow-hidden bg-border">
          <Image
            src={project.frontmatter.image}
            alt={project.frontmatter.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-6">
        <div className="mb-3 flex items-center justify-between">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs ${
              statusColors[project.frontmatter.status] ?? statusColors.planovano
            }`}
          >
            {getStatusLabel(project.frontmatter.status)}
          </span>
        </div>
        <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground">
          {project.frontmatter.title}
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-muted">
          {project.frontmatter.description}
        </p>
        <div className="mb-4 flex flex-wrap gap-2">
          {project.frontmatter.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border bg-background px-2.5 py-0.5 font-mono text-xs text-muted"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex gap-4">
          {project.frontmatter.githubUrl && (
            <a
              href={project.frontmatter.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              GitHub
            </a>
          )}
          {project.frontmatter.liveUrl && (
            <a
              href={project.frontmatter.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent transition-colors hover:text-accent-hover"
            >
              Live demo
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
