import Link from 'next/link'
import { PixelMascot } from '@/components/PixelMascot'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <PixelMascot scale={8} />
      <h1 className="mt-6 text-6xl font-black tracking-tight text-foreground">404</h1>
      <p className="mt-3 text-lg text-muted">
        Tady nic není... ale maskot tu je!
      </p>
      <p className="mt-1 text-sm text-muted">
        Stránka buď neexistuje, nebo se přestěhovala.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        Zpět na hlavní stránku
      </Link>
    </div>
  )
}
