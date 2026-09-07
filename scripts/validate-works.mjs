// works.generated.json の中身を検査する。
// このファイルはビルド時に scripts/fetch-works.mjs が書き出すが、APIキーが無い
// 環境ではコミット済みのものがそのまま使われるので、壊れたまま出荷しないよう見る。

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FILE = path.join(__dirname, '..', 'lib', 'works.generated.json')

const errors = []

if (!fs.existsSync(FILE)) {
  console.error('lib/works.generated.json がありません。`npm run fetch-works` を実行してください。')
  process.exit(1)
}

let works
try {
  works = JSON.parse(fs.readFileSync(FILE, 'utf-8'))
} catch (err) {
  console.error(`lib/works.generated.json が JSON として読めません: ${err.message}`)
  process.exit(1)
}

if (!Array.isArray(works)) {
  console.error('lib/works.generated.json は配列である必要があります。')
  process.exit(1)
}

const seen = new Map()
works.forEach((w, i) => {
  const at = `${i + 1}件目`
  if (!w || typeof w !== 'object') return errors.push(`${at}: オブジェクトではありません`)
  if (!/^[\w-]{11}$/.test(w.videoId || '')) {
    errors.push(`${at}: videoId が YouTube の形式（11文字）ではありません: ${JSON.stringify(w.videoId)}`)
  }
  if (typeof w.title !== 'string' || !w.title.trim()) {
    errors.push(`${at}: title が空です`)
  }
  if (w.publishedAt !== null && Number.isNaN(Date.parse(w.publishedAt))) {
    errors.push(`${at}: publishedAt が日付として読めません: ${JSON.stringify(w.publishedAt)}`)
  }
  if (seen.has(w.videoId)) {
    errors.push(`${at}: videoId が ${seen.get(w.videoId)} と重複しています（${w.videoId}）`)
  } else {
    seen.set(w.videoId, at)
  }
})

// 公開日の新しい順に並んでいること（トップの「最新作」がこれに依存している）
for (let i = 1; i < works.length; i++) {
  const prev = works[i - 1]?.publishedAt
  const cur = works[i]?.publishedAt
  if (prev && cur && prev < cur) {
    errors.push(`${i + 1}件目: 公開日の新しい順に並んでいません（${prev} の後ろに ${cur}）`)
    break
  }
}

if (errors.length) {
  console.error('lib/works.generated.json に問題があります:\n' + errors.map((e) => `  - ${e}`).join('\n'))
  process.exit(1)
}

if (!works.length) {
  console.warn('⚠ lib/works.generated.json が空です。作品ページには何も表示されません。')
  console.warn('  YOUTUBE_API_KEY を設定して `npm run fetch-works` を実行してください。')
} else {
  console.log(`✓ lib/works.generated.json: ${works.length}曲、問題ありません`)
}
