import fs from 'node:fs/promises'
import { GitHubStateStore } from './automation/store.mjs'
import { flushNotifications } from './automation/discord.mjs'
import { emptyState, setIncident } from './automation/rules.mjs'

const env = process.env
const { playlistId } = JSON.parse(await fs.readFile(new URL('../lib/covers.config.json', import.meta.url), 'utf8'))
const environment = env.GITHUB_REF_NAME === 'main' ? 'production' : 'staging'
const context = { environment, playlistId, runUrl: `https://github.com/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}` }
const store = new GitHubStateStore({ repository: env.GITHUB_REPOSITORY, token: env.GH_TOKEN, environment, playlistId, slot: 'alerts' })
let state
let persist = true
try { state = await store.load() } catch {
  persist = false
  state = emptyState(playlistId)
  console.error('通知履歴を読み込めません。今回の異常はDiscordへ直接通知します。')
}
const component = env.STATUS_COMPONENT || 'workflow'
const failed = env.STATUS_RESULT !== 'success'
setIncident(state, component, failed ? 'workflow-failed' : null, new Date().toISOString())
const save = async (value) => { if (persist) await store.save(value) }
try { await save(state) } catch { persist = false; console.error('通知履歴を保存できません。直接通知を試みます。') }
await flushNotifications({ state, save, webhook: env.DISCORD_WEBHOOK_URL, context }).catch(() => {
  console.error('Discordへ通知できませんでした。GitHub Actionsの実行結果を確認してください。')
  process.exitCode = 1
})
