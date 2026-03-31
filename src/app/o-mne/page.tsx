import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'O mně',
  description: 'Kdo stojí za airepublic.cz — průvodcem světem umělé inteligence.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-24 pb-16">
      <header className="mb-12">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">O mně</h1>
      </header>
      <div className="prose">
        <p>
          Jsem nadšenec do umělé inteligence a technologií. airepublic.cz jsem
          založil jako místo, kde sdílím své zkušenosti s AI nástroji, píšu
          praktické návody a dokumentuji své vibe&nbsp;coding projekty.
        </p>
        <p>
          Věřím, že AI změní způsob, jakým pracujeme, tvoříme a přemýšlíme.
          Na tomto webu najdete poctivé recenze nástrojů, srozumitelné návody
          pro začátečníky i pokročilé, a reálné projekty, které ukazují, co
          všechno se dá s&nbsp;AI vytvořit.
        </p>
        <h2>Co tu najdete</h2>
        <ul>
          <li>
            <strong>Recenze AI nástrojů</strong> — podrobné hodnocení s klady,
            zápory a cenami
          </li>
          <li>
            <strong>Blog</strong> — novinky ze světa AI, návody a praktické tipy
          </li>
          <li>
            <strong>Vibe coding projekty</strong> — reálné aplikace vytvořené
            s&nbsp;pomocí AI od nápadu po produkci
          </li>
        </ul>
        <h2>Kontakt</h2>
        <p>
          Máte dotaz nebo nápad na spolupráci? Napište mi na{' '}
          <a href="mailto:pavel@leadforge.cz">pavel@leadforge.cz</a>.
        </p>
      </div>
    </div>
  )
}
