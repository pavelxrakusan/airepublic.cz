import type { Metadata } from 'next'
import { getAllContent } from '@/lib/mdx'
import type { Tool } from '@/lib/types'
import { ToolCard } from '@/components/ToolCard'

export const metadata: Metadata = {
  title: 'AI Nástroje',
  description: 'Recenze a srovnání nejlepších AI nástrojů — psaní, obrázky, kód, produktivita.',
}

export default function NastrojePage() {
  const tools = getAllContent<Tool>('nastroje')

  return (
    <div className="mx-auto max-w-5xl px-6 pt-24 pb-16">
      <header className="mb-12">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">AI Nástroje</h1>
        <p className="text-lg text-muted">
          Podrobné recenze AI nástrojů s hodnocením, klady, zápory a cenami.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  )
}
