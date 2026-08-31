"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  SlidersHorizontal,
  CircleHelp,
  AudioLines,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { AudioChecker } from "@/components/site/AudioChecker";
import { siteLinks } from "@/lib/siteLinks";
import { contactPolicyCopy, contactActionLabels } from "@/lib/contactPolicy";
import { AnimatedPanel } from "@/components/site/AnimatedPanel";
import { SectionHeader } from "@/components/site/SectionHeader";
import { PageFrame } from "@/components/site/PageFrame";

const quickChecks = [
  {
    title: "ノイズが強くないか",
    desc: "サーッという定常ノイズや、環境音が大きすぎないかを最初に確認します。",
    icon: AudioLines,
  },
  {
    title: "音割れしていないか",
    desc: "ピークが強すぎて耳に痛い状態になっていないかを見ます。",
    icon: AlertCircle,
  },
  {
    title: "音量が小さすぎないか",
    desc: "極端に小さい場合は、後工程で扱いにくくなることがあります。",
    icon: SlidersHorizontal,
  },
] as const;

const okayExamples = [
  "多少のノイズはあるが、歌声が十分に聴き取れる",
  "大きな破綻はなく、そのまま相談しながら進められる",
  "少し気になる点はあるが、修正や調整の余地がある",
] as const;

const cautionExamples = [
  "音割れが強く、修正で取り戻しにくい",
  "ノイズが大きく、歌声より目立ってしまっている",
  "音量が極端に小さく、判断しづらい",
  "頭出しや書き出し状態に問題がある",
] as const;

const beforeSubmit = [
  "モノラル推奨",
  "エフェクトなし推奨",
  "頭出し済みだと助かります",
  "24bit / 44.1kHz 以上推奨",
  "ハモリ / コーラスは別トラック推奨",
] as const;

const faqItems = [
  {
    q: "完璧じゃないと送れませんか？",
    a: "完璧でなくても大丈夫です。大きな問題がないかを先に確認して、不安があれば相談しながら進めるための入口として使ってください。",
  },
  {
    q: "このページだけで合否が決まりますか？",
    a: "最終判断を断定するためというより、提出前の不安を減らすための簡易チェックです。迷う場合は、そのままご相談いただければ大丈夫です。",
  },
  {
    q: "録り直しが必要なケースはありますか？",
    a: "あります。特に音割れや大きなノイズなど、後から直しにくい問題が強い場合は、録り直しをおすすめすることがあります。",
  },
  {
    q: "そのままMIX依頼に進んでもいいですか？",
    a: "大丈夫です。状態に大きな問題がなければ、そのまま相談へ進んでもらって問題ありません。",
  },
] as const;


export default function AudioCheckPage() {
  return (
    <PageFrame>
      <SiteHeader currentLabel="音声データチェック" />

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-2 lg:px-10 lg:pt-4">
        <section className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AnimatedPanel className="rounded-[2rem] border border-white/12 bg-shinkai-800/80 backdrop-blur-xl">
              <div className="grid gap-6 p-6 md:p-7 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.55 }}
                    className="inline-flex items-center gap-2 rounded-full bg-shinkai-800/60 px-3 py-1 text-xs font-medium text-sheen"
                  >
                    <motion.div
                      animate={{ rotate: [0, 8, -5, 0], scale: [1, 1.08, 1] }}
                      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                    </motion.div>
                    <span>音声データチェック</span>
                  </motion.div>

                  <h1 className="mt-3 text-3xl font-semibold tracking-tight text-shinkai-100 md:text-5xl">
                    提出前に、
                    <br />
                    このままで大丈夫そうかをかんたんに確認できます。
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-shinkai-100 md:text-base">
                    難しい専門用語だけで終わらず、いまの音源状態で大きな問題がなさそうかを確認するための入口です。
                    はじめての依頼で不安なときに、まず軽く状態を整理してから相談に進めるようにしています。
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <motion.div
                      animate={{ y: [0, -2, 0], scale: [1, 1.012, 1] }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Button asChild className="h-12 rounded-full border border-sheen/40 bg-sheen px-6 text-sm text-shinkai-950 shadow-[0_18px_40px_rgba(95,168,199,0.25)] backdrop-blur-xl hover:bg-sheen/90">
                        <a href={siteLinks.googleForm} target="_blank" rel="noreferrer">
                          {contactActionLabels.primary}
                        </a>
                      </Button>
                    </motion.div>

                    <Button
                      asChild
                      variant="outline"
                      className="h-12 rounded-full border-white/15 bg-shinkai-800/50 px-6 text-sm text-shinkai-100 shadow-[0_10px_30px_rgba(13,25,32,0.2)] backdrop-blur-2xl hover:bg-shinkai-800/80"
                    >
                      <Link href={siteLinks.mix}>MIX依頼ページへ</Link>
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4">
                  {quickChecks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="flex items-start gap-3">
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-sheen" />
                        <div>
                          <div className="text-sm font-semibold text-shinkai-100">{item.title}</div>
                          <div className="mt-1 text-sm leading-6 text-shinkai-200">{item.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </AnimatedPanel>
          </motion.div>

          {/* Interactive audio checker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
          >
            <AnimatedPanel className="rounded-[1.75rem] border border-white/12 bg-shinkai-800/80 backdrop-blur-xl">
              <div className="p-6">
                <p className="text-sm font-medium text-sheen">実際に確認してみる</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-shinkai-100">
                  音声ファイルをここにドロップ
                </h2>
                <p className="mt-2 mb-5 text-sm leading-7 text-shinkai-100">
                  ノイズ・音割れ・サンプルレートを自動で確認します。ファイルはブラウザ内で処理され、外部には送信されません。
                </p>
                <AudioChecker />
              </div>
            </AnimatedPanel>
          </motion.div>

          <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
            <AnimatedPanel className="rounded-[1.75rem] border border-white/12 bg-shinkai-800/80 backdrop-blur">
              <div className="p-6">
                <SectionHeader
                  eyebrow="このページで分かること"
                  title="まずは、大きな問題がなさそうかを確認します"
                  body="最終的な細かい判断まで一気に決めるというより、提出前に不安になりやすいポイントを先に整理するイメージです。"
                />

                <div className="grid gap-3">
                  {[
                    "ノイズが極端に大きくないか",
                    "音割れのような強い破綻がないか",
                    "音量が小さすぎて扱いにくくないか",
                    "そのまま相談しながら進められそうか",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-shinkai-900/40 px-4 py-3 text-sm text-shinkai-100"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedPanel>

            <AnimatedPanel className="rounded-[1.75rem] border border-white/12 bg-shinkai-800/80 backdrop-blur">
              <div className="p-6">
                <SectionHeader
                  eyebrow="チェック結果の見方"
                  title="OK寄り / 注意寄り の目安を分かりやすく整理します"
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.25rem] border border-white/10 bg-shinkai-900/40 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-medium text-shinkai-100">
                      <CheckCircle2 className="h-4 w-4 text-sheen" />
                      そのまま相談しやすい例
                    </div>
                    <div className="space-y-2 text-sm leading-7 text-shinkai-100">
                      {okayExamples.map((item) => (
                        <div key={item}>・{item}</div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.25rem] border border-white/10 bg-shinkai-900/40 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-medium text-shinkai-100">
                      <AlertCircle className="h-4 w-4 text-sheen" />
                      先に見直したい例
                    </div>
                    <div className="space-y-2 text-sm leading-7 text-shinkai-100">
                      {cautionExamples.map((item) => (
                        <div key={item}>・{item}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedPanel>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.04fr_0.96fr]">
            <AnimatedPanel className="rounded-[1.75rem] border border-white/12 bg-shinkai-800/80 backdrop-blur">
              <div className="p-6">
                <SectionHeader
                  eyebrow="提出前の目安"
                  title="このような形ですと、よりスムーズに進められます"
                />

                <div className="grid gap-3 text-sm text-shinkai-100">
                  {beforeSubmit.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-shinkai-900/40 px-4 py-3"
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-sm leading-7 text-shinkai-100">
                  理想的な形はありますが、最初から完璧でなくても問題ありません。状態に迷う場合は、そのままご相談いただいても大丈夫です。
                </p>
              </div>
            </AnimatedPanel>

            <AnimatedPanel className="rounded-[1.75rem] border border-white/12 bg-shinkai-800/80 backdrop-blur">
              <div className="p-6">
                <SectionHeader
                  eyebrow="次に進む目安"
                  title="判断に迷ったら、そのまま相談へ進んで大丈夫です"
                />

                <div className="space-y-3 text-sm text-shinkai-100">
                  <div className="rounded-2xl border border-white/10 bg-shinkai-900/40 p-4">
                    ・大きな音割れやノイズがなければ、そのまま相談しながら進められることが多いです。
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-shinkai-900/40 p-4">
                    ・録り直しが必要そうな場合でも、どこが気になるかを整理して次に進みやすくします。
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-shinkai-900/40 p-4">
                    ・状態に不安が残る場合は、GoogleフォームやXからそのまま相談してください。
                  </div>
                </div>
              </div>
            </AnimatedPanel>
          </div>

          <AnimatedPanel className="rounded-[1.75rem] border border-white/12 bg-shinkai-800/80 backdrop-blur">
            <div className="p-6">
              <SectionHeader eyebrow="よくある質問" title="提出前に不安になりやすい点を先に整理したい方へ" />

              <div className="space-y-3">
                {faqItems.map((item) => (
                  <motion.div
                    key={item.q}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45 }}
                    className="rounded-[1.2rem] border border-white/10 bg-shinkai-900/40 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-sheen" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-shinkai-100">Q. {item.q}</div>
                        <div className="mt-2 text-sm leading-7 text-shinkai-100">{item.a}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedPanel>

          <AnimatedPanel className="rounded-[1.9rem] border border-white/12 bg-shinkai-800/80 backdrop-blur-xl">
            <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <SectionHeader
                  eyebrow={contactPolicyCopy.eyebrow}
                  title={contactPolicyCopy.title}
                  body={`音源状態に不安がある場合も、そのままご相談いただいて大丈夫です。大きな問題がなさそうかを確認したうえで、必要なら次の進め方も一緒に整理できます。${contactPolicyCopy.full}`}
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button asChild className="h-12 rounded-full border border-sheen/40 bg-sheen px-6 text-sm text-shinkai-950 shadow-[0_18px_40px_rgba(95,168,199,0.25)] backdrop-blur-xl hover:bg-sheen/90">
                  <a href={siteLinks.googleForm} target="_blank" rel="noreferrer">
                    {contactActionLabels.primary}
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-full border-white/15 bg-shinkai-800/50 px-6 text-sm text-shinkai-100 shadow-[0_10px_30px_rgba(13,25,32,0.2)] backdrop-blur-2xl hover:bg-shinkai-800/80"
                >
                  <a href={siteLinks.x} target="_blank" rel="noreferrer">
                    {contactActionLabels.secondary}
                  </a>
                </Button>
              </div>
            </div>
          </AnimatedPanel>

          <AnimatedPanel className="rounded-[1.75rem] border border-white/12 bg-shinkai-800/80 backdrop-blur">
            <div className="grid gap-5 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <SectionHeader
                  eyebrow="次に進む"
                  title="必要に応じて、こちらも確認できます"
                  body="依頼内容が固まってきたら MIX依頼ページへ、その前に流れを確認したい場合は はじめての方へ へ進んでください。"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button asChild className="h-12 rounded-full border border-sheen/40 bg-sheen px-6 text-sm text-shinkai-950 shadow-[0_18px_40px_rgba(95,168,199,0.25)] backdrop-blur-xl hover:bg-sheen/90">
                  <Link href={siteLinks.mix}>MIX依頼ページへ</Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-full border-white/15 bg-shinkai-800/50 px-6 text-sm text-shinkai-100 shadow-[0_10px_30px_rgba(13,25,32,0.2)] backdrop-blur-2xl hover:bg-shinkai-800/80"
                >
                  <Link href={siteLinks.guide}>はじめての方へ</Link>
                </Button>
              </div>
            </div>
          </AnimatedPanel>
        </section>
      </main>

      <SiteFooter />
    </PageFrame>
  );
}
