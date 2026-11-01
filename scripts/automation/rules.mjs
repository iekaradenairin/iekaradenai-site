import { splitWorkTitle } from '../../lib/workTitle.ts'

export const normalize = (text) => text.normalize('NFKC').toLowerCase().replace(/[\p{P}\p{Z}\p{S}\s]/gu, '')

export function buildSongs(works, config) {
  const songs = new Map()
  for (const work of works) {
    const title = config.titleOverrides[work.videoId] ?? splitWorkTitle(work.title).title.replace(/\s+feat\.?\s+.+$/i, '').trim()
    const key = normalize(title)
    if (key.length < 2) throw new Error('曲名の補正が必要です')
    if (!songs.has(key)) songs.set(key, { key, title, aliases: [...new Set([title, ...(config.aliases[title] || [])])], originalIds: [] })
    songs.get(key).originalIds.push(work.videoId)
  }
  return [...songs.values()]
}

export function linkedVideoIds(text) {
  const ids = new Set()
  for (const match of text.matchAll(/https?:\/\/[^\s<>"）)]+/g)) {
    try {
      const url = new URL(match[0])
      const host = url.hostname.toLowerCase()
      let id
      if (host === 'youtu.be') id = url.pathname.split('/')[1]
      if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com'].includes(host)) {
        id = url.searchParams.get('v') || (/^\/(shorts|embed|live)\//.test(url.pathname) ? url.pathname.split('/')[2] : null)
      }
      if (/^[\w-]{11}$/.test(id || '')) ids.add(id)
    } catch { /* URLとして解釈できない文字列は照合しない */ }
  }
  return ids
}

export function decide(video, songs, config, originalChannelId) {
  if (config.excludedVideoIds.includes(video.id)) return { accepted: false, reason: 'excluded-video' }
  if (config.excludedChannelIds.includes(video.channelId)) return { accepted: false, reason: 'excluded-channel' }
  if (!video.public) return { accepted: false, reason: 'unavailable' }
  const text = `${video.title}\n${video.description}`
  const normalized = normalize(text)
  const links = linkedVideoIds(text)
  for (const song of songs) {
    if (!song.aliases.some((alias) => normalized.includes(normalize(alias)))) continue
    if (video.channelId === originalChannelId && song.originalIds.includes(video.id)) return { accepted: false, reason: 'own-original' }
    const originalLink = song.originalIds.find((id) => links.has(id))
    const author = config.authorNames.find((name) => normalized.includes(normalize(name)))
    if (originalLink || author) return { accepted: true, song: song.title, reason: originalLink ? `原曲URL一致: ${originalLink}` : `作者表記一致: ${author}` }
  }
  return { accepted: false, reason: 'no-match' }
}

export function emptyState(playlistId) {
  return { version: 1, playlistId, history: {}, pending: {}, attempts: {}, outbox: [], search: { cursor: 0, lastDeepScan: null }, incidents: {} }
}

export function reconcile(state, items, now) {
  const present = new Set(items.map((item) => item.id))
  for (const item of items) {
    const attempt = state.attempts[item.id]
    if (attempt && !state.history[item.id]) {
      state.outbox.push(additionEvent(item, attempt, now))
    }
    state.history[item.id] ??= { firstSeenAt: now, source: attempt ? 'automatic' : 'playlist' }
    delete state.pending[item.id]
    delete state.attempts[item.id]
  }
  // 結果不明の追加を次回再送しない。追加成功後に手動削除された可能性もあるため。
  for (const id of Object.keys(state.attempts)) {
    if (!present.has(id)) {
      state.history[id] ??= { firstSeenAt: now, source: 'uncertain-attempt' }
      delete state.attempts[id]
      delete state.pending[id]
      state.outbox.push({ id: `uncertain-${id}`, type: 'uncertain', videoId: id, at: now })
    }
  }
}

export function additionEvent(video, match, now) {
  return { id: `added-${video.id}`, type: 'added', videoId: video.id, title: video.title, channelTitle: video.channelTitle, reason: match.reason, at: now }
}

export function setIncident(state, component, code, now) {
  const previous = state.incidents[component]
  if (code) {
    if (previous?.code === code) return
    state.incidents[component] = { code, since: now }
    state.outbox.push({ id: `${component}-${now}`, type: 'error', component, code, at: now })
  } else if (previous) {
    delete state.incidents[component]
    state.outbox.push({ id: `${component}-recovered-${now}`, type: 'recovered', component, at: now })
  }
}
