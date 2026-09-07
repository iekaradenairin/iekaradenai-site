'use client'

import { useEffect, type RefObject } from 'react'

/**
 * カードが水底から浮上する振り付け。
 *
 * 深さ・傾き・横ゆれ・待ち時間をカードごとに毎回振り直すので、リロードのたび
 * 浮き上がり方が変わる。決まった順に整列させないのが狙いなので、値は固定しない。
 *
 * 対象は deck 直下の `[data-card]`。呼び出し側は 3D が効くよう、祖先に
 * perspective を置くこと。
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

export function useSurfacing(deckRef: RefObject<HTMLElement | null>, count: number) {
  useEffect(() => {
    const el = deckRef.current
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

    // 取りこぼしの掃除。一気にスクロールして IO が拾えなかったカードも必ず浮かせる
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
  }, [deckRef, count])
}
