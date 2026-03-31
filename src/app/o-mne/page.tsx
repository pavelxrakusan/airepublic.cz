import type { Metadata } from 'next'
import { PixelMascot } from '@/components/PixelMascot'

export const metadata: Metadata = {
  title: 'O mně',
  description: 'Grafik, designér a fotograf z Prahy, co objevil AI a teď staví věci s Claudem.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-24 pb-16">
      <header className="mb-12 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <PixelMascot scale={8} />
        <div>
          <h1 className="mb-2 text-4xl font-bold tracking-tight">Ahoj!</h1>
          <p className="text-lg text-muted">
            Grafik, designér a biker z Prahy, co před měsícem objevil Claude
            a&nbsp;teď staví věci, o&nbsp;kterých dřív jen snil.
          </p>
        </div>
      </header>

      <div className="prose">
        <h2>Kdo jsem</h2>
        <p>
          Celý život se pohybuji na pomezí designu a&nbsp;technologií. Prošel jsem
          reklamkami, novinami i&nbsp;fotografickou agenturou. Originálně jsem grafik,
          designér a&nbsp;fotograf — Adobe Creative Cloud je můj druhý domov. Nějakou
          dobu jsem taky dělal elektronickou hudbu jako <strong>Pavel X Rakusan</strong> —
          najdete mě na SoundCloudu i&nbsp;Beatportu. Produkoval jsem v&nbsp;Abletonu
          a&nbsp;stále mě to občas chytne.
        </p>
        <p>
          Dneska pracuji v&nbsp;neziskovém sektoru jako marketing expert. Zaměřujeme
          se na práci s&nbsp;rizikovými skupinami osob — smysluplná práce, která mě
          naplňuje. A&nbsp;po večerech? Po večerech stavím věci s&nbsp;AI.
        </p>

        <h2>Jak jsem se dostal k AI</h2>
        <p>
          Dřív jsem na weby a&nbsp;technické věci najímal programátory. Pak přišel
          Claude. Zkusil jsem free tier, hitl limit za hodinu, koupil Pro a&nbsp;najednou
          jsem stavěl věci sám — bez frameworků, bez závislostí na externistech.
          Celý příběh jsem sepsal v&nbsp;článku{' '}
          <a href="/blog/od-free-tieru-po-zavislost">Od free tieru po závislost</a>.
        </p>
        <p>
          Dneska mám čistý vývojářský notebook — Docker, Warp, Cursor, Figma,
          Raycast — a&nbsp;většinu věcí si dělám sám. Claude Code v&nbsp;terminálu,
          vibe coding, iterace. Tenhle web je živý důkaz.
        </p>

        <h2>Co stavím</h2>
        <ul>
          <li>
            <strong>airepublic.cz</strong> — tenhle web. Next.js 15, TypeScript,
            Tailwind v4, pixel maskot. Showcase toho, co se dá s&nbsp;AI postavit.
          </li>
          <li>
            <strong>CARFAST.cz</strong> — autobazarová platforma s&nbsp;AI importem
            aut, 7 scrapery, 4 jazyky. Custom PHP, zero dependencies.{' '}
            <a href="/blog/carfast-architektura">Technický rozbor tady</a>.
          </li>
          <li>
            A&nbsp;další projekty, které přibývají rychleji, než stíhám psát články.
          </li>
        </ul>

        <h2>Mimo obrazovku</h2>
        <p>
          Jezdím na horském kole. Traily, downhill, pumptracky, bikeparky —
          čím víc bahna, tím líp. Praha a&nbsp;okolí mají překvapivě dobré
          traily a&nbsp;já je znám skoro všechny.
        </p>

        <h2>Proč airepublic.cz</h2>
        <p>
          Protože AI změnila způsob, jakým pracuji. Jako designér jsem celý
          život tvořil vizuálně — teď tvořím i&nbsp;technicky. A&nbsp;chci o&nbsp;tom
          psát v&nbsp;češtině, upřímně, bez marketingového balastu. Recenze nástrojů,
          co jsem reálně testoval. Návody, co jsem reálně použil. Projekty,
          co jsem reálně postavil.
        </p>
        <p>
          Žádný influencer, žádný guru. Jen člověk, co před měsícem objevil
          Claude a&nbsp;teď si neumí představit život bez něj.
        </p>

        <h2>Kontakt</h2>
        <p>
          Máte dotaz, nápad na spolupráci, nebo jen chcete říct ahoj?{' '}
          <a href="mailto:pavel@leadforge.cz">pavel@leadforge.cz</a>
        </p>
      </div>
    </div>
  )
}
