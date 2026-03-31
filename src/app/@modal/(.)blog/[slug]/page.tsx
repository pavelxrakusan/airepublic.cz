import { notFound } from 'next/navigation'
import { getContentBySlug } from '@/lib/mdx'
import type { BlogPost } from '@/lib/types'
import { ArticleModal } from '@/components/ArticleModal'

export default async function InterceptedBlogPost({
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

  // First ~500 chars as preview
  const preview = post.content.slice(0, 500).replace(/[#*`>\-|]/g, '').trim()

  return (
    <ArticleModal
      title={post.frontmatter.title}
      description={post.frontmatter.description}
      date={post.frontmatter.date}
      readingTime={post.readingTime.text}
      tags={post.frontmatter.tags}
      preview={preview}
      slug={slug}
    />
  )
}
