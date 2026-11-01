export class ServiceError extends Error {
  constructor(service, code) {
    super(`${service}: ${code}`)
    this.code = code
    this.service = service
  }
}

export async function refreshAccessToken(env = process.env, request = fetch) {
  if (!env.YOUTUBE_CLIENT_ID || !env.YOUTUBE_CLIENT_SECRET || !env.YOUTUBE_REFRESH_TOKEN) throw new ServiceError('youtube', 'oauth-not-configured')
  let response
  try {
    response = await request('https://oauth2.googleapis.com/token', {
      method: 'POST', signal: AbortSignal.timeout(30000),
      body: new URLSearchParams({ client_id: env.YOUTUBE_CLIENT_ID, client_secret: env.YOUTUBE_CLIENT_SECRET, refresh_token: env.YOUTUBE_REFRESH_TOKEN, grant_type: 'refresh_token' }),
    })
  } catch { throw new ServiceError('youtube', 'oauth-network') }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new ServiceError('youtube', ['invalid_grant', 'invalid_client'].includes(body.error) ? 'reauth-required' : `oauth-http-${response.status}`)
  }
  const body = await response.json()
  if (!body.access_token) throw new ServiceError('youtube', 'oauth-invalid-response')
  return body.access_token
}

export class YouTube {
  constructor({ key, token, request = fetch }) { Object.assign(this, { key, token, request }) }
  async call(resource, params, body) {
    const url = new URL(`https://www.googleapis.com/youtube/v3/${resource}`)
    for (const [key, value] of Object.entries(params)) if (value !== undefined) url.searchParams.set(key, value)
    if (!this.token) {
      if (!this.key) throw new ServiceError('youtube', 'api-key-not-configured')
      url.searchParams.set('key', this.key)
    }
    let response
    try {
      response = await this.request(url, {
        method: body ? 'POST' : 'GET', signal: AbortSignal.timeout(30000),
        headers: { ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}) },
        ...(body ? { body: JSON.stringify(body) } : {}),
      })
    } catch { throw new ServiceError('youtube', body ? 'write-result-unknown' : 'read-network') }
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      const reason = error.error?.errors?.[0]?.reason
      // APIレスポンス全文・URL・資格情報はログに出さない。
      const safeReason = new Set(['quotaExceeded', 'playlistNotFound', 'playlistItemsNotAccessible', 'videoNotFound', 'forbidden', 'authError'])
      throw new ServiceError('youtube', response.status === 401 ? 'reauth-required' : safeReason.has(reason) ? reason : `http-${response.status}`)
    }
    return response.json()
  }
  async playlist(id) {
    const items = []
    let pageToken
    do {
      const result = await this.call('playlistItems', { part: 'snippet,contentDetails', playlistId: id, maxResults: 50, pageToken })
      if (!Array.isArray(result.items)) throw new ServiceError('youtube', 'invalid-playlist-response')
      for (const item of result.items) {
        const snippet = item.snippet
        const videoId = snippet?.resourceId?.videoId
        if (/^[\w-]{11}$/.test(videoId || '')) items.push({ id: videoId, title: snippet.title || '', channelTitle: snippet.videoOwnerChannelTitle || '' })
      }
      pageToken = result.nextPageToken
    } while (pageToken)
    return items
  }
  async originalChannel(handle) {
    const result = await this.call('channels', { part: 'id', forHandle: handle })
    if (!result.items?.[0]?.id) throw new ServiceError('youtube', 'original-channel-not-found')
    return result.items[0].id
  }
  async search(query, options = {}) {
    const result = await this.call('search', { part: 'snippet', type: 'video', q: query, maxResults: 50, order: options.deep ? 'relevance' : 'date', publishedAfter: options.publishedAfter, pageToken: options.pageToken })
    if (!Array.isArray(result.items)) throw new ServiceError('youtube', 'invalid-search-response')
    return { ids: result.items.map((item) => item.id?.videoId).filter(Boolean), nextPageToken: result.nextPageToken }
  }
  async videos(ids) {
    const result = []
    for (let i = 0; i < ids.length; i += 50) {
      const response = await this.call('videos', { part: 'snippet,status', id: ids.slice(i, i + 50).join(',') })
      if (!Array.isArray(response.items)) throw new ServiceError('youtube', 'invalid-video-response')
      for (const video of response.items) result.push({ id: video.id, title: video.snippet.title, description: video.snippet.description, channelId: video.snippet.channelId, channelTitle: video.snippet.channelTitle, publishedAt: video.snippet.publishedAt, public: video.status.privacyStatus === 'public' || video.status.privacyStatus === 'unlisted' })
    }
    return result
  }
  async add(playlistId, videoId) {
    return this.call('playlistItems', { part: 'snippet' }, { snippet: { playlistId, resourceId: { kind: 'youtube#video', videoId } } })
  }
}
