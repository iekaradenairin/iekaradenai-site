'use client'

import { useEffect, useRef } from 'react'

/**
 * カーソル追従の水紋。Claude Design 側では5ページすべてに同じ initRipple /
 * drawRipples / tick がコピーされていたので、ここ1箇所に畳んでいる。
 * デザイン方針（プロジェクトの CLAUDE.md）で「新規ページには必ず付ける」もの。
 *
 * 親要素（position:relative なページラッパー）いっぱいに敷き、
 * ポインタ座標は親の矩形基準で取る。
 */

type Drop = { x: number; y: number; t: number; life: number; amp: number; scale: number }

/** 端末の描画バッファ上限。フルページ高さ × dpr2 だと数千万pxになりモバイルで落ちるため */
const MAX_BACKING_PIXELS = 12_000_000

export function RippleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const host = canvas?.parentElement
    if (!canvas || !host) return

    // 動きを減らす設定の人には出さない（rAF ごと回さない）
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    const drops: Drop[] = []
    let last: { x: number; y: number } | null = null

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      if (!w || !h) return
      const fit = Math.sqrt(MAX_BACKING_PIXELS / (w * h))
      const dpr = Math.min(window.devicePixelRatio || 1, 2, Math.max(1, fit))
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const add = (e: PointerEvent, strong: boolean) => {
      if (!w || !h) return
      const r = host.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      if (x < 0 || y < 0 || x > w || y > h) return
      if (!strong) {
        // 追従は間引く。1pxごとに落とすと水面が潰れる
        if (last && Math.hypot(x - last.x, y - last.y) < 44) return
        last = { x, y }
      }
      if (drops.length > 20) drops.shift()
      const base = strong ? 4.2 : 3.4
      drops.push({
        x,
        y,
        t: 0,
        life: base * (0.72 + Math.random() * 0.56), // ±28% ゆらぎ
        amp: (strong ? 1 : 0.8) * (0.8 + Math.random() * 0.4),
        scale: 0.85 + Math.random() * 0.35,
      })
    }

    const onMove = (e: PointerEvent) => add(e, false)
    const onDown = (e: PointerEvent) => add(e, true)

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h)
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i]
        d.t += dt
        const p = d.t / d.life
        if (p >= 1) {
          drops.splice(i, 1)
          continue
        }
        const ease = 1 - Math.pow(1 - p, 2.2)
        const fade = (1 - p) * (1 - p)

        // 輪が広がる前でも落ちた点が読めるように、内側にごく淡い光を置く
        const gr = ease * 70
        if (gr > 1) {
          const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, gr)
          g.addColorStop(0, `rgba(150,195,255,${(fade * d.amp * 0.03).toFixed(3)})`)
          g.addColorStop(1, 'rgba(150,195,255,0)')
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(d.x, d.y, gr, 0, 6.2832)
          ctx.fill()
        }

        for (let k = 0; k < 2; k++) {
          const rp = ease - k * 0.14
          if (rp <= 0) continue
          const radius = rp * (k === 0 ? 130 : 90) * d.scale
          const alpha = fade * d.amp * (k === 0 ? 0.09 : 0.055)
          if (alpha <= 0.003) continue
          ctx.lineWidth = 1
          ctx.strokeStyle = `rgba(205,230,255,${alpha.toFixed(3)})`
          ctx.beginPath()
          ctx.arc(d.x, d.y, radius, 0, 6.2832)
          ctx.stroke()
        }
      }
    }

    let raf = 0
    let prev = 0
    const spin = (now: number) => {
      const dt = Math.min(0.05, prev ? (now - prev) / 1000 : 0.016)
      prev = now
      if (drops.length) draw(dt)
      raf = requestAnimationFrame(spin)
    }

    resize()
    // ページ高さはコンテンツで変わる（Audio Check の結果表示など）
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerdown', onDown)
    raf = requestAnimationFrame(spin)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [])

  return <canvas ref={ref} className="ripple" aria-hidden="true" />
}

export default RippleCanvas
