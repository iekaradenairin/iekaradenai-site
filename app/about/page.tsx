import { PageFrame } from "@/components/site/PageFrame";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { AnimatedPanel } from "@/components/site/AnimatedPanel";
import { SectionHeader } from "@/components/site/SectionHeader";
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
      <main className="mx-auto max-w-4xl px-6 pb-20 pt-8 lg:px-10 lg:pt-10">
        <section className="space-y-6">
          <AnimatedPanel className="rounded-[2rem] border border-white/70 bg-white/80 p-6 backdrop-blur-xl md:p-10">
            <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
              家から出ない倫・オリジナル曲{works.length}曲
            </div>
            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-slate-950 md:text-4xl">
              言えなかった言葉のことを、
              <br />
              ずっと書いています。
            </h1>

            <div className="mt-6 space-y-5 text-sm leading-8 text-slate-700 md:text-base">
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
          </AnimatedPanel>

          <AnimatedPanel className="rounded-[1.9rem] border border-white/70 bg-white/80 p-6 backdrop-blur-xl md:p-8">
            <SectionHeader eyebrow="音づくりで大事にしていること" title="曲はいつも絵から始まります。" />
            <div className="space-y-4 text-sm leading-8 text-slate-700 md:text-base">
              <p>
                一枚のイラストに惹かれて、この絵の中で何があったんだろう、と考えるところから曲が生まれる。
                だから僕の曲には必ず情景があります。
              </p>
              <p>屋上、神社の階段、湖、桜。感情を直接書くかわりに、風景を書いている。</p>
            </div>
          </AnimatedPanel>

          <AnimatedPanel className="rounded-[1.9rem] border border-white/70 bg-white/80 p-6 backdrop-blur-xl md:p-8">
            <SectionHeader eyebrow="制作環境" title="使っている機材・ソフト" />
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[8rem_1fr]">
              {setupRows.map((row) => (
                <div key={row.label} className="contents">
                  <dt className="text-xs font-medium tracking-wide text-slate-500 sm:pt-0.5">{row.label}</dt>
                  <dd className="text-sm leading-7 text-slate-700 sm:mb-0">{row.value}</dd>
                </div>
              ))}
            </dl>
          </AnimatedPanel>
        </section>
      </main>
      <SiteFooter />
    </PageFrame>
  );
}
