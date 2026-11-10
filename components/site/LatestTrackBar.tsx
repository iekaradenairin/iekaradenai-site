'use client'

import { useEffect, useRef } from 'react'

import { youtubeThumbnailUrl, youtubeWatchUrl } from '@/lib/works'

/**
 * ヒーロー下端の「最新作」バー。
 * 右側はビジュアライザ風の装飾。淡い帯が3本、ゆっくり膨らんでは引く。
 * 実際の音は鳴らしておらず、解析もしていない（数式だけで揺らしている）。
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
    const ctx = c.getContext('2d')
    if (!ctx) return

    // 帯ごとの波の細かさ・流れる速さと向き・位相・振れ幅・色・濃さ。
    // 向きと速さをずらしてあるので、重なり方が少しずつ変わり続ける
    const RIBBONS = [
      { cycles: 1.9, speed: 0.2, phase: 0, amp: 1, rgb: '143,180,255', alpha: 1 },
      { cycles: 2.7, speed: -0.15, phase: 2.1, amp: 0.86, rgb: '195,217,255', alpha: 0.7 },
      { cycles: 1.3, speed: 0.11, phase: 4.4, amp: 0.7, rgb: '112,150,238', alpha: 0.8 },
    ]

    const draw = (t: number) => {
      const w = c.clientWidth
      const h = c.clientHeight
      if (!w || !h) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
        c.width = Math.round(w * dpr)
        c.height = Math.round(h * dpr)
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      const mid = h / 2
      const reach = h * 0.44
      const step = 3
      // 幅の狭い画面では山の数を減らして、細かく詰まらないようにする
      const density = Math.max(0.5, Math.min(1, w / 900))
      // 全体がゆっくり息をする
      const breath = 0.82 + 0.18 * Math.sin(t * 0.13)

      for (const r of RIBBONS) {
        ctx.beginPath()
        for (let x = 0; x <= w + step; x += step) {
          const u = x / w
          // 両端は中心線へ収束させる
          const taper = Math.pow(Math.sin(Math.PI * Math.min(1, u)), 1.4)
          // ところどころが膨らんでは引く。音に反応しているような揺らぎはここで作る
          const swell =
            (0.66 + 0.34 * Math.sin(u * 5.2 + t * 0.19 + r.phase * 1.7)) *
            (0.8 + 0.2 * Math.sin(u * 11 - t * 0.27 + r.phase * 0.6))
          const a = u * 6.2832 * r.cycles * density
          const wave =
            0.72 * Math.sin(a + t * r.speed + r.phase) +
            0.28 * Math.sin(a * 2.3 - t * r.speed * 1.4 + r.phase * 2)
          const y = mid - wave * swell * taper * breath * r.amp * reach
          if (x) ctx.lineTo(x, y)
          else ctx.moveTo(x, y)
        }

        // 太く淡い線を下に敷いてにじませ、その上に細い線を重ねる
        ctx.lineJoin = 'round'
        ctx.strokeStyle = `rgba(${r.rgb},${(0.035 * r.alpha).toFixed(3)})`
        ctx.lineWidth = 7
        ctx.stroke()
        ctx.strokeStyle = `rgba(${r.rgb},${(0.2 * r.alpha).toFixed(3)})`
        ctx.lineWidth = 1
        ctx.stroke()

        // 線と中心線のあいだを、中心へ向けて消える淡い色で満たす
        ctx.lineTo(w + step, mid)
        ctx.lineTo(0, mid)
        ctx.closePath()
        const g = ctx.createLinearGradient(0, mid - reach, 0, mid + reach)
        g.addColorStop(0, `rgba(${r.rgb},${(0.15 * r.alpha).toFixed(3)})`)
        g.addColorStop(0.5, `rgba(${r.rgb},0)`)
        g.addColorStop(1, `rgba(${r.rgb},${(0.15 * r.alpha).toFixed(3)})`)
        ctx.fillStyle = g
        ctx.fill()
      }
    }

    // 動きを減らす設定の人には、止まった1枚だけを描く
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      draw(12)
      return
    }

    let raf = 0
    let prev = 0
    let t = 0

    const frame = (now: number) => {
      const dt = Math.min(0.05, prev ? (now - prev) / 1000 : 0.016)
      prev = now
      t += dt
      draw(t)
      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      data-hero-floor=""
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
      {/* 広い画面で左端に張り付かないよう、900pxを超えた幅の22%ぶん右へ寄せる。狭い画面では寄せない */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 20,
          minHeight: 112,
          padding: '11px 0 11px max(0px, calc((100% - 900px) * 0.22))',
          minWidth: 0,
        }}
      >
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

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flex: '1 1 240px', minWidth: 0 }}>
          <canvas
            ref={viz}
            aria-hidden="true"
            style={{
              flex: '0 1 auto',
              minWidth: 0,
              // 残りの幅の62%を使い、その中央に置く。折り返して1行を占める狭い画面では幅いっぱい
              width: 'max(62%, min(100%, 360px))',
              maxWidth: 900,
              height: 76,
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
