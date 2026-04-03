import type { Metadata } from 'next'
import { getAllContent } from '@/lib/mdx'
import type { BlogPost } from '@/lib/types'
import { ArticleCard } from '@/components/ArticleCard'
import { AnimatedPage, StaggerItem } from '@/components/motion/AnimatedGrid'

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
    <AnimatedPage
      title="Blog"
      description="Novinky, návody a postřehy ze světa umělé inteligence."
    >
      {posts.map((post) => (
        <StaggerItem key={post.slug}>
          <ArticleCard post={post} />
        </StaggerItem>
      ))}
    </AnimatedPage>
  )
}
