'use client'

import { useEffect, useRef, useState } from 'react'

import { splitWorkTitle, youtubeEmbedUrl, type Work } from '@/lib/works'

/**
 * 作品カードの「水底から浮上する」演出。
 *
 * 深さ・傾き・横ゆれ・待ち時間をカードごとに毎回振り直すので、リロードのたび
 * 浮き上がり方が変わる。決まった順に整列させないのが狙いなので、値は固定しない。
 *
 * IntersectionObserver は最適化にすぎない。一気にスクロールして飛ばされたカードが
 * 沈んだままになるのを防ぐため、別に取りこぼしの掃除も回している。
 */
function roll() {
  const r = Math.random
  return {
    z: -420 - r() * 340,
    y: 70 + r() * 90,
    x: (r() - 0.5) * 70,
    rx: 44 + r() * 26,
    rz: (r() - 0.5) * 8,
    blur: 7 + r() * 6,
    delay: Math.round(r() * 620),
    dur: 1350 + Math.round(r() * 750),
  }
}

export function WorksDeck({ works }: { works: Work[] }) {
  const deck = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(-1)

  useEffect(() => {
    const el = deck.current
    if (!el) return

    const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-card]'))
    if (!cards.length) return

    // 動きを減らす設定なら、沈めずそのまま出す
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const shown = new WeakSet<HTMLElement>()
    const timers: number[] = []

    for (const card of cards) {
      const v = roll()
      card.dataset.delay = String(v.delay)
      card.style.transition = 'none'
      card.style.transform =
        `translate3d(${v.x.toFixed(1)}px,${v.y.toFixed(1)}px,${v.z.toFixed(0)}px)` +
        ` rotateX(${v.rx.toFixed(1)}deg) rotateZ(${v.rz.toFixed(2)}deg) scale(.94)`
      card.style.opacity = '0'
      card.style.filter = `blur(${v.blur.toFixed(1)}px)`
      void card.offsetWidth // 上の初期状態を確定させてから transition を張る
      card.style.transition =
        `transform ${v.dur}ms cubic-bezier(.17,.72,.2,1),` +
        ` opacity ${Math.round(v.dur * 0.62)}ms ease-out,` +
        ` filter ${Math.round(v.dur * 0.7)}ms ease-out`
    }

    const show = (card: HTMLElement) => {
      if (shown.has(card)) return
      shown.add(card)
      timers.push(
        window.setTimeout(() => {
          card.style.transform = 'translate3d(0,0,0)'
          card.style.opacity = '1'
          card.style.filter = 'none'
        }, Number(card.dataset.delay) || 0),
      )
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting || e.boundingClientRect.bottom < 0) show(e.target as HTMLElement)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    cards.forEach((card) => io.observe(card))

    // 取りこぼしの掃除。IO が拾えなかったカードも必ず浮かせる
    const sweep = window.setInterval(() => {
      const vh = window.innerHeight
      for (const card of cards) {
        if (shown.has(card)) continue
        if (card.getBoundingClientRect().top < vh * 0.92) show(card)
      }
    }, 150)

    // 初期表示ぶんはスクロールを待たずに始める
    const kick = requestAnimationFrame(() => {
      for (const card of cards) {
        const r = card.getBoundingClientRect()
        if (r.top < window.innerHeight * 0.92 && r.bottom > 0) show(card)
      }
    })

    return () => {
      io.disconnect()
      window.clearInterval(sweep)
      cancelAnimationFrame(kick)
      timers.forEach((t) => window.clearTimeout(t))
    }
  }, [works.length])

  return (
    <div ref={deck} className="deck">
      {works.map((work, i) => {
        const live = playing === i
        const { title, credit } = splitWorkTitle(work.title)
        return (
          <div key={work.videoId} data-card className="deck__card">
            <div
              className="card card--interactive"
              onClick={() => setPlaying((p) => (p === i ? -1 : i))}
              style={{ gap: 14, padding: '14px 14px 20px', transformStyle: 'preserve-3d' }}
            >
              <div
                className="hatch"
                style={{ position: 'relative', aspectRatio: '16 / 9', overflow: 'hidden' }}
              >
                {live ? (
                  <iframe
                    src={youtubeEmbedUrl(work.videoId)}
                    title={work.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                  />
                ) : (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element -- YouTube 側のサムネイル。next/image の最適化対象にしない */}
                    <img
                      src={`https://i.ytimg.com/vi/${work.videoId}/hqdefault.jpg`}
                      alt=""
                      loading="lazy"
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                    />
                    <span
                      className="mono"
                      style={{ position: 'absolute', left: 10, bottom: 9, fontSize: 9, lineHeight: 1, color: 'var(--ink-1)', textShadow: '0 1px 4px rgba(0,0,0,.8)' }}
                    >
                      クリックで読み込み
                    </span>
                    <span
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        width: 44,
                        height: 44,
                        margin: '-22px 0 0 -22px',
                        borderRadius: '50%',
                        border: '1px solid rgba(255,255,255,.35)',
                        background: 'rgba(5,10,18,.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        color: 'var(--ink-1)',
                      }}
                    >
                      ▶
                    </span>
                  </>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '0 4px' }}>
                <span className="display display--card" style={{ fontSize: 19, textShadow: 'none' }}>
                  {title}
                </span>
                {credit ? <span className="deck__credit">{credit}</span> : null}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default WorksDeck
