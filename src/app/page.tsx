import type { Metadata } from 'next'
import { getAllContent } from '@/lib/mdx'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://airepublic.cz'

export const metadata: Metadata = {
  alternates: { canonical: baseUrl },
  openGraph: {
    title: 'airepublic.cz — Průvodce světem umělé inteligence',
    description: 'Český AI portál — recenze nástrojů, návody, novinky a vibe coding projekty.',
    type: 'website',
    url: baseUrl,
    images: [{ url: `${baseUrl}/api/og?title=airepublic.cz&description=${encodeURIComponent('Průvodce světem umělé inteligence')}`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'airepublic.cz',
    description: 'Český AI portál — recenze nástrojů, návody, novinky a vibe coding projekty.',
  },
}
import type { BlogPost, Tool, Project } from '@/lib/types'
import { HeroParticles } from '@/components/HeroParticles'
import { PixelMascot } from '@/components/PixelMascot'
import { HomeContent } from '@/components/motion/HomeContent'

export default function HomePage() {
  const posts = getAllContent<BlogPost>('blog').slice(0, 3)
  const tools = getAllContent<Tool>('nastroje').slice(0, 3)
  const projects = getAllContent<Project>('projekty').slice(0, 3)

  return (
    <>
      {/* ═══ Hero ═══ */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden bg-background">
        {/* Desktop: canvas particles */}
        <div className="hidden sm:block">
          <HeroParticles />
        </div>

        {/* Mobile hero: just the mascot, living its life */}
        <div className="flex flex-col items-center px-6 pt-16 sm:hidden">
          <PixelMascot scale={12} />
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
                className="rounded-full border border-border bg-background/80 px-3 py-1 font-mono text-xs text-muted backdrop-blur-sm"
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
      <HomeContent posts={posts} tools={tools} projects={projects} />
    </>
  )
}
