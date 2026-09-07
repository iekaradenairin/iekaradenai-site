import generated from './works.generated.json'

import { WORKS_PLAYLIST_ID } from './siteLinks'

/**
 * 作品データは YouTube の再生リストが唯一の出所。
 * `scripts/fetch-works.mjs` がビルド時に works.generated.json を書き出し、
 * ここではそれを読むだけ。曲を足すときはサイトを触らず、再生リストに入れて
 * 再ビルドすれば載る。
 */
export type Work = {
  videoId: string
  title: string
  /** 動画の公開日（ISO8601）。取れなかったものは null */
  publishedAt: string | null
}

/** 公開日の新しい順 */
export const works: Work[] = generated

/** トップの「最新作」。再生リストが空ならフッターの再生リストリンクに落ちる */
export const latestWork: Work | undefined = works[0]

export function youtubeThumbnailUrl(videoId: string, quality: 'mqdefault' | 'hqdefault' = 'mqdefault') {
  return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`
}

/** クリックされてから読み込む前提。nocookie ドメインは _headers の CSP frame-src で許可済み */
export function youtubeEmbedUrl(videoId: string) {
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`
}

export function youtubeWatchUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}&list=${WORKS_PLAYLIST_ID}`
}

/** 「2026.08」形式。日付不明なら空文字 */
export function formatReleaseMonth(publishedAt: string | null) {
  if (!publishedAt) return ''
  return publishedAt.slice(0, 7).replace('-', '.')
}
