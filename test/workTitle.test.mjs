import assert from 'node:assert/strict'
import test from 'node:test'

import { splitWorkTitle } from '../lib/workTitle.ts'

test('曲名とクレジットをスラッシュで割る', () => {
  assert.deepEqual(splitWorkTitle('藍空をなぞって / 花隈千冬'), {
    title: '藍空をなぞって',
    credit: '花隈千冬',
  })
  assert.deepEqual(splitWorkTitle('スクリーン・エコー / 倫 feat. 花隈千冬'), {
    title: 'スクリーン・エコー',
    credit: '倫 feat. 花隈千冬',
  })
})

test('【初投稿】のような角括弧プレフィックスは落とす', () => {
  assert.deepEqual(splitWorkTitle('【初投稿】秋乃 / 倫 feat. 花隈千冬'), {
    title: '秋乃',
    credit: '倫 feat. 花隈千冬',
  })
})

test('歌唱名側の企画タグ〖〗は残す', () => {
  // 同名曲の見分けがこれ頼みなので消してはいけない
  assert.deepEqual(splitWorkTitle('藍空をなぞって / 星巡璃〖#VocaDuo2026〗'), {
    title: '藍空をなぞって',
    credit: '星巡璃〖#VocaDuo2026〗',
  })
})

test('同名で歌唱違いの2曲が、クレジットで区別できる', () => {
  const a = splitWorkTitle('藍空をなぞって / 花隈千冬')
  const b = splitWorkTitle('藍空をなぞって / 星巡璃〖#VocaDuo2026〗')
  assert.equal(a.title, b.title)
  assert.notEqual(a.credit, b.credit)
})

test('曲名側に feat. が入っていても最初のスラッシュで割る', () => {
  assert.deepEqual(splitWorkTitle('花笑み、ひとひら feat. 雨衣 / Matsuyoi'), {
    title: '花笑み、ひとひら feat. 雨衣',
    credit: 'Matsuyoi',
  })
})

test('連続した空白は詰める', () => {
  assert.deepEqual(splitWorkTitle('君色の白 / 倫 feat.  花隈千冬'), {
    title: '君色の白',
    credit: '倫 feat. 花隈千冬',
  })
})

test('スラッシュが無ければクレジットは空になる', () => {
  assert.deepEqual(splitWorkTitle('深海遊泳'), { title: '深海遊泳', credit: '' })
})

test('スラッシュが区切りでない場合は割らない（前後に空白が要る）', () => {
  assert.deepEqual(splitWorkTitle('AC/DC風の何か'), { title: 'AC/DC風の何か', credit: '' })
})
