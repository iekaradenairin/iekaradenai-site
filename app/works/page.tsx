import RippleCanvas from '@/components/site/RippleCanvas'
import SiteFooter from '@/components/site/SiteFooter'
import SiteHeader from '@/components/site/SiteHeader'
import WorksDeck from '@/components/site/WorksDeck'
import { siteLinks } from '@/lib/siteLinks'
import { works } from '@/lib/works'

export default function WorksPage() {
  return (
    <div className="page">
      <RippleCanvas />
      <SiteHeader current="works" />

      <section className="section" style={{ maxWidth: 1100, margin: 0, padding: 'clamp(56px, 8vw, 92px) var(--gutter) 40px' }}>
        <div className="stack" style={{ gap: 24 }}>
          <span className="eyebrow">WORKS — 作品</span>
          <h1 className="display display--page">
            紡いできた作品たち。
            <br />
            全部に大切な想いを込めています。
          </h1>
          <p className="lead" style={{ maxWidth: '32em' }}>
            順番に聴く必要はありません。気になる声に耳を傾けてみてください。
          </p>
        </div>
      </section>

      <section
        className="section section--wide"
        style={{ padding: '20px var(--gutter) 120px', perspective: 1500, perspectiveOrigin: '50% 40%' }}
      >
        {works.length ? (
          <WorksDeck works={works} />
        ) : (
          <div className="panel" style={{ justifyContent: 'flex-start' }}>
            <div className="stack" style={{ gap: 10, maxWidth: '32em' }}>
              <span className="display display--panel" style={{ textShadow: 'none' }}>
                作品を読み込めませんでした
              </span>
              <p className="body-xs">
                再生リストから曲を取得できていません。YouTube の再生リストから直接ご覧ください。
              </p>
            </div>
            <a href={siteLinks.youtubePlaylist} target="_blank" rel="noopener noreferrer" className="btn-solid">
              再生リストを開く
            </a>
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  )
}
