"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ChevronRight,
  ListChecks,
  FileAudio,
  FolderInput,
  CircleHelp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { siteLinks } from "@/lib/siteLinks";
import { contactPolicyCopy, contactActionLabels } from "@/lib/contactPolicy";
import { AnimatedPanel } from "@/components/site/AnimatedPanel";
import { SectionHeader } from "@/components/site/SectionHeader";
import { PageFrame } from "@/components/site/PageFrame";

const flowSteps = [
  {
    step: "STEP 1",
    title: "まず相談する",
    desc: "まだ迷っている段階でも大丈夫です。何から決めればよいか分からない場合や、お手元の音源で進められるか不安な場合も、まずはお気軽にご相談ください。",
  },
  {
    step: "STEP 2",
    title: "必要なものを準備する",
    desc: "まずはボーカル音源とオケがあれば大丈夫です。ご希望の雰囲気が伝わる材料があると、方向性をより合わせやすくなります。",
  },
  {
    step: "STEP 3",
    title: "制作・確認・納品",
    desc: "やり取りをしながら、できるだけご希望に寄り添って進めます。修正も内容を確認しながら丁寧に対応します。",
  },
] as const;

const requiredItems = ["ボーカル音源", "オケ"] as const;

const helpfulItems = [
  "参考曲",
  "キー情報",
  "依頼内容メモ",
  "ハモリ希望の有無",
  "納期希望",
  "活動の背景や曲の用途",
] as const;

const reassuringPoints = [
  "音源に不安があっても、確認しながら進められます",
  "最初から完璧にまとまっていなくても大丈夫です",
  "難しい用語が分からなくても、できるだけやさしく案内します",
  "キー変更や提出形式に迷う場合も、相談ベースで大丈夫です",
] as const;

const faqs = [
  {
    q: "はじめてでも依頼できますか？",
    a: "もちろん大丈夫です。内容がまだまとまりきっていない場合も、ご相談をいただきながら一緒に整理していけます。",
  },
  {
    q: "音源に自信がありません",
    a: "不安がある場合は、まず音声データチェックをご利用ください。それでも判断しにくい部分は、ご相談をいただきながら確認していけます。",
  },
  {
    q: "何を渡せばいいか分かりません",
    a: "このページの「送ってほしいもの」に必須と、あると助かるものをまとめています。すべて揃っていなくても、その時点でお持ちのものからご相談いただけます。",
  },
  {
    q: "納期はどれくらいですか？",
    a: "基本は、すべてのデータ受領後から1ヶ月程度を目安としています。お急ぎの場合も、まずは一度ご相談ください。",
  },
  {
    q: "料金はどれくらいですか？",
    a: "歌ってみたのMIXは MIX依頼ページ に目安を掲載しています。作曲は内容によって変わるため、ご相談内容を見ながらご案内しています。",
  },
] as const;


export default function GuidePage() {
  return (
    <PageFrame>
      <SiteHeader currentLabel="はじめての方へ" />

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
                    <span>はじめての方へ</span>
                  </motion.div>

                  <h1 className="mt-3 text-3xl font-semibold tracking-tight text-shinkai-100 md:text-5xl">
                    はじめての依頼でも、
                    <br />
                    安心して相談できるように。
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-shinkai-100 md:text-base">
                    まだ迷っている段階でも大丈夫です。何を準備すればいいのか、どこまで相談してよいのか、
                    そういった最初の不安をできるだけ減らせるように、流れや必要なものを分かりやすくまとめています。
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
                      <Link href={siteLinks.audioCheck}>音声データチェックを試す</Link>
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4">
                  {[
                    {
                      icon: ListChecks,
                      title: "流れが分かる",
                      desc: "最初に何をすればよいかを順番に確認できます。",
                    },
                    {
                      icon: FolderInput,
                      title: "必要なものが分かる",
                      desc: "どの音源や情報を送ればよいかを整理できます。",
                    },
                    {
                      icon: FileAudio,
                      title: "不安を先に減らせる",
                      desc: "音源の状態が気になる場合は提出前に確認できます。",
                    },
                  ].map((item) => {
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

          <div className="grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-3">
            {flowSteps.map((item) => (
              <div
                key={item.step}
                className="sm:border-l sm:border-white/10 sm:pl-6 sm:first:border-l-0 sm:first:pl-0"
              >
                <div className="text-xs font-medium tracking-[0.14em] text-sheen">{item.step}</div>
                <h2 className="mt-2 text-xl font-semibold text-shinkai-100">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-shinkai-100">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.04fr_0.96fr]">
            <AnimatedPanel className="rounded-[1.75rem] border border-white/12 bg-shinkai-800/80 backdrop-blur">
              <div className="p-6">
                <SectionHeader eyebrow="送ってほしいもの" title="まずは、この内容が分かれば大丈夫です" />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.25rem] border border-white/10 bg-shinkai-900/40 p-4">
                    <div className="text-sm font-medium text-shinkai-100">必須</div>
                    <ul className="mt-3 space-y-2 text-sm text-shinkai-100">
                      {requiredItems.map((item) => (
                        <li key={item}>・{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-[1.25rem] border border-white/10 bg-shinkai-900/40 p-4">
                    <div className="text-sm font-medium text-shinkai-100">なるべくあると助かるもの</div>
                    <ul className="mt-3 space-y-2 text-sm text-shinkai-100">
                      {helpfulItems.map((item) => (
                        <li key={item}>・{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-shinkai-100">
                  参考曲やご希望の雰囲気、活動の背景なども共有いただけると、方向性をより丁寧に合わせやすくなります。活動の節目や投稿予定日がある場合も、分かる範囲でお知らせいただけると助かります。
                </p>
              </div>
            </AnimatedPanel>

            <AnimatedPanel className="rounded-[1.75rem] border border-white/12 bg-shinkai-800/80 backdrop-blur">
              <div className="p-6">
                <SectionHeader eyebrow="安心して進めるために" title="最初に知っておくと安心なこと" />

                <div className="space-y-3">
                  {reassuringPoints.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-shinkai-900/40 p-4 text-sm leading-7 text-shinkai-100"
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-[1.25rem] border border-white/10 bg-shinkai-900/40 p-4 text-sm leading-7 text-shinkai-100">
                  キー変更をご希望の場合は、ご相談の段階であらかじめお知らせください。変更後のオケがあるとスムーズですが、お手元にない場合も、まずは一度ご相談ください。
                </div>
              </div>
            </AnimatedPanel>
          </div>

          <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
            <AnimatedPanel className="rounded-[1.75rem] border border-white/12 bg-shinkai-800/80 backdrop-blur">
              <div className="p-6">
                <SectionHeader
                  eyebrow="提出前の確認"
                  title="音源に不安がある場合も大丈夫です"
                  body="理想的な形はありますが、最初から完璧でなくても問題ありません。不安がある場合は、音声データチェックで簡易チェックをしてからお送りください。"
                />

                <Link
                  href={siteLinks.audioCheck}
                  className="inline-flex items-center text-sm font-medium text-sheen transition hover:text-shinkai-100"
                >
                  音声データチェックページへ
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </AnimatedPanel>

            <AnimatedPanel className="rounded-[1.75rem] border border-white/12 bg-shinkai-800/80 backdrop-blur">
              <div className="p-6">
                <SectionHeader eyebrow="よくある質問" title="初回の不安を、先に整理しておきたい方へ" />

                <div className="space-y-3">
                  {faqs.map((item) => (
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
          </div>

          <AnimatedPanel className="rounded-[1.9rem] border border-white/12 bg-shinkai-800/80 backdrop-blur-xl">
            <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <SectionHeader
                  eyebrow={contactPolicyCopy.eyebrow}
                  title={contactPolicyCopy.title}
                  body={`まだご依頼を迷っている段階でも問題ありません。費用感だけを知りたい場合や、現在の音源で進められるか確認したい場合など、事前のご相談から歓迎しています。${contactPolicyCopy.full}`}
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
                  body="歌ってみたのMIXをご希望の場合は MIX依頼ページへ、オリジナル曲をつくりたい場合は 作曲依頼ページへ進んでください。どちらも料金や進め方の目安をまとめています。"
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
                  <Link href={siteLinks.compose}>作曲依頼ページへ</Link>
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