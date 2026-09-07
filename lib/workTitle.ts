/**
 * 作品タイトル・日付の表示整形。
 *
 * works.ts は works.generated.json を import しているが、Node の ESM ローダーは
 * JSON import に `with { type: "json" }` を要求するため、テストから works.ts を
 * 辿ると落ちる。整形だけを使いたい側のためにここへ切り出してある。
 */

/** 「2026.08」形式。日付不明なら空文字 */
export function formatReleaseMonth(publishedAt: string | null) {
  if (!publishedAt) return ''
  return publishedAt.slice(0, 7).replace('-', '.')
}

/**
 * YouTube のタイトルを「曲名」と「クレジット」に割る。
 *
 * 投稿タイトルは `曲名 / 倫 feat. 歌唱名` の形で、そのまま出すとカードで
 * 2〜3行に折り返す。かといってスラッシュ以降を捨てると、同じ曲名で歌唱違いの
 * 「藍空をなぞって」2曲が区別できなくなる。そこで捨てずに下段へ落とす。
 *
 * 生タイトルは works.generated.json 側にそのまま持たせてあるので、
 * ここの規則を変えても再取得は要らない。
 */
export function splitWorkTitle(raw: string): { title: string; credit: string } {
  // 【初投稿】のような角括弧プレフィックスは落とす。
  // 〖#VocaDuo2026〗は歌唱名側に付く企画タグなので残す。
  const cleaned = raw
    .replace(/^【[^】]*】\s*/, '')
    .replace(/\s{2,}/g, ' ')
    .trim()

  // 区切りは前後に空白のあるスラッシュだけ。「AC/DC」のような曲名を割らないため
  const at = cleaned.indexOf(' / ')
  if (at === -1) return { title: cleaned, credit: '' }
  return { title: cleaned.slice(0, at).trim(), credit: cleaned.slice(at + 3).trim() }
}
