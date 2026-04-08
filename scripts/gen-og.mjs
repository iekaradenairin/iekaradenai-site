// OGP画像ビルド時生成スクリプト
// next build の前に実行し、public/og/ にPNGを生成する
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { createElement as h } from 'react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const LOG_DIR = path.join(ROOT, 'content', 'log')
const OG_DIR = path.join(ROOT, 'public', 'og')

// --- frontmatter parser ---
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}
  const data = {}
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    data[line.slice(0, colon).trim()] = line.slice(colon + 1).trim()
  }
  return data
}

// --- Google Fonts から Noto Sans JP Bold を全セグメント取得 ---
async function fetchFont() {
  console.log('  Fetching Noto Sans JP from Google Fonts...')
  const css = await fetch(
    'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700',
    { headers: { 'User-Agent': 'Mozilla/5.0' } }
  ).then(r => r.text())

  const urls = [...css.matchAll(/url\(([^)]+)\)/g)].map(m => m[1])
  console.log(`  Downloading ${urls.length} font segment(s)...`)
  return Promise.all(urls.map(u => fetch(u).then(r => r.arrayBuffer())))
}

// --- OGP要素構築 ---
function buildElement(title) {
  return h('div', {
    style: {
      width: 1200,
      height: 630,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '0 80px',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      fontFamily: '"Noto Sans JP"',
      position: 'relative',
    },
  },
    h('div', {
      style: {
        position: 'absolute',
        top: 52,
        left: 80,
        fontSize: 22,
        fontWeight: 700,
        color: '#38bdf8',
        letterSpacing: '0.05em',
      },
    }, '家から出ない倫　/ Rin'),
    h('div', {
      style: {
        fontSize: 58,
        fontWeight: 700,
        color: '#ffffff',
        lineHeight: 1.5,
        maxWidth: 1000,
      },
    }, title),
    h('div', {
      style: {
        position: 'absolute',
        bottom: 52,
        right: 80,
        fontSize: 20,
        color: '#64748b',
      },
    }, 'iekaradenai.work'),
  )
}

// --- SVG → PNG ---
async function generatePng(title, fonts) {
  const svg = await satori(buildElement(title), {
    width: 1200,
    height: 630,
    fonts: fonts.map(data => ({
      name: 'Noto Sans JP',
      data,
      weight: 700,
      style: 'normal',
    })),
  })
  return new Resvg(svg).render().asPng()
}

// --- エントリーポイント ---
async function main() {
  fs.mkdirSync(OG_DIR, { recursive: true })

  const fonts = await fetchFont()

  // デフォルトOGP（トップ・その他ページ用）
  console.log('  Generating: default')
  fs.writeFileSync(
    path.join(OG_DIR, 'default.png'),
    await generatePng('MIX・作曲依頼', fonts)
  )

  // log記事ごとのOGP
  if (!fs.existsSync(LOG_DIR)) return

  const files = fs.readdirSync(LOG_DIR)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'))

  for (const file of files) {
    const slug = file.replace(/\.md$/, '')
    const raw = fs.readFileSync(path.join(LOG_DIR, file), 'utf-8')
    const { title } = parseFrontmatter(raw)
    console.log(`  Generating: log-${slug}`)
    fs.writeFileSync(
      path.join(OG_DIR, `log-${slug}.png`),
      await generatePng(title || slug, fonts)
    )
  }

  console.log('OGP generation complete.')
}

main().catch(err => { console.error(err); process.exit(1) })
