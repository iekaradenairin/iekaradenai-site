import { PageFrame } from "@/components/site/PageFrame";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { works } from "@/lib/works";

const setupRows = [
  { label: "DAW", value: "Cubase" },
  { label: "歌声合成", value: "SynthesizerV 花隈千冬V2（メイン）/ モカV2 / VoiSona 雨衣" },
  { label: "オーディオIF", value: "RME Fireface UCX II" },
  { label: "モニター", value: "ADAM T7V" },
  { label: "MIX", value: "FabFilter Pro-Q3・Pro-C2 / iZotope MPS / Waves Horizon / Soundtoys Decapitator" },
] as const;

export default function AboutPage() {
  return (
    <PageFrame>
      <SiteHeader currentLabel="世界観" />
      <main className="mx-auto max-w-2xl px-6 pb-24 pt-10 lg:pt-16">
        <div className="inline-flex rounded-full bg-shinkai-800/60 px-3 py-1 text-xs font-medium text-sheen">
          家から出ない倫・オリジナル曲{works.length}曲
        </div>
        <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-shinkai-100 md:text-4xl">
          言えなかった言葉のことを、
          <br />
          ずっと書いています。
        </h1>

        <div className="mt-6 space-y-5 text-base leading-8 text-shinkai-200">
          <p>
            告白できないまま終わった夏。何年経っても忘れられない紅葉。もう会えない人。
            決着のついていない感情は、時間が経ってから急に戻ってくる。
            その、戻ってくる瞬間のための曲を作っています。
          </p>
          <p>
            和ロックとポップスのあいだを行き来しながら、
            「泣きたいわけじゃないけど泣ける」あたりを狙っています。
            解決も克服もしなくていい。終わったことを、終わったまま肯定したい。
          </p>
        </div>

        <div className="mt-16 border-t border-white/10 pt-12">
          <p className="text-sm font-medium text-sheen">音づくりで大事にしていること</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-shinkai-100">曲はいつも絵から始まります。</h2>
          <div className="mt-5 space-y-4 text-base leading-8 text-shinkai-200">
            <p>
              一枚のイラストに惹かれて、この絵の中で何があったんだろう、と考えるところから曲が生まれる。
              だから僕の曲には必ず情景があります。
            </p>
            <p>屋上、神社の階段、湖、桜。感情を直接書くかわりに、風景を書いている。</p>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-12">
          <p className="text-sm font-medium text-sheen">制作環境</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-shinkai-100">使っている機材・ソフト</h2>
          <dl className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-[8rem_1fr]">
            {setupRows.map((row) => (
              <div key={row.label} className="contents">
                <dt className="text-xs font-medium tracking-wide text-shinkai-300 sm:pt-0.5">{row.label}</dt>
                <dd className="text-sm leading-7 text-shinkai-200 sm:mb-0">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </main>
      <SiteFooter />
    </PageFrame>
  );
}
