import { ServiceError } from './api.mjs'

const clip = (text, max) => String(text || '').replace(/[\r\n]/g, ' ').replace(/([\\`*_~|<>])/g, '\\$1').slice(0, max)

export function notificationBatches(events, { environment, playlistId, runUrl }) {
  const label = environment === 'staging' ? '【検証】' : ''
  const footer = `\n[再生リスト](https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId)})${runUrl ? ` · [実行結果](${runUrl})` : ''}`
  const batches = []
  const added = events.filter((event) => event.type === 'added')
  for (let i = 0; i < added.length; i += 5) {
    const group = added.slice(i, i + 5)
    batches.push({ eventIds: group.map((event) => event.id), content: `${label} **歌ってくれた作品を${group.length}件追加しました**\n${group.map((event) => `\n${clip(event.title, 120)}／${clip(event.channelTitle, 50)}\nhttps://www.youtube.com/watch?v=${event.videoId}\n追加理由：${clip(event.reason, 80)}`).join('\n')}${footer}` })
  }
  for (const event of events.filter((event) => event.type !== 'added')) {
    let text
    if (event.type === 'test') text = 'Discord通知の接続テストです。動画の追加・削除は行っていません。'
    else if (event.type === 'uncertain') text = `追加結果を確定できなかった動画があります。重複や再追加を避けるため、自動で再試行しません。\nhttps://www.youtube.com/watch?v=${event.videoId}`
    else if (event.type === 'recovered') text = `${clip(event.component, 60)} の処理が復旧しました。`
    else if (event.code === 'reauth-required') text = 'YouTubeの再認証が必要です。自動追加を停止しました。既存の再生リスト・掲載作品は維持しています。\n復旧手順：リポジトリの docs/YOUTUBE_AUTOMATION.md を確認してください。'
    else text = `${clip(event.component, 60)} の処理が停止しました。既存の再生リストは維持しています。\nエラー：${clip(event.code, 100)}`
    batches.push({ eventIds: [event.id], content: `${label} **YouTube自動更新**\n${text}${footer}` })
  }
  return batches
}

export async function flushNotifications({ state, save, webhook, context, request = fetch }) {
  if (!state.outbox.length) return
  let url
  try { url = new URL(webhook) } catch { throw new ServiceError('discord', 'webhook-not-configured') }
  if (url.protocol !== 'https:' || url.hostname !== 'discord.com' || !/^\/api\/webhooks\/\d+\/[\w-]+$/.test(url.pathname)) throw new ServiceError('discord', 'invalid-webhook')
  url.searchParams.set('wait', 'true')
  for (const batch of notificationBatches(state.outbox, context)) {
    let response
    try {
      response = await request(url, {
        method: 'POST', signal: AbortSignal.timeout(30000), headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: batch.content, allowed_mentions: { parse: [] }, flags: 4 }),
      })
    } catch { throw new ServiceError('discord', 'delivery-unknown') }
    if (!response.ok) throw new ServiceError('discord', `http-${response.status}`)
    const message = await response.json().catch(() => null)
    if (!message?.id) throw new ServiceError('discord', 'delivery-unknown')
    state.outbox = state.outbox.filter((event) => !batch.eventIds.includes(event.id))
    state.lastDiscordSuccessAt = new Date().toISOString()
    await save(state)
  }
}
