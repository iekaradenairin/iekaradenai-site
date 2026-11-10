'use client'

import { useEffect, useRef } from 'react'

import { youtubeThumbnailUrl, youtubeWatchUrl } from '@/lib/works'

/**
 * ヒーロー下端の「最新作」バー。
 * 右側は音の波形ではなく、奥へ続く水面のワイヤーがゆっくりうねり、光の筋が落ちるだけの装飾。
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
    const ctx = c.getContext('2d')
    if (!ctx) return

    // 水面は1枚の高さ場。行ごとに別の波を描くのではなく、同じ面を奥行き位置を変えて
    // 切り出すので、うねりの峰が行をまたいで斜めにつながる
    const surface = (x: number, z: number, t: number) =>
      0.55 * Math.sin(0.9 * x + 0.5 * z + t * 0.16) +
      0.3 * Math.sin(1.7 * x - 1.1 * z - t * 0.23 + 1.3) +
      0.15 * Math.sin(3.1 * x + 2.3 * z + t * 0.34 + 4.1)

    const ROWS = 13
    const Z_FAR = 6
    const Z_NEAR = 1

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

      // 水面に落ちる光の筋。ゆっくり左右へ寄る
      const lightX = w * (0.6 + 0.07 * Math.sin(t * 0.05))
      const step = 3

      // 奥から手前へ。手前の面で奥の線を消してから描くので、うねりの陰に線が隠れる
      for (let j = 0; j < ROWS; j++) {
        const near = j / (ROWS - 1)
        // 透視投影: 奥の行ほど水平線へ詰まり、うねりは小さく、横には広く見える
        const drop = Math.pow(near, 1.5)
        const z = 1 / (1 / Z_FAR + (1 / Z_NEAR - 1 / Z_FAR) * drop)
        const y0 = h * (0.12 + 0.66 * drop)
        const amp = (h * 0.17) / z
        // 幅の狭い画面では見える範囲も狭めて、うねりが細かく詰まらないようにする
        const span = z * 6 * Math.max(0.45, Math.min(1, w / 900))

        ctx.beginPath()
        for (let x = 0; x <= w + step; x += step) {
          const y = y0 - surface((x / w - 0.5) * span, z, t) * amp
          if (x) ctx.lineTo(x, y)
          else ctx.moveTo(x, y)
        }

        ctx.save()
        ctx.lineTo(w + step, h)
        ctx.lineTo(0, h)
        ctx.closePath()
        ctx.globalCompositeOperation = 'destination-out'
        ctx.fillStyle = 'rgba(0,0,0,.9)'
        ctx.fill()
        ctx.restore()

        // 光の筋は手前ほど幅が広がり、行ごとに少しずつ揺れる
        const base = 0.07 + 0.3 * near * near
        const cx = (lightX + Math.sin(t * 0.23 + j * 1.1) * w * 0.012) / w
        const half = 0.05 + 0.13 * near
        const g = ctx.createLinearGradient(0, 0, w, 0)
        g.addColorStop(0, `rgba(143,180,255,${base.toFixed(3)})`)
        g.addColorStop(Math.max(0, cx - half), `rgba(143,180,255,${base.toFixed(3)})`)
        g.addColorStop(Math.min(1, Math.max(0, cx)), `rgba(226,238,255,${Math.min(0.95, base + 0.1 + 0.42 * near).toFixed(3)})`)
        g.addColorStop(Math.min(1, cx + half), `rgba(143,180,255,${base.toFixed(3)})`)
        g.addColorStop(1, `rgba(143,180,255,${base.toFixed(3)})`)

        ctx.beginPath()
        for (let x = 0; x <= w + step; x += step) {
          const y = y0 - surface((x / w - 0.5) * span, z, t) * amp
          if (x) ctx.lineTo(x, y)
          else ctx.moveTo(x, y)
        }
        ctx.strokeStyle = g
        ctx.lineWidth = 0.6 + 0.6 * near
        ctx.stroke()

        // 光の筋の中で、ときどき峰がきらめく
        for (let k = 0; k < 2; k++) {
          const id = j * 2 + k
          const glint = Math.pow(Math.max(0, Math.sin(t * (0.5 + (id % 5) * 0.09) + id * 2.4)), 10)
          if (glint < 0.02) continue
          const gx = (cx + (((id * 0.618) % 1) - 0.5) * half * 1.5) * w
          const gy = y0 - surface((gx / w - 0.5) * span, z, t) * amp
          ctx.fillStyle = `rgba(236,244,255,${(glint * (0.35 + 0.5 * near)).toFixed(3)})`
          ctx.beginPath()
          ctx.arc(gx, gy, 0.7 + near * 0.8, 0, 6.2832)
          ctx.fill()
        }
      }
    }

    // 動きを減らす設定の人には、止まった水面を1枚だけ描く
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      draw(0)
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
