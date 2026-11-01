import { buildSongs, decide, reconcile, additionEvent, setIncident } from './rules.mjs'
import { ServiceError } from './api.mjs'

export function validateConfig(config) {
  for (const [key, max] of [['maxAdditions', 5], ['maxSearchCalls', 80], ['recentDays', 365]]) {
    if (!Number.isInteger(config[key]) || config[key] < 1 || config[key] > max) throw new ServiceError('config', `invalid-${key}`)
  }
  if (typeof config.enabled !== 'boolean' || !config.authorNames?.length || !config.originalChannelHandle) throw new ServiceError('config', 'invalid-config')
  for (const key of ['authorNames', 'excludedVideoIds', 'excludedChannelIds']) {
    if (!Array.isArray(config[key]) || config[key].some((value) => typeof value !== 'string' || !value.trim())) throw new ServiceError('config', `invalid-${key}`)
  }
  for (const key of ['titleOverrides', 'aliases']) if (!config[key] || Array.isArray(config[key]) || typeof config[key] !== 'object') throw new ServiceError('config', `invalid-${key}`)
  for (const values of Object.values(config.aliases)) if (!Array.isArray(values) || values.some((value) => typeof value !== 'string' || !value.trim())) throw new ServiceError('config', 'invalid-aliases')
}

export async function discover({ youtube, works, config, state, save, now = new Date().toISOString() }) {
  validateConfig(config)
  const songs = buildSongs(works, config)
  if (!songs.length) throw new ServiceError('search', 'no-songs')
  const originalChannelId = await youtube.originalChannel(config.originalChannelHandle)
  const search = structuredClone(state.search)
  const deep = !search.lastDeepScan || Date.parse(now) - Date.parse(search.lastDeepScan) > 7 * 86400000
  const publishedAfter = deep ? undefined : (search.windowAfter ??= new Date(Date.parse(now) - config.recentDays * 86400000).toISOString())
  const tasks = songs.flatMap((song) => song.aliases.map((alias) => ({ song: song.key, query: `"${alias}"` })))
  let calls = 0
  const found = new Set(Object.keys(state.pending))
  // 予算内でページを巡回し、途中のページトークンも永続化する。
  while (calls < config.maxSearchCalls) {
    const cursor = search.cursor % tasks.length
    const task = tasks[cursor]
    const fingerprint = `${deep ? 'deep' : 'recent'}:${task.query}:${publishedAfter?.slice(0, 10) || ''}`
    const pageToken = search.task === fingerprint ? search.pageToken : undefined
    const result = await youtube.search(task.query, { deep, publishedAfter, pageToken })
    calls++
    result.ids.forEach((id) => { if (!state.history[id]) found.add(id) })
    if (result.nextPageToken) {
      search.task = fingerprint
      search.pageToken = result.nextPageToken
    } else {
      search.cursor = (cursor + 1) % tasks.length
      delete search.task
      delete search.pageToken
      if (search.cursor === 0) {
        if (deep) search.lastDeepScan = now
        delete search.windowAfter
        break
      }
    }
  }
  // 検索の短い概要ではなく、動画詳細の完全な概要欄で判定する。
  const videos = await youtube.videos([...found])
  const present = new Set(videos.map((video) => video.id))
  for (const id of Object.keys(state.pending)) if (!present.has(id)) delete state.pending[id]
  const report = []
  for (const video of videos) {
    if (state.history[video.id]) continue
    const match = decide(video, songs, config, originalChannelId)
    report.push({ videoId: video.id, title: video.title, channelTitle: video.channelTitle, ...match })
    if (match.accepted) state.pending[video.id] = { id: video.id, title: video.title, channelTitle: video.channelTitle, reason: match.reason, discoveredAt: state.pending[video.id]?.discoveredAt || now }
    else delete state.pending[video.id]
  }
  state.lastSearchSuccessAt = now
  state.search = search
  setIncident(state, 'search', null, now)
  await save(state)
  return report
}

export async function applyCandidates({ youtube, state, config, save, now = new Date().toISOString() }) {
  validateConfig(config)
  const added = []
  for (const candidate of Object.values(state.pending).slice(0, config.maxAdditions)) {
    // 必ず処理直前に照合し、手動追加と失敗後の再実行にも対応する。
    reconcile(state, await youtube.playlist(state.playlistId), now)
    await save(state)
    if (state.history[candidate.id]) continue
    // API書き込み前に意図を永続化する。保存できなければ追加しない。
    state.attempts[candidate.id] = { reason: candidate.reason, at: now }
    await save(state)
    await youtube.add(state.playlistId, candidate.id)
    state.history[candidate.id] = { firstSeenAt: now, source: 'automatic' }
    delete state.attempts[candidate.id]
    delete state.pending[candidate.id]
    state.outbox.push(additionEvent(candidate, candidate, now))
    await save(state)
    added.push(candidate.id)
  }
  setIncident(state, 'addition', null, now)
  state.lastAdditionSuccessAt = now
  await save(state)
  return added
}
