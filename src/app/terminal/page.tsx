import type { Metadata } from 'next'
import Terminal from '@/components/terminal/Terminal'

const baseUrl = 'https://airepublic.cz'

export const metadata: Metadata = {
  title: 'Terminal — airepublic.cz',
  description:
    'Interaktivní terminál s vlastní osobností. Zkus ho neotrávit... nebo zkus.',
  alternates: {
    canonical: `${baseUrl}/terminal`,
  },
  openGraph: {
    title: 'Terminal — airepublic.cz',
    description:
      'Interaktivní terminál s vlastní osobností. Zkus ho neotrávit... nebo zkus.',
    url: `${baseUrl}/terminal`,
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent('Terminal')}&description=${encodeURIComponent('Interaktivní terminál s vlastní osobností')}`,
        width: 1200,
        height: 630,
        alt: 'Terminal — airepublic.cz',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terminal — airepublic.cz',
    description:
      'Interaktivní terminál s vlastní osobností. Zkus ho neotrávit... nebo zkus.',
  },
}

export default function TerminalPage() {
  return (
    <main className="min-h-screen px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="sr-only">Terminal — airepublic.cz</h1>
        <Terminal />
        <p className="mt-4 text-center text-xs text-zinc-600">
          Tip: zkus napsat <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-400">help</code> nebo prostě cokoliv. Na vlastní nebezpečí.
        </p>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Terminal — airepublic.cz',
            description:
              'Interaktivní terminál s vlastní osobností.',
            url: `${baseUrl}/terminal`,
            author: {
              '@type': 'Person',
              name: 'Pavel Rakušan',
              url: `${baseUrl}/o-mne`,
            },
          }),
        }}
      />
    </main>
  )
}
