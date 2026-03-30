import type { Metadata } from 'next'
import { getAllContent } from '@/lib/mdx'
import type { BlogPost } from '@/lib/types'
import { ArticleCard } from '@/components/ArticleCard'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Články o umělé inteligenci, návody a novinky ze světa AI.',
}

export default function BlogPage() {
  const posts = getAllContent<BlogPost>('blog')

  return (
    <>
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
    </>
  )
}
