'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { type TerminalLine, WELCOME_LINES, executeCommand } from './commands'
import { MELTDOWN_SEQUENCE, POST_MELTDOWN_LINES } from './effects'
import MeltdownOverlay from './MeltdownOverlay'
import {
  INITIAL_PERSONALITY,
  type PersonalityState,
  getInterjection,
  shouldTriggerMeltdown,
  updatePersonality,
} from './personality'

type ActiveEffect = 'glitch' | 'shake' | null

export default function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>(WELCOME_LINES)
  const [input, setInput] = useState('')
  const [personality, setPersonality] = useState<PersonalityState>(INITIAL_PERSONALITY)
  const [activeEffect, setActiveEffect] = useState<ActiveEffect>(null)
  const [meltdownPhase, setMeltdownPhase] = useState<'none' | 'sequence' | 'bsod'>('none')
  const [inputDisabled, setInputDisabled] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight
      }
    }, 0)
  }, [])

  const addLines = useCallback(
    (newLines: TerminalLine[]) => {
      setLines((prev) => [...prev, ...newLines])
      scrollToBottom()
    },
    [scrollToBottom],
  )

  const triggerEffect = useCallback((effect: ActiveEffect, durationMs = 500) => {
    setActiveEffect(effect)
    setTimeout(() => setActiveEffect(null), durationMs)
  }, [])

  // Meltdown sequence runner
  const runMeltdown = useCallback(() => {
    setMeltdownPhase('sequence')
    setInputDisabled(true)

    let totalDelay = 0
    for (const step of MELTDOWN_SEQUENCE) {
      const delay = totalDelay
      setTimeout(() => {
        addLines(step.lines)
        if (step.effect === 'glitch' || step.effect === 'shake') {
          triggerEffect(step.effect, step.durationMs)
        }
      }, delay)
      totalDelay += step.durationMs
    }

    // After sequence, show BSOD overlay
    setTimeout(() => {
      setMeltdownPhase('bsod')
    }, totalDelay)
  }, [addLines, triggerEffect])

  const handleMeltdownComplete = useCallback(() => {
    setMeltdownPhase('none')
    setLines([...WELCOME_LINES, ...POST_MELTDOWN_LINES])
    setPersonality(INITIAL_PERSONALITY)
    setInputDisabled(false)
    setActiveEffect(null)
    scrollToBottom()
    inputRef.current?.focus()
  }, [scrollToBottom])

  const handleCommand = useCallback(
    (rawInput: string) => {
      const trimmed = rawInput.trim()
      if (!trimmed) return

      // Add user input line
      addLines([{ text: `$ ${trimmed}`, type: 'input' }])

      // Execute command
      const result = executeCommand(trimmed, personality.annoyance, personality.lastCommand)

      // Handle side effects
      if (result.sideEffect === 'clear') {
        setLines([])
        setPersonality((prev) => updatePersonality(prev, trimmed, result.annoyanceCost))
        return
      }

      // Add output with delays if specified
      const linesWithDelay = result.lines.filter((l) => l.delay !== undefined && l.delay > 0)
      const linesWithoutDelay = result.lines.filter((l) => !l.delay || l.delay === 0)

      if (linesWithoutDelay.length > 0) {
        addLines(linesWithoutDelay)
      }

      for (const line of linesWithDelay) {
        setTimeout(() => {
          addLines([line])
        }, line.delay)
      }

      // Random interjection
      const interjection = getInterjection(personality.annoyance)
      if (interjection) {
        const maxDelay = Math.max(0, ...result.lines.map((l) => l.delay ?? 0))
        setTimeout(
          () => {
            addLines([interjection])
          },
          maxDelay + 300,
        )
      }

      // Trigger visual effects
      if (result.sideEffect === 'shake') triggerEffect('shake', 500)
      if (result.sideEffect === 'glitch') triggerEffect('glitch', 400)

      // Update personality
      const newPersonality = updatePersonality(personality, trimmed, result.annoyanceCost)
      setPersonality(newPersonality)

      // Check meltdown
      if (shouldTriggerMeltdown(newPersonality.annoyance) && meltdownPhase === 'none') {
        const maxDelay = Math.max(0, ...result.lines.map((l) => l.delay ?? 0))
        setTimeout(
          () => {
            runMeltdown()
          },
          maxDelay + 500,
        )
      }
    },
    [personality, addLines, triggerEffect, runMeltdown, meltdownPhase],
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

  const focusInput = useCallback(() => {
    if (!inputDisabled) {
      inputRef.current?.focus()
    }
  }, [inputDisabled])

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const lineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'input':
        return 'text-zinc-300'
      case 'output':
        return 'text-zinc-500'
      case 'error':
        return 'text-red-400'
      case 'success':
        return 'text-green-400'
      case 'warning':
        return 'text-amber-400'
      case 'system':
        return 'text-cyan-400'
    }
  }

  // Annoyance bar color
  const annoyanceColor =
    personality.annoyance <= 20
      ? 'bg-green-500'
      : personality.annoyance <= 50
        ? 'bg-yellow-500'
        : personality.annoyance <= 80
          ? 'bg-orange-500'
          : 'bg-red-500'

  const effectClass = activeEffect === 'glitch' ? 'terminal-glitch' : activeEffect === 'shake' ? 'terminal-shake' : ''

  return (
    <>
      {meltdownPhase === 'bsod' && <MeltdownOverlay onComplete={handleMeltdownComplete} />}

      <div
        className={`mx-auto max-w-3xl overflow-hidden rounded-lg border border-zinc-800 bg-[#0a0a0a] font-mono text-sm shadow-2xl ${effectClass}`}
        onClick={focusInput}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            <span className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="h-3 w-3 rounded-full bg-green-500" />
            <span className="ml-2 text-xs text-zinc-500">terminal — airepublic.cz</span>
          </div>
          {/* Annoyance indicator */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-600">trpělivost</span>
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-800">
              <div
                className={`h-full transition-all duration-300 ${annoyanceColor}`}
                style={{ width: `${100 - personality.annoyance}%` }}
              />
            </div>
          </div>
        </div>

        {/* Output area */}
        <div
          ref={outputRef}
          className="terminal-scanline relative h-[60vh] min-h-[400px] overflow-y-auto px-4 py-3 space-y-0.5"
        >
          {lines.map((line, i) => (
            <div
              key={i}
              className={`${lineColor(line.type)} ${line.type === 'system' ? 'font-bold' : ''}`}
            >
              {line.text || '\u00A0'}
            </div>
          ))}

          {/* Command input row */}
          {!inputDisabled && (
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
                autoCapitalize="off"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
