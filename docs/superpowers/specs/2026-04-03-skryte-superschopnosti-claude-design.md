# Skryté superschopnosti Claude — Design Spec

**Datum:** 2026-04-03
**Typ:** Blog článek (MDX)
**Slug:** `skryte-superschopnosti-claude`

## Metadata

```yaml
title: "Skryté superschopnosti Claude, o kterých většina lidí neví"
description: "Claude umí víc než chat. Artifacts, extended thinking, computer use, Claude Code — tady je přehled funkcí, které vás překvapí a změní váš workflow."
date: "2026-04-03"
tags: ["Claude", "tipy", "funkce", "Anthropic", "workflow", "pokročilé"]
```

## Cílová skupina

Mix ChatGPT uživatelů zvažujících/zkoušejících Claude + vývojáři, kteří chtějí vědět co Claude umí technicky.

## Tón

Strukturovaný průvodce s osobními komentáři a zkušenostmi u každé funkce. Friendly expert, ne suchý tutoriál.

## Struktura: Top-down (od nejimpresivnějšího)

### Úvod

Většina lidí zná Claude jako "ten druhý chatbot vedle ChatGPT". Ale pod kapotou je toho mnohem víc — a spousta funkcí, o kterých běžný uživatel netuší. Tady je přehled schopností, které mě osobně překvapily a které reálně používám.

### Hlavní sekce (5-6, každá do hloubky)

#### 1. Extended Thinking

- Co to je: Claude může "přemýšlet nahlas" — vidíte jeho reasoning chain v reálném čase, krok po kroku.
- Srovnání: OpenAI má o1/o3 modely, ale u Claude je thinking transparentnější a dostupnější (funguje na všech modelech řady 4).
- Osobní komentář: Kdy to reálně pomáhá (složité analytické úlohy, architektura, debugging) vs. kdy je to zbytečný overhead (jednoduché otázky).
- Tip: Jak thinking zapnout/využít v praxi.

#### 2. Artifacts & Projects

- Artifacts: Interaktivní výstupy přímo v chatu — spustitelný kód, vizualizace, SVG, dokumenty, React komponenty. Není to jen "text v boxíku", je to mini-IDE v chatovém okně.
- Projects: Trvalý kontext — nahrajete soubory, nastavíte system prompt, a Claude má kontext napříč konverzacemi. Jako workspace.
- Osobní příklad: Jak Projects používám pro tento blog (CLAUDE.md, pravidla, kontext).
- Srovnání: ChatGPT má GPTs, ale Projects jsou flexibilnější pro ad-hoc práci.

#### 3. Claude Code (CLI agent)

- Co to je: Terminálový AI agent, co čte celý codebase, edituje soubory, spouští příkazy, commituje.
- Klíčové funkce: Hooks (automatické akce), MCP servery (napojení na externí služby), subagenti (paralelní práce), worktrees (izolované prostředí).
- Teď i jako desktop app, web app (claude.ai/code), a IDE extensions (VS Code, JetBrains).
- Osobní komentář: Proč je to game-changer oproti Copilotu — Claude Code rozumí celému projektu, ne jen otevřenému souboru.
- Link na článek: `/blog/claude-code-vibe-coding`

#### 4. Computer Use

- Co to je: Claude dokáže ovládat počítač — vidí screenshot, kliká, píše, naviguje UI.
- Kde to má smysl: Automatizace opakovaných UI úloh, testování, scraping vizuálních dat.
- Kde ne: Zatím pomalejší a méně spolehlivé než klasická automatizace. Nečekejte zázraky na komplexních workflow.
- Upřímný pohled: Wow efekt velký, praktické využití zatím niche. Ale potenciál je obrovský.

#### 5. Tool Use & MCP protokol

- Tool Use: Claude může přes API volat vaše funkce — databáze, API, kalkulačky, cokoliv. Není to jen chat, je to agent.
- MCP: Otevřený standard pro napojení AI na externí nástroje. Ekosystém serverů roste exponenciálně.
- Příklad: Jak MCP funguje v praxi (GitHub, Supabase, Figma, Chrome DevTools...).
- Link na článek: `/blog/mcp-protocol-revoluce`

#### 6. System prompts & Constitutional AI

- System prompts: Jak si Claude přizpůsobit — nastavit tón, pravidla, formát odpovědí. Funguje lépe než u většiny konkurence díky RLHF tréninku.
- Constitutional AI: Proč se Claude chová jinak než GPT — je trénovaný na principech, ne jen na RLHF. Výsledek: méně halucinací, víc "odmítnutí odpovědět" (což je feature, ne bug).
- Tip: Jak psát efektivní system prompty pro Claude specificky.

### Rychlé tipy (kratší formát, 2-3 věty každý)

1. **200k tokenů kontextu** — Celá kniha, celý codebase, celý dataset najednou. ChatGPT má 128k, Claude 200k (Opus 4.6 až 1M).
2. **PDF a obrázky přímo v chatu** — Nahrajete PDF, Claude ho přečte a analyzuje. Totéž s obrázky, screenshoty, diagramy.
3. **Structured output (JSON mode)** — API umí vracet čistý JSON podle vašeho schématu. Ideální pro parsování a integraci.
4. **Prompt caching** — Opakované prompty (system prompt, velké dokumenty) se cachují → výrazná úspora na API.
5. **Opus vs Sonnet vs Haiku** — Opus na těžké reasoning úlohy, Sonnet na denní práci (sweet spot), Haiku na rychlé/levné operace.
6. **Claude na mobilu** — iOS i Android app, funguje překvapivě dobře na cestách.
7. **Batch API** — Hromadné zpracování za poloviční cenu, výsledky do 24h. Ideální pro velké datasety.

### Závěr

Krátké shrnutí — Claude není jen chatbot, je to platforma. CTA: vyzkoušejte si to sami na claude.ai. Link na článek `/blog/od-free-tieru-po-zavislost` pro celý příběh.

## Interní linky

- `/blog/claude-code-vibe-coding` (Claude Code workflow)
- `/blog/mcp-protocol-revoluce` (MCP protokol)
- `/blog/od-free-tieru-po-zavislost` (osobní příběh)
- `/blog/anthropic-claude-4-recenze` (Claude 4 recenze)
- `/blog/claude-vs-chatgpt-2026` (srovnání s ChatGPT)
- `/nastroje/claude` (recenze nástroje)

## SEO

- `generateMetadata()` s title, description, canonical URL, OG image, Twitter card
- OG image: `/api/og?title=...&description=...`
- JSON-LD `BlogPosting` schema
- Author: Pavel Rakušan

## Soubor

`src/content/blog/skryte-superschopnosti-claude.mdx`
