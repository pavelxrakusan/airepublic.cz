import { get, list, put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

interface ScoreEntry {
  name: string
  score: number
  date: string
}

const BLOB_KEY = 'snake-scores.json'
const RATE_LIMIT_MS = 60 * 1000
const rateLimit = new Map<string, number>()

async function readScores(): Promise<ScoreEntry[]> {
  try {
    const { blobs } = await list({ prefix: BLOB_KEY })
    if (blobs.length === 0) return []

    const result = await get(blobs[0].url, { access: 'private' })
    if (!result) return []
    const chunks: Uint8Array[] = []
    for await (const chunk of result.stream) {
      chunks.push(chunk as Uint8Array)
    }
    const text = Buffer.concat(chunks).toString()
    const data = JSON.parse(text)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

async function writeScores(scores: ScoreEntry[]): Promise<void> {
  await put(BLOB_KEY, JSON.stringify(scores), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}

export async function GET(): Promise<NextResponse> {
  const scores = await readScores()
  const top10 = scores.sort((a, b) => b.score - a.score).slice(0, 10)
  return NextResponse.json(top10)
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  const lastSubmit = rateLimit.get(ip)
  const now = Date.now()
  if (lastSubmit !== undefined && now - lastSubmit < RATE_LIMIT_MS) {
    return NextResponse.json(
      { error: 'Počkej chvíli před dalším zápisem' },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Neplatné údaje' }, { status: 400 })
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    !('name' in body) ||
    !('score' in body)
  ) {
    return NextResponse.json({ error: 'Neplatné údaje' }, { status: 400 })
  }

  const { name: rawName, score: rawScore } = body as Record<string, unknown>

  if (typeof rawName !== 'string') {
    return NextResponse.json({ error: 'Neplatné údaje' }, { status: 400 })
  }

  const name = rawName.trim()
  if (name.length === 0 || name.length > 12) {
    return NextResponse.json({ error: 'Neplatné údaje' }, { status: 400 })
  }

  const score = Number(rawScore)
  if (!Number.isFinite(score) || score <= 0) {
    return NextResponse.json({ error: 'Neplatné údaje' }, { status: 400 })
  }

  rateLimit.set(ip, now)

  try {
    const existing = await readScores()
    const updated: ScoreEntry[] = [
      ...existing,
      { name, score, date: new Date().toISOString() },
    ]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)

    await writeScores(updated)
    return NextResponse.json(updated)
  } catch (err) {
    console.error('Snake scores write error:', err)
    return NextResponse.json(
      { error: 'Chyba při ukládání' },
      { status: 500 }
    )
  }
}
