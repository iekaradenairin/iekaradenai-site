import assert from 'node:assert/strict'
import test from 'node:test'
import fs from 'node:fs'
import { buildSongs, decide, linkedVideoIds, emptyState, reconcile, setIncident } from '../scripts/automation/rules.mjs'
import { discover, applyCandidates } from '../scripts/automation/engine.mjs'
import { notificationBatches, flushNotifications } from '../scripts/automation/discord.mjs'
import { YouTube, refreshAccessToken } from '../scripts/automation/api.mjs'

const config = JSON.parse(fs.readFileSync(new URL('../lib/discovery.config.json', import.meta.url)))
const works = JSON.parse(fs.readFileSync(new URL('../lib/works.generated.json', import.meta.url)))
const songs = buildSongs(works, config)
const now = '2026-11-01T00:00:00Z'
const originalChannelId = 'UCaaaaaaaaaaaaaaaaaaaaaa'
const candidate = { id: 'SGbf1NgRzvg', title: '【歌ってみた】星空そして君に', description: '作詞作曲：家から出ない倫', channelId: 'UCbbbbbbbbbbbbbbbbbbbbbb', channelTitle: '歌い手', public: true }
const save = async () => {}

const fakeYouTube = (overrides = {}) => ({
  originalChannel: async () => originalChannelId,
  search: async () => ({ ids: [candidate.id] }),
  videos: async () => [candidate],
  playlist: async () => [],
  add: async () => ({}),
  ...overrides,
})

test('曲名は自動抽出・重複統合し、featの末尾を除去して原曲IDを複数保持する', () => {
  assert.equal(songs.find((song) => song.title === '藍空をなぞって').originalIds.length, 2)
  assert.ok(songs.some((song) => song.title === '花笑み、ひとひら'))
  assert.ok(songs.some((song) => song.title === '秋乃'))
  assert.equal(buildSongs(works, { ...config, titleOverrides: { FE0TG8CqM3M: '補正曲名' } })[0].title, '補正曲名')
})

test('全角半角・句読点の差を許容し、作者名のみ・曲名のみ・倫一文字では追加しない', () => {
  assert.equal(decide(candidate, songs, config, originalChannelId).accepted, true)
  assert.equal(decide({ ...candidate, description: '倫' }, songs, config, originalChannelId).accepted, false)
  assert.equal(decide({ ...candidate, title: '別の曲' }, songs, config, originalChannelId).accepted, false)
})

test('対応する原曲URLなら作者表記なしで一致し、偽ドメインや別曲URLは使わない', () => {
  assert.deepEqual([...linkedVideoIds('https://youtube.com.evil.test/watch?v=FE0TG8CqM3M')], [])
  assert.equal(decide({ ...candidate, description: 'https://youtu.be/FE0TG8CqM3M?t=5' }, songs, config, originalChannelId).accepted, true)
  assert.equal(decide({ ...candidate, description: 'https://youtu.be/GTdhEuRJRzg' }, songs, config, originalChannelId).accepted, false)
})

test('自己投稿の原曲を除外し、同じ作品リスト内の他チャンネルの本家歌唱版は許可する', () => {
  const original = { ...candidate, id: 'FE0TG8CqM3M', channelId: originalChannelId }
  assert.equal(decide(original, songs, config, originalChannelId).reason, 'own-original')
  assert.equal(decide({ ...candidate, id: 'sepS54VqbnQ', title: '藍空をなぞって' }, songs, config, originalChannelId).accepted, true)
  assert.equal(decide(candidate, songs, { ...config, excludedChannelIds: [candidate.channelId] }, originalChannelId).accepted, false)
})

test('既存掲載を履歴に登録し、削除されても履歴は残す。手動再追加は妨げない', () => {
  const state = emptyState('playlist')
  reconcile(state, [candidate], now)
  reconcile(state, [], now)
  assert.ok(state.history[candidate.id])
  reconcile(state, [candidate], now)
  assert.equal(state.history[candidate.id].source, 'playlist')
})

test('結果不明の書き込みは、存在すれば成功通知、不在なら再追加せず要確認にする', () => {
  for (const present of [true, false]) {
    const state = emptyState('playlist')
    state.attempts[candidate.id] = { reason: '作者表記一致' }
    reconcile(state, present ? [candidate] : [], now)
    assert.ok(state.history[candidate.id])
    assert.equal(state.outbox[0].type, present ? 'added' : 'uncertain')
    assert.equal(Object.keys(state.attempts).length, 0)
  }
})

test('追加前に履歴保存。保存失敗時はYouTubeに一切書き込まない', async () => {
  const state = emptyState('playlist')
  state.pending[candidate.id] = { ...candidate, reason: '一致' }
  let calls = 0
  await assert.rejects(applyCandidates({ state, config, youtube: fakeYouTube({ add: async () => { calls++ } }), save: async () => { throw new Error('disk failure') } }))
  assert.equal(calls, 0)
})

test('追加直前に手動追加があれば重複追加しない', async () => {
  const state = emptyState('playlist')
  state.pending[candidate.id] = candidate
  let calls = 0
  await applyCandidates({ state, config, youtube: fakeYouTube({ playlist: async () => [candidate], add: async () => { calls++ } }), save })
  assert.equal(calls, 0)
})

test('追加は最大5件で残りを保持し、成功通知は成功した作品だけ', async () => {
  const state = emptyState('playlist')
  for (let i = 0; i < 7; i++) state.pending[`aaaaaaaaaa${i}`] = { ...candidate, id: `aaaaaaaaaa${i}`, reason: '一致' }
  const added = await applyCandidates({ state, config, youtube: fakeYouTube(), save })
  assert.equal(added.length, 5)
  assert.equal(Object.keys(state.pending).length, 2)
  assert.equal(state.outbox.length, 5)
})

test('書き込みの結果不明時は処理中の記録を残して停止し、後続動画は追加しない', async () => {
  const state = emptyState('playlist')
  state.pending[candidate.id] = { ...candidate, reason: '一致' }
  await assert.rejects(applyCandidates({ state, config, youtube: fakeYouTube({ add: async () => { throw new Error('timeout') } }), save }))
  assert.ok(state.attempts[candidate.id])
  assert.equal(state.outbox.length, 0)
})

test('検索リクエスト数に上限を設け、ページ途中から再開できる', async () => {
  const state = emptyState('playlist')
  let calls = 0
  await discover({ state, works, config: { ...config, maxSearchCalls: 2 }, now, save, youtube: fakeYouTube({ search: async () => { calls++; return { ids: [candidate.id], nextPageToken: 'next' } } }) })
  assert.equal(calls, 2)
  assert.equal(state.search.pageToken, 'next')
  assert.ok(state.pending[candidate.id])
})

test('動画詳細取得失敗時に検索巡回位置を先へ進めない', async () => {
  const state = emptyState('playlist')
  await assert.rejects(discover({ state, works, config, now, save, youtube: fakeYouTube({ videos: async () => { throw new Error('timeout') } }) }))
  assert.deepEqual(state.search, { cursor: 0, lastDeepScan: null })
})

test('認証切れを識別し、トークンやレスポンス全文をエラーに含めない', async () => {
  const env = { YOUTUBE_CLIENT_ID: 'id', YOUTUBE_CLIENT_SECRET: 'secret', YOUTUBE_REFRESH_TOKEN: 'token' }
  await assert.rejects(refreshAccessToken(env, async () => ({ ok: false, status: 400, json: async () => ({ error: 'invalid_grant', error_description: 'secret' }) })), (error) => error.code === 'reauth-required' && !error.message.includes('secret'))
})

test('不完全なプレイリストレスポンスを空の正常リストとして扱わない', async () => {
  const youtube = new YouTube({ key: 'key', request: async () => ({ ok: true, json: async () => ({}) }) })
  await assert.rejects(youtube.playlist('list'), (error) => error.code === 'invalid-playlist-response')
})

test('Discordは成功追加をまとめ、メンションを無効化し、失敗時は通知キューを残す', async () => {
  const state = emptyState('playlist')
  const context = { environment: 'staging', playlistId: 'playlist' }
  state.outbox.push({ id: 'added-1', type: 'added', videoId: candidate.id, title: '@everyone 曲', channelTitle: '投稿者', reason: '作者一致' })
  const webhook = 'https://discord.com/api/webhooks/123/fake-token'
  await assert.rejects(flushNotifications({ state, save, webhook, context, request: async () => ({ ok: false, status: 429 }) }))
  assert.equal(state.outbox.length, 1)
  await flushNotifications({ state, save, webhook, context, request: async (_url, options) => {
    assert.deepEqual(JSON.parse(options.body).allowed_mentions, { parse: [] })
    assert.ok(JSON.parse(options.body).content.includes('【検証】'))
    return { ok: true, json: async () => ({ id: 'message' }) }
  } })
  assert.equal(state.outbox.length, 0)
  assert.equal(notificationBatches([{ id: 'test', type: 'test' }], context).length, 1)
})

test('同一異常は連投せず、復旧を一度だけ通知する', () => {
  const state = emptyState('playlist')
  setIncident(state, 'addition', 'reauth-required', now)
  setIncident(state, 'addition', 'reauth-required', now)
  setIncident(state, 'addition', null, now)
  setIncident(state, 'addition', null, now)
  assert.deepEqual(state.outbox.map((item) => item.type), ['error', 'recovered'])
})

test('GitHub状態保存はSHAで競合を検出し、異なる掲載先の履歴を流用しない', async () => {
  const { GitHubStateStore } = await import('../scripts/automation/store.mjs')
  const state = emptyState('target')
  let writes = 0
  const store = new GitHubStateStore({ repository: 'owner/repo', token: 'fake', environment: 'staging', playlistId: 'target', request: async (_url, options) => {
    if (options.method === 'GET') return { ok: true, json: async () => ({ sha: 'old-sha', content: Buffer.from(JSON.stringify(state)).toString('base64') }) }
    const body = JSON.parse(options.body)
    assert.equal(body.sha, 'old-sha')
    assert.equal(body.branch, 'automation-state')
    writes++
    return { ok: false, status: 409 }
  } })
  await store.load()
  await assert.rejects(store.save(state), (error) => error.code === 'conflict')
  assert.equal(writes, 1)
  const wrong = new GitHubStateStore({ repository: 'owner/repo', token: 'fake', environment: 'staging', playlistId: 'different', request: async () => ({ ok: true, json: async () => ({ sha: 'old', content: Buffer.from(JSON.stringify(state)).toString('base64') }) }) })
  await assert.rejects(wrong.load(), (error) => error.code === 'invalid-or-wrong-playlist')
})

test('翌日に持ち越した直近検索は同じ期間・ページで続行する', async () => {
  const state = emptyState('playlist')
  state.search.lastDeepScan = now
  const queries = []
  const youtube = fakeYouTube({ search: async (_query, options) => { queries.push(options); return { ids: [], nextPageToken: 'next' } } })
  const limited = { ...config, maxSearchCalls: 1 }
  await discover({ state, works, config: limited, now, save, youtube })
  await discover({ state, works, config: limited, now: '2026-11-02T00:00:00Z', save, youtube })
  assert.equal(queries[0].publishedAfter, queries[1].publishedAfter)
  assert.equal(queries[1].pageToken, 'next')
})
