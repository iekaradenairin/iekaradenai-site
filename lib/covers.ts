import generated from './covers.generated.json'
import config from './covers.config.json'
import type { Work } from './works'

export type Cover = Work & {
  /** 動画の投稿チャンネル名。歌唱者と断定せず、投稿元として表示する。 */
  channelTitle: string
  channelId: string | null
}

export const covers: Cover[] = generated
export const coversPlaylistUrl = config.playlistId
  ? `https://www.youtube.com/playlist?list=${encodeURIComponent(config.playlistId)}`
  : null
