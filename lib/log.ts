import fs from 'fs'
import path from 'path'

const LOG_DIR = path.join(process.cwd(), 'content/log')

export type LogPost = {
  slug: string
  title: string
  date: string
  tags: string[]
  content: string
}

export type LogPostMeta = Omit<LogPost, 'content'>

// --- frontmatter parser ---
function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }

  const data: Record<string, unknown> = {}
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    const val = line.slice(colon + 1).trim()
    if (val.startsWith('[') && val.endsWith(']')) {
      data[key] = val.slice(1, -1).split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
    } else {
      data[key] = val
    }
  }
  return { data, content: match[2] }
}

// --- minimal markdown → HTML ---
export function renderMarkdown(md: string): string {
  const lines = md.split('\n')
  const out: string[] = []
  let inCode = false
  let inList = false
  let listTag = ''

  const inline = (s: string) =>
    s
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2">')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/~~([^~]+)~~/g, '<del>$1</del>')

  const closeList = () => {
    if (inList) { out.push(`</${listTag}>`); inList = false; listTag = '' }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // code fence
    if (line.startsWith('```')) {
      if (!inCode) {
        closeList()
        const lang = line.slice(3).trim()
        out.push(`<pre><code${lang ? ` class="language-${lang}"` : ''}>`)
        inCode = true
      } else {
        out.push('</code></pre>')
        inCode = false
      }
      continue
    }
    if (inCode) { out.push(line.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')); continue }

    // headings
    const h = line.match(/^(#{1,4})\s+(.+)/)
    if (h) { closeList(); out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); continue }

    // hr
    if (/^---+$/.test(line.trim())) { closeList(); out.push('<hr>'); continue }

    // blockquote
    if (line.startsWith('> ')) { closeList(); out.push(`<blockquote><p>${inline(line.slice(2))}</p></blockquote>`); continue }

    // ul
    const ul = line.match(/^[-*]\s+(.+)/)
    if (ul) {
      if (!inList || listTag !== 'ul') { closeList(); out.push('<ul>'); inList = true; listTag = 'ul' }
      out.push(`<li>${inline(ul[1])}</li>`)
      continue
    }

    // ol
    const ol = line.match(/^\d+\.\s+(.+)/)
    if (ol) {
      if (!inList || listTag !== 'ol') { closeList(); out.push('<ol>'); inList = true; listTag = 'ol' }
      out.push(`<li>${inline(ol[1])}</li>`)
      continue
    }

    // blank line
    if (line.trim() === '') { closeList(); out.push(''); continue }

    // paragraph
    closeList()
    out.push(`<p>${inline(line)}</p>`)
  }
  closeList()

  return out.join('\n')
}

// --- public API ---
export function getAllPosts(): LogPostMeta[] {
  if (!fs.existsSync(LOG_DIR)) return []

  return fs
    .readdirSync(LOG_DIR)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, '')
      const raw = fs.readFileSync(path.join(LOG_DIR, filename), 'utf-8')
      const { data } = parseFrontmatter(raw)
      return {
        slug,
        title: String(data.title ?? slug),
        date: data.date ? String(data.date).slice(0, 10) : '',
        tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
      }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPost(slug: string): LogPost | null {
  const filepath = path.join(LOG_DIR, `${slug}.md`)
  if (!fs.existsSync(filepath)) return null

  const raw = fs.readFileSync(filepath, 'utf-8')
  const { data, content } = parseFrontmatter(raw)

  return {
    slug,
    title: String(data.title ?? slug),
    date: data.date ? String(data.date).slice(0, 10) : '',
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    content,
  }
}
