import RippleCanvas from '@/components/site/RippleCanvas'
import SiteFooter from '@/components/site/SiteFooter'
import SiteHeader from '@/components/site/SiteHeader'
import { siteLinks } from '@/lib/siteLinks'

const sources = [
  {
    eyebrow: 'PIAPRO',
    title: 'ピアプロ',
    body: '全曲のオフボーカルをまとめて置いています。曲を探すならこちらから。',
    href: siteLinks.piapro,
    action: 'ピアプロを見る →',
  },
  {
    eyebrow: 'DRIVE',
    title: 'Google ドライブ',
    body: '同じものを共有フォルダにも置いています。まとめて落としたいときはこちら。',
    href: siteLinks.driveInstrumentals,
    action: 'フォルダを開く →',
  },
]

const terms = [
  {
    title: 'してもらって嬉しいこと',
    body: '歌ってみた・演奏動画の投稿、配信での使用、練習や録音の練習台。曲名と作者名をどこかに書いてもらえたら十分です。',
  },
  {
    title: 'ひとこと相談してほしいこと',
    body: 'CDやサブスクなど、販売をともなう形での使用。イベントやお店での再生。だめという話ではなく、把握しておきたいだけです。',
  },
  {
    title: '遠慮してほしいこと',
    body: '音源そのものの再配布や販売、自作としての公開。誰かを傷つける目的での使用も、できれば避けてください。',
  },
]

export default function InstrumentalsPage() {
  return (
    <div className="page">
      <RippleCanvas />
      <SiteHeader current="instrumentals" />

      <section className="section" style={{ padding: 'clamp(56px, 8vw, 92px) var(--gutter) 64px' }}>
        <div className="stack" style={{ gap: 24 }}>
          <span className="eyebrow">INSTRUMENTALS — オフボーカル</span>
          <h1 className="display display--page">
            この曲を
            <br />
            あなたの声で。
          </h1>
          <p className="lead" style={{ maxWidth: '32em' }}>
            オフボーカル音源を配布しています。歌ってみた、演奏、練習用に、どうぞ自由に使ってください。あなたの声でもう一度この作品に息を吹き込んでいただけたら本当に嬉しいです。
          </p>
        </div>
      </section>

      <section className="section" style={{ padding: '0 var(--gutter) 96px' }}>
        <div className="stack" style={{ gap: 20 }}>
          <span className="eyebrow eyebrow--small">音源のある場所</span>

          <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))', gap: '26px 34px' }}>
            {sources.map((s) => (
              <div key={s.eyebrow} className="card card--hoverable" style={{ gap: 20, padding: '32px 30px' }}>
                <span className="eyebrow" style={{ fontSize: 10, letterSpacing: '0.2em' }}>
                  {s.eyebrow}
                </span>
                <span className="display display--panel" style={{ textShadow: 'none' }}>
                  {s.title}
                </span>
                <p className="body-sm">{s.body}</p>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  {s.action}
                </a>
              </div>
            ))}
          </div>

          <p className="note" style={{ marginTop: 6 }}>
            見つからない曲や、キー変更・ガイドメロディ入りのご希望があれば聞いてみてください。対応できる場合もあります。
          </p>
        </div>
      </section>

      <section className="section" style={{ padding: '0 var(--gutter) 96px' }}>
        <div className="stack" style={{ gap: 34 }}>
          <span className="eyebrow eyebrow--dim">TERMS — 使うときのお願い</span>
          <div className="grid-auto grid-auto--md">
            {terms.map((t) => (
              <div key={t.title} className="rule">
                <span className="label">{t.title}</span>
                <p className="body-xs">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ padding: '0 var(--gutter) 110px' }}>
        <div className="panel">
          <div className="stack" style={{ gap: 10, maxWidth: '32em' }}>
            <span className="display display--card" style={{ textShadow: 'none' }}>
              歌ってくれたら聴きに行きます
            </span>
            <p className="body-xs">
              投稿したらXで教えてください。連絡をもらえたら必ず聴きに行きます。使い方の質問や、音源の要望もこちらから。
            </p>
            <p style={{ margin: 0, fontSize: 11, lineHeight: 1.9, color: 'var(--ink-8)' }}>
              ※必ず聴きに行きますが、感想やリポストをお約束するものではありません。
            </p>
          </div>
          <a href={siteLinks.x} target="_blank" rel="noopener noreferrer" className="btn-solid" style={{ flex: 'none' }}>
            Xで知らせる
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
