import type { MetadataRoute } from 'next'
import { getAllSlugs } from '@/lib/mdx'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://airepublic.cz'

export default function sitemap(): MetadataRoute.Sitemap {
  const blogSlugs = getAllSlugs('blog')
  const toolSlugs = getAllSlugs('nastroje')
  const projectSlugs = getAllSlugs('projekty')

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/nastroje`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/projekty`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/o-mne`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/terminal`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/playground`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
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

  const projectRoutes: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: `${baseUrl}/projekty/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...blogRoutes, ...toolRoutes, ...projectRoutes]
}
