import type { Metadata } from 'next'
import { PlaygroundContent } from '@/components/playground/PlaygroundContent'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://airepublic.cz'

export const metadata: Metadata = {
  title: 'Playground — Framer Motion',
  description: 'Interaktivní showcase animací s Framer Motion — drag, spring, layout, gesta a další.',
  alternates: { canonical: `${baseUrl}/playground` },
  openGraph: {
    title: 'Playground — Framer Motion | airepublic.cz',
    description: 'Interaktivní showcase animací s Framer Motion.',
    url: `${baseUrl}/playground`,
    images: [{ url: `${baseUrl}/api/og?title=${encodeURIComponent('Playground')}&description=${encodeURIComponent('Framer Motion Showcase')}`, width: 1200, height: 630 }],
  },
}

export default function PlaygroundPage() {
  return <PlaygroundContent />
}
