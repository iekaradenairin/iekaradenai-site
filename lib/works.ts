export const MOODS = ['和ロック', 'ポップス×エモーション', '青春', '夏', '静謐', 'バンドロック'] as const
export type Mood = (typeof MOODS)[number]

export type Work = {
  title: string
  youtubeId: string
  releasedAt?: `${number}-${number}-${number}` | null
  scene?: string
  roles?: string
  vocal?: string
  moods?: Mood[]
  nicoId?: string
  bpm?: number
  featured?: boolean
  altVersions?: { label: string; youtubeId: string }[]
}

export const works: Work[] = [
  {
    title: '秋乃',
    youtubeId: 'Jx_Wy3w1K8Y',
    releasedAt: null,
    scene: '京都の紅葉。死別ではなく未練。二人で見た紅葉を、何年経っても忘れられない。',
    vocal: '花隈千冬',
    moods: ['静謐'],
    bpm: 120,
  },
  {
    title: 'Loverador Tea',
    youtubeId: '93U2sYevkTQ',
    releasedAt: null,
    scene: '湖に沈んだ村。死んだ人に会いに、湖へ身を投げる。',
    vocal: '花隈千冬',
    bpm: 130,
  },
  {
    title: '花笑み、ひとひら',
    youtubeId: 'BC8ZgzJWhX0',
    releasedAt: '2025-07-01',
    scene: 'お祭り、花火、言えなかった告白。結末は委ねる。',
    roles: '作曲 / 編曲 / MIX',
    vocal: 'あまねもも',
    moods: ['和ロック'],
    bpm: 165,
  },
  {
    title: '水星巡航トリップ',
    youtubeId: 'wfamkctKfUw',
    releasedAt: '2025-08-29',
    scene: '深夜3時、波の音で眠りに落ちる。水面の星がシャンデリアになる海の夢。',
    roles: '作詞 / 作曲 / 編曲 / ボーカルディレクション / MIX',
    vocal: 'VoiSona 雨衣',
    moods: ['夏'],
    altVersions: [{ label: 'ボーカル版', youtubeId: 'j1jHlhBlnok' }],
  },
  {
    title: '花びらを集む',
    youtubeId: 'TkMa3mY4X-U',
    releasedAt: '2026-03-29',
    scene: '桜、言えなかった言葉、新しい春へ。後悔と再生。',
    vocal: '千冬V2',
    moods: ['和ロック'],
    bpm: 160,
  },
  {
    title: 'あの空の青',
    youtubeId: '0sPxCqFvrIg',
    releasedAt: '2026-04-17',
    scene: '放課後の屋上、風、光の粒。終わったことへの肯定。',
    moods: ['ポップス×エモーション'],
  },
  {
    title: '君色の白',
    youtubeId: 'l7iJFOIqoY0',
    releasedAt: '2026-05-31',
    scene: '4月から5月へ高まっていく片思い。今まさにその中にいる。',
    vocal: '千冬V2',
    moods: ['ポップス×エモーション'],
    nicoId: 'sm46379886',
  },
  {
    title: '藍空をなぞって',
    youtubeId: 'sepS54VqbnQ',
    releasedAt: '2026-06-26',
    scene: '神社、星、夏だけの命。夏が終われば空に帰る狐巫女との別れ。',
    roles: '作曲 / 編曲 / ボーカルディレクション / MIX',
    vocal: 'あまねもも',
    moods: ['和ロック'],
  },
  {
    title: 'スクリーン・エコー',
    youtubeId: 'jmvbCR526U4',
    releasedAt: '2026-07-25',
    vocal: '千冬V2',
    moods: ['バンドロック'],
    bpm: 180,
  },
  {
    title: '藍空をなぞって（ボカロ版）',
    youtubeId: 'FBlDIdRFPnk',
    releasedAt: '2026-08-21',
    scene: '#9「藍空をなぞって」のSynthesizerV版。ボカコレ ルーキー枠。',
    vocal: '千冬V2',
    moods: ['和ロック'],
    nicoId: 'sm46690420',
  },
]

const YOUTUBE_ID_RE = /^[A-Za-z0-9_-]{11}$/

function formatProblem(title: string, problem: string, cause: string, fix: string): string {
  return `✗ lib/works.ts:「${title}」\n  問題: ${problem}\n  原因: ${cause}\n  直し方: ${fix}`
}

function validateWorks(list: Work[]): string[] {
  const problems: string[] = []
  const titleSeen = new Set<string>()
  const idSeen = new Map<string, string>()

  for (const w of list) {
    if (!YOUTUBE_ID_RE.test(w.youtubeId)) {
      problems.push(
        formatProblem(
          w.title,
          `youtubeId が YouTube ID の形式ではありません → "${w.youtubeId}"`,
          'URL 全体を貼っている可能性があります',
          'youtu.be/ の後ろの11文字だけを書いてください'
        )
      )
    }
    for (const alt of w.altVersions ?? []) {
      if (!YOUTUBE_ID_RE.test(alt.youtubeId)) {
        problems.push(
          formatProblem(
            w.title,
            `altVersions「${alt.label}」の youtubeId が YouTube ID の形式ではありません → "${alt.youtubeId}"`,
            'URL 全体を貼っている可能性があります',
            'youtu.be/ の後ろの11文字だけを書いてください'
          )
        )
      }
    }
    if (titleSeen.has(w.title)) {
      problems.push(
        formatProblem(w.title, 'タイトルが重複しています', '同じ曲を2回登録した可能性があります', '重複したエントリを削除してください')
      )
    }
    titleSeen.add(w.title)

    if (idSeen.has(w.youtubeId)) {
      problems.push(
        formatProblem(
          w.title,
          `youtubeId が「${idSeen.get(w.youtubeId)}」と重複しています`,
          'コピペミスの可能性があります',
          '正しい YouTube ID に直してください'
        )
      )
    }
    idSeen.set(w.youtubeId, w.title)
  }

  return problems
}

export const workProblems = validateWorks(works)
if (workProblems.length > 0) {
  throw new Error(workProblems.join('\n\n'))
}

export function compareWorks(a: Work, b: Work): number {
  if (a.releasedAt !== b.releasedAt) {
    if (a.releasedAt == null) return 1
    if (b.releasedAt == null) return -1
    return a.releasedAt < b.releasedAt ? 1 : -1
  }
  if (a.title !== b.title) return a.title < b.title ? -1 : 1
  return a.youtubeId < b.youtubeId ? -1 : a.youtubeId > b.youtubeId ? 1 : 0
}

export const worksSorted: Work[] = [...works].sort(compareWorks)

export const heroWork: Work = works.find((w) => w.featured) ?? worksSorted[0]

export function youtubeThumbnailUrl(youtubeId: string, quality: 'maxresdefault' | 'hqdefault' = 'maxresdefault'): string {
  return `https://i.ytimg.com/vi/${youtubeId}/${quality}.jpg`
}
