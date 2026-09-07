import RippleCanvas from '@/components/site/RippleCanvas'
import SiteFooter from '@/components/site/SiteFooter'
import SiteHeader from '@/components/site/SiteHeader'
import { siteLinks } from '@/lib/siteLinks'

const services = [
  {
    eyebrow: 'MIX',
    title: '歌を音楽の真ん中に',
    body: '録っていただいた歌とオケを預かって、聴かせたい言葉が埋もれないところまで整えます。声質を作り変えるのではなく、その人の声のまま前に出す方向で。',
    points: ['歌ってみた / オリジナル曲どちらも', 'ピッチ・タイミング補正を含みます', 'ハモリ、掛け合いの多い曲も対応'],
  },
  {
    eyebrow: 'COMPOSE',
    title: '言いたいことから曲にする',
    body: '歌いたい温度や、渡したい相手、キャラクターの背景から作ります。和ロック寄り、ポップス寄り、どちらにも寄せられます。作詞まで含めてのご相談も可能です。',
    points: ['歌い手さんのオリジナル曲', 'キャラクターソング、イメージソング', '作詞のみ・編曲のみもご相談ください'],
  },
]

const flow = [
  { n: '01', title: 'ご相談', body: 'Googleフォーム、またはXのDMから。決まっていないことがあっても大丈夫です。' },
  { n: '02', title: '内容と日程のご案内', body: 'やりたいことをうかがって、費用と納期をお伝えします。ここまで無料です。' },
  { n: '03', title: '制作', body: 'やり取りはDiscordを想定しています。途中の状態もお聞かせします。' },
  { n: '04', title: '納品', body: '修正を反映したうえで、書き出したデータをお渡しします。' },
]

export default function OrderPage() {
  return (
    <div className="page">
      <RippleCanvas />
      <SiteHeader current="order" />

      <section className="section section--narrow" style={{ padding: 'clamp(56px, 8vw, 96px) var(--gutter) 72px' }}>
        <div className="stack" style={{ gap: 26 }}>
          <span className="eyebrow eyebrow--dim">REQUEST — ご依頼</span>
          <h1 className="display" style={{ fontSize: 'clamp(26px, 4vw, 42px)', lineHeight: 1.5 }}>
            MIXと作曲も
            <br />
            おまかせください。
          </h1>
          <p className="lead" style={{ maxWidth: '34em' }}>
            数えきれないほど作り手がいるなかで、僕を選んでくださること自体が本当にありがたいことだと思っています。いただいたご依頼は、僕の作るすべての楽曲と同じ熱量でお作りします。まずは相談だけ、という状態でも大丈夫です。
          </p>
        </div>
      </section>

      <section className="section section--narrow" style={{ padding: '0 var(--gutter) 96px' }}>
        <div className="grid-auto grid-auto--lg">
          {services.map((s) => (
            <div key={s.eyebrow} className="card" style={{ gap: 18, padding: '34px 30px' }}>
              <span className="eyebrow" style={{ fontSize: 10, letterSpacing: '0.2em' }}>
                {s.eyebrow}
              </span>
              <h2 className="display display--panel" style={{ textShadow: 'none' }}>
                {s.title}
              </h2>
              <p className="body-sm">{s.body}</p>
              <div
                className="stack"
                style={{
                  gap: 9,
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: 'var(--ink-5)',
                  paddingTop: 6,
                  borderTop: '1px solid rgba(255,255,255,.08)',
                }}
              >
                {s.points.map((p) => (
                  <span key={p}>{p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--narrow" style={{ padding: '0 var(--gutter) 96px' }}>
        <div className="stack" style={{ gap: 34 }}>
          <span className="eyebrow eyebrow--dim">FLOW — ご依頼の流れ</span>
          <div className="grid-auto grid-auto--sm">
            {flow.map((f) => (
              <div key={f.n} className="rule" style={{ gap: 11 }}>
                <span className="eyebrow eyebrow--small">{f.n}</span>
                <span className="label">{f.title}</span>
                <p className="body-xs">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--narrow" style={{ padding: '0 var(--gutter) 110px' }}>
        <div className="panel" style={{ gap: 28 }}>
          <div className="stack" style={{ gap: 10, maxWidth: '30em' }}>
            <span className="display display--card" style={{ textShadow: 'none' }}>
              まずは、お気軽にご相談ください
            </span>
            <p className="body-xs">
              費用と納期は内容によって変わるので、やりたいことをうかがってからお伝えしています。「これは頼めるのか」という確認だけでも構いません。
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 18 }}>
            <a href={siteLinks.googleForm} target="_blank" rel="noopener noreferrer" className="btn-solid">
              Googleフォーム
            </a>
            <a href={siteLinks.x} target="_blank" rel="noopener noreferrer" className="link-quiet">
              XのDMで聞く →
            </a>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 26px', marginTop: 22, fontSize: 12, color: 'var(--ink-8)' }}>
          <span>お預かりした音源を作品以外に使うことはありません。</span>
          <span>公開・クレジットの有無はご希望に合わせます。</span>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
