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
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 72px',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 60%, #f8fafc 100%)',
      fontFamily: '"Noto Sans JP"',
      position: 'relative',
    },
  },
    // 装飾: 右上の円
    h('div', {
      style: {
        position: 'absolute',
        top: -120,
        right: -120,
        width: 480,
        height: 480,
        borderRadius: '50%',
        background: 'rgba(186, 230, 253, 0.45)',
      },
    }),
    // 装飾: 左下の円
    h('div', {
      style: {
        position: 'absolute',
        bottom: -100,
        left: -100,
        width: 360,
        height: 360,
        borderRadius: '50%',
        background: 'rgba(224, 242, 254, 0.6)',
      },
    }),
    // ガラスカード
    h('div', {
      style: {
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '52px 64px',
        borderRadius: '28px',
        background: 'rgba(255, 255, 255, 0.72)',
        border: '1.5px solid rgba(255, 255, 255, 0.9)',
      },
    },
      // サイト名
      h('div', {
        style: {
          fontSize: 22,
          fontWeight: 700,
          color: '#0284c7',
          marginBottom: 28,
        },
      }, '家から出ない倫 / Rin'),
      // タイトル
      h('div', {
        style: {
          fontSize: 52,
          fontWeight: 700,
          color: '#0f172a',
          lineHeight: 1.55,
        },
      }, title),
      // URL
      h('div', {
        style: {
          fontSize: 18,
          color: '#94a3b8',
          marginTop: 36,
        },
      }, 'iekaradenai.work'),
    ),
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
