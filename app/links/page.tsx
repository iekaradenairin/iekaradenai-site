import Link from 'next/link'

import RippleCanvas from '@/components/site/RippleCanvas'
import SiteFooter from '@/components/site/SiteFooter'
import { siteLinks } from '@/lib/siteLinks'

/**
 * 名刺のQRコードの飛び先。印刷済みなので、このパスは動かさないこと
 * （リダイレクトにしてもいけない）。
 *
 * 渡す前にひと通り会話しているので、自己紹介の文章は置かない。
 * 名義とリンクだけ。ヘッダーも外してある — ナビの外部リンクが
 * このページの中身とそのまま重複するため。
 */

const channels = [
  {
    eyebrow: 'YOUTUBE',
    title: 'YouTube',
    handle: '@iekaradenai_rin',
    href: siteLinks.youtubeChannel,
  },
  {
    eyebrow: 'NICONICO',
    title: 'ニコニコ動画',
    handle: 'マイページ',
    href: siteLinks.niconico,
  },
]

export default function LinksPage() {
  return (
    <div className="page">
      <RippleCanvas />

      <main
        className="section section--narrow"
        style={{ maxWidth: 640, padding: 'clamp(56px, 12vw, 104px) var(--gutter) clamp(64px, 12vw, 96px)' }}
      >
        <Link
          href={siteLinks.home}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            marginBottom: 'clamp(40px, 7vw, 60px)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- 名義ロゴ */}
          <img
            src="/name.png"
            alt="家から出ない倫"
            style={{ display: 'block', height: 'clamp(56px, 13vw, 86px)', width: 'auto', opacity: 0.95 }}
          />
          <span className="mono" style={{ fontSize: 11, lineHeight: 1, color: 'var(--ink-6)', letterSpacing: '0.18em' }}>
            MUSIC CREATOR
          </span>
        </Link>

        <div className="stack" style={{ gap: 16 }}>
          {/* X が主導線なので1枚だけ大きく、枠も明るくして先に目に入るようにする */}
          <a
            href={siteLinks.x}
            target="_blank"
            rel="noopener noreferrer"
            className="link-card link-card--primary"
          >
            <span className="eyebrow" style={{ fontSize: 10, letterSpacing: '0.2em' }}>
              X
            </span>
            <span className="display display--panel" style={{ textShadow: 'none' }}>
              @iekaradenai_Rin
            </span>
            <span className="link-card__go" aria-hidden="true">
              →
            </span>
          </a>

          <div
            className="grid-auto"
            style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,220px),1fr))', gap: 16 }}
          >
            {channels.map((c) => (
              <a
                key={c.eyebrow}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-card"
              >
                <span className="eyebrow eyebrow--small">{c.eyebrow}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-1)' }}>{c.title}</span>
                <span className="mono" style={{ fontSize: 11, lineHeight: 1, color: 'var(--ink-6)' }}>
                  {c.handle}
                </span>
                <span className="link-card__go" aria-hidden="true">
                  →
                </span>
              </a>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
