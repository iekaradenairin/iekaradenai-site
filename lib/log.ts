import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const LOG_DIR = path.join(process.cwd(), 'content/log')

export type LogPost = {
  slug: string
  title: string
  date: string
  tags: string[]
  content: string
}

export type LogPostMeta = Omit<LogPost, 'content'>

export function getAllPosts(): LogPostMeta[] {
  if (!fs.existsSync(LOG_DIR)) return []

  return fs
    .readdirSync(LOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, '')
      const raw = fs.readFileSync(path.join(LOG_DIR, filename), 'utf-8')
      const { data } = matter(raw)
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ? String(data.date).slice(0, 10) : '',
        tags: data.tags ?? [],
      }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPost(slug: string): LogPost | null {
  const filepath = path.join(LOG_DIR, `${slug}.md`)
  if (!fs.existsSync(filepath)) return null

  const raw = fs.readFileSync(filepath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ? String(data.date).slice(0, 10) : '',
    tags: data.tags ?? [],
    content,
  }
}
