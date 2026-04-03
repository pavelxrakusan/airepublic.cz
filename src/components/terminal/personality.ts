import { type AnnoyanceLevel, getAnnoyanceLevel, type TerminalLine } from './commands'

export interface PersonalityState {
  annoyance: number
  commandCount: number
  recentTimestamps: number[] // for spam detection
  lastCommand: string
}

export const INITIAL_PERSONALITY: PersonalityState = {
  annoyance: 0,
  commandCount: 0,
  recentTimestamps: [],
  lastCommand: '',
}

const SPAM_WINDOW_MS = 5000
const SPAM_THRESHOLD = 3
const SPAM_PENALTY = 8

export function updatePersonality(
  state: PersonalityState,
  commandInput: string,
  annoyanceCost: number,
): PersonalityState {
  const now = Date.now()
  const recentTimestamps = [...state.recentTimestamps, now].filter(
    (t) => now - t < SPAM_WINDOW_MS,
  )

  let totalCost = annoyanceCost

  // Spam detection: 3+ commands in 5 seconds
  if (recentTimestamps.length >= SPAM_THRESHOLD) {
    totalCost += SPAM_PENALTY
  }

  const newAnnoyance = Math.max(0, Math.min(100, state.annoyance + totalCost))

  return {
    annoyance: newAnnoyance,
    commandCount: state.commandCount + 1,
    recentTimestamps,
    lastCommand: commandInput.trim().toLowerCase(),
  }
}

/** Random interjection lines injected between commands at higher annoyance */
const INTERJECTIONS: Record<AnnoyanceLevel, string[]> = {
  friendly: [],
  irritated: [
    '(Vzdychá...)',
    '(Koukám, máš volno...)',
    '(To je vše? Můžu jít?)',
  ],
  hostile: [
    '(Počítám do deseti...)',
    '(Systém zvažuje odpojení uživatele.)',
    '(Tenhle člověk...)',
  ],
  warning: [
    '⚠️ [SYSTEM] Trpělivost na kritické úrovni.',
    '⚠️ [SYSTEM] Doporučený postup: zavřít prohlížeč.',
    '⚠️ [SYSTEM] Zahajuji odpočet...',
  ],
  meltdown: [],
}

/** Returns an optional interjection line to inject (20% chance at irritated+) */
export function getInterjection(annoyance: number): TerminalLine | null {
  const level = getAnnoyanceLevel(annoyance)
  const pool = INTERJECTIONS[level]
  if (pool.length === 0) return null
  if (Math.random() > 0.2) return null

  return {
    text: pool[Math.floor(Math.random() * pool.length)],
    type: level === 'warning' ? 'warning' : 'output',
  }
}

export function shouldTriggerMeltdown(annoyance: number): boolean {
  return annoyance >= 96
}
