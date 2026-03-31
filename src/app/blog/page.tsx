import type { Metadata } from 'next'
import { getAllContent } from '@/lib/mdx'
import type { BlogPost } from '@/lib/types'
import { ArticleCard } from '@/components/ArticleCard'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://airepublic.cz'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Články o umělé inteligenci, návody a novinky ze světa AI.',
  alternates: { canonical: `${baseUrl}/blog` },
  openGraph: {
    title: 'Blog | airepublic.cz',
    description: 'Články o umělé inteligenci, návody a novinky ze světa AI.',
    url: `${baseUrl}/blog`,
    images: [{ url: `${baseUrl}/api/og?title=Blog&description=${encodeURIComponent('Články o AI, návody a novinky')}`, width: 1200, height: 630 }],
  },
}

export default function BlogPage() {
  const posts = getAllContent<BlogPost>('blog')

  return (
    <div className="mx-auto max-w-5xl px-6 pt-24 pb-16">
      <header className="mb-12">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Blog</h1>
        <p className="text-lg text-muted">
          Novinky, návody a postřehy ze světa umělé inteligence.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
