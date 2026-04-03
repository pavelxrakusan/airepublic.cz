'use client'

import type { BlogPost, Tool, Project, ContentItem } from '@/lib/types'
import { ArticleCard } from '@/components/ArticleCard'
import { ToolCard } from '@/components/ToolCard'
import { ProjectCard } from '@/components/ProjectCard'
import { StaggerGrid, StaggerItem } from '@/components/motion/StaggerGrid'
import { FadeIn } from '@/components/motion/FadeIn'
import Link from 'next/link'

interface HomeContentProps {
  posts: ContentItem<BlogPost>[]
  tools: ContentItem<Tool>[]
  projects: ContentItem<Project>[]
}

function SectionHeader({ title, href, linkText }: { title: string; href: string; linkText: string }) {
  return (
    <FadeIn className="mb-8 flex items-center justify-between">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <Link href={href} className="text-sm text-muted transition-colors hover:text-foreground">
        {linkText} &rarr;
      </Link>
    </FadeIn>
  )
}

export function HomeContent({ posts, tools, projects }: HomeContentProps) {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-16">
      {posts.length > 0 && (
        <section className="mb-20 pt-12">
          <SectionHeader title="Poslední články" href="/blog" linkText="Všechny články" />
          <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <StaggerItem key={post.slug}>
                <ArticleCard post={post} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </section>
      )}

      {tools.length > 0 && (
        <section className="mb-20">
          <SectionHeader title="Recenze nástrojů" href="/nastroje" linkText="Všechny nástroje" />
          <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <StaggerItem key={tool.slug}>
                <ToolCard tool={tool} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </section>
      )}

      {projects.length > 0 && (
        <section className="mb-20">
          <SectionHeader title="Projekty" href="/projekty" linkText="Všechny projekty" />
          <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <StaggerItem key={project.slug}>
                <ProjectCard project={project} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </section>
      )}
    </div>
  )
}
