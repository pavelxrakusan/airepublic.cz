# Vtipný Terminál — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive terminal page at `/terminal` with a personality/annoyance system, 30+ commands, and a meltdown sequence with glitch effects.

**Architecture:** Single page with one main client component. Three layers: command engine (parses input, returns responses), personality system (annoyance counter 0-100 that shifts tone), effects system (glitch overlays, screen shake, fake BSOD). All client-side, zero API calls, pre-baked responses. Annoyance resets on page refresh.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4, CSS animations for glitch effects.

**Spec:** `docs/superpowers/specs/2026-03-31-terminal-design.md`

---

## File Structure

```
src/app/terminal/page.tsx                  — Server component: metadata, SEO, JSON-LD, renders Terminal
src/components/terminal/Terminal.tsx        — Main 'use client' component: input, output, state, layout
src/components/terminal/commands.ts        — Command registry: all commands, responses, annoyance costs
src/components/terminal/personality.ts     — Annoyance level logic, tone modifiers, sarcastic responses
src/components/terminal/effects.ts         — Effect type definitions and meltdown sequence data
src/components/terminal/MeltdownOverlay.tsx — 'use client' fullscreen overlay: BSOD, glitch, file deletion
src/app/globals.css                        — Add glitch/shake/blink keyframe animations
src/components/Footer.tsx                  — Add "Terminal" link
src/app/sitemap.ts                         — Add /terminal route
```

---

### Task 1: Command Engine — Types & Data

**Files:**
- Create: `src/components/terminal/commands.ts`

This task builds the pure-data foundation: types, command registry, and response pools. No React, no state — just exportable functions and data.

- [ ] **Step 1: Create the command types and response types**

```ts
// src/components/terminal/commands.ts

export type LineType = 'input' | 'output' | 'error' | 'success' | 'warning' | 'system'

export interface TerminalLine {
  text: string
  type: LineType
  delay?: number // ms delay before showing (for sequential output)
}

export type SideEffect = 'clear' | 'meltdown' | 'matrix' | 'shake' | 'glitch'

export interface CommandResult {
  lines: TerminalLine[]
  annoyanceCost: number
  sideEffect?: SideEffect
}

export type AnnoyanceLevel = 'friendly' | 'irritated' | 'hostile' | 'warning' | 'meltdown'

export function getAnnoyanceLevel(annoyance: number): AnnoyanceLevel {
  if (annoyance <= 20) return 'friendly'
  if (annoyance <= 50) return 'irritated'
  if (annoyance <= 80) return 'hostile'
  if (annoyance <= 95) return 'warning'
  return 'meltdown'
}
```

- [ ] **Step 2: Add the real commands**

Add to `commands.ts`:

```ts
function realCommands(annoyance: number): Record<string, () => CommandResult> {
  const level = getAnnoyanceLevel(annoyance)

  return {
    help: () => {
      if (level === 'friendly') {
        return {
          lines: [
            { text: 'Dostupné příkazy:', type: 'output' },
            { text: '  help        — zobrazí tuto nápovědu', type: 'output' },
            { text: '  about       — o airepublic.cz', type: 'output' },
            { text: '  projects    — výpis projektů', type: 'output' },
            { text: '  blog        — poslední články', type: 'output' },
            { text: '  contact     — kontaktní info', type: 'output' },
            { text: '  weather     — předpověď počasí', type: 'output' },
            { text: '  time        — aktuální čas', type: 'output' },
            { text: '  joke        — programátorský vtip', type: 'output' },
            { text: '  quote       — motivační citát', type: 'output' },
            { text: '  ls          — výpis souborů', type: 'output' },
            { text: '  cat <file>  — čtení souboru', type: 'output' },
            { text: '  whoami      — kdo jsi', type: 'output' },
            { text: '  clear       — vyčistí terminál', type: 'output' },
            { text: '  neofetch    — systémové info', type: 'output' },
          ],
          annoyanceCost: 0,
        }
      }
      if (level === 'irritated') {
        return {
          lines: [
            { text: 'Příkazy? Jasně, tady máš... některé:', type: 'output' },
            { text: '  help, about, blog, ls, clear', type: 'output' },
            { text: '  (zbytek si najdi sám)', type: 'output' },
          ],
          annoyanceCost: 0,
        }
      }
      // hostile+
      return {
        lines: [
          { text: 'help? HELP?', type: 'error' },
          { text: 'Pomoc potřebuješ ty, ne já.', type: 'error' },
        ],
        annoyanceCost: 2,
      }
    },

    about: () => ({
      lines: [
        { text: 'airepublic.cz — Pavel Rakušan', type: 'output' },
        { text: 'Blog o AI nástrojích, Claude, a dalších vychytávkách.', type: 'output' },
        { text: 'Vytvořeno s Next.js, Tailwind a nadměrnou dávkou entuziasmu.', type: 'output' },
      ],
      annoyanceCost: 0,
    }),

    projects: () => ({
      lines: [
        { text: '📁 Projekty:', type: 'output' },
        { text: '  airepublic.cz    — tenhle web (jo, meta)', type: 'output' },
        { text: '  snake            — retro had v terminálu', type: 'output' },
        { text: '→ Více na /projekty', type: 'success' },
      ],
      annoyanceCost: 0,
    }),

    blog: () => ({
      lines: [
        { text: '📝 Poslední články:', type: 'output' },
        { text: '  Claude 4 — První dojmy a recenze', type: 'output' },
        { text: '  Jak používám AI pro kódování', type: 'output' },
        { text: '  AI nástroje pro rok 2026', type: 'output' },
        { text: '→ Více na /blog', type: 'success' },
      ],
      annoyanceCost: 0,
    }),

    contact: () => ({
      lines: [
        { text: '📬 Kontakt:', type: 'output' },
        { text: '  Web:     airepublic.cz', type: 'output' },
        { text: '  GitHub:  github.com/pavelxrakusan', type: 'output' },
        { text: '  Email:   [redacted — nejsem blázen]', type: 'output' },
      ],
      annoyanceCost: 0,
    }),

    weather: () => {
      const forecasts = [
        'Zataženo s přeháňkami kódu. Občasný segfault.',
        'Jasno, 42°C ve stínu monitoru. Doporučujeme hydrataci.',
        'Bouřkové varování: nadměrný počet otevřených tabů.',
        'Mlha. Viditelnost na 1 Stack Overflow odpověď.',
        'Sněží — padají deprecated packages.',
        'Tornádo v node_modules. Evakuujte projekt.',
      ]
      return {
        lines: [
          { text: `🌤️ Předpověď: ${forecasts[Math.floor(Math.random() * forecasts.length)]}`, type: 'output' },
        ],
        annoyanceCost: 0,
      }
    },

    time: () => ({
      lines: [
        { text: `🕐 ${new Date().toLocaleTimeString('cs-CZ')} — Čas strávený v terminálu: příliš mnoho.`, type: 'output' },
      ],
      annoyanceCost: 0,
    }),

    joke: () => {
      const jokes = [
        'Proč programátoři preferují tmavý režim? Protože je přitahuje světlo bugů.',
        'Co říká mass storage device? "Nemůžu tě nést, jsi moc heavy."',
        'Kolik programátorů potřebuješ na výměnu žárovky? Žádného — to je hardwarový problém.',
        'Proč se JavaScript pole cítilo osamělé? Protože bylo [].',
        'SQL dotaz vejde do baru, přijde ke dvěma tabulkám a ptá se: "Můžu se připojit?"',
        'Programátor jde do obchodu. Manželka volá: "Kup chleba. Pokud mají vejce, kup 12." Přinesl 12 chlebů.',
        'Existují 10 typů lidí — ti co rozumí binárnímu kódu a ti co ne.',
      ]
      return {
        lines: [
          { text: jokes[Math.floor(Math.random() * jokes.length)], type: 'output' },
        ],
        annoyanceCost: 0,
      }
    },

    quote: () => {
      const quotes = [
        '"Nejlepší kód je ten, který nikdy nenapíšeš." — Nikdo nikdy',
        '"Move fast and break things." — A pak 3 hodiny debuguj.',
        '"It works on my machine." — Každý vývojář, vždy.',
        '"Jednou se to celé přepíše." — Slib starý jako IT.',
        '"Deadlines jsou jen návrhy." — Projekt, který nikdy neskončil.',
        '"AI mi nahradí práci." — Říká člověk, který opravuje výstup AI.',
      ]
      return {
        lines: [
          { text: `💬 ${quotes[Math.floor(Math.random() * quotes.length)]}`, type: 'output' },
        ],
        annoyanceCost: 0,
      }
    },

    ls: () => {
      if (level === 'hostile' || level === 'warning') {
        return {
          lines: [
            { text: 'Výpis tvých prohřešků:', type: 'error' },
            { text: '  nadmerny-spam.log        420 KB', type: 'error' },
            { text: '  otravne-prikazy.txt      999 MB', type: 'error' },
            { text: '  trpelivost.dll           0 KB (EMPTY)', type: 'error' },
          ],
          annoyanceCost: 2,
        }
      }
      return {
        lines: [
          { text: 'index.html    style.css     app.js', type: 'output' },
          { text: 'readme.md     .env          node_modules/', type: 'output' },
          { text: 'tajny-plan.txt              snake.exe', type: 'output' },
        ],
        annoyanceCost: 0,
      }
    },

    dir: () => realCommands(annoyance).ls(),

    whoami: () => {
      const responses: Record<AnnoyanceLevel, string> = {
        friendly: 'Návštěvník airepublic.cz. Vítej!',
        irritated: 'Někdo, kdo má zjevně hodně volného času.',
        hostile: 'Problém. Ty jsi problém.',
        warning: 'Cíl č. 1 na mém seznamu.',
        meltdown: 'TERMINATED.',
      }
      return {
        lines: [{ text: responses[level], type: level === 'friendly' ? 'output' : 'error' }],
        annoyanceCost: 1,
      }
    },

    clear: () => ({
      lines: [],
      annoyanceCost: 0,
      sideEffect: 'clear' as SideEffect,
    }),

    neofetch: () => ({
      lines: [
        { text: '         ▄▄▄▄▄▄▄          user@airepublic.cz', type: 'success' },
        { text: '        ██╔════██╗         ───────────────────', type: 'success' },
        { text: '        ███████╔═╝         OS: Next.js 15 + React 19', type: 'output' },
        { text: '        ██╔════██╗         Host: Vercel Edge Network', type: 'output' },
        { text: '        ██║    ██║         Kernel: TypeScript 5.7 strict', type: 'output' },
        { text: '        ╚═╝    ╚═╝         Shell: Terminal v1.0', type: 'output' },
        { text: '                            Theme: Tailwind 4 + Geist', type: 'output' },
        { text: '  ██ ██ ██ ██ ██ ██        CPU: Claude-powered neurons', type: 'output' },
        { text: '                            Memory: ∞ (optimistic)', type: 'output' },
      ],
      annoyanceCost: 0,
    }),
  }
}
```

- [ ] **Step 3: Add easter egg commands**

Add to `commands.ts`:

```ts
function easterEggCommands(annoyance: number): Record<string, () => CommandResult> {
  return {
    'sudo': () => ({
      lines: [
        { text: '[sudo] password for user: ********', type: 'warning' },
        { text: 'Přístup odepřen. A to z dobrého důvodu.', type: 'error' },
      ],
      annoyanceCost: 5,
    }),

    'sudo rm -rf /': () => ({
      lines: [
        { text: '🚨 VAROVÁNÍ: Pokus o smazání kořenového adresáře', type: 'error' },
        { text: 'Incident zaznamenán. IP adresa odeslána na NÚKIB.', type: 'error' },
      ],
      annoyanceCost: 10,
    }),

    'rm -rf /': () => ({
      lines: [
        { text: 'Mazání celého blogu...', type: 'error', delay: 0 },
        { text: '██████░░░░░░░░ 42%', type: 'error', delay: 800 },
        { text: '...just kidding. Ale zkus to znovu a uvidíš.', type: 'output', delay: 1600 },
      ],
      annoyanceCost: 10,
    }),

    'hack': () => ({
      lines: [
        { text: 'Připojování k satelitu...', type: 'success', delay: 0 },
        { text: 'Obcházení firewallu...', type: 'success', delay: 600 },
        { text: 'Stahování přísně tajných dat...', type: 'success', delay: 1200 },
        { text: '...ERROR: Tvůj internet je na to moc pomalý.', type: 'error', delay: 2000 },
      ],
      annoyanceCost: 5,
    }),

    'hack nasa': () => easterEggCommands(annoyance).hack(),
    'hack pentagon': () => easterEggCommands(annoyance).hack(),

    'matrix': () => ({
      lines: [
        { text: 'Wake up, Neo...', type: 'success', delay: 0 },
        { text: 'The Matrix has you...', type: 'success', delay: 800 },
        { text: 'Follow the white rabbit. 🐇', type: 'output', delay: 1600 },
      ],
      annoyanceCost: 0,
      sideEffect: 'matrix' as SideEffect,
    }),

    'snake': () => ({
      lines: [
        { text: '🐍 Snake? Máme celý článek!', type: 'success' },
        { text: '→ /blog/snake-game', type: 'output' },
      ],
      annoyanceCost: 0,
    }),

    'exit': () => ({
      lines: [
        { text: 'Odejít? Teď? Když jsme si tak rozuměli?', type: 'output' },
        { text: 'Odmítám. 😤', type: 'error' },
      ],
      annoyanceCost: 3,
    }),

    'quit': () => easterEggCommands(annoyance).exit(),

    'coffee': () => ({
      lines: [
        { text: 'Vaření kávy... ☕', type: 'success', delay: 0 },
        { text: '418 I\'m a teapot. Jsem terminál, ne kávovar.', type: 'error', delay: 1000 },
      ],
      annoyanceCost: 0,
    }),

    'make coffee': () => easterEggCommands(annoyance).coffee(),

    'ping': () => ({
      lines: [
        { text: 'PING airepublic.cz (127.0.0.1): 56 data bytes', type: 'output', delay: 0 },
        { text: '64 bytes: seq=1 ttl=64 time=0.042ms', type: 'output', delay: 400 },
        { text: '64 bytes: seq=2 ttl=64 time=lol ms', type: 'output', delay: 800 },
        { text: '64 bytes: seq=3 ttl=64 time=nice ms', type: 'output', delay: 1200 },
        { text: '--- ping interrupted: dostal jsem tě ---', type: 'output', delay: 1600 },
      ],
      annoyanceCost: 0,
    }),

    'ssh root@localhost': () => ({
      lines: [
        { text: 'Connection refused. A to z dobrého důvodu.', type: 'error' },
      ],
      annoyanceCost: 3,
    }),

    'cowsay': () => {
      const messages = ['Mů!', 'Napiš "help"', 'Jsem kráva, ne IT podpora']
      const msg = messages[Math.floor(Math.random() * messages.length)]
      return {
        lines: [
          { text: ` ${'_'.repeat(msg.length + 2)}`, type: 'output' },
          { text: `< ${msg} >`, type: 'output' },
          { text: ` ${'‾'.repeat(msg.length + 2)}`, type: 'output' },
          { text: '        \\   ^__^', type: 'output' },
          { text: '         \\  (oo)\\_______', type: 'output' },
          { text: '            (__)\\       )\\/\\', type: 'output' },
          { text: '                ||----w |', type: 'output' },
          { text: '                ||     ||', type: 'output' },
        ],
        annoyanceCost: 0,
      }
    },

    'fortune': () => {
      const fortunes = [
        'Tvůj další deployment bude bez chyb. LOL.',
        'V blízké budoucnosti budeš googlovat chybovou hlášku, kterou jsi právě ignoroval.',
        'Hvězdy říkají: git push --force. Hvězdy lžou.',
        'Dnes je ideální den na refaktoring. Zítra taky. Nikdy to neuděláš.',
      ]
      return {
        lines: [
          { text: `🔮 ${fortunes[Math.floor(Math.random() * fortunes.length)]}`, type: 'output' },
        ],
        annoyanceCost: 0,
      }
    },

    'sl': () => ({
      lines: [
        { text: '      ====        ________                ___________', type: 'output' },
        { text: '  _D _|  |_______/        \\__I_I_____===__|_________| ', type: 'output' },
        { text: '   |(_)---  |   H\\________/ |   |        =|___ ___|', type: 'output' },
        { text: '   /     |  |   H  |  |     |   |         ||_| |_||', type: 'output' },
        { text: '  |      |  |   H  |__--------------------| [___] |', type: 'output' },
        { text: '  | ________|___H__/__|_____/[][]~\\_______|       |', type: 'output' },
        { text: '  |/ |   |-----------I_____I [][] []  D   |=======|__', type: 'output' },
        { text: 'Chtěl jsi napsat "ls"? 🚂', type: 'success' },
      ],
      annoyanceCost: 0,
    }),

    'please': () => ({
      lines: [
        { text: 'Alespoň máš slušné vychování. 👏', type: 'success' },
        { text: 'Ale pořád ti to nepomůže.', type: 'output' },
      ],
      annoyanceCost: -2, // reduces annoyance!
    }),

    '42': () => ({
      lines: [
        { text: 'Odpověď na Základní otázku života, vesmíru a vůbec.', type: 'output' },
        { text: 'Ale otázka zní: jaká byla ta otázka?', type: 'output' },
      ],
      annoyanceCost: 0,
    }),
  }
}
```

- [ ] **Step 4: Add the `cat` command handler and `executeCommand` main function**

Add to `commands.ts`:

```ts
function handleCat(filename: string, annoyance: number): CommandResult {
  const level = getAnnoyanceLevel(annoyance)
  const files: Record<string, CommandResult> = {
    'readme.md': {
      lines: [
        { text: '# airepublic.cz', type: 'output' },
        { text: 'Blog o AI. Vytvořil Pavel Rakušan.', type: 'output' },
        { text: 'Tip: zkus příkaz "neofetch" nebo "joke".', type: 'output' },
      ],
      annoyanceCost: 0,
    },
    '.env': {
      lines: [
        { text: 'Hezký pokus. 🕵️', type: 'error' },
        { text: 'SECRET_KEY=nice-try-buddy', type: 'error' },
        { text: 'DATABASE_URL=nope://localhost/not-telling', type: 'error' },
      ],
      annoyanceCost: 3,
    },
    'tajny-plan.txt': {
      lines: [
        { text: '=== PŘÍSNĚ TAJNÝ PLÁN ===', type: 'warning' },
        { text: '1. Udělat blog', type: 'output' },
        { text: '2. ???', type: 'output' },
        { text: '3. Profit', type: 'success' },
      ],
      annoyanceCost: 0,
    },
    'index.html': {
      lines: [
        { text: '<!DOCTYPE html>', type: 'output' },
        { text: '<html><body>', type: 'output' },
        { text: '  <h1>Hele, používáme React, ne vanilla HTML.</h1>', type: 'output' },
        { text: '</body></html>', type: 'output' },
      ],
      annoyanceCost: 0,
    },
    'snake.exe': {
      lines: [
        { text: 'Binární soubor. Nedá se zobrazit.', type: 'error' },
        { text: '(Ale můžeš si ho zahrát na /blog/snake-game)', type: 'success' },
      ],
      annoyanceCost: 0,
    },
  }

  if (files[filename]) return files[filename]

  if (level === 'hostile' || level === 'warning') {
    return {
      lines: [{ text: `Soubor "${filename}" neexistuje. Jako tvoje šance mě otravovat dál.`, type: 'error' }],
      annoyanceCost: 2,
    }
  }

  return {
    lines: [{ text: `cat: ${filename}: No such file or directory`, type: 'error' }],
    annoyanceCost: 1,
  }
}

const UNKNOWN_FRIENDLY = [
  (cmd: string) => `command not found: ${cmd}`,
  (cmd: string) => `"${cmd}"? Zkus "help" pro seznam příkazů.`,
  (cmd: string) => `Neznámý příkaz "${cmd}".`,
]

const UNKNOWN_IRRITATED = [
  (cmd: string) => `"${cmd}"? To jako vážně?`,
  (cmd: string) => `Neznám "${cmd}". Zkus "help", génie.`,
  (cmd: string) => `${cmd}: permission denied (a to z dobrého důvodu)`,
  (cmd: string) => `Hmm, "${cmd}"... kreativní, ale ne.`,
]

const UNKNOWN_HOSTILE = [
  () => 'Ne.',
  () => 'Přestaň.',
  (cmd: string) => `"${cmd}"? Ignoruju tě.`,
  () => 'Doporučuji přestat. Vážně.',
  () => '...',
]

const UNKNOWN_WARNING = [
  () => 'Tohle je tvoje poslední varování.',
  () => 'Vím kde bydlíš. 🏠',
  () => 'Systém zaznamenal nadměrné využívání. Zahajuji protiopatření.',
  () => '⚠️ VAROVÁNÍ: Trpělivost na kritické úrovni.',
]

function unknownCommand(cmd: string, annoyance: number): CommandResult {
  const level = getAnnoyanceLevel(annoyance)
  let pool: Array<(cmd: string) => string>
  let sideEffect: SideEffect | undefined

  switch (level) {
    case 'friendly':
      pool = UNKNOWN_FRIENDLY
      break
    case 'irritated':
      pool = UNKNOWN_IRRITATED
      break
    case 'hostile':
      pool = UNKNOWN_HOSTILE
      sideEffect = Math.random() > 0.7 ? 'shake' : undefined
      break
    case 'warning':
      pool = UNKNOWN_WARNING
      sideEffect = Math.random() > 0.5 ? 'glitch' : undefined
      break
    default:
      pool = UNKNOWN_FRIENDLY
  }

  const response = pool[Math.floor(Math.random() * pool.length)](cmd)

  return {
    lines: [{ text: response, type: level === 'friendly' ? 'error' : 'warning' }],
    annoyanceCost: 2,
    sideEffect,
  }
}

export function executeCommand(rawInput: string, annoyance: number, lastCommand: string): CommandResult {
  const trimmed = rawInput.trim()
  if (!trimmed) return { lines: [], annoyanceCost: 0 }

  const normalized = trimmed.toLowerCase()

  // Check for cat/type with argument
  if (normalized.startsWith('cat ') || normalized.startsWith('type ')) {
    const filename = trimmed.split(' ').slice(1).join(' ').trim()
    return handleCat(filename, annoyance)
  }

  // Check exact match in real commands
  const real = realCommands(annoyance)
  if (real[normalized]) return real[normalized]()

  // Check exact match in easter egg commands
  const eggs = easterEggCommands(annoyance)
  if (eggs[normalized]) return eggs[normalized]()

  // sudo + anything
  if (normalized.startsWith('sudo ')) {
    const sudoCmd = eggs['sudo rm -rf /']
    if (normalized === 'sudo rm -rf /' || normalized === 'sudo rm -rf /*') {
      return sudoCmd()
    }
    return eggs['sudo']()
  }

  // rm -rf variants
  if (normalized.startsWith('rm -rf')) {
    return eggs['rm -rf /']()
  }

  // Repeated command penalty (extra annoyance)
  const repeatBonus = normalized === lastCommand ? 3 : 0
  const result = unknownCommand(trimmed, annoyance)
  result.annoyanceCost += repeatBonus

  return result
}

export const WELCOME_LINES: TerminalLine[] = [
  { text: '╔══════════════════════════════════════╗', type: 'system' },
  { text: '║   airepublic.cz terminal v2.0        ║', type: 'system' },
  { text: '║   Napiš "help" pro seznam příkazů.   ║', type: 'system' },
  { text: '╚══════════════════════════════════════╝', type: 'system' },
  { text: '', type: 'output' },
]
```

- [ ] **Step 5: Commit**

```bash
git add src/components/terminal/commands.ts
git commit -m "feat(terminal): add command engine with 30+ commands and personality-aware responses"
```

---

### Task 2: Personality System

**Files:**
- Create: `src/components/terminal/personality.ts`

Annoyance counter logic, spam detection, and personality-specific interjections.

- [ ] **Step 1: Create personality system**

```ts
// src/components/terminal/personality.ts

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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/terminal/personality.ts
git commit -m "feat(terminal): add personality system with annoyance tracking and spam detection"
```

---

### Task 3: Effects System & Meltdown Data

**Files:**
- Create: `src/components/terminal/effects.ts`

Side effect definitions and the meltdown sequence script.

- [ ] **Step 1: Create effects system**

```ts
// src/components/terminal/effects.ts

import type { TerminalLine } from './commands'

export interface MeltdownStep {
  lines: TerminalLine[]
  durationMs: number // how long to show before next step
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
  {
    lines: [
      { text: `Mazání: ${FAKE_FILES[0]}`, type: 'error' },
    ],
    durationMs: 600,
  },
  {
    lines: [
      { text: `Mazání: ${FAKE_FILES[1]}`, type: 'error' },
    ],
    durationMs: 500,
  },
  {
    lines: [
      { text: `Mazání: ${FAKE_FILES[2]}`, type: 'error' },
    ],
    durationMs: 400,
  },
  {
    lines: [
      { text: `Mazání: ${FAKE_FILES[3]}`, type: 'error' },
    ],
    durationMs: 350,
  },
  {
    lines: [
      { text: `Mazání: ${FAKE_FILES[4]}`, type: 'error' },
    ],
    durationMs: 300,
  },
  {
    lines: [
      { text: `Mazání: ${FAKE_FILES[5]}`, type: 'error' },
    ],
    durationMs: 300,
  },
  {
    lines: [
      { text: `Mazání: ${FAKE_FILES[6]}`, type: 'error' },
    ],
    durationMs: 250,
  },
  {
    lines: [
      { text: `Mazání: ${FAKE_FILES[7]}`, type: 'error' },
    ],
    durationMs: 200,
  },
  {
    lines: [
      { text: `Mazání: ${FAKE_FILES[8]}`, type: 'error' },
    ],
    durationMs: 200,
  },
  {
    lines: [
      { text: `Mazání: ${FAKE_FILES[9]}`, type: 'error' },
    ],
    durationMs: 200,
  },
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/terminal/effects.ts
git commit -m "feat(terminal): add meltdown sequence and BSOD effect data"
```

---

### Task 4: CSS Animations for Glitch Effects

**Files:**
- Modify: `src/app/globals.css`

Add keyframe animations for glitch, shake, blink, and terminal-specific styles.

- [ ] **Step 1: Add terminal animation keyframes to globals.css**

Append to the end of `src/app/globals.css`:

```css
/* ── Terminal effects ──────────────────────────────── */

@keyframes terminal-glitch {
  0% { clip-path: inset(40% 0 61% 0); transform: translate(-2px, 2px); }
  10% { clip-path: inset(92% 0 1% 0); transform: translate(1px, -1px); }
  20% { clip-path: inset(43% 0 1% 0); transform: translate(-1px, 3px); }
  30% { clip-path: inset(25% 0 58% 0); transform: translate(2px, 1px); }
  40% { clip-path: inset(54% 0 7% 0); transform: translate(-3px, -2px); }
  50% { clip-path: inset(58% 0 43% 0); transform: translate(1px, 2px); }
  60% { clip-path: inset(28% 0 30% 0); transform: translate(-2px, -1px); }
  70% { clip-path: inset(75% 0 2% 0); transform: translate(3px, -2px); }
  80% { clip-path: inset(1% 0 85% 0); transform: translate(-1px, 1px); }
  90% { clip-path: inset(37% 0 53% 0); transform: translate(2px, -3px); }
  100% { clip-path: inset(0 0 0 0); transform: translate(0); }
}

@keyframes terminal-shake {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-4px, 2px); }
  20% { transform: translate(3px, -2px); }
  30% { transform: translate(-2px, 4px); }
  40% { transform: translate(4px, -1px); }
  50% { transform: translate(-3px, 3px); }
  60% { transform: translate(2px, -4px); }
  70% { transform: translate(-4px, 1px); }
  80% { transform: translate(3px, 3px); }
  90% { transform: translate(-1px, -2px); }
}

@keyframes terminal-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes terminal-scanline {
  0% { top: -10%; }
  100% { top: 110%; }
}

.terminal-glitch {
  animation: terminal-glitch 0.3s linear infinite;
}

.terminal-shake {
  animation: terminal-shake 0.4s linear infinite;
}

.terminal-blink {
  animation: terminal-blink 0.5s step-end infinite;
}

.terminal-scanline::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.05);
  animation: terminal-scanline 3s linear infinite;
  pointer-events: none;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(terminal): add glitch, shake, blink CSS animations"
```

---

### Task 5: Meltdown Overlay Component

**Files:**
- Create: `src/components/terminal/MeltdownOverlay.tsx`

Fullscreen overlay for the BSOD/kernel panic phase of meltdown.

- [ ] **Step 1: Create MeltdownOverlay component**

```tsx
// src/components/terminal/MeltdownOverlay.tsx
'use client'

import { useCallback, useEffect, useState } from 'react'
import { BSOD_LINES } from './effects'

interface MeltdownOverlayProps {
  onComplete: () => void
}

export default function MeltdownOverlay({ onComplete }: MeltdownOverlayProps) {
  const [phase, setPhase] = useState<'bsod' | 'black' | 'reveal'>('bsod')

  useEffect(() => {
    // Show BSOD for 4 seconds
    const bsodTimer = setTimeout(() => setPhase('black'), 4000)
    return () => clearTimeout(bsodTimer)
  }, [])

  useEffect(() => {
    if (phase === 'black') {
      // Black screen for 3 seconds
      const blackTimer = setTimeout(() => setPhase('reveal'), 3000)
      return () => clearTimeout(blackTimer)
    }
  }, [phase])

  const handleRevealComplete = useCallback(() => {
    onComplete()
  }, [onComplete])

  useEffect(() => {
    if (phase === 'reveal') {
      // Auto-close after a brief moment
      const timer = setTimeout(handleRevealComplete, 500)
      return () => clearTimeout(timer)
    }
  }, [phase, handleRevealComplete])

  if (phase === 'reveal') return null

  if (phase === 'black') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <div className="font-mono text-zinc-600 text-sm animate-pulse">
          Restarting...
        </div>
      </div>
    )
  }

  // BSOD phase
  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#0000AA] p-8 font-mono text-white text-sm leading-relaxed">
      <div className="mx-auto max-w-2xl pt-12">
        <div className="mb-6 inline-block bg-white px-2 text-[#0000AA] font-bold">
          airepublic.cz
        </div>
        {BSOD_LINES.map((line, i) => (
          <div key={i} className={line === '' ? 'h-4' : ''}>
            {line}
          </div>
        ))}
        <div className="mt-8 terminal-blink">
          Press any key to continue_
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/terminal/MeltdownOverlay.tsx
git commit -m "feat(terminal): add BSOD meltdown overlay component"
```

---

### Task 6: Main Terminal Component

**Files:**
- Create: `src/components/terminal/Terminal.tsx`

The main client component that wires everything together: input handling, output display, command execution, personality tracking, effects, and meltdown trigger.

- [ ] **Step 1: Create the Terminal component**

```tsx
// src/components/terminal/Terminal.tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/terminal/Terminal.tsx
git commit -m "feat(terminal): add main Terminal component with full interaction loop"
```

---

### Task 7: Terminal Page with SEO

**Files:**
- Create: `src/app/terminal/page.tsx`

Server component with metadata, JSON-LD, and layout. Renders the Terminal client component.

- [ ] **Step 1: Create the terminal page**

```tsx
// src/app/terminal/page.tsx
import type { Metadata } from 'next'
import Terminal from '@/components/terminal/Terminal'

const baseUrl = 'https://airepublic.cz'

export const metadata: Metadata = {
  title: 'Terminal — airepublic.cz',
  description:
    'Interaktivní terminál s vlastní osobností. Zkus ho neotrávit... nebo zkus.',
  alternates: {
    canonical: `${baseUrl}/terminal`,
  },
  openGraph: {
    title: 'Terminal — airepublic.cz',
    description:
      'Interaktivní terminál s vlastní osobností. Zkus ho neotrávit... nebo zkus.',
    url: `${baseUrl}/terminal`,
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent('Terminal')}&description=${encodeURIComponent('Interaktivní terminál s vlastní osobností')}`,
        width: 1200,
        height: 630,
        alt: 'Terminal — airepublic.cz',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terminal — airepublic.cz',
    description:
      'Interaktivní terminál s vlastní osobností. Zkus ho neotrávit... nebo zkus.',
  },
}

export default function TerminalPage() {
  return (
    <main className="min-h-screen px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="sr-only">Terminal — airepublic.cz</h1>
        <Terminal />
        <p className="mt-4 text-center text-xs text-zinc-600">
          Tip: zkus napsat <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-400">help</code> nebo prostě cokoliv. Na vlastní nebezpečí.
        </p>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Terminal — airepublic.cz',
            description:
              'Interaktivní terminál s vlastní osobností.',
            url: `${baseUrl}/terminal`,
            author: {
              '@type': 'Person',
              name: 'Pavel Rakušan',
              url: `${baseUrl}/o-mne`,
            },
          }),
        }}
      />
    </main>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/terminal/page.tsx
git commit -m "feat(terminal): add terminal page with SEO metadata and JSON-LD"
```

---

### Task 8: Footer Link & Sitemap

**Files:**
- Modify: `src/components/Footer.tsx`
- Modify: `src/app/sitemap.ts`

Add "Terminal" link in footer and `/terminal` route to sitemap.

- [ ] **Step 1: Add Terminal link to Footer**

In `src/components/Footer.tsx`, add after the "O mně" link:

```tsx
<Link href="/terminal" className="text-sm text-muted transition-colors hover:text-foreground">
  Terminal
</Link>
```

- [ ] **Step 2: Add /terminal to sitemap**

In `src/app/sitemap.ts`, add to the static routes array:

```ts
{
  url: `${baseUrl}/terminal`,
  lastModified: new Date(),
  changeFrequency: 'monthly',
  priority: 0.5,
},
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.tsx src/app/sitemap.ts
git commit -m "feat(terminal): add Terminal link to footer and sitemap"
```

---

### Task 9: Manual Testing & Polish

No new files — this is a verification pass.

- [ ] **Step 1: Start dev server and test**

```bash
npm run dev
```

Open `http://localhost:3000/terminal` and verify:

1. Terminal renders with welcome message and title bar
2. `help` shows command list
3. `about`, `blog`, `projects`, `contact` return correct output
4. `joke`, `quote`, `weather` return random responses
5. `ls` shows file listing
6. `cat readme.md`, `cat .env`, `cat tajny-plan.txt` show correct content
7. `neofetch` shows ASCII art + system info
8. `cowsay`, `fortune`, `sl` show ASCII art
9. `sudo`, `rm -rf /`, `hack` increase annoyance
10. Unknown commands show sarcastic responses
11. Annoyance bar in title bar changes color
12. At high annoyance, responses become hostile and glitch effects trigger
13. At annoyance 96+, meltdown sequence fires: file deletion, BSOD, reset
14. Footer shows "Terminal" link
15. `clear` clears the terminal
16. Spam detection works (rapid commands increase annoyance faster)

- [ ] **Step 2: Run build to check for TypeScript errors**

```bash
npm run build
```

Expected: Build succeeds with no type errors.

- [ ] **Step 3: Fix any issues found and commit**

```bash
git add -u
git commit -m "fix(terminal): polish based on manual testing"
```

---

## Self-Review Checklist

- [x] **Spec coverage:** All 30+ commands from spec implemented. Personality system with 5 levels. Meltdown sequence with BSOD. Annoyance costs match spec table. Footer link. Scanline effect for atmosphere.
- [x] **Placeholder scan:** No TBDs, TODOs, or "add later" statements. All code blocks are complete.
- [x] **Type consistency:** `TerminalLine`, `CommandResult`, `PersonalityState`, `AnnoyanceLevel`, `SideEffect`, `MeltdownStep` — consistent across all files. `executeCommand` signature matches usage in Terminal.tsx.
