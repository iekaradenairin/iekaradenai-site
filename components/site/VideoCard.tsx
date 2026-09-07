'use client'

import type { CSSProperties, ReactNode } from 'react'

import { youtubeEmbedUrl } from '@/lib/works'

/**
 * サムネイルを見せておいて、クリックで YouTube 埋め込みに差し替わるカード。
 * 作品ページの一覧と、トップの世界観セクションで共有している。
 *
 * 最初から iframe を並べると11個ぶんの YouTube プレイヤーを読みに行くので、
 * 押されるまでは画像1枚に留める。
 */
export function VideoCard({
  videoId,
  title,
  live,
  onToggle,
  style,
  children,
}: {
  videoId: string
  /** スクリーンリーダー・iframe title 用。表示は children 側で組む */
  title: string
  live: boolean
  onToggle: () => void
  style?: CSSProperties
  children: ReactNode
}) {
  return (
    <div
      className="card card--interactive"
      style={{ transformStyle: 'preserve-3d', ...style }}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onToggle()
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={live}
      aria-label={live ? `${title} の再生を閉じる` : `${title} を再生する`}
    >
      <div className="hatch" style={{ position: 'relative', aspectRatio: '16 / 9', overflow: 'hidden' }}>
        {live ? (
          <iframe
            src={youtubeEmbedUrl(videoId)}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
          />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- YouTube 側のサムネイル。next/image の最適化対象にしない */}
            <img
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
            />
            <span
              className="mono"
              style={{
                position: 'absolute',
                left: 10,
                bottom: 9,
                fontSize: 9,
                lineHeight: 1,
                color: 'var(--ink-1)',
                textShadow: '0 1px 4px rgba(0,0,0,.8)',
              }}
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

      {children}
    </div>
  )
}

export default VideoCard
