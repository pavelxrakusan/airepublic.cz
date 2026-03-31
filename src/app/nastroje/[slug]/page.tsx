import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getContentBySlug, getAllSlugs, getCategoryLabel } from '@/lib/mdx'
import type { Tool } from '@/lib/types'
import Link from 'next/link'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://airepublic.cz'

export function generateStaticParams() {
  return getAllSlugs('nastroje').map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const { frontmatter } = getContentBySlug<Tool>('nastroje', slug)
    const title = `${frontmatter.title} — Recenze`
    const ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(frontmatter.title)}&description=${encodeURIComponent(`${frontmatter.rating}/5 ★ — ${frontmatter.description.slice(0, 100)}`)}`

    return {
      title,
      description: frontmatter.description,
      alternates: { canonical: `${baseUrl}/nastroje/${slug}` },
      openGraph: {
        title,
        description: frontmatter.description,
        type: 'article',
        url: `${baseUrl}/nastroje/${slug}`,
        images: [{ url: ogImage, width: 1200, height: 630, alt: frontmatter.title }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: frontmatter.description,
        images: [ogImage],
      },
    }
  } catch {
    return {}
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`h-5 w-5 ${i < rating ? 'text-accent' : 'text-border'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let tool
  try {
    tool = getContentBySlug<Tool>('nastroje', slug)
  } catch {
    notFound()
  }

  const { frontmatter, content } = tool

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: frontmatter.title,
    description: frontmatter.description,
    applicationCategory: 'AI Tool',
    url: frontmatter.affiliateUrl ?? `${baseUrl}/nastroje/${slug}`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: frontmatter.rating,
      bestRating: 5,
      worstRating: 1,
      ratingCount: 1,
    },
    review: {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Pavel Rakušan', url: `${baseUrl}/o-mne` },
      reviewRating: { '@type': 'Rating', ratingValue: frontmatter.rating, bestRating: 5 },
    },
  }

  return (
    <article className="mx-auto max-w-5xl px-6 pt-24 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="mb-10">
        <Link
          href="/nastroje"
          className="mb-6 inline-block text-sm text-muted transition-colors hover:text-foreground"
        >
          &larr; Zpět na nástroje
        </Link>
        <div className="mb-4 flex items-center gap-4">
          <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">
            {getCategoryLabel(frontmatter.category)}
          </span>
          <StarRating rating={frontmatter.rating} />
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          {frontmatter.title}
        </h1>
        <p className="text-lg text-muted">{frontmatter.description}</p>
      </header>

      {/* Pros / Cons / Pricing */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-3 text-sm font-semibold text-green-600">Klady</h3>
          <ul className="space-y-1.5 text-sm text-muted">
            {frontmatter.pros.map((pro) => (
              <li key={pro} className="flex gap-2">
                <span className="text-green-600">+</span> {pro}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-3 text-sm font-semibold text-red-600">Zápory</h3>
          <ul className="space-y-1.5 text-sm text-muted">
            {frontmatter.cons.map((con) => (
              <li key={con} className="flex gap-2">
                <span className="text-red-600">&minus;</span> {con}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-3 text-sm font-semibold text-accent">Cena</h3>
          <p className="font-mono text-sm text-muted">{frontmatter.pricing}</p>
          {frontmatter.affiliateUrl && (
            <a
              href={frontmatter.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              {frontmatter.affiliateLabel ?? 'Vyzkoušet'}
            </a>
          )}
        </div>
      </div>

      <div className="prose">
        <MDXRemote source={content} />
      </div>
    </article>
  )
}
