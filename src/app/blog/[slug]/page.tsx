import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getContentBySlug, getAllSlugs } from '@/lib/mdx'
import type { BlogPost } from '@/lib/types'
import Link from 'next/link'
import Image from 'next/image'

export function generateStaticParams() {
  return getAllSlugs('blog').map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const { frontmatter } = getContentBySlug<BlogPost>('blog', slug)
    return {
      title: frontmatter.title,
      description: frontmatter.description,
      openGraph: {
        title: frontmatter.title,
        description: frontmatter.description,
        type: 'article',
        publishedTime: frontmatter.date,
      },
    }
  } catch {
    return {}
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let post
  try {
    post = getContentBySlug<BlogPost>('blog', slug)
  } catch {
    notFound()
  }

  return (
    <article className="mx-auto max-w-5xl px-6 pt-24 pb-16">
      <header className="mb-10">
        <Link
          href="/blog"
          className="mb-6 inline-block text-sm text-muted transition-colors hover:text-foreground"
        >
          &larr; Zpět na blog
        </Link>
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          {post.frontmatter.title}
        </h1>
        {post.frontmatter.image && (
          <div className="relative mt-6 aspect-[2/1] overflow-hidden rounded-lg border border-border">
            <Image
              src={post.frontmatter.image}
              alt={post.frontmatter.title}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </div>
        )}
        <div className="flex items-center gap-3 text-sm text-muted">
          <time dateTime={post.frontmatter.date}>
            {new Date(post.frontmatter.date).toLocaleDateString('cs-CZ', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
          <span>&middot;</span>
          <span>{post.readingTime.text}</span>
        </div>
        {post.frontmatter.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>
      <div className="prose">
        <MDXRemote source={post.content} />
      </div>
    </article>
  )
}
