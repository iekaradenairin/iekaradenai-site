import Link from 'next/link'

import SiteFooter from '@/components/site/SiteFooter'
import SiteHeader from '@/components/site/SiteHeader'
import { siteLinks } from '@/lib/siteLinks'

export default function NotFound() {
  return (
    <div className="page">
      <SiteHeader />

      <section className="section section--narrow" style={{ padding: 'clamp(72px, 10vw, 120px) var(--gutter) 110px' }}>
        <div className="stack" style={{ gap: 26 }}>
          <span className="eyebrow eyebrow--dim">404 — NOT FOUND</span>
          <h1 className="display display--page">
            そのページは
            <br />
            見つかりませんでした。
          </h1>
          <p className="lead" style={{ maxWidth: '30em' }}>
            移動したか、なくなったのかもしれません。トップか作品ページからたどってみてください。
          </p>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 18, paddingTop: 6 }}>
            <Link href={siteLinks.home} className="btn-solid">
              トップへ戻る
            </Link>
            <Link href={siteLinks.works} className="link-quiet">
              作品を見る →
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
