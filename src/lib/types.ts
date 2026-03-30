export interface BlogPost {
  title: string
  description: string
  date: string
  tags: string[]
}

export interface Tool {
  title: string
  description: string
  category: 'psani' | 'obrazky' | 'kod' | 'produktivita' | 'video'
  rating: number
  affiliateUrl?: string
  affiliateLabel?: string
  pros: string[]
  cons: string[]
  pricing: string
}

export interface Project {
  title: string
  description: string
  techStack: string[]
  githubUrl?: string
  liveUrl?: string
  status: 'hotovo' | 'rozpracovano' | 'planovano'
}

export interface ContentItem<T> {
  frontmatter: T
  content: string
  slug: string
  readingTime: {
    text: string
    minutes: number
    time: number
    words: number
  }
}
