'use client'

import dynamic from 'next/dynamic'
import { useCallback, useRef, useState } from 'react'

const SnakeGame = dynamic(() => import('./SnakeGame'), { ssr: false })

interface Line {
  text: string
  type: 'input' | 'output' | 'error' | 'success'
}

const INITIAL_LINES: Line[] = [
  { text: 'airepublic.cz terminal v1.0', type: 'output' },
  { text: 'Napiš "snake" pro spuštění hry.', type: 'output' },
]

export default function SnakeTerminal() {
  const [lines, setLines] = useState<Line[]>(INITIAL_LINES)
  const [input, setInput] = useState('')
  const [playing, setPlaying] = useState(false)
  const [gameOverScore, setGameOverScore] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  const addLine = useCallback((text: string, type: Line['type']) => {
    setLines((prev) => [...prev, { text, type }])
    // Scroll to bottom after render
    setTimeout(() => {
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight
      }
    }, 0)
  }, [])

  const handleCommand = useCallback(
    (raw: string) => {
      const cmd = raw.trim()
      if (!cmd) return

      addLine(`$ ${cmd}`, 'input')

      const normalized = cmd.toLowerCase()

      if (normalized === 'snake' || normalized === 'run snake.exe') {
        addLine('Spouštím snake.exe...', 'success')
        setTimeout(() => {
          setPlaying(true)
        }, 500)
      } else if (normalized === 'help') {
        addLine('Dostupné příkazy: snake, help, clear', 'output')
      } else if (normalized === 'clear') {
        setLines([])
      } else {
        addLine(`command not found: ${cmd}`, 'error')
      }
    },
    [addLine],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleCommand(input)
        setInput('')
      }
    },
    [input, handleCommand],
  )

  const handleGameOver = useCallback(
    (score: number) => {
      setPlaying(false)
      setGameOverScore(score)
      addLine(`Hra skončila! Skóre: ${score}`, 'output')
      addLine('Zadej své jméno pro uložení skóre:', 'output')
      setTimeout(() => {
        nameInputRef.current?.focus()
      }, 0)
    },
    [addLine],
  )

  const handleClose = useCallback(() => {
    setPlaying(false)
    addLine('Hra ukončena.', 'output')
  }, [addLine])

  const handleNameSubmit = useCallback(async () => {
    const trimmedName = name.trim()
    if (!trimmedName || gameOverScore === null || submitting) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/snake-scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName, score: gameOverScore }),
      })
      if (res.ok) {
        addLine(`Skóre ${gameOverScore} uloženo jako '${trimmedName}'!`, 'success')
      } else {
        addLine('Chyba při ukládání skóre.', 'error')
      }
    } catch {
      addLine('Chyba při ukládání skóre.', 'error')
    } finally {
      setSubmitting(false)
      setGameOverScore(null)
      setName('')
      inputRef.current?.focus()
    }
  }, [name, gameOverScore, submitting, addLine])

  const handleNameKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleNameSubmit()
      }
    },
    [handleNameSubmit],
  )

  const focusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  const lineColor = (type: Line['type']) => {
    switch (type) {
      case 'input':
        return 'text-zinc-300'
      case 'output':
        return 'text-zinc-500'
      case 'error':
        return 'text-red-400'
      case 'success':
        return 'text-green-400'
    }
  }

  return (
    <>
      {playing && <SnakeGame onGameOver={handleGameOver} onClose={handleClose} />}

      <div
        className="my-8 overflow-hidden rounded-lg border border-zinc-800 bg-[#0a0a0a] font-mono text-sm"
        onClick={focusInput}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-2">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="h-3 w-3 rounded-full bg-green-500" />
          <span className="ml-2 text-xs text-zinc-500">terminal</span>
        </div>

        {/* Output area */}
        <div
          ref={outputRef}
          className="max-h-64 overflow-y-auto px-4 py-3 space-y-0.5"
        >
          {lines.map((line, i) => (
            <div key={i} className={lineColor(line.type)}>
              {line.text}
            </div>
          ))}

          {/* Name input row after game over */}
          {gameOverScore !== null && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-zinc-500">jméno:</span>
              <input
                ref={nameInputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 12))}
                onKeyDown={handleNameKeyDown}
                disabled={submitting}
                maxLength={12}
                className="flex-1 bg-transparent text-zinc-300 outline-none caret-green-400"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNameSubmit()
                }}
                disabled={submitting}
                className="text-xs text-zinc-500 hover:text-zinc-300 disabled:opacity-50"
              >
                [Enter]
              </button>
            </div>
          )}

          {/* Command input row */}
          {gameOverScore === null && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-green-400">$&nbsp;</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-zinc-300 outline-none caret-green-400"
                autoComplete="off"
                spellCheck={false}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
