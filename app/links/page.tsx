import Link from 'next/link'

import LinkCards from '@/components/site/LinkCards'
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
export default function LinksPage() {
  return (
    <div className="page">
      <RippleCanvas />

      <main
        className="section section--narrow"
        style={{
          maxWidth: 640,
          padding: 'clamp(56px, 12vw, 104px) var(--gutter) clamp(64px, 12vw, 96px)',
          // カードが奥から浮上するので奥行きを与える
          perspective: 1200,
          perspectiveOrigin: '50% 40%',
        }}
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

        <LinkCards />
      </main>

      <SiteFooter />
    </div>
  )
}
