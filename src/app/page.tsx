import { getAllContent } from '@/lib/mdx'
import type { BlogPost, Tool, Project } from '@/lib/types'
import { ArticleCard } from '@/components/ArticleCard'
import { ToolCard } from '@/components/ToolCard'
import { ProjectCard } from '@/components/ProjectCard'
import Link from 'next/link'

export default function HomePage() {
  const posts = getAllContent<BlogPost>('blog').slice(0, 3)
  const tools = getAllContent<Tool>('nastroje').slice(0, 3)
  const projects = getAllContent<Project>('projekty').slice(0, 3)

  return (
    <>
      {/* Hero */}
      <section className="py-20 text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
          <span className="bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent">
            AIRepublic
          </span>
        </h1>
        <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted">
          Průvodce světem umělé inteligence. Recenze nástrojů, praktické návody
          a vibe&nbsp;coding projekty — vše v češtině.
        </p>
      </section>

      {/* Latest articles */}
      {posts.length > 0 && (
        <section className="mb-20">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Poslední články</h2>
            <Link href="/blog" className="text-sm text-muted transition-colors hover:text-foreground">
              Všechny články &rarr;
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Latest tools */}
      {tools.length > 0 && (
        <section className="mb-20">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Recenze nástrojů</h2>
            <Link href="/nastroje" className="text-sm text-muted transition-colors hover:text-foreground">
              Všechny nástroje &rarr;
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-20">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Projekty</h2>
            <Link href="/projekty" className="text-sm text-muted transition-colors hover:text-foreground">
              Všechny projekty &rarr;
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
