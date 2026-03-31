import Link from 'next/link'
import Image from 'next/image'
import type { BlogPost, ContentItem } from '@/lib/types'

export function ArticleCard({ post }: { post: ContentItem<BlogPost> }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:border-border-hover hover:shadow-md"
    >
      {post.frontmatter.image && (
        <div className="relative aspect-[2/1] overflow-hidden bg-border">
          <Image
            src={post.frontmatter.image}
            alt={post.frontmatter.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-6">
        <div className="mb-3 flex items-center gap-3 text-xs text-muted">
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
        <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent">
          {post.frontmatter.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted">
          {post.frontmatter.description}
        </p>
        {post.frontmatter.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
