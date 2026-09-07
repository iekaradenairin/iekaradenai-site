import Link from 'next/link'

import AudioChecker from '@/components/site/AudioChecker'
import RippleCanvas from '@/components/site/RippleCanvas'
import SiteFooter from '@/components/site/SiteFooter'
import SiteHeader from '@/components/site/SiteHeader'
import { siteLinks } from '@/lib/siteLinks'

const guides = ['モノラルで書き出し', 'エフェクトはかけずに', '24bit / 48kHz 以上', '頭出しを合わせて', 'ハモリは別トラックで']

const faq = [
  {
    q: '完璧じゃないと送れませんか？',
    a: '大丈夫です。整えるところは一緒に整えていくので、迷っている状態のまま相談してもらって構いません。',
  },
  {
    q: 'このページで合否が決まりますか？',
    a: '決まりません。数値を見ただけの目安なので、判断は実際に聴かせてもらってからお伝えします。',
  },
  {
    q: '録り直しになることはありますか？',
    a: 'あります。音割れや大きなノイズは後から取り戻しにくいので、その場合は正直にお伝えします。',
  },
  {
    q: 'ファイルは残りますか？',
    a: '残りません。解析はブラウザの中だけで行われ、音源が送信されることはありません。',
  },
]

export default function AudioCheckPage() {
  return (
    <div className="page">
      <RippleCanvas />
      <SiteHeader current="audiocheck" />

      <section className="section" style={{ padding: 'clamp(56px, 8vw, 92px) var(--gutter) 56px' }}>
        <div className="stack" style={{ gap: 24 }}>
          <span className="eyebrow">AUDIO CHECK — 音声データチェック</span>
          <h1 className="display display--page">
            耳では気づけないところを
            <br />
            もうひとつの目で。
          </h1>
          <p className="lead" style={{ maxWidth: '33em' }}>
            録った歌をブラウザ上で解析して、ノイズ・音割れ・音量・書き出し形式のあたりだけ確認します。合否を決めるものではなく相談する前の不安をひとつ減らすための道具です。
          </p>
          <p className="note">
            ファイルはお使いのブラウザの中だけで処理されます。どこにも送信されず、保存もされません。
          </p>
        </div>
      </section>

      <AudioChecker />

      <section className="section" style={{ padding: '0 var(--gutter) 96px' }}>
        <div className="stack" style={{ gap: 30 }}>
          <span className="eyebrow eyebrow--dim">GUIDE — 提出前の目安</span>
          <p className="body-sm" style={{ maxWidth: '36em', fontSize: 14, lineHeight: 2.05, color: 'var(--ink-2)' }}>
            この形だと進めやすいという目安です。最初から全部そろっていなくても大丈夫なので、迷ったらそのまま送ってください。
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {guides.map((g) => (
              <span key={g} className="pill">
                {g}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ padding: '0 var(--gutter) 96px' }}>
        <div className="stack" style={{ gap: 34 }}>
          <span className="eyebrow eyebrow--dim">FAQ — よくある質問</span>
          <div className="grid-auto">
            {faq.map((item) => (
              <div key={item.q} className="rule">
                <span className="label">{item.q}</span>
                <p className="body-xs">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ padding: '0 var(--gutter) 110px' }}>
        <div className="panel" style={{ padding: 'clamp(24px, 3vw, 36px) clamp(20px, 2.6vw, 34px)' }}>
          <div className="stack" style={{ gap: 10, maxWidth: '32em' }}>
            <span className="display display--card" style={{ textShadow: 'none' }}>
              状態に迷ったらそのまま相談してください
            </span>
            <p className="body-xs">
              どこが気になるかを一緒に整理して、次にやることまでお伝えします。聞くだけでも大丈夫です。
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 18 }}>
            <Link href={siteLinks.order} className="btn-solid">
              依頼ページへ
            </Link>
            <a href={siteLinks.x} target="_blank" rel="noopener noreferrer" className="link-quiet">
              XのDMで聞く →
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
