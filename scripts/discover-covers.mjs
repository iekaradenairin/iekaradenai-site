import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { YouTube, ServiceError, refreshAccessToken } from './automation/api.mjs'
import { emptyState, reconcile, setIncident } from './automation/rules.mjs'
import { discover, applyCandidates, validateConfig } from './automation/engine.mjs'
import { GitHubStateStore } from './automation/store.mjs'
import { flushNotifications } from './automation/discord.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = async (name) => JSON.parse(await fs.readFile(path.join(ROOT, name), 'utf8'))
const safe = (error) => error instanceof ServiceError ? error.code : 'unexpected-error'
const timestamp = () => new Date().toISOString()
const markdown = (text) => String(text || '').replace(/[\r\n]/g, ' ').replace(/([\\`*_~|<>[\]])/g, '\\$1')

export async function main(env = process.env) {
  const mode = env.AUTOMATION_MODE || 'preview'
  if (!['preview', 'apply', 'notify-test', 'sync', 'failure'].includes(mode)) throw new ServiceError('config', 'invalid-mode')
  const environment = env.GITHUB_REF_NAME === 'main' ? 'production' : 'staging'
  const config = await read('lib/discovery.config.json')
  validateConfig(config)
  const published = await read('lib/covers.config.json')
  const playlistId = environment === 'production' ? published.playlistId : env.COVERS_STAGING_PLAYLIST_ID
  const context = { environment, playlistId: playlistId || published.playlistId, runUrl: env.GITHUB_RUN_ID ? `https://github.com/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}` : undefined }
  const youtube = new YouTube({ key: env.YOUTUBE_API_KEY })

  if (mode === 'preview') {
    // 読み取りだけ。Googleの書き込み認証・検証リスト未作成でも検索を検証できる。
    const state = emptyState(published.playlistId)
    reconcile(state, await youtube.playlist(published.playlistId), timestamp())
    const report = await discover({ youtube, works: await read('lib/works.generated.json'), config, state, save: async () => {} })
    await fs.writeFile(path.join(ROOT, 'automation-report.json'), JSON.stringify({ generatedAt: timestamp(), songs: (await import('./automation/rules.mjs')).buildSongs(await read('lib/works.generated.json'), config), candidates: report }, null, 2) + '\n')
    const accepted = report.filter((item) => item.accepted)
    console.log(`読み取り検証: ${report.length}動画を判定、${accepted.length}件が新規追加の候補です。リストへの書き込みはしていません。`)
    if (env.GITHUB_STEP_SUMMARY) await fs.appendFile(env.GITHUB_STEP_SUMMARY, `## 歌ってくれた作品：検索の検証\n\nYouTubeへの追加なし。新規候補 ${accepted.length} 件。\n\n${accepted.map((item) => `- ${markdown(item.title)}／${markdown(item.channelTitle)}\n  - https://www.youtube.com/watch?v=${item.videoId}\n  - ${markdown(item.reason)}`).join('\n')}\n`)
    return
  }

  if (!playlistId) throw new ServiceError('config', 'staging-playlist-not-configured')
  if (environment === 'staging' && playlistId === published.playlistId) throw new ServiceError('config', 'staging-must-use-separate-playlist')
  const store = new GitHubStateStore({ repository: env.GITHUB_REPOSITORY, token: env.GH_TOKEN, environment, playlistId })
  const state = await store.load()
  const save = (value) => store.save(value)
  const flush = () => flushNotifications({ state, save, webhook: env.DISCORD_WEBHOOK_URL, context })
  const now = timestamp()
  let failed = false
  if (mode === 'notify-test') {
    state.outbox.push({ id: `test-${env.GITHUB_RUN_ID || now}`, type: 'test', at: now })
    await save(state)
    await flush()
    console.log('Discord接続テストを送信しました。')
    return
  }
  if (mode === 'failure') {
    setIncident(state, env.FAILED_COMPONENT || 'website', 'workflow-failed', now)
    await save(state)
    await flush()
    return
  }

  let component = 'playlist'
  try {
    reconcile(state, await youtube.playlist(playlistId), now)
    setIncident(state, 'playlist', null, now)
    await save(state)
    if (mode === 'sync') {
      // 停止スイッチで自動追加を止めていても、履歴同期・未送信通知は継続する。
      setIncident(state, 'website', null, now)
      await save(state)
    } else {
      component = 'search'
      await discover({ youtube, works: await read('lib/works.generated.json'), config, state, save })
      if (config.enabled || env.AUTOMATION_EXPLICIT_APPLY === 'true') {
        if (environment === 'production' && !config.enabled) throw new ServiceError('config', 'production-additions-disabled')
        component = 'addition'
        youtube.token = await refreshAccessToken(env)
        await applyCandidates({ youtube, state, config, save })
      }
    }
  } catch (error) {
    // 状態保存が壊れた場合は外部への書き込みを継続しない。
    if (error instanceof ServiceError && error.service === 'state') throw error
    failed = true
    setIncident(state, component, safe(error), now)
    await save(state)
    console.error(`${component}: ${safe(error)}`)
  }
  // 通知を先に永続化しているため、送れなければ次回再送できる。
  await flush()
  if (failed) {
    if (env.GITHUB_OUTPUT) await fs.appendFile(env.GITHUB_OUTPUT, 'error_reported=true\n')
    process.exitCode = 1
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`自動処理を停止しました: ${safe(error)}`)
    process.exitCode = 1
  })
}
