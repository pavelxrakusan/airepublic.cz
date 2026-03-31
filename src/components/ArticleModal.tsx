'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import Link from 'next/link'

interface Props {
  title: string
  description: string
  date: string
  readingTime: string
  tags: string[]
  preview: string
  slug: string
}

export function ArticleModal({ title, description, date, readingTime, tags, preview, slug }: Props) {
  const router = useRouter()

  const close = useCallback(() => {
    router.back()
  }, [router])

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [close])

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={close}
    >
      <article
        className="relative mx-4 max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-background p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={close}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:text-foreground"
          aria-label="Zavřít"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="3" y1="3" x2="13" y2="13" />
            <line x1="13" y1="3" x2="3" y2="13" />
          </svg>
        </button>

        {/* Meta */}
        <div className="mb-4 flex items-center gap-3 text-xs text-muted">
          <time dateTime={date}>
            {new Date(date).toLocaleDateString('cs-CZ', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
          <span>&middot;</span>
          <span>{readingTime}</span>
        </div>

        {/* Title */}
        <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h2>

        {/* Description */}
        <p className="mb-4 text-base leading-relaxed text-muted">
          {description}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Preview text */}
        <div className="mb-6 border-t border-border pt-4">
          <p className="text-sm leading-relaxed text-muted">
            {preview}...
          </p>
        </div>

        {/* CTA */}
        <Link
          href={`/blog/${slug}`}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Číst celý článek
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </article>
    </div>
  )
}
