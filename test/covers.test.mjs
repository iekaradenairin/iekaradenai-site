import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeCoverItems } from '../scripts/fetch-covers.mjs'

const item = (id, title, date, owner = '歌ってくれた方') => ({
  snippet: { title, resourceId: { videoId: id }, videoOwnerChannelTitle: owner, videoOwnerChannelId: 'UCaaaaaaaaaaaaaaaaaaaaaa' },
  contentDetails: { videoPublishedAt: date },
})

test('歌ってみたのタイトルを分割せず、動画の投稿チャンネルを保持する', () => {
  const title = '【歌ってみた】星空、そして君に / cover by someone'
  const [cover] = normalizeCoverItems([item('aaaaaaaaaaa', title, '2026-10-01T00:00:00Z')])
  assert.equal(cover.title, title)
  assert.equal(cover.channelTitle, '歌ってくれた方')
  assert.equal(cover.channelId, 'UCaaaaaaaaaaaaaaaaaaaaaa')
})

test('作品を新しい順に並べ、重複・削除・非公開を除く', () => {
  const covers = normalizeCoverItems([
    item('aaaaaaaaaaa', '古い作品', '2025-01-01T00:00:00Z'),
    item('bbbbbbbbbbb', '新しい作品', '2026-01-01T00:00:00Z', '別の方'),
    item('bbbbbbbbbbb', '新しい作品', '2026-01-01T00:00:00Z', '別の方'),
    item('ccccccccccc', 'Private video', null),
    item('ddddddddddd', 'Deleted video', null),
  ])
  assert.deepEqual(covers.map((cover) => [cover.title, cover.channelTitle]), [['新しい作品', '別の方'], ['古い作品', '歌ってくれた方']])
})

test('投稿元が取れなくても歌唱者を推測せず、空のリストも扱える', () => {
  const [cover] = normalizeCoverItems([{ snippet: { title: '曲', resourceId: { videoId: 'aaaaaaaaaaa' } } }])
  assert.equal(cover.channelTitle, '')
  assert.equal(cover.channelId, null)
  assert.deepEqual(normalizeCoverItems([]), [])
})
