import assert from 'node:assert/strict'
import test from 'node:test'

import { normalizeItems } from '../scripts/fetch-works.mjs'

/** playlistItems の1件分をでっち上げる */
function item({ videoId, title, videoPublishedAt = null, position = 0 }) {
  return {
    snippet: { title, position, resourceId: { videoId } },
    contentDetails: videoPublishedAt ? { videoPublishedAt } : {},
  }
}

test('公開日の新しい順に並ぶ（再生リストの並び順ではなく）', () => {
  const got = normalizeItems([
    item({ videoId: 'aaaaaaaaaaa', title: '古い曲', videoPublishedAt: '2023-06-01T00:00:00Z', position: 0 }),
    item({ videoId: 'bbbbbbbbbbb', title: '新しい曲', videoPublishedAt: '2026-08-01T00:00:00Z', position: 1 }),
    item({ videoId: 'ccccccccccc', title: '中くらい', videoPublishedAt: '2025-01-01T00:00:00Z', position: 2 }),
  ])
  assert.deepEqual(
    got.map((w) => w.title),
    ['新しい曲', '中くらい', '古い曲'],
  )
})

test('公開日が取れないものは末尾に回り、再生リストの並び順を保つ', () => {
  const got = normalizeItems([
    item({ videoId: 'aaaaaaaaaaa', title: '日付なし2', position: 5 }),
    item({ videoId: 'bbbbbbbbbbb', title: '日付あり', videoPublishedAt: '2024-01-01T00:00:00Z', position: 1 }),
    item({ videoId: 'ccccccccccc', title: '日付なし1', position: 2 }),
  ])
  assert.deepEqual(
    got.map((w) => w.title),
    ['日付あり', '日付なし1', '日付なし2'],
  )
})

test('非公開・削除済みの項目は落とす', () => {
  const got = normalizeItems([
    item({ videoId: 'aaaaaaaaaaa', title: 'Private video', videoPublishedAt: '2026-01-01T00:00:00Z' }),
    item({ videoId: 'bbbbbbbbbbb', title: 'Deleted video', videoPublishedAt: '2026-01-01T00:00:00Z' }),
    item({ videoId: 'ccccccccccc', title: '生きてる曲', videoPublishedAt: '2025-01-01T00:00:00Z' }),
  ])
  assert.deepEqual(
    got.map((w) => w.title),
    ['生きてる曲'],
  )
})

test('再生リストに同じ動画が二度入っていても1件にまとまる', () => {
  const got = normalizeItems([
    item({ videoId: 'aaaaaaaaaaa', title: '同じ曲', videoPublishedAt: '2025-01-01T00:00:00Z', position: 0 }),
    item({ videoId: 'aaaaaaaaaaa', title: '同じ曲', videoPublishedAt: '2025-01-01T00:00:00Z', position: 7 }),
  ])
  assert.equal(got.length, 1)
})

test('videoId かタイトルが欠けた項目は落とす', () => {
  const got = normalizeItems([
    { snippet: { title: 'IDなし', position: 0 }, contentDetails: {} },
    item({ videoId: 'bbbbbbbbbbb', title: '   ' }),
    item({ videoId: 'ccccccccccc', title: '正常', videoPublishedAt: '2025-01-01T00:00:00Z' }),
  ])
  assert.deepEqual(
    got.map((w) => w.title),
    ['正常'],
  )
})

test('サイトが使うキーだけを返す（position は漏らさない）', () => {
  const [work] = normalizeItems([
    item({ videoId: 'aaaaaaaaaaa', title: '曲', videoPublishedAt: '2025-01-01T00:00:00Z', position: 3 }),
  ])
  assert.deepEqual(Object.keys(work).sort(), ['publishedAt', 'title', 'videoId'])
})
