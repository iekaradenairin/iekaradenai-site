'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import type { Work } from '@/lib/works'
import type { Cover } from '@/lib/covers'
import { siteLinks } from '@/lib/siteLinks'
import RippleCanvas from './RippleCanvas'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
import WorksDeck from './WorksDeck'

export default function WorksExperience({ works, covers, coversPlaylistUrl, children }: {
  works: Work[]
  covers: Cover[]
  coversPlaylistUrl: string | null
  children: ReactNode
}) {
  const pathname = usePathname()
  const isCovers = pathname.replace(/\/$/, '') === siteLinks.covers
  const weather = isCovers ? 'sunshower' : 'night'
  const items = isCovers ? covers : works
  const playlist = isCovers ? coversPlaylistUrl : siteLinks.youtubePlaylist

  return (
    <div className="page works-world" data-weather={weather}>
      <div className="works-world__daylight" aria-hidden="true" />
      <div key={weather} className={`works-world__leak works-world__leak--${weather}`} aria-hidden="true" />
      <RippleCanvas tone={weather} />
      <SiteHeader current="works" />
      <section className="section works-intro">
        <nav className="works-switch" aria-label="作品の種類">
          <Link href={siteLinks.works} scroll={false} aria-current={!isCovers ? 'page' : undefined}>
            <span className="works-switch__symbol" aria-hidden="true">☾</span>オリジナル作品
          </Link>
          <Link href={siteLinks.covers} scroll={false} aria-current={isCovers ? 'page' : undefined}>
            <span className="works-switch__symbol" aria-hidden="true">☼</span>歌ってくれた作品
          </Link>
        </nav>
        <div key={weather} className="stack works-intro__copy" aria-live="polite">
          <span className="eyebrow">{isCovers ? 'COVERS — 歌ってくれた作品' : 'WORKS — 作品'}</span>
          <h1 className="display display--page">
            {isCovers ? <>あなたの声で、<br />また違う景色になる。</> : <>紡いできた作品たち。<br />全部に大切な想いを込めています。</>}
          </h1>
          <p className="lead works-intro__lead">
            {isCovers ? <>作った曲に、新しい息を吹き込んでくれた声たち。<br />歌ってくれて、ありがとう。</> : '順番に聴く必要はありません。気になる声に耳を傾けてみてください。'}
          </p>
        </div>
      </section>
      <section className="section section--wide works-list" aria-label={isCovers ? '歌ってくれた作品一覧' : 'オリジナル作品一覧'}>
        {items.length ? (
          <WorksDeck key={weather} works={items} variant={isCovers ? 'covers' : 'originals'} />
        ) : (
          <div className="works-empty">
            <span className="works-empty__symbol" aria-hidden="true">{isCovers ? '☼' : '☾'}</span>
            <h2 className="display display--panel">{isCovers ? 'ここから、また違う声で。' : '作品を読み込めませんでした'}</h2>
            <p className="body-sm">{isCovers ? '歌ってくれた作品を、少しずつここに集めていきます。' : 'YouTubeの再生リストから直接ご覧ください。'}</p>
            {playlist ? <a className="link-quiet" href={playlist} target="_blank" rel="noopener noreferrer">YouTubeの再生リストを見る ↗</a> : null}
          </div>
        )}
      </section>
      {children}
      <SiteFooter />
    </div>
  )
}
