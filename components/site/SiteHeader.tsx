import Link from 'next/link'

import { siteLinks } from '@/lib/siteLinks'

export type NavKey = 'top' | 'works' | 'instrumentals' | 'audiocheck' | 'order'

/**
 * デザイン側は現在ページの強調を componentDidMount 後に JS で塗っていたが、
 * ここでは現在ページが描画時点で分かるので data-current で静的に出す。
 */
export function SiteHeader({ current }: { current?: NavKey }) {
  const on = (key: NavKey) => (current === key ? 'true' : undefined)

  return (
    <header className="site-header">
      <Link href={siteLinks.home} className="site-header__brand">
        {/* eslint-disable-next-line @next/next/no-img-element -- 名義ロゴ。next/image は静的エクスポートでの最適化を伴わないため素の img で足りる */}
        <img src="/name.png" alt="家から出ない倫" className="site-header__mark" />
        <span
          className="mono"
          style={{ fontSize: 11, lineHeight: 1, color: 'var(--ink-6)', letterSpacing: '0.18em' }}
        >
          MUSIC CREATOR
        </span>
      </Link>

      <nav className="site-header__nav">
        <Link href={siteLinks.home} className="site-header__link" data-current={on('top')}>
          トップ
        </Link>
        <Link href={siteLinks.works} className="site-header__link" data-current={on('works')}>
          作品
        </Link>

        <span className="site-header__divider" aria-hidden="true" />

        <div className="site-header__externals">
          <a href={siteLinks.youtubeChannel} target="_blank" rel="noopener noreferrer">
            YouTube
          </a>
          <a href={siteLinks.x} target="_blank" rel="noopener noreferrer">
            X
          </a>
          <a href={siteLinks.niconico} target="_blank" rel="noopener noreferrer">
            niconico
          </a>
        </div>

        <Link href={siteLinks.order} className="site-header__order" data-current={on('order')}>
          依頼
        </Link>
      </nav>
    </header>
  )
}

export default SiteHeader
