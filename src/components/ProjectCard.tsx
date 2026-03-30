import { getStatusLabel } from '@/lib/mdx'
import type { Project, ContentItem } from '@/lib/types'

const statusColors: Record<string, string> = {
  hotovo: 'border-green-800 text-green-400',
  rozpracovano: 'border-yellow-800 text-yellow-400',
  planovano: 'border-border text-muted',
}

export function ProjectCard({ project }: { project: ContentItem<Project> }) {
  return (
    <div className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-border-hover">
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
            className="rounded-full border border-border px-2.5 py-0.5 font-mono text-xs text-muted"
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
  )
}
