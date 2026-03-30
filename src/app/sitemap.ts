import type { MetadataRoute } from 'next'
import { getAllSlugs } from '@/lib/mdx'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://airepublic.cz'

export default function sitemap(): MetadataRoute.Sitemap {
  const blogSlugs = getAllSlugs('blog')
  const toolSlugs = getAllSlugs('nastroje')

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/nastroje`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/projekty`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/o-mne`, changeFrequency: 'monthly', priority: 0.5 },
  ]

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const toolRoutes: MetadataRoute.Sitemap = toolSlugs.map((slug) => ({
    url: `${baseUrl}/nastroje/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...blogRoutes, ...toolRoutes]
}
