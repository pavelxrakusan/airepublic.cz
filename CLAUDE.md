# airepublic.cz — Project Rules

## SEO Rules (MANDATORY for every article, tool review, and project)

Every content page MUST have:

### Blog articles (`/blog/[slug]`)
- `generateMetadata()` with: title, description, canonical URL, OG image, Twitter card, tags
- OG image: use `frontmatter.image` if available, fallback to `/api/og?title=...&description=...`
- JSON-LD `BlogPosting` schema with: headline, description, datePublished, image, author, publisher, keywords
- Author: `{ name: "Pavel Rakušan", url: "${baseUrl}/o-mne" }`

### Tool reviews (`/nastroje/[slug]`)
- `generateMetadata()` with: title (include "— Recenze"), description, canonical, OG image, Twitter card
- OG image: always use `/api/og` endpoint with title and rating in description
- JSON-LD `SoftwareApplication` schema with: name, description, aggregateRating, review

### Projects (`/projekty`)
- `image` field in frontmatter (screenshot of the live site)
- Project card shows image with `object-top` alignment

### MDX frontmatter checklist
Every blog post MUST have:
```yaml
title: "..."           # max 60 chars for search results
description: "..."     # max 155 chars, compelling, includes keywords
date: "YYYY-MM-DD"     # publication date
tags: ["..."]          # 3-6 relevant tags
image: "/images/..."   # optional but recommended for project articles
```

### Sitemap
- `sitemap.ts` MUST include ALL route types: blog, nastroje, projekty
- When adding a new content type, update sitemap.ts

### Canonical URLs
- Every page with `generateMetadata()` must include `alternates.canonical`
- Static pages use `export const metadata` with `alternates.canonical`

### OG Images
- Every page must have an OG image (1200×630)
- Blog/tool articles: frontmatter image OR `/api/og` dynamic generation
- Collection pages: `/api/og` with page title

## Content Rules
- All content in Czech
- Tone: friendly expert, personal, no buzzwords
- Author perspective: early adopter, Claude fan, honest about limitations
- Dates: all 2026, never reference "future 2025"
- Price: Claude Pro = $20/month (consistent everywhere)

## Tech Rules
- TypeScript strict, no `any`
- Tailwind utility classes, no inline styles
- `bg-background` not `bg-white` (dark mode support)
- All images via `next/image` with proper `sizes` and `alt`
- Client components: push `'use client'` as far down as possible
