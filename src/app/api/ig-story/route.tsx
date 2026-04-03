import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const qrcode = require('qrcode-generator')

export const runtime = 'nodejs'

function generateQRMatrix(url: string): boolean[][] {
  const qr = qrcode(0, 'M')
  qr.addData(url)
  qr.make()

  const size = qr.getModuleCount()
  const matrix: boolean[][] = []
  for (let row = 0; row < size; row++) {
    const rowData: boolean[] = []
    for (let col = 0; col < size; col++) {
      rowData.push(qr.isDark(row, col))
    }
    matrix.push(rowData)
  }
  return matrix
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const title = searchParams.get('title') ?? 'Nový článek'
  const slug = searchParams.get('slug') ?? ''

  const articleUrl = slug
    ? `https://airepublic.cz/blog/${slug}`
    : 'https://airepublic.cz'

  const qrMatrix = generateQRMatrix(articleUrl)
  const moduleSize = Math.floor(200 / qrMatrix.length)
  const qrPixelSize = moduleSize * qrMatrix.length

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: '#0a0a0a',
          padding: '80px 60px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            display: 'flex',
            width: 80,
            height: 4,
            backgroundColor: '#7c3aed',
            marginBottom: 40,
          }}
        />

        {/* Label */}
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            color: '#7c3aed',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >
          Novinka na
        </div>

        {/* Brand */}
        <div
          style={{
            display: 'flex',
            fontSize: 42,
            marginBottom: 80,
          }}
        >
          <span style={{ color: '#7c3aed', fontWeight: 700 }}>ai</span>
          <span style={{ color: '#f8fafc', fontWeight: 700 }}>republic.cz</span>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 64,
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.15,
            marginBottom: 32,
            maxWidth: '100%',
            wordWrap: 'break-word',
          }}
        >
          {title}
        </div>

        {/* Spacer */}
        <div style={{ display: 'flex', flex: 1 }} />

        {/* Bottom section: QR + CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          {/* CTA text */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', fontSize: 24, color: '#94a3b8' }}>
              Naskenuj a čti
            </div>
            <div style={{ display: 'flex', fontSize: 18, color: '#64748b' }}>
              airepublic.cz
            </div>
          </div>

          {/* QR Code */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: 12,
              backgroundColor: '#ffffff',
              borderRadius: 12,
            }}
          >
            {qrMatrix.map((row, rowIdx) => (
              <div key={rowIdx} style={{ display: 'flex' }}>
                {row.map((isDark, colIdx) => (
                  <div
                    key={colIdx}
                    style={{
                      width: moduleSize,
                      height: moduleSize,
                      backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: 4,
            backgroundColor: '#7c3aed',
            marginTop: 40,
          }}
        />
      </div>
    ),
    {
      width: 1080,
      height: 1920,
    },
  )
}
