// GitHub Secretsの接続検証専用。動画追加を伴わず、認証情報を一切表示しない。
import { flushNotifications } from './automation/discord.mjs'
const state = { outbox: [{ id: `test-${process.env.GITHUB_RUN_ID || Date.now()}`, type: 'test' }] }
await flushNotifications({
  state, save: async () => {}, webhook: process.env.DISCORD_WEBHOOK_URL,
  context: {
    environment: 'staging', playlistId: 'PLJUkB9xv7gTE',
    runUrl: `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`,
  },
})
console.log('Discordへの検証通知が受理されました。')
