import Link from 'next/link'

import ParticleField from '@/components/site/ParticleField'
import RippleCanvas from '@/components/site/RippleCanvas'
import SiteFooter from '@/components/site/SiteFooter'
import SiteHeader from '@/components/site/SiteHeader'
import LatestTrackBar from '@/components/site/LatestTrackBar'
import { siteLinks } from '@/lib/siteLinks'
import { formatReleaseMonth, latestWork } from '@/lib/works'

const worldCards = [
  {
    title: '青春と、和ロック',
    body: '和楽器とギターは、混ざりきらないまま並べておきます。馴染ませすぎない距離に、あの頃の温度が残るから。',
  },
  {
    title: '言えなかった言葉',
    body: '感情は直接書かずに、雨や駅や水位に預けます。言えなかったことほど、風景のほうが覚えているから。',
  },
  {
    title: '流れる時間',
    body: '終わったことは、終わったままでいい。乗り越えるための曲ではなく、まだ引きずっていていい曲を置いています。',
  },
]

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

        {latestWork ? (
          <LatestTrackBar
            title={latestWork.title}
            meta={formatReleaseMonth(latestWork.publishedAt)}
            videoId={latestWork.videoId}
          />
        ) : null}
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
            overflow: 'hidden',
            letterSpacing: 'var(--tracking)',
          }}
        >
          <div
            aria-hidden="true"
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
            <p style={{ margin: 0, maxWidth: '34em', fontSize: 17, lineHeight: 2.1, color: 'var(--ink-2)', textWrap: 'pretty' }}>
              泣きたいわけじゃないのに、なぜか泣けてしまう夜があります。好きだった人のことを、ふいに思い出してしまう夜も。終わったはずの気持ちほど、ずいぶん経ってから戻ってくる。そういう夜のそばで鳴っている音楽を作っています。
            </p>
          </div>

          <div className="grid-auto" style={{ position: 'relative', gap: 28 }}>
            {worldCards.map((card) => (
              <div key={card.title} className="card" style={{ gap: 22, padding: 28 }}>
                <div className="hatch" style={{ position: 'relative', height: 190 }}>
                  <span
                    className="mono"
                    style={{ position: 'absolute', left: 10, bottom: 9, fontSize: 9, lineHeight: 1, color: 'var(--ink-8)' }}
                  >
                    代表作 MV サムネイル 16:9
                  </span>
                </div>
                <span className="display display--card" style={{ textShadow: 'none' }}>
                  {card.title}
                </span>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.95, color: 'var(--ink-4)' }}>{card.body}</p>
              </div>
            ))}
          </div>

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
