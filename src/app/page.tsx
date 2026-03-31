import { getAllContent } from '@/lib/mdx'
import type { BlogPost, Tool, Project } from '@/lib/types'
import { ArticleCard } from '@/components/ArticleCard'
import { ToolCard } from '@/components/ToolCard'
import { ProjectCard } from '@/components/ProjectCard'
import { HeroParticles } from '@/components/HeroParticles'
import { PixelMascot } from '@/components/PixelMascot'
import Link from 'next/link'

export default function HomePage() {
  const posts = getAllContent<BlogPost>('blog').slice(0, 3)
  const tools = getAllContent<Tool>('nastroje').slice(0, 3)
  const projects = getAllContent<Project>('projekty').slice(0, 3)

  return (
    <>
      {/* ═══ Hero ═══ */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden bg-white">
        {/* Desktop: canvas particles */}
        <div className="hidden sm:block">
          <HeroParticles />
        </div>

        {/* Mobile hero: mascot is the star */}
        <div className="flex flex-col items-center gap-4 px-6 pt-20 sm:hidden">
          <PixelMascot scale={10} />
          <h1
            className="mt-2 bg-gradient-to-r from-[#11457E] via-[#999] to-[#D7141A] bg-clip-text text-center text-3xl font-black tracking-tight text-transparent"
          >
            airepublic.cz
          </h1>
        </div>

        {/* Desktop content layer (below particle text) */}
        <div className="pointer-events-none relative z-10 hidden flex-col items-center gap-8 px-6 pt-[42vh] sm:flex">
          {/* Subtitle */}
          <p
            className="max-w-xl text-center text-xl leading-relaxed text-muted animate-fade-in-up"
            style={{ animationDelay: '1.5s' }}
          >
            Měsíc s&nbsp;Claudem a&nbsp;už si neumím představit život bez AI.
            Tady píšu o&nbsp;tom co testuji, co funguje a&nbsp;co je hype.
          </p>

          {/* Desktop mascot (smaller) */}
          <div className="pointer-events-auto animate-fade-in-up" style={{ animationDelay: '2.2s' }}>
            <PixelMascot scale={6} />
          </div>

          {/* Tech badges */}
          <div className="flex flex-wrap justify-center gap-2 animate-fade-in-up" style={{ animationDelay: '2.6s' }}>
            {['Next.js 15', 'React 19', 'TypeScript', 'Tailwind v4', 'MDX', 'Vercel'].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border bg-white/80 px-3 py-1 font-mono text-xs text-muted backdrop-blur-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Mobile subtitle + badges (below mascot) */}
        <div className="flex flex-col items-center gap-4 px-6 pb-8 sm:hidden">
          <p className="max-w-sm text-center text-base leading-relaxed text-muted">
            Měsíc s&nbsp;Claudem a&nbsp;už si neumím představit život bez AI.
            Tady píšu o&nbsp;tom co testuji, co funguje a&nbsp;co je hype.
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {['Next.js 15', 'React 19', 'TypeScript', 'Tailwind v4'].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center">
          <svg
            className="h-5 w-5 text-muted/40 animate-scroll-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-px bg-border" />
      </section>

      {/* ═══ Content ═══ */}
      <div className="mx-auto max-w-5xl px-6 pb-16">
        {posts.length > 0 && (
          <section className="mb-20 pt-12">
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
      </div>
    </>
  )
}
