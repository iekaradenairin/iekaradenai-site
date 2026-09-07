import Link from 'next/link'

import { siteLinks } from '@/lib/siteLinks'

const COPYRIGHT = '© 2026 家から出ない倫 / iekaradenai Rin'

/**
 * デザイン側はトップだけ大きいフッター、他ページは1行の細いフッター、という
 * 使い分けだったのでバリアントにしてある。
 */
export function SiteFooter({ variant = 'slim' }: { variant?: 'slim' | 'full' }) {
  if (variant === 'full') return <FullFooter />

  return (
    <footer className="site-footer site-footer--slim">
      <Link href={siteLinks.home} style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
        ← トップへ戻る
      </Link>

      <div className="site-footer__nav">
        <Link href={siteLinks.works}>作品</Link>
        <Link href={siteLinks.instrumentals}>オフボーカル</Link>
        <Link href={siteLinks.audioCheck}>音声データチェック</Link>
        <Link href={siteLinks.order}>依頼</Link>
      </div>

      <span style={{ whiteSpace: 'nowrap' }}>{COPYRIGHT}</span>
    </footer>
  )
}

function FullFooter() {
  return (
    <footer className="site-footer site-footer--full">
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 40,
          marginBottom: 52,
        }}
      >
        <div className="stack" style={{ gap: 14, maxWidth: '30em' }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- 名義ロゴ */}
          <img
            src="/name.png"
            alt="家から出ない倫"
            style={{ display: 'block', height: 72, width: 'auto', alignSelf: 'flex-start', objectFit: 'contain', opacity: 0.9 }}
          />
          <span className="mono" style={{ fontSize: 11, lineHeight: 1, color: 'var(--ink-8)', letterSpacing: '0.18em' }}>
            MUSIC CREATOR
          </span>
          <p style={{ margin: '6px 0 0', fontSize: 13, lineHeight: 2, color: 'var(--ink-3)' }}>
            夜ひとりのときに聴く曲を作っています。言葉にならなかった思いも、ずっと消えない記憶も、全部音楽にのせて。
          </p>
          <p style={{ margin: 0, fontSize: 12, lineHeight: 2, color: 'var(--ink-8)' }}>
            MIX・作曲のご依頼もお受けしています。ご相談は Googleフォーム、または X のDMから。
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px 64px' }}>
          <div className="site-footer__group">
            <span className="eyebrow eyebrow--small">サイト</span>
            <Link href={siteLinks.works}>作品</Link>
            <Link href={siteLinks.instrumentals}>オフボーカル配布</Link>
          </div>

          <div className="site-footer__group">
            <span className="eyebrow eyebrow--small">ご依頼の方へ</span>
            <Link href={siteLinks.order}>MIX・作曲のご依頼</Link>
            <Link href={siteLinks.audioCheck}>音声データチェック</Link>
          </div>

          <div className="site-footer__group">
            <span className="eyebrow eyebrow--small">外部リンク</span>
            <a href={siteLinks.youtubeChannel} target="_blank" rel="noopener noreferrer">
              YouTube
            </a>
            <a href={siteLinks.niconico} target="_blank" rel="noopener noreferrer">
              niconico
            </a>
            <a href={siteLinks.piapro} target="_blank" rel="noopener noreferrer">
              ピアプロ
            </a>
            <a href={siteLinks.x} target="_blank" rel="noopener noreferrer">
              Xで相談する
            </a>
            <a href={siteLinks.googleForm} target="_blank" rel="noopener noreferrer">
              Googleフォーム
            </a>
          </div>
        </div>
      </div>

      <div className="site-footer__legal">
        <span>{COPYRIGHT}</span>
      </div>
    </footer>
  )
}

export default SiteFooter
