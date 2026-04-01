# Vtipný Terminál — Design Spec

## Přehled

Interaktivní terminálová stránka na `/terminal` — vypadá jako skutečný terminál, reaguje na 30-40+ příkazů (reálné i easter eggy), má "trpělivostní systém" kde postupně nabírá osobnost, a po příliš mnoha otravných příkazech spustí meltdown sekvenci kde "maže" uživatelův desktop s glitch efekty.

## Architektura

Jedna stránka (`src/app/terminal/page.tsx`) s jedním hlavním klientským komponentem. Stav trpělivosti (annoyance level) se drží v paměti — refresh = reset.

**Tři vrstvy:**
1. **Command engine** — parsuje vstup, vrací odpověď(i) s typem a případným side effectem
2. **Personality system** — annoyance counter (0-100), ovlivňuje tón odpovědí a odemyká meltdown
3. **Effects system** — glitch overlay, screen shake, fake BSOD, "mazání souborů"

## Příkazový systém

### Reálné příkazy (~10)
- `help` — seznam příkazů (mění se s annoyance)
- `about` — info o airepublic.cz
- `projects` — výpis projektů
- `blog` — výpis posledních článků
- `contact` — kontakt
- `weather` — "falešné" počasí (předpřipravené vtipné předpovědi)
- `time` — aktuální čas
- `joke` — random český programátorský vtip
- `quote` — random motivační citát (sarkastický)
- `ls` / `dir` — výpis "souborů"
- `cat` / `type` — čtení "souborů"
- `whoami` — kdo jsi
- `clear` — vyčistí terminál

### Easter egg příkazy (~15)
- `sudo` / `sudo rm -rf /` — varování + annoyance boost
- `hack` / `hack nasa` — falešná hacking sekvence
- `matrix` — zelený text efekt
- `snake` — odkaz na snake článek
- `exit` / `quit` — odmítne
- `coffee` / `make coffee` — 418 teapot
- `ping` — falešný ping
- `ssh root@localhost` — "přístup odepřen, a to z dobrého důvodu"
- `rm -rf /` — "mazání..." pak "just kidding"
- `neofetch` — ASCII art + "systémové info" airepublic
- `cowsay` — ASCII kráva s hláškou
- `fortune` — random "moudrost"
- `sl` — ASCII vlak (překlep od `ls`)
- `please` — "alespoň máš slušné vychování"
- `42` — odpověď na vše

### Sarkastické odpovědi na neznámé příkazy (~10 variant)
- Rotující pool vtipných odpovědí
- Mění se podle annoyance levelu (zpočátku slušné, pak drzejší)

## Personality systém (annoyance 0-100)

### Level 0-20: Přátelský
- Normální odpovědi
- `help` ukazuje všechny příkazy
- Neznámé příkazy: "Zkus help pro seznam příkazů"

### Level 21-50: Podrážděný
- Odpovědi s komentáři ("Další génius...")
- `help` začne skrývat příkazy
- Random sarkastické poznámky mezi odpověďmi

### Level 51-80: Nepřátelský
- Občas odmítne provést příkaz
- Občas udělá něco jiného než co jsi chtěl (`ls` → vypíše tvoje prohřešky)
- Začnou se objevovat varovné hlášky ("Doporučuji přestat.")
- Lehký screen shake na některých příkazech

### Level 81-95: Varování
- "Tohle je tvoje poslední varování."
- "Vím kde bydlíš."
- "Systém zaznamenal nadměrné využívání. Zahajuji protiopatření."
- Častější glitche, text se občas "rozbije"

### Level 96-100: MELTDOWN
Spustí se automaticky. Sekvence:
1. "SYSTEM OVERRIDE INITIATED" (červený text, blikání)
2. Screen glitch efekt (CSS animation — posun řádků, barevné artefakty)
3. Falešný výpis Desktop souborů (`ls ~/Desktop`)
4. Progress bar mazání souborů jeden po jednom
5. "FORMATTING C:\\ ..."
6. Fake BSOD / kernel panic
7. Obrazovka zčerná
8. Po 3 sekundách: "Just kidding. Ale příště si dej pozor. 😈"
9. Terminál se resetuje na level 0

### Co zvyšuje annoyance
| Akce | Body |
|------|------|
| Neznámé příkazy | +2 |
| Opakování stejného příkazu | +3 |
| `sudo` cokoliv | +5 |
| `rm -rf` | +10 |
| `hack` | +5 |
| Spamování (3+ příkazy za 5s) | +8 |
| `exit` / `quit` | +3 |

## Vizuální efekty

- **Glitch overlay** — CSS `@keyframes` s `clip-path` a `transform: translate` na náhodných řádcích
- **Screen shake** — CSS animation `transform: translate` na celém terminálu
- **Fake BSOD** — fullscreen overlay s modrým/černým pozadím a error textem
- **Progress bar** — ASCII `[████████░░░░] 67%` animovaný v terminálu
- **Blikající text** — CSS `animation: blink`
- **Červený text** — pro varování a meltdown

## Struktura souborů

```
src/app/terminal/page.tsx                  — stránka s metadata + SEO
src/components/terminal/Terminal.tsx        — hlavní 'use client' komponenta
src/components/terminal/commands.ts        — příkazy a odpovědi (čistá data/logika)
src/components/terminal/personality.ts     — annoyance systém a tón odpovědí
src/components/terminal/effects.ts         — glitch/meltdown efekt definice
src/components/terminal/MeltdownOverlay.tsx — BSOD/glitch overlay komponenta
```

## Navigace

Odkaz ve footeru — "Terminal" vedle ostatních odkazů. Kdo najde, najde.

## Tech

- Čistě client-side, žádné API volání (zero cost)
- Předpřipravené odpovědi, žádné AI
- CSS animace pro glitch efekty
- Annoyance state v paměti (refresh = reset)
