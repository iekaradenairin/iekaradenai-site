// 作品データ取り込み — ビルド時に YouTube の再生リストから全曲を引いて
// lib/works.generated.json に焼き込む。
//
// このサイトは静的エクスポート（output: "export"）でサーバーが無いため、
// 閲覧時ではなくビルド時に取得する。APIキーがブラウザに出ないので、
// 鍵の露出もクォータ消費もゼロになる。
//
//   YOUTUBE_API_KEY=xxxx npm run build
//
// キーが無いとき・APIが落ちているときは、既にコミットされている
// works.generated.json をそのまま使う（ビルドは失敗させない）。
// 新曲が反映されないだけで、サイトが空になることはない。

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const OUT = path.join(ROOT, 'lib', 'works.generated.json')

const PLAYLIST_ID = process.env.YOUTUBE_PLAYLIST_ID || 'PL9xTJo4NgKecdcBhJaL3MCZu9JBFjKG0h'

/** 非公開・削除済みの項目はタイトルがこの固定文字列になり、videoId も再生できない */
const DEAD_TITLES = new Set(['Private video', 'Deleted video', '非公開動画', '削除された動画'])

/**
 * playlistItems のレスポンスを、サイトが使う形に整える。
 *
 * 並びは再生リストの順ではなく公開日の新しい順にする。トップの「最新作」が
 * 再生リストの並べ替え次第でズレると困るため。
 */
export function normalizeItems(items) {
  const works = []
  const seen = new Set()

  for (const item of items) {
    const snippet = item?.snippet
    const videoId = snippet?.resourceId?.videoId
    const title = (snippet?.title || '').trim()

    if (!videoId || !title) continue
    if (DEAD_TITLES.has(title)) continue
    if (seen.has(videoId)) continue // 再生リストに同じ曲が二度入っていても1件にする
    seen.add(videoId)

    works.push({
      videoId,
      title,
      // contentDetails.videoPublishedAt は動画自体の公開日。
      // snippet.publishedAt は「再生リストに追加した日」なので使わない。
      publishedAt: item?.contentDetails?.videoPublishedAt || null,
      position: typeof snippet.position === 'number' ? snippet.position : works.length,
    })
  }

  works.sort((a, b) => {
    if (a.publishedAt && b.publishedAt) return a.publishedAt < b.publishedAt ? 1 : -1
    if (a.publishedAt) return -1 // 日付が取れたものを先に
    if (b.publishedAt) return 1
    return a.position - b.position
  })

  return works.map(({ videoId, title, publishedAt }) => ({ videoId, title, publishedAt }))
}

async function fetchAll(key) {
  const items = []
  let pageToken = ''

  do {
    const url =
      'https://www.googleapis.com/youtube/v3/playlistItems' +
      '?part=snippet,contentDetails&maxResults=50' +
      `&playlistId=${encodeURIComponent(PLAYLIST_ID)}` +
      `&key=${encodeURIComponent(key)}` +
      (pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : '')

    const res = await fetch(url)
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      throw new Error(`YouTube API ${res.status}: ${body.slice(0, 300)}`)
    }
    const json = await res.json()
    items.push(...(json.items || []))
    pageToken = json.nextPageToken || ''
  } while (pageToken)

  return items
}

// --strict では取得できなかった時点で落とす。
// ビルド中は「前回のデータで出す」のが正しい振る舞いだが、日次の更新ジョブで
// 同じことをやると、キー失効やクォータ切れに気づかないまま更新が止まる。
const STRICT = process.argv.includes('--strict')

function keepExisting(reason) {
  if (STRICT) {
    console.error(`  ${reason}`)
    process.exit(1)
  }
  if (fs.existsSync(OUT)) {
    const n = JSON.parse(fs.readFileSync(OUT, 'utf-8')).length
    console.warn(`  ${reason} — 既存の works.generated.json（${n}曲）をそのまま使います`)
    return
  }
  fs.writeFileSync(OUT, '[]\n')
  console.warn(`  ${reason} — works.generated.json が無いので空で作成しました（作品ページは空になります）`)
}

async function main() {
  const key = process.env.YOUTUBE_API_KEY
  if (!key) {
    keepExisting('YOUTUBE_API_KEY が未設定')
    return
  }

  try {
    const works = normalizeItems(await fetchAll(key))
    if (!works.length) {
      keepExisting('再生リストから1曲も取得できませんでした')
      return
    }
    fs.writeFileSync(OUT, JSON.stringify(works, null, 2) + '\n')
    console.log(`  Fetched: ${works.length} works from playlist ${PLAYLIST_ID}`)
  } catch (err) {
    keepExisting(`取得に失敗しました（${err.message}）`)
  }
}

// テストから import されたときは実行しない
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
