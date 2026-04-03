'use client'

import { useCallback, useState } from 'react'
import Terminal from './Terminal'

export default function TerminalEmbed() {
  const [expanded, setExpanded] = useState(false)

  const openInWindow = useCallback(() => {
    const isMobile = window.innerWidth < 640
    if (isMobile) {
      window.open('/terminal', '_blank')
    } else {
      window.open(
        '/terminal',
        'airepublic-terminal',
        'width=720,height=560,menubar=no,toolbar=no,location=no,status=no',
      )
    }
  }, [])

  return (
    <div className="my-8">
      {!expanded ? (
        <div className="overflow-hidden rounded-lg border border-zinc-800 bg-[#0a0a0a] font-mono text-sm">
          {/* Mini title bar */}
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className="h-3 w-3 rounded-full bg-yellow-500" />
              <span className="h-3 w-3 rounded-full bg-green-500" />
              <span className="ml-2 text-xs text-zinc-500">terminal — airepublic.cz</span>
            </div>
          </div>
          {/* Preview content */}
          <div className="px-4 py-6 text-center">
            <p className="mb-1 text-zinc-400">Ahoj! Jsem terminál airepublic.cz.</p>
            <p className="mb-4 text-zinc-600 text-xs">Zkus mě neotrávit... nebo zkus.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setExpanded(true)}
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
              >
                Spustit tady
              </button>
              <button
                onClick={openInWindow}
                className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
              >
                Otevřít v novém okně
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <Terminal />
          <div className="mt-2 flex justify-end gap-3">
            <button
              onClick={openInWindow}
              className="text-xs text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Otevřít v novém okně
            </button>
            <button
              onClick={() => setExpanded(false)}
              className="text-xs text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Zavřít
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
