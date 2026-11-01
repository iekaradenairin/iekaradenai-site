// ローカルのループバックOAuth。資格情報を出力せずGitHub Secretsへ直接登録する。
import fs from 'node:fs/promises'
import http from 'node:http'
import crypto from 'node:crypto'
import { spawn } from 'node:child_process'
import { YouTube } from './automation/api.mjs'

const filename = process.argv[2]
if (!filename) throw new Error('使い方: node scripts/authorize-youtube.mjs /absolute/path/to/client_secret.json [--create-staging-playlist]')
const credentials = JSON.parse(await fs.readFile(filename, 'utf8')).installed
if (!credentials?.client_id || !credentials.client_secret) throw new Error('デスクトップアプリ用のOAuth JSONを指定してください')
const verifier = crypto.randomBytes(32).toString('base64url')
const challenge = crypto.createHash('sha256').update(verifier).digest('base64url')
const state = crypto.randomBytes(24).toString('base64url')
const server = http.createServer()
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const redirectUri = `http://127.0.0.1:${server.address().port}`
const authorization = new URL('https://accounts.google.com/o/oauth2/v2/auth')
for (const [key, value] of Object.entries({ client_id: credentials.client_id, redirect_uri: redirectUri, response_type: 'code', scope: 'https://www.googleapis.com/auth/youtube.force-ssl', access_type: 'offline', prompt: 'consent', state, code_challenge: challenge, code_challenge_method: 'S256' })) authorization.searchParams.set(key, value)
console.log('以下のURLをブラウザで開き、対象YouTubeチャンネルのアカウントで認証してください。')
console.log(authorization.href)

const setSecret = (name, value) => new Promise((resolve, reject) => {
  const child = spawn('gh', ['secret', 'set', name, '--repo', 'iekaradenairin/iekaradenai-site'], { stdio: ['pipe', 'ignore', 'ignore'] })
  child.on('error', () => reject(new Error('GitHub Secretsへ接続できません')))
  child.on('close', (code) => code === 0 ? resolve() : reject(new Error(`${name} を登録できませんでした`)))
  child.stdin.end(value)
})

try {
  const code = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('認証待ちが時間切れになりました。再実行してください。')), 10 * 60 * 1000)
    server.on('request', (request, response) => {
      const url = new URL(request.url, redirectUri)
      if (url.searchParams.get('state') !== state) { response.writeHead(400); response.end('Invalid state'); return }
      clearTimeout(timer)
      if (url.searchParams.get('error') || !url.searchParams.get('code')) {
        response.writeHead(400); response.end('Authorization cancelled.'); reject(new Error('認証を完了できませんでした')); return
      }
      response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
      response.end('認証コードを受け取りました。このタブを閉じてCodexへ戻ってください。')
      resolve(url.searchParams.get('code'))
    })
  })
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', signal: AbortSignal.timeout(30000),
    body: new URLSearchParams({ client_id: credentials.client_id, client_secret: credentials.client_secret, code, code_verifier: verifier, redirect_uri: redirectUri, grant_type: 'authorization_code' }),
  })
  if (!response.ok) throw new Error('認証コードを交換できませんでした。資格情報は出力しません。')
  const tokens = await response.json()
  if (!tokens.refresh_token) throw new Error('更新トークンを取得できません。再認証してください。')
  await setSecret('YOUTUBE_CLIENT_ID', credentials.client_id)
  await setSecret('YOUTUBE_CLIENT_SECRET', credentials.client_secret)
  await setSecret('YOUTUBE_REFRESH_TOKEN', tokens.refresh_token)
  console.log('Google認証情報をGitHub Secretsに登録しました。')
  if (process.argv.includes('--create-staging-playlist')) {
    const youtube = new YouTube({ token: tokens.access_token })
    const playlist = await youtube.call('playlists', { part: 'snippet,status' }, {
      snippet: { title: '【検証】歌ってくれた作品 — 自動追加テスト', description: '家から出ない倫のHPステージング用。自動追加・通知・削除後の再追加防止を確認するリストです。' },
      status: { privacyStatus: 'unlisted' },
    })
    await new Promise((resolve, reject) => {
      const child = spawn('gh', ['variable', 'set', 'COVERS_STAGING_PLAYLIST_ID', '--repo', 'iekaradenairin/iekaradenai-site', '--body', playlist.id], { stdio: 'ignore' })
      child.on('error', reject)
      child.on('close', (code) => code === 0 ? resolve() : reject(new Error('検証リストの変数登録に失敗しました')))
    })
    console.log(`検証用リスト: https://www.youtube.com/playlist?list=${playlist.id}`)
  }
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
} finally {
  server.close()
}
