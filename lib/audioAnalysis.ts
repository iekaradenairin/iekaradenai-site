/**
 * 音声データチェックの解析。
 *
 * 解析はすべてブラウザ内で完結する。ファイルはどこにも送信しないし保存もしない
 * （ページ上でもそう明言している）ので、ここに送信処理を足さないこと。
 *
 * 判定はあくまで目安。「注意」が出ても実際は問題ないこと、逆に「大丈夫そう」でも
 * 聴けば気になることがある、という前提で文面を書いてある。断定しない。
 */

export type Level = 'ok' | 'warn' | 'bad' | 'info'

export type Check = {
  label: string
  level: Level
  badge: string
  value: string
  note: string
}

export type Report = {
  checks: Check[]
  summary: { tone: 'ok' | 'warn' | 'bad'; title: string; body: string }
  spec: { format: string; length: string; channels: string }
}

/** measure() が受けられる最小限の形。テストから AudioBuffer なしで叩けるようにしている */
export type Samples = {
  numberOfChannels: number
  length: number
  sampleRate: number
  duration: number
  getChannelData(channel: number): Float32Array
}

export type Measurement = {
  peakDb: number
  clipRatio: number
  maxRun: number
  loudDb: number
  noiseDb: number | null
  /** 静かな区間が無くて測れなかった場合は null */
  snr: number | null
  headSec: number
  identical: boolean
}

const BADGE: Record<Level, string> = {
  ok: '大丈夫そう',
  warn: 'すこし注意',
  bad: '先に見直したい',
  info: '参考',
}

const db = (x: number) => (x > 0 ? 20 * Math.log10(x) : -120)
const fix = (x: number, d = 1) => (x <= -119 ? '-∞' : x.toFixed(d))

/**
 * WAV の fmt チャンクからサンプルレートとビット深度を読む。
 *
 * decodeAudioData 後の AudioBuffer.sampleRate は「再生環境の」値に変換済みなので、
 * 提出データの実際の書き出し設定を知るにはファイル自身のヘッダを見るしかない。
 * WAV 以外（MP3 等）は 0 を返し、呼び出し側で「不明」として扱う。
 */
export function parseWavHeader(buf: ArrayBuffer): { bits: number; rate: number } {
  const none = { bits: 0, rate: 0 }
  try {
    const v = new DataView(buf)
    if (v.byteLength < 44) return none
    const str = (o: number, n: number) => {
      let s = ''
      for (let i = 0; i < n; i++) s += String.fromCharCode(v.getUint8(o + i))
      return s
    }
    if (str(0, 4) !== 'RIFF' || str(8, 4) !== 'WAVE') return none
    let p = 12
    while (p + 8 <= v.byteLength) {
      const id = str(p, 4)
      const size = v.getUint32(p + 4, true)
      if (id === 'fmt ') {
        return { rate: v.getUint32(p + 12, true) || 0, bits: v.getUint16(p + 22, true) || 0 }
      }
      p += 8 + size + (size % 2) // チャンクは偶数バイト境界に揃う
    }
    return none
  } catch {
    return none
  }
}

export function measure(audio: Samples): Measurement {
  const ch = audio.numberOfChannels
  const len = audio.length
  const data: Float32Array[] = []
  for (let c = 0; c < ch; c++) data.push(audio.getChannelData(c))

  const win = Math.max(256, Math.round(audio.sampleRate * 0.05)) // 50ms
  const frames: number[] = []
  let peak = 0
  let clipped = 0
  let run = 0
  let maxRun = 0
  let identical = ch > 1

  for (let i = 0; i < len; i += win) {
    let sum = 0
    let n = 0
    const end = Math.min(len, i + win)
    for (let j = i; j < end; j++) {
      let mix = 0
      for (let c = 0; c < ch; c++) {
        const s = data[c][j]
        const a = Math.abs(s)
        if (a > peak) peak = a
        if (a >= 0.9895) {
          clipped++
          run++
          if (run > maxRun) maxRun = run
        } else {
          run = 0
        }
        mix += s
      }
      if (identical && ch > 1 && Math.abs(data[0][j] - data[1][j]) > 0.0005) identical = false
      mix /= ch
      sum += mix * mix
      n++
    }
    frames.push(Math.sqrt(sum / Math.max(1, n)))
  }

  const sorted = frames.slice().sort((a, b) => a - b)
  const q = (p: number) => sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(sorted.length * p)))] || 0
  const loud = q(0.92)

  // ノイズフロアは「実際に静かな区間」からだけ測る。鳴りっぱなしの音源には
  // 静かな区間が無いので、その場合は測定不能として null を返す。
  // ここで一番小さいフレームを拾うと、無音の無い音源で S/N を過大評価してしまう。
  const gateQuiet = loud * Math.pow(10, -25 / 20)
  const quiet = sorted.filter((x) => x < gateQuiet)
  const enough = quiet.length >= Math.max(3, Math.floor(frames.length * 0.02))
  const noise = enough ? quiet[Math.floor(quiet.length * 0.5)] : 0

  // 頭の無音：ノイズフロアを明確に超えた最初のフレーム
  const gate = Math.max(noise * 4, loud * 0.08)
  let head = 0
  for (let i = 0; i < frames.length; i++) {
    if (frames[i] > gate) {
      head = i
      break
    }
  }

  return {
    peakDb: db(peak),
    clipRatio: clipped / Math.max(1, len * ch),
    maxRun,
    loudDb: db(loud),
    noiseDb: enough ? db(noise) : null,
    snr: enough ? db(loud) - db(noise) : null,
    headSec: (head * win) / audio.sampleRate,
    identical,
  }
}

function check(label: string, level: Level, value: string, note: string): Check {
  return { label, level, badge: BADGE[level], value, note }
}

export function buildReport(
  file: { name: string; size: number },
  audio: Samples,
  m: Measurement,
  wav: { bits: number; rate: number },
): Report {
  const checks: Check[] = []

  // --- ノイズ ---
  if (m.snr === null) {
    checks.push(
      check(
        'ノイズの量',
        'info',
        '測れませんでした',
        '最初から最後まで音が鳴っていて、静かな区間がないため測定できませんでした。歌の前後に少しだけ無音を残して書き出すと確認できます。',
      ),
    )
  } else {
    const lv: Level = m.snr >= 32 ? 'ok' : m.snr >= 22 ? 'warn' : 'bad'
    checks.push(
      check(
        'ノイズの量',
        lv,
        `S/N ${fix(m.snr)} dB`,
        lv === 'ok'
          ? '歌声とノイズの差が十分あります。このまま進めて問題ないと思います。'
          : lv === 'warn'
            ? 'サーッという音が少し乗っています。処理できる範囲ですが、録音環境を静かにできるならそのほうが仕上がります。'
            : 'ノイズが歌声に近い大きさで入っています。マイクの位置や環境音を見直して録り直せると、仕上がりが大きく変わります。',
      ),
    )
  }

  // --- 音割れ ---
  {
    const lv: Level =
      m.maxRun >= 8 || m.clipRatio > 0.0004 ? 'bad' : m.peakDb > -0.3 || m.maxRun > 0 ? 'warn' : 'ok'
    checks.push(
      check(
        '音割れ',
        lv,
        `ピーク ${fix(m.peakDb)} dBFS`,
        lv === 'ok'
          ? '余裕を持って収まっています。歪みの心配はありません。'
          : lv === 'warn'
            ? '上限にかなり近いところまで来ています。録音時の入力を少し下げると安全です。'
            : '波形の上が潰れています。音割れは後から戻せないので、入力を下げて録り直すのをおすすめします。',
      ),
    )
  }

  // --- 音量 ---
  {
    const lv: Level = m.loudDb >= -24 ? 'ok' : m.loudDb >= -32 ? 'warn' : 'bad'
    checks.push(
      check(
        '音量',
        lv,
        `平均 ${fix(m.loudDb)} dBFS`,
        lv === 'ok'
          ? '扱いやすい音量です。'
          : lv === 'warn'
            ? 'やや小さめですが、こちらで持ち上げられます。そのままでも大丈夫です。'
            : 'かなり小さく録れています。持ち上げるとノイズも一緒に上がるので、可能なら入力を上げて録り直せると安心です。',
      ),
    )
  }

  // --- 書き出し形式（WAV はヘッダから、それ以外は不明として扱う）---
  const { bits, rate: sr } = wav
  const ext = (file.name.split('.').pop() || '').toUpperCase()
  if (!sr) {
    checks.push(
      check(
        '書き出し形式',
        'info',
        ext || '不明',
        '圧縮された形式のため、元のサンプルレートやビット深度は読み取れません。可能なら 24bit / 48kHz 以上の WAV で書き出したものが安心です。',
      ),
    )
  } else {
    const okSr = sr >= 48000
    const nearSr = sr >= 44100
    const okBits = bits === 0 || bits >= 24
    const lv: Level = okSr && okBits ? 'ok' : nearSr ? 'warn' : 'bad'
    checks.push(
      check(
        '書き出し形式',
        lv,
        `${bits ? `${bits}bit / ` : ''}${(sr / 1000).toFixed(1)}kHz`,
        !nearSr
          ? 'サンプルレートが低めです。24bit / 48kHz 以上で書き出し直せると音の情報が残ります。'
          : !okSr
            ? '48kHz 以上を推奨しています。44.1kHz でも進められますが、選べるなら 48kHz が安心です。'
            : !okBits
              ? '16bit で書き出されています。24bit のほうが余裕がありますが、このままでも進められます。'
              : '推奨どおりです。このまま送ってもらえれば大丈夫です。',
      ),
    )
  }

  const bad = checks.filter((c) => c.level === 'bad').length
  const warn = checks.filter((c) => c.level === 'warn').length

  const summary: Report['summary'] = bad
    ? {
        tone: 'bad',
        title: '先に見直したいところがあります',
        body: '後から取り戻しにくい部分に引っかかっています。下の内容を見て、録り直せるところがあれば試してみてください。判断に迷ったらそのまま相談してもらっても大丈夫です。',
      }
    : warn
      ? {
          tone: 'warn',
          title: '気になる点はありますが、進められそうです',
          body: '大きな破綻はありません。下の「すこし注意」だけ目を通して、直せそうなら直す、難しければそのまま送ってもらう、で大丈夫です。',
        }
      : {
          tone: 'ok',
          title: 'このまま進めて大丈夫そうです',
          body: '目立った問題は見つかりませんでした。安心してそのまま相談に進んでください。',
        }

  const mm = Math.floor(audio.duration / 60)
  const ss = Math.round(audio.duration % 60)
  const channels =
    audio.numberOfChannels === 1 ? 'モノラル' : m.identical ? 'ステレオ（左右同一・実質モノラル）' : 'ステレオ'
  const head = m.headSec >= 1 ? `　頭の無音 ${m.headSec.toFixed(1)}秒` : ''

  return {
    checks,
    summary,
    spec: {
      format: `${ext} / ${(file.size / 1048576).toFixed(1)}MB${sr ? ` / ${(sr / 1000).toFixed(1)}kHz` : ''}`,
      length: `${mm}分${String(ss).padStart(2, '0')}秒${head}`,
      channels,
    },
  }
}
