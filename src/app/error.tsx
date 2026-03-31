'use client'

import { PixelMascot } from '@/components/PixelMascot'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <PixelMascot scale={8} />
      <h1 className="mt-6 text-4xl font-black tracking-tight text-foreground">
        Něco se pokazilo
      </h1>
      <p className="mt-3 text-lg text-muted">
        Maskot na tom pracuje... ale možná bude potřebovat pomoc.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        Zkusit znovu
      </button>
    </div>
  )
}
