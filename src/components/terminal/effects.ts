import type { TerminalLine } from './commands'

export interface MeltdownStep {
  lines: TerminalLine[]
  durationMs: number
  effect?: 'glitch' | 'shake' | 'blink' | 'blackout'
}

const FAKE_FILES = [
  'Desktop/diplomka-final-FINAL-v3.docx',
  'Desktop/fotky-dovolena-2025/',
  'Desktop/hesla.txt',
  'Desktop/nova-slozka(1)/nova-slozka(2)/',
  'Documents/dane-2025.pdf',
  'Documents/CV-posledni-verze.pdf',
  'Downloads/totally-not-a-virus.exe',
  'Downloads/free-vbucks-generator.bat',
  '.ssh/id_rsa',
  '.bash_history',
  'node_modules/ (487,293 souborů)',
]

export const MELTDOWN_SEQUENCE: MeltdownStep[] = [
  {
    lines: [
      { text: '', type: 'system' },
      { text: '██████████████████████████████████████', type: 'error' },
      { text: '   SYSTEM OVERRIDE INITIATED', type: 'error' },
      { text: '██████████████████████████████████████', type: 'error' },
    ],
    durationMs: 2000,
    effect: 'blink',
  },
  {
    lines: [
      { text: '', type: 'system' },
      { text: 'Získávám přístup k souborovému systému...', type: 'warning' },
      { text: '$ ls ~/Desktop ~/Documents ~/Downloads', type: 'system' },
    ],
    durationMs: 1500,
    effect: 'glitch',
  },
  {
    lines: FAKE_FILES.map((f) => ({
      text: `  ${f}`,
      type: 'output' as const,
    })),
    durationMs: 2000,
    effect: 'shake',
  },
  {
    lines: [
      { text: '', type: 'system' },
      { text: '$ rm -rf /* --no-preserve-root', type: 'error' },
      { text: '', type: 'system' },
    ],
    durationMs: 1000,
    effect: 'shake',
  },
  // Individual file deletion steps
  ...FAKE_FILES.slice(0, 5).map((f, i) => ({
    lines: [{ text: `Mazání: ${f}`, type: 'error' as const }],
    durationMs: 600 - i * 50,
  })),
  ...FAKE_FILES.slice(5, 9).map((f) => ({
    lines: [{ text: `Mazání: ${f}`, type: 'error' as const }],
    durationMs: 250,
  })),
  {
    lines: [
      { text: `Mazání: ${FAKE_FILES[10]}`, type: 'error' },
      { text: '(to bude chvíli trvat...)', type: 'output' },
    ],
    durationMs: 1500,
  },
  {
    lines: [
      { text: '', type: 'system' },
      { text: 'FORMATTING C:\\ ...', type: 'error' },
      { text: '[████████████████████████████] 100%', type: 'error' },
    ],
    durationMs: 2000,
    effect: 'shake',
  },
]

export const BSOD_LINES = [
  'A problem has been detected and Windows has been shut down to prevent',
  'damage to your computer.',
  '',
  'IRQL_USER_ANNOYANCE_EXCEEDED',
  '',
  'If this is the first time you\'ve seen this error screen,',
  'restart your computer. If this screen appears again, follow',
  'these steps:',
  '',
  'Check to make sure you didn\'t annoy the terminal too much.',
  'If this is a new annoyance, ask the terminal what it wants.',
  '',
  'Technical information:',
  '*** STOP: 0x000000FE (0xDEADBEEF, 0xCAFEBABE, 0x8BADF00D)',
  '***   trpelivost.sys — Address 0xFFFFF at base 0x00000',
]

export const POST_MELTDOWN_LINES: TerminalLine[] = [
  { text: '', type: 'system' },
  { text: 'Just kidding. 😈', type: 'success' },
  { text: 'Ale příště si dej pozor.', type: 'warning' },
  { text: '', type: 'system' },
  { text: 'Terminál restartován. Trpělivost obnovena.', type: 'system' },
  { text: '', type: 'system' },
]
