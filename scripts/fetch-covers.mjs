// 掲載対象は専用プレイリストで選び、取得と更新を自動化する。
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { fetchAll, normalizeItems } from './fetch-works.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'lib/covers.generated.json')

export function normalizeCoverItems(items) {
  const owners = new Map()
  for (const item of items) {
    const snippet = item?.snippet
    const id = snippet?.resourceId?.videoId
    if (id && !owners.has(id)) {
      owners.set(id, {
        channelTitle: (snippet.videoOwnerChannelTitle || '').trim(),
        channelId: snippet.videoOwnerChannelId || null,
      })
    }
  }
  return normalizeItems(items).map((work) => ({ ...work, ...owners.get(work.videoId) }))
}

async function main() {
  const { playlistId } = JSON.parse(fs.readFileSync(path.join(ROOT, 'lib/covers.config.json'), 'utf8'))
  if (!playlistId) {
    console.log('Covers: 再生リスト未指定。既存の掲載データを使います。')
    return
  }
  if (!/^[\w-]+$/.test(playlistId)) throw new Error('covers.config.json の playlistId が不正です')

  try {
    const key = process.env.YOUTUBE_API_KEY
    if (!key) throw new Error('YOUTUBE_API_KEY が未設定です')
    const covers = normalizeCoverItems(await fetchAll(key, playlistId))
    // 正常に取得できた空リストも反映する（最後の掲載作品を外せるようにする）。
    fs.writeFileSync(OUT, JSON.stringify(covers, null, 2) + '\n')
    console.log(`Covers: ${covers.length}件を取得しました`)
  } catch (error) {
    if (process.argv.includes('--strict') || !fs.existsSync(OUT)) throw error
    console.warn(`Covers: ${error.message} — 前回のデータを維持します`)
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
