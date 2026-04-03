import type { Metadata } from 'next'
import { getAllContent } from '@/lib/mdx'
import type { Tool } from '@/lib/types'
import { ToolCard } from '@/components/ToolCard'
import { AnimatedPage, StaggerItem } from '@/components/motion/AnimatedGrid'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://airepublic.cz'

export const metadata: Metadata = {
  title: 'AI Nástroje',
  description: 'Recenze a srovnání nejlepších AI nástrojů — psaní, obrázky, kód, produktivita.',
  alternates: { canonical: `${baseUrl}/nastroje` },
  openGraph: {
    title: 'AI Nástroje | airepublic.cz',
    description: 'Recenze a srovnání nejlepších AI nástrojů.',
    url: `${baseUrl}/nastroje`,
    images: [{ url: `${baseUrl}/api/og?title=${encodeURIComponent('AI Nástroje')}&description=${encodeURIComponent('Recenze a srovnání nejlepších AI nástrojů')}`, width: 1200, height: 630 }],
  },
}

export default function NastrojePage() {
  const tools = getAllContent<Tool>('nastroje')

  return (
    <AnimatedPage
      title="AI Nástroje"
      description="Podrobné recenze AI nástrojů s hodnocením, klady, zápory a cenami."
    >
      {tools.map((tool) => (
        <StaggerItem key={tool.slug}>
          <ToolCard tool={tool} />
        </StaggerItem>
      ))}
    </AnimatedPage>
  )
}
