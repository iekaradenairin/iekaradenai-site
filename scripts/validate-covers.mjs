import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const covers = JSON.parse(fs.readFileSync(path.join(ROOT, 'lib/covers.generated.json'), 'utf8'))
const { playlistId } = JSON.parse(fs.readFileSync(path.join(ROOT, 'lib/covers.config.json'), 'utf8'))
if (typeof playlistId !== 'string' || (playlistId && !/^[\w-]+$/.test(playlistId))) throw new Error('playlistId が不正です')
if (!Array.isArray(covers)) throw new Error('covers.generated.json は配列である必要があります')
const seen = new Set()
for (const [index, cover] of covers.entries()) {
  if (!cover || !/^[\w-]{11}$/.test(cover.videoId || '') || seen.has(cover.videoId)
    || typeof cover.title !== 'string' || !cover.title.trim()
    || typeof cover.channelTitle !== 'string'
    || (cover.channelId !== null && !/^UC[\w-]{22}$/.test(cover.channelId || ''))
    || (cover.publishedAt !== null && (typeof cover.publishedAt !== 'string' || Number.isNaN(Date.parse(cover.publishedAt))))) {
    throw new Error(`歌ってくれた作品の${index + 1}件目に問題があります`)
  }
  seen.add(cover.videoId)
  const previous = covers[index - 1]?.publishedAt
  if (cover.publishedAt && index > 0 && (!previous || previous < cover.publishedAt)) {
    throw new Error('歌ってくれた作品が公開日の新しい順ではありません')
  }
}
console.log(`✓ covers.generated.json: ${covers.length}件、問題ありません`)
