import { ServiceError } from './api.mjs'
import { emptyState } from './rules.mjs'

export class GitHubStateStore {
  constructor({ repository, token, environment, playlistId, slot = 'main', request = fetch }) {
    if (!/^[\w.-]+\/[\w.-]+$/.test(repository || '') || !['staging', 'production'].includes(environment)) throw new ServiceError('state', 'invalid-config')
    Object.assign(this, { repository, token, environment, playlistId, request })
    this.branch = 'automation-state'
    this.sha = null
    if (!['main', 'alerts'].includes(slot)) throw new ServiceError('state', 'invalid-slot')
    this.filename = `${environment}${slot === 'alerts' ? '-alerts' : ''}.json`
  }
  async api(endpoint, { method = 'GET', body, allow404 = false } = {}) {
    let response
    try {
      response = await this.request(`https://api.github.com/repos/${this.repository}/${endpoint}`, {
        method, signal: AbortSignal.timeout(30000),
        headers: { Authorization: `Bearer ${this.token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28' },
        ...(body ? { body: JSON.stringify(body) } : {}),
      })
    } catch { throw new ServiceError('state', 'network') }
    if (response.status === 404 && allow404) return null
    if (!response.ok) throw new ServiceError('state', response.status === 409 ? 'conflict' : `http-${response.status}`)
    return response.json()
  }
  async load() {
    const file = await this.api(`contents/${this.filename}?ref=${this.branch}`, { allow404: true })
    if (!file) {
      // ブランチの存在も確認する。権限エラーを空の履歴と取り違えない。
      const branch = await this.api(`git/ref/heads/${this.branch}`, { allow404: true })
      if (!branch) {
        const repository = await this.api('')
        const base = await this.api(`git/ref/heads/${repository.default_branch}`)
        await this.api('git/refs', { method: 'POST', body: { ref: `refs/heads/${this.branch}`, sha: base.object.sha } })
      }
      return emptyState(this.playlistId)
    }
    this.sha = file.sha
    const state = JSON.parse(Buffer.from(file.content, 'base64').toString('utf8'))
    if (state.version !== 1 || state.playlistId !== this.playlistId || !state.history || !state.pending || !state.attempts || !Array.isArray(state.outbox) || !state.search || !state.incidents) throw new ServiceError('state', 'invalid-or-wrong-playlist')
    return state
  }
  async save(state) {
    const result = await this.api(`contents/${this.filename}`, {
      method: 'PUT',
      body: {
        message: `automation: checkpoint ${this.environment} [skip ci]`, branch: this.branch,
        content: Buffer.from(JSON.stringify(state, null, 2) + '\n').toString('base64'),
        ...(this.sha ? { sha: this.sha } : {}),
      },
    })
    this.sha = result.content.sha
  }
}
