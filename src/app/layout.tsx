import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { FloatingMascot } from '@/components/FloatingMascot'
import { KonamiListener } from '@/components/EasterEggs'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://airepublic.cz'),
  title: {
    default: 'airepublic.cz — Průvodce světem umělé inteligence',
    template: '%s | airepublic.cz',
  },
  description:
    'Český AI portál — recenze nástrojů, návody, novinky a vibe coding projekty ze světa umělé inteligence.',
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    siteName: 'airepublic.cz',
  },
}

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <html lang="cs" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Navigation />
        <main>{children}</main>
        {modal}
        <Footer />
        <FloatingMascot />
        <KonamiListener />
      </body>
    </html>
  )
}
