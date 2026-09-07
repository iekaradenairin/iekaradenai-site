import Link from 'next/link'

import ParticleField from '@/components/site/ParticleField'
import RippleCanvas from '@/components/site/RippleCanvas'
import SiteFooter from '@/components/site/SiteFooter'
import SiteHeader from '@/components/site/SiteHeader'
import LatestTrackBar from '@/components/site/LatestTrackBar'
import WorldDeck, { type WorldCard } from '@/components/site/WorldDeck'
import { siteLinks } from '@/lib/siteLinks'
import { formatReleaseMonth, latestWork, splitWorkTitle } from '@/lib/works'

// 世界観セクションの3枚は手で選んで手で書くもの。見出しは曲名ではなく
// 「その曲が何の話か」を置いている。作品一覧（再生リスト由来）とは別管理。
const worldCards: WorldCard[] = [
  {
    videoId: 'FBlDIdRFPnk',
    title: 'あの双子座に願いを',
    body: '二人の出会いと別れを描く物語。あのとき過ごした思い出は、いつになっても風化しない。星を見たら鮮明に思い出せる。',
  },
  {
    videoId: 'wfamkctKfUw',
    title: '世界を旅する…そんな夢',
    body: '静かに広がる少し暗くて冷たい世界。叶う叶わないは結果のお話。いつまでも想っていたいのも別のお話。',
  },
  {
    videoId: '6TGFCqzekSU',
    title: '花火の裏、隠れる想い',
    body: '言葉にできないこともある。そして言葉にしても伝わらないときもあるかもしれない。それでもそれは後悔じゃない。',
  },
]

/** ヒーロー下端のバーは1行しか出せないので、年月と歌唱名を中黒でつないで meta に入れる */
function LatestTrack({ work }: { work: NonNullable<typeof latestWork> }) {
  const { title, credit } = splitWorkTitle(work.title)
  const meta = [formatReleaseMonth(work.publishedAt), credit].filter(Boolean).join(' · ')
  return <LatestTrackBar title={title} meta={meta} videoId={work.videoId} />
}

export default function TopPage() {
  return (
    <>
      {/* --- ヒーロー：粒子フィールドは右側だけ。水紋は下の world セクション側に敷く --- */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          minWidth: 0,
          minHeight: 'min(920px, 100svh)',
          overflow: 'hidden',
          background: 'var(--bg-hero)',
          color: '#fff',
          letterSpacing: 'var(--tracking)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: -200,
            bottom: -300,
            width: 900,
            height: 900,
            borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(0,0,110,.14) 0%,rgba(0,0,0,0) 70%)',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: -120,
            top: -180,
            width: 780,
            height: 780,
            borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(12,40,110,.18) 0%,rgba(0,0,0,0) 68%)',
          }}
        />

        <div
          aria-hidden="true"
          style={{ position: 'absolute', right: 0, top: 0, width: 'min(660px, 55%)', height: '100%' }}
        >
          <ParticleField />
        </div>

        <SiteHeader current="top" />

        <div
          style={{
            position: 'relative',
            padding: 'clamp(56px, 8vw, 104px) var(--gutter) 0',
            display: 'flex',
            flexDirection: 'column',
            gap: 34,
            maxWidth: 760,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
            <span
              className="mono"
              style={{
                fontWeight: 700,
                fontSize: 11,
                lineHeight: 1,
                letterSpacing: '0.22em',
                color: '#fff',
                background: 'var(--navy)',
                padding: '7px 12px',
              }}
            >
              VOCALOID PRODUCER
            </span>
            <span
              className="mono"
              style={{ fontSize: 11, lineHeight: 1, letterSpacing: '0.16em', color: 'var(--ink-6)' }}
            >
              SYNTHESIZER V — ORIGINAL SONGS
            </span>
          </div>

          <h1 className="display display--hero">
            言えない言葉は
            <br />
            夜に浮かんでくる。
          </h1>

          <p style={{ margin: 0, maxWidth: '26em', fontSize: 15, lineHeight: 2.05, color: 'var(--ink-2)' }}>
            言葉にできなかったものを
            <br />
            星や花、水の底に預けて曲にしています。
            <br />
            夜のいちばん静かな時間に、そっと届いて。
          </p>

          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 22, paddingTop: 12 }}>
            <a
              href={siteLinks.youtubePlaylist}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-solid btn-solid--hero"
            >
              最新作を聴く
            </a>
            <a href={siteLinks.youtubeChannel} target="_blank" rel="noopener noreferrer" className="link-quiet" style={{ fontSize: 14 }}>
              これまでの曲 →
            </a>
          </div>
        </div>

        <div style={{ flex: '1 1 auto', minHeight: 40 }} />

        {latestWork ? <LatestTrack work={latestWork} /> : null}
      </div>

      {/* --- 以降が水紋の対象範囲 --- */}
      <div className="page" style={{ minHeight: 0 }}>
        <RippleCanvas />

        <section
          id="world"
          style={{
            position: 'relative',
            boxSizing: 'border-box',
            padding: 'clamp(72px, 10vw, 130px) var(--gutter) clamp(80px, 10vw, 138px)',
            background: 'var(--bg)',
            color: '#fff',
            letterSpacing: 'var(--tracking)',
            // カードが水底から浮上する（Z方向に動く）ので奥行きを与える。
            // セクション自体は clip しない — 浮上途中のカードが切れるため
            perspective: 1500,
            perspectiveOrigin: '50% 40%',
          }}
        >
          {/* 装飾の光はセクション外へはみ出すので、ここだけで切る */}
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: -260,
                width: 900,
                height: 900,
                marginLeft: -450,
                borderRadius: '50%',
                background: 'radial-gradient(circle,rgba(0,0,115,.24) 0%,rgba(0,0,0,0) 68%)',
              }}
            />
          </div>

          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 34,
              textAlign: 'center',
              marginBottom: 'clamp(64px, 8vw, 104px)',
            }}
          >
            <span className="eyebrow">WORLD — 世界観</span>
            <h2 className="display display--world">
              沈んだままの記憶ほど、
              <br />
              明るく見える。
            </h2>
            {/* ヒーローの段落と同じ 15px / 行間2.05。デザイン原本は17pxだったが、
                スマホ幅だと本文としては大きすぎた */}
            <p className="lead" style={{ maxWidth: '34em' }}>
              泣きたいわけじゃないのに、なぜか泣けてしまう夜があります。好きだった人のことを、ふいに思い出してしまう夜も。終わったはずの気持ちほど、ずいぶん経ってから戻ってくる。そういう夜のそばで鳴っている音楽を作っています。
            </p>
          </div>

          <WorldDeck cards={worldCards} />

          <div style={{ position: 'relative', marginTop: 56, display: 'flex', justifyContent: 'center' }}>
            <Link href={siteLinks.works} className="btn-ghost" style={{ alignSelf: 'auto' }}>
              作品をすべて見る →
            </Link>
          </div>
        </section>

        <SiteFooter variant="full" />
      </div>
    </>
  )
}
