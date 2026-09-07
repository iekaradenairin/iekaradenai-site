import RippleCanvas from '@/components/site/RippleCanvas'
import SiteFooter from '@/components/site/SiteFooter'
import SiteHeader from '@/components/site/SiteHeader'
import { siteLinks } from '@/lib/siteLinks'

/**
 * 名刺のQRコードの飛び先。印刷済みなので、このパスは動かさないこと
 * （リダイレクトにしてもいけない）。
 *
 * 主目的は X への誘導。ただし曲を聴きたい人がそのまま離脱しないよう、
 * YouTube とニコニコも一段下に並べて押しやすくしてある。
 */

const channels = [
  {
    eyebrow: 'YOUTUBE',
    title: 'YouTube',
    body: 'オリジナル曲のMVを公開しています。まずはここから。',
    href: siteLinks.youtubeChannel,
    action: 'チャンネルを見る →',
  },
  {
    eyebrow: 'NICONICO',
    title: 'ニコニコ動画',
    body: '同じ曲をニコニコ動画にも上げています。',
    href: siteLinks.niconico,
    action: 'マイページを見る →',
  },
]

export default function LinksPage() {
  return (
    <div className="page">
      <RippleCanvas />
      <SiteHeader />

      <section className="section section--narrow" style={{ padding: 'clamp(56px, 8vw, 92px) var(--gutter) 56px' }}>
        <div className="stack" style={{ gap: 24 }}>
          <span className="eyebrow">LINKS — リンク</span>
          <h1 className="display display--page">
            見つけてくれて、
            <br />
            ありがとうございます。
          </h1>
          <p className="lead" style={{ maxWidth: '30em' }}>
            和ロックとポップスのあいだで、言えなかった言葉を情景に託して曲を作っています。
            よければ、覗いていってください。
          </p>
        </div>
      </section>

      {/* X を主導線にするので、1枚だけ大きく置く */}
      <section className="section section--narrow" style={{ padding: '0 var(--gutter) 34px' }}>
        <div className="panel" style={{ gap: 28 }}>
          <div className="stack" style={{ gap: 12, maxWidth: '30em' }}>
            <span className="eyebrow" style={{ fontSize: 10, letterSpacing: '0.2em' }}>
              X
            </span>
            <span className="display display--panel" style={{ textShadow: 'none' }}>
              いちばん反応が早い場所です
            </span>
            <p className="body-xs">
              制作の途中経過や新曲の告知はここに流しています。ご相談のDMもこちらからどうぞ。
            </p>
          </div>
          <a
            href={siteLinks.x}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-solid"
            style={{ flex: 'none' }}
          >
            Xを見る
          </a>
        </div>
      </section>

      <section className="section section--narrow" style={{ padding: '0 var(--gutter) 96px' }}>
        <div
          className="grid-auto"
          style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,280px),1fr))', gap: 24 }}
        >
          {channels.map((c) => (
            <div key={c.eyebrow} className="card card--hoverable" style={{ gap: 18, padding: '30px 28px' }}>
              <span className="eyebrow" style={{ fontSize: 10, letterSpacing: '0.2em' }}>
                {c.eyebrow}
              </span>
              <span className="display display--panel" style={{ textShadow: 'none' }}>
                {c.title}
              </span>
              <p className="body-sm">{c.body}</p>
              <a href={c.href} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                {c.action}
              </a>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
