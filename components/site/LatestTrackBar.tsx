'use client'

import { useEffect, useRef } from 'react'

import { youtubeThumbnailUrl, youtubeWatchUrl } from '@/lib/works'

/**
 * ヒーロー下端の「最新作」バー。
 * 右側は音の波形ではなく、奥へ続く水面のワイヤーがゆっくり呼吸するだけの装飾。
 * （実際の音を鳴らしていないので、解析しているように見せない）
 */
export function LatestTrackBar({
  title,
  meta,
  videoId,
}: {
  title: string
  meta: string
  videoId: string
}) {
  const viz = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = viz.current
    if (!c) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = c.getContext('2d')
    if (!ctx) return

    let raf = 0
    let prev = 0
    let t = 0

    const frame = (now: number) => {
      const dt = Math.min(0.05, prev ? (now - prev) / 1000 : 0.016)
      prev = now
      t += dt

      const w = c.clientWidth
      const h = c.clientHeight
      if (w && h) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
          c.width = Math.round(w * dpr)
          c.height = Math.round(h * dpr)
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, w, h)

        const rows = 7
        for (let j = 0; j < rows; j++) {
          const d = j / (rows - 1)
          const y0 = h * (0.18 + 0.68 * d)
          const a = h * 0.16 * (1 - d * 0.55)
          const step = Math.max(4, w / 60)
          ctx.beginPath()
          for (let x = 0; x <= w; x += step) {
            const ph = (x / w) * 4.4 + t * (0.42 - d * 0.16) - j * 0.55
            const y = y0 - Math.sin(ph) * a * (0.62 + 0.38 * Math.sin(t * 0.26 + j * 0.6))
            if (x) ctx.lineTo(x, y)
            else ctx.moveTo(x, y)
          }
          ctx.strokeStyle = `rgba(143,180,255,${(0.14 + 0.4 * (1 - d)).toFixed(2)})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        padding: '0 var(--gutter)',
        borderTop: '1px solid rgba(255,255,255,.13)',
        background: 'rgba(5,10,18,.55)',
        backdropFilter: 'blur(6px)',
        zIndex: 7,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 20, minHeight: 112, padding: '11px 0', minWidth: 0 }}>
        <a
          href={youtubeWatchUrl(videoId)}
          target="_blank"
          rel="noopener noreferrer"
          className="hatch"
          style={{
            position: 'relative',
            width: 160,
            height: 90,
            flex: 'none',
            border: '1px solid rgba(255,255,255,.14)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
          aria-label={`最新作「${title}」を YouTube で見る`}
        >
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url("${youtubeThumbnailUrl(videoId)}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.82,
            }}
          />
          <span
            aria-hidden="true"
            style={{
              position: 'relative',
              width: 0,
              height: 0,
              borderLeft: '14px solid rgba(255,255,255,.92)',
              borderTop: '9px solid transparent',
              borderBottom: '9px solid transparent',
              animation: 'om-pulse 2.6s ease-in-out infinite',
            }}
          />
        </a>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, minWidth: 0, flex: '0 1 210px', overflow: 'hidden' }}>
          <span className="mono" style={{ fontWeight: 700, fontSize: 10, lineHeight: 1, letterSpacing: '0.18em', color: 'var(--accent)' }}>
            最新作 — LATEST TRACK
          </span>
          <span style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.4 }}>{title}</span>
          {meta ? (
            <span className="mono" style={{ fontSize: 11, lineHeight: 1, color: 'var(--ink-6)' }}>
              {meta}
            </span>
          ) : null}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '1 1 240px', minWidth: 0 }}>
          <canvas
            ref={viz}
            aria-hidden="true"
            style={{
              flex: '1 1 auto',
              minWidth: 0,
              width: '100%',
              height: 64,
              display: 'block',
              WebkitMaskImage: 'linear-gradient(to right,transparent 0,#000 18%,#000 82%,transparent 100%)',
              maskImage: 'linear-gradient(to right,transparent 0,#000 18%,#000 82%,transparent 100%)',
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default LatestTrackBar
