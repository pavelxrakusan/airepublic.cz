import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import type { ContentItem } from './types'

const contentDirectory = path.join(process.cwd(), 'src/content')

export function getContentBySlug<T>(type: string, slug: string): ContentItem<T> {
  const filePath = path.join(contentDirectory, type, `${slug}.mdx`)
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContent)

  return {
    frontmatter: data as T,
    content,
    slug,
    readingTime: readingTime(content),
  }
}

export function getAllContent<T>(type: string): ContentItem<T>[] {
  const dir = path.join(contentDirectory, type)
  if (!fs.existsSync(dir)) return []

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))

  return files
    .map((file) => {
      const slug = file.replace('.mdx', '')
      return getContentBySlug<T>(type, slug)
    })
    .sort((a, b) => {
      const dateA = (a.frontmatter as Record<string, string>).date ?? ''
      const dateB = (b.frontmatter as Record<string, string>).date ?? ''
      return dateB.localeCompare(dateA)
    })
}

export function getAllSlugs(type: string): string[] {
  const dir = path.join(contentDirectory, type)
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace('.mdx', ''))
}

export { getCategoryLabel, getStatusLabel } from './labels'
