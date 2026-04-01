# Snake Game — Design Spec

## Přehled

Klasický Snake jako easter egg na blogu airepublic.cz. Článek `/blog/snake-game` popisuje jak hra vznikla a obsahuje interaktivní terminál, kde čtenář "spustí" hru příkazem. Hra se otevře jako fullscreen modal. Leaderboard s top 10 skóre uložený ve Vercel Blob.

## Herní mechanika

- Klasický snake — had sbírá jídlo, roste, nesmí narazit do sebe ani do stěn
- Zrychlování s rostoucím skóre (interval se zkracuje)
- Grid-based pohyb (ne pixel-based)
- Canvas rendering pro plynulost
- Game over při nárazu do stěny nebo do sebe

## Ovládání

- **Desktop:** šipky na klávesnici
- **Mobil:** swipe gesta (detekce směru přejetí prstem přes touch events)
- Hra běží ve fullscreen modalu — žádná kolize se scrollem stránky
- Pauza: mezerník (desktop), tap na pauza ikonu (mobil)

## Interaktivní terminál v článku

- Stylizovaný terminálový blok s blikajícím kurzorem (zelený text na černém pozadí)
- Čtenář klikne do pole, napíše `snake` (nebo `run snake.exe`, obě varianty fungují)
- Terminál "odpoví" textem a spustí hru v modalu
- Na mobilu: input pole se soft klávesnicí
- Příkazy mimo `snake`/`run snake.exe` vrátí vtipnou odpověď ("command not found")

## Leaderboard

- Po game over se zobrazí skóre + input pro přezdívku (max 12 znaků)
- Top 10 skóre zobrazené v článku pod terminálem
- **Storage:** Vercel Blob — jeden JSON soubor (`snake-scores.json`)
- **API route:** `src/app/api/snake-scores/route.ts`
  - `GET` — načti top 10 skóre (seřazené desc)
  - `POST` — ulož nové skóre `{ name: string, score: number }`
- **Rate limit:** 1 zápis za 60 sekund per IP (in-memory Map, resetuje se při cold start — dostatečné pro tuto škálu)
- **Validace:** name max 12 znaků, score musí být kladné číslo, sanitizace inputu
- Žádná autentizace

## Struktura souborů

```
src/content/blog/snake-game.mdx          — článek o vzniku hry
src/components/SnakeGame.tsx              — herní canvas + logika ('use client')
src/components/SnakeTerminal.tsx          — interaktivní terminál ('use client')
src/components/SnakeLeaderboard.tsx       — tabulka top skóre ('use client')
src/app/api/snake-scores/route.ts        — API pro čtení/zápis skóre
```

## Technologie

- **Canvas API** pro rendering hry
- **requestAnimationFrame** pro game loop
- **Touch events** (touchstart/touchend) pro swipe detekci na mobilu
- **Vercel Blob** (`@vercel/blob`) pro persistenci skóre
- Všechny herní komponenty jsou `'use client'` — importované do MDX článku

## Herní detaily

- **Grid:** 20×20 buněk
- **Počáteční délka hada:** 3 segmenty
- **Počáteční rychlost:** 150ms interval
- **Zrychlení:** -5ms za každé snědené jídlo (minimum 60ms)
- **Skóre:** +10 bodů za jídlo
- **Barvy:** zelený had, červené jídlo, tmavé pozadí (ladí s dark mode blogem)

## Článek (MDX)

Článek v češtině popisující:
- Motivace — proč snake na tech blogu
- Technické výzvy — canvas, swipe gesta, leaderboard
- Ukázky kódu — klíčové části implementace
- Interaktivní terminál pro spuštění hry
- Leaderboard pod terminálem
