'use client'

import { useRef, useState } from 'react'

import VideoCard from './VideoCard'
import { useSurfacing } from './useSurfacing'

/**
 * トップの世界観セクション。曲名ではなく、その曲が何の話かを一言で置いた
 * 見出しを付けている（作品ページの一覧とは役割が違う）。
 */
export type WorldCard = {
  videoId: string
  title: string
  body: string
}

export function WorldDeck({ cards }: { cards: WorldCard[] }) {
  const deck = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(-1)

  useSurfacing(deck, cards.length)

  return (
    <div ref={deck} className="grid-auto" style={{ position: 'relative', gap: 28 }}>
      {cards.map((card, i) => (
        <div key={card.videoId} data-card className="deck__card">
          <VideoCard
            videoId={card.videoId}
            title={card.title}
            live={playing === i}
            onToggle={() => setPlaying((p) => (p === i ? -1 : i))}
            style={{ gap: 22, padding: 28, height: '100%' }}
          >
            <span className="display display--card" style={{ textShadow: 'none' }}>
              {card.title}
            </span>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.95, color: 'var(--ink-4)' }}>{card.body}</p>
          </VideoCard>
        </div>
      ))}
    </div>
  )
}

export default WorldDeck
