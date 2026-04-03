import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()}{' '}
          <span className="font-bold text-accent">ai</span>republic.cz
        </p>
        <nav className="flex gap-6">
          <Link href="/blog" className="text-sm text-muted transition-colors hover:text-foreground">
            Blog
          </Link>
          <Link href="/nastroje" className="text-sm text-muted transition-colors hover:text-foreground">
            Nástroje
          </Link>
          <Link href="/o-mne" className="text-sm text-muted transition-colors hover:text-foreground">
            O mně
          </Link>
          <Link href="/terminal" className="text-sm text-muted transition-colors hover:text-foreground">
            Terminal
          </Link>
          <Link href="/playground" className="text-sm text-muted transition-colors hover:text-foreground">
            Playground
          </Link>
        </nav>
      </div>
    </footer>
  )
}
