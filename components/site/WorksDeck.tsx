'use client'

import { useRef, useState } from 'react'

import VideoCard from './VideoCard'
import { useSurfacing } from './useSurfacing'
import { splitWorkTitle, type Work } from '@/lib/works'
import type { Cover } from '@/lib/covers'

export function WorksDeck({ works, variant = 'originals' }: { works: (Work | Cover)[]; variant?: 'originals' | 'covers' }) {
  const deck = useRef<HTMLDivElement>(null)
  // 同時に鳴らないように、再生中は1枚だけに絞る
  const [playing, setPlaying] = useState(-1)

  useSurfacing(deck, works.length)

  return (
    <div ref={deck} className="deck">
      {works.map((work, i) => {
        const { title, credit } = variant === 'covers'
          ? { title: work.title, credit: 'channelTitle' in work ? work.channelTitle : '' }
          : splitWorkTitle(work.title)
        return (
          <div key={work.videoId} className="deck__slot">
            <div data-card className="deck__card">
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
                  {credit ? <span className="deck__credit">{variant === 'covers' ? `投稿：${credit}` : credit}</span> : null}
                </div>
              </VideoCard>
              {variant === 'covers' ? (
                <a className="deck__source" href={`https://www.youtube.com/watch?v=${work.videoId}`} target="_blank" rel="noopener noreferrer">
                  YouTubeで見る <span aria-hidden="true">↗</span><span className="sr-only">：{title}</span>
                </a>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default WorksDeck
