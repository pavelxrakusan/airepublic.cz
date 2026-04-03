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

    'hack nasa': () => easterEggCommands(annoyance)['hack'](),
    'hack pentagon': () => easterEggCommands(annoyance)['hack'](),

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

    'quit': () => easterEggCommands(annoyance)['exit'](),

    'coffee': () => ({
      lines: [
        { text: 'Vaření kávy... ☕', type: 'success', delay: 0 },
        { text: "418 I'm a teapot. Jsem terminál, ne kávovar.", type: 'error', delay: 1000 },
      ],
      annoyanceCost: 0,
    }),

    'make coffee': () => easterEggCommands(annoyance)['coffee'](),

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

const UNKNOWN_FRIENDLY: Array<(cmd: string) => string> = [
  (cmd: string) => `command not found: ${cmd}`,
  (cmd: string) => `"${cmd}"? Zkus "help" pro seznam příkazů.`,
  (cmd: string) => `Neznámý příkaz "${cmd}".`,
]

const UNKNOWN_IRRITATED: Array<(cmd: string) => string> = [
  (cmd: string) => `"${cmd}"? To jako vážně?`,
  (cmd: string) => `Neznám "${cmd}". Zkus "help", génie.`,
  (cmd: string) => `${cmd}: permission denied (a to z dobrého důvodu)`,
  (cmd: string) => `Hmm, "${cmd}"... kreativní, ale ne.`,
]

const UNKNOWN_HOSTILE: Array<(cmd: string) => string> = [
  () => 'Ne.',
  () => 'Přestaň.',
  (cmd: string) => `"${cmd}"? Ignoruju tě.`,
  () => 'Doporučuji přestat. Vážně.',
  () => '...',
]

const UNKNOWN_WARNING: Array<(cmd: string) => string> = [
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
    if (normalized === 'sudo rm -rf /' || normalized === 'sudo rm -rf /*') {
      return eggs['sudo rm -rf /']()
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
