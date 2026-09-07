'use client'

import { useRef } from 'react'

import { useSurfacing } from './useSurfacing'
import { siteLinks } from '@/lib/siteLinks'

/**
 * 名刺QRの飛び先に並ぶリンクカード。
 * 作品カードと同じ「水底から浮上する」振り付けを共有している。
 *
 * perspective は外側の main 側に置いてあり、途中のコンテナには
 * preserve-3d が要る（無いと孫要素で奥行きが効かない）。
 */

const channels = [
  {
    eyebrow: 'YOUTUBE',
    title: 'YouTube',
    handle: '@iekaradenai_rin',
    href: siteLinks.youtubeChannel,
  },
  {
    eyebrow: 'NICONICO',
    title: 'ニコニコ動画',
    handle: 'マイページ',
    href: siteLinks.niconico,
  },
]

export function LinkCards() {
  const deck = useRef<HTMLDivElement>(null)
  useSurfacing(deck, channels.length + 1)

  return (
    <div ref={deck} className="stack" style={{ gap: 16, transformStyle: 'preserve-3d' }}>
      {/* X が主導線なので1枚だけ大きく、枠も明るくして先に目に入るようにする */}
      <div data-card>
        <a
          href={siteLinks.x}
          target="_blank"
          rel="noopener noreferrer"
          className="link-card link-card--primary"
        >
          <span className="eyebrow" style={{ fontSize: 10, letterSpacing: '0.2em' }}>
            X
          </span>
          <span className="display display--panel" style={{ textShadow: 'none' }}>
            @iekaradenai_Rin
          </span>
          <span className="link-card__go" aria-hidden="true">
            →
          </span>
        </a>
      </div>

      <div
        className="grid-auto"
        style={{
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,220px),1fr))',
          gap: 16,
          transformStyle: 'preserve-3d',
        }}
      >
        {channels.map((c) => (
          <div key={c.eyebrow} data-card>
            <a
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-card"
              style={{ height: '100%' }}
            >
              <span className="eyebrow eyebrow--small">{c.eyebrow}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-1)' }}>{c.title}</span>
              <span className="mono" style={{ fontSize: 11, lineHeight: 1, color: 'var(--ink-6)' }}>
                {c.handle}
              </span>
              <span className="link-card__go" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LinkCards
