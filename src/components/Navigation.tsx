'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Domů' },
  { href: '/nastroje', label: 'Nástroje' },
  { href: '/blog', label: 'Blog' },
  { href: '/projekty', label: 'Projekty' },
  { href: '/o-mne', label: 'O mně' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="font-mono text-sm font-bold tracking-tight text-foreground">
          <span className="font-extrabold text-accent">ai</span>
          republic
          <span className="text-muted">.cz</span>
        </Link>
        <ul className="flex items-center gap-1">
          {links.map(({ href, label }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? 'text-foreground'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
