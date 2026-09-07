'use client'

import { useRef, useState } from 'react'

import VideoCard from './VideoCard'
import { useSurfacing } from './useSurfacing'
import { splitWorkTitle, type Work } from '@/lib/works'

export function WorksDeck({ works }: { works: Work[] }) {
  const deck = useRef<HTMLDivElement>(null)
  // 同時に鳴らないように、再生中は1枚だけに絞る
  const [playing, setPlaying] = useState(-1)

  useSurfacing(deck, works.length)

  return (
    <div ref={deck} className="deck">
      {works.map((work, i) => {
        const { title, credit } = splitWorkTitle(work.title)
        return (
          <div key={work.videoId} data-card className="deck__card">
            <VideoCard
              videoId={work.videoId}
              title={title}
              live={playing === i}
              onToggle={() => setPlaying((p) => (p === i ? -1 : i))}
              style={{ gap: 14, padding: '14px 14px 20px' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '0 4px' }}>
                <span className="display display--card" style={{ fontSize: 19, textShadow: 'none' }}>
                  {title}
                </span>
                {credit ? <span className="deck__credit">{credit}</span> : null}
              </div>
            </VideoCard>
          </div>
        )
      })}
    </div>
  )
}

export default WorksDeck
