"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Radio,
  Sparkles,
  ChevronRight,
  Mic2,
  FileAudio,
  PlayCircle,
  Music4,
  Wand2,
  Disc3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { siteLinks } from "@/lib/siteLinks";
import { contactPolicyCopy, contactActionLabels } from "@/lib/contactPolicy";
import { SiteFooter } from "@/components/site/SiteFooter";

const featureCards = [
  {
    title: "MIX依頼",
    desc: "はじめての歌ってみた依頼でも迷いにくいように、必要な準備から相談の流れまで順番に案内します。自然な補正をベースに丁寧に対応します。",
    icon: Mic2,
    badge: "はじめてでも安心",
    href: siteLinks.mix,
    linkText: "MIX依頼ページへ",
  },
  {
    title: "音声データチェック",
    desc: "難しい専門用語だけで終わらず、『このまま提出して大丈夫か』を自動で確認できます。初回依頼の不安を減らすための入口です。",
    icon: FileAudio,
    badge: "提出前に確認",
    href: siteLinks.audioCheck,
    linkText: "音声データチェックページへ",
  },
  {
    title: "作品展示",
    desc: "作品や関与実績を記載しています。私の作品の空気感、世界観のある音づくりを感じてもらえるとうれしいです。",
    icon: PlayCircle,
    badge: "作品を見る",
    href: siteLinks.works,
    linkText: "作品展示ページへ",
  },
  {
    title: "作曲依頼",
    desc: "作曲・編曲相談の入口です。費用感や納期・参考曲の共有や方向性のすり合わせも、相談ベースで進められます。",
    icon: Music4,
    badge: "制作相談OK",
    href: siteLinks.compose,
    linkText: "作曲依頼ページへ",
  },
  {
    title: "オフボーカル配布",
    desc: "歌ってみたに使えるオフボーカルを公開しています。気軽ご利用ください。曲の空気感や世界観も一緒に楽しんでもらえたらと思っています。",
    icon: Disc3,
    badge: "気軽に使ってOK",
    href: siteLinks.instrumentals,
    linkText: "配布中の音源を見る",
  },
] as const;

const works = [
  {
    label: "注目作品",
    title: "花笑み、ひとひら",
    role: "作曲 / 編曲 / MIX",
    desc: "透明感と夏の空気を、まっすぐ閉じ込めた1曲。",
    tags: ["透明感", "夏", "青春感"],
    url: "https://www.youtube.com/watch?v=BC8ZgzJWhX0",
    thumbnail: "https://i.ytimg.com/vi/BC8ZgzJWhX0/hqdefault.jpg",
  },
  {
    label: "透明感の軸",
    title: "水星巡航トリップ",
    role: "作曲 / 編曲 / 作詞 / 仕上げ",
    desc: "瑞々しさと爽やかさの中に、ほのかなエモーショナルさがにじむ1曲。",
    tags: ["爽やか", "瑞々しさ", "ほのかなエモーショナルさ"],
    url: "https://www.youtube.com/watch?v=wfamkctKfUw",
    thumbnail: "https://i.ytimg.com/vi/wfamkctKfUw/hqdefault.jpg",
  },
  {
    label: "MIX参考",
    title: "紫色のひまわり",
    role: "MIX / ハモリ提案",
    desc: "夜の感情を丁寧にすくい取るような、余韻を大切にしたMIX。",
    tags: ["エモーショナル", "夜", "余韻"],
    url: "https://www.youtube.com/watch?v=yu2VQvv9l5s",
    thumbnail: "https://i.ytimg.com/vi/yu2VQvv9l5s/hqdefault.jpg",
  },
] as const;

const beginnerSteps = [
  "1. はじめての方へ で、依頼の流れと必要なものを確認",
  "2. 音声データチェックで、提出前の不安をかんたん確認",
  "3. わからないところは、そのまま相談しながら進めてOK",
] as const;

function GlassOrb({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`pointer-events-none absolute rounded-full blur-3xl opacity-55 ${className ?? ""}`}
      animate={{ x: [0, 20, -12, 0], y: [0, -16, 10, 0], scale: [1, 1.05, 0.98, 1] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

function AnimatedPanel({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      animate={{
        boxShadow: [
          "0 10px 24px rgba(148,163,184,0.10)",
          "0 18px 34px rgba(148,163,184,0.14)",
          "0 10px 24px rgba(148,163,184,0.10)",
        ],
      }}
      transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function TopPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f3fbff_0%,#e8f5ff_32%,#f8fcff_70%,#ffffff_100%)] text-slate-800">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.88),transparent_24%),radial-gradient(circle_at_top_right,rgba(191,219,254,0.34),transparent_30%),radial-gradient(circle_at_40%_18%,rgba(255,255,255,0.48),transparent_14%)]"
          animate={{ opacity: [0.78, 1, 0.82] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 opacity-45"
          animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage:
              "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.24) 18%, rgba(255,255,255,0) 38%)",
            backgroundSize: "220% 100%",
          }}
        />
        <GlassOrb
          className="left-[-120px] top-[-40px] h-72 w-72 bg-gradient-to-br from-cyan-200/40 via-sky-200/30 to-transparent"
          delay={0.2}
        />
        <GlassOrb
          className="right-[-80px] top-10 h-96 w-96 bg-gradient-to-br from-cyan-200/35 via-sky-200/25 to-transparent"
          delay={1.2}
        />
        <GlassOrb
          className="left-[36%] top-[8%] h-48 w-48 bg-gradient-to-br from-white/50 via-cyan-100/25 to-transparent"
          delay={2.1}
        />
      </div>

      <section className="relative overflow-hidden">
        <motion.div
          className="pointer-events-none absolute left-[5%] top-10 h-24 w-24 rounded-full border border-white/45 bg-white/10 backdrop-blur-xl"
          animate={{ y: [0, -8, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute right-[8%] top-28 h-16 w-16 rounded-full border border-white/40 bg-white/10 backdrop-blur-xl"
          animate={{ y: [0, 10, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        />

        <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10 flex items-center gap-3"
          >
            <motion.div
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/35 shadow-[0_12px_32px_rgba(148,163,184,0.14)] ring-1 ring-white/50 backdrop-blur-2xl"
              animate={{
                boxShadow: [
                  "0 12px 32px rgba(148,163,184,0.14)",
                  "0 18px 42px rgba(56,189,248,0.18)",
                  "0 12px 32px rgba(148,163,184,0.14)",
                ],
              }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Radio className="h-5 w-5 text-sky-500" />
            </motion.div>
            <div>
              <p className="text-sm font-medium text-sky-700">music works</p>
              <h1 className="text-base font-semibold tracking-wide text-slate-900">倫 / Rin</h1>
            </div>
          </motion.div>

          <motion.nav
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="relative z-10 hidden items-center gap-6 text-sm text-slate-700 md:flex"
          >
            <a href="#features" className="inline-flex min-h-[44px] items-center transition hover:text-slate-900">
              サービス
            </a>
            <Link
              href={siteLinks.guide}
              className="inline-flex min-h-[44px] items-center rounded-full bg-white/60 px-3 text-slate-900 shadow-sm transition hover:bg-white/80"
            >
              はじめての方へ
            </Link>
            <Link href={siteLinks.works} className="inline-flex min-h-[44px] items-center transition hover:text-slate-900">
              作品
            </Link>
          </motion.nav>
        </header>

        <div className="mx-auto grid max-w-7xl gap-6 px-6 pb-16 pt-4 lg:px-10 xl:grid-cols-[minmax(0,1fr)_minmax(400px,520px)] xl:gap-8 2xl:pb-20 2xl:pt-8">
          <div className="relative z-10 flex min-w-0 flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65 }}
              className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-sm text-slate-800 shadow-[0_10px_30px_rgba(148,163,184,0.10)] ring-1 ring-white/60 backdrop-blur-xl"
            >
              <motion.div
                animate={{ rotate: [0, 8, -5, 0], scale: [1, 1.08, 1] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="h-4 w-4 text-sky-500" />
              </motion.div>
              <span>イメージする世界観を作品へ</span>
            </motion.div>

            <div className="relative overflow-hidden rounded-[2rem] py-2">
              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.06 }}
                className="max-w-4xl whitespace-pre-line text-4xl font-semibold leading-tight tracking-tight text-slate-950 md:text-5xl xl:text-6xl"
              >
                {`声の透明感も
作品の世界観も
まっすぐ届くように`}
              </motion.h2>
              <motion.div
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-[linear-gradient(120deg,rgba(255,255,255,0),rgba(255,255,255,0.7),rgba(255,255,255,0))] mix-blend-screen"
                animate={{ x: ["-10%", "320%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.6 }}
              />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.14 }}
              className="mt-4 max-w-3xl text-base leading-8 text-slate-700 md:text-lg"
            >
              声の良さを大切にしながら、聴きやすく自然な補正をベースに希望の世界観になるようできるだけ寄り添って制作します。はじめての依頼でもやり取りや相談しやすいよう十分に配慮し、必要があれば雰囲気づくりやオリジナルのアレンジやハモリも一緒に考えます。
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.28 }}
              className="mt-6 flex flex-col gap-3 sm:flex-row"
            >
              <motion.div
                animate={{ y: [0, -2, 0], scale: [1, 1.012, 1] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <a href={siteLinks.guide}>
                  <Button className="h-12 rounded-full border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(30,41,59,0.84))] px-6 text-sm text-white shadow-[0_18px_40px_rgba(148,163,184,0.22)] backdrop-blur-xl hover:bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.9))]">
                    はじめての方へ
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </motion.div>

              <a href={siteLinks.mix}>
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-white/75 bg-white/30 px-6 text-sm text-slate-700 shadow-[0_10px_30px_rgba(148,163,184,0.12)] backdrop-blur-2xl hover:bg-white/45"
                >
                  MIX依頼を見る
                </Button>
              </a>

              <a href={siteLinks.audioCheck}>
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-sky-100 bg-sky-50/70 px-6 text-sm text-sky-700 shadow-sm hover:bg-sky-100"
                >
                  音声データチェックを試す
                </Button>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.34 }}
              className="mt-6"
            >
              <AnimatedPanel className="rounded-[1.6rem] border border-white/70 bg-white/80 backdrop-blur-xl">
                <div className="p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-500">まず確認できること</p>
                      <h3 className="text-lg font-semibold text-slate-900">
                        初回依頼でも、安心して進められる
                      </h3>
                    </div>
                    <motion.div
                      className="shrink-0 rounded-full bg-sky-50 px-3 py-1 text-xs text-sky-600"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2.6, repeat: Infinity }}
                    >
                      はじめてでも安心
                    </motion.div>
                  </div>

                  <div className="grid gap-2.5">
                    {beginnerSteps.map((step, i) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.45, delay: 0.42 + i * 0.08 }}
                        whileHover={{ x: 6 }}
                        className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 text-sm leading-7 text-slate-600"
                      >
                        {step}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </AnimatedPanel>
            </motion.div>
          </div>

          <div className="relative z-10 min-w-0 xl:justify-self-end xl:w-full xl:max-w-[520px] xl:pt-4">
            <motion.div
              className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/70 via-cyan-100/40 to-sky-200/30 blur-2xl"
              animate={{ opacity: [0.72, 1, 0.76], scale: [1, 1.03, 1] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <AnimatedPanel className="relative overflow-hidden rounded-[1.9rem] bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.94))] p-5 text-white shadow-[0_30px_80px_rgba(148,163,184,0.18)]">
                <motion.div
                  className="pointer-events-none absolute inset-0 opacity-50"
                  animate={{ backgroundPosition: ["0% 0%", "120% 0%"] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  style={{
                    backgroundImage:
                      "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(125,211,252,0.16) 30%, rgba(255,255,255,0) 58%)",
                    backgroundSize: "180% 100%",
                  }}
                />

                <div className="relative mb-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs tracking-[0.2em] text-sky-200">作品展示</p>
                    <h4 className="mt-2 text-xl font-semibold">音で空気/雰囲気も伝える</h4>
                  </div>
                  <motion.div
                    className="shrink-0"
                    animate={{ rotate: [0, 10, -8, 0], scale: [1, 1.08, 1] }}
                    transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Wand2 className="h-5 w-5 text-sky-200" />
                  </motion.div>
                </div>

                <p className="relative text-sm leading-7 text-slate-200">
                  透明感や空気感、青春感のあるサウンドを中心に様々な作品を取り扱ってます。
                </p>

                <div className="relative mt-4 grid gap-3">
                  {works.map((work, i) => (
                    <motion.a
                      key={work.title}
                      href={work.url}
                      target="_blank"
                      rel="noreferrer"
                      initial={{ opacity: 0, y: 18, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.34 + i * 0.08 }}
                      whileHover={{ y: -4, scale: 1.01 }}
                      className="group rounded-[1.15rem] border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm transition-colors hover:bg-white/[0.07]"
                    >
                      <div className="grid gap-3 md:grid-cols-[184px_minmax(0,1fr)] md:items-start">
                        <div className="relative aspect-video overflow-hidden rounded-2xl ring-1 ring-white/10">
                          <img
                            src={work.thumbnail}
                            alt={work.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                          />
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08),rgba(15,23,42,0.24)_52%,rgba(15,23,42,0.70))]" />
                          <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/20 px-2.5 py-1 text-[10px] tracking-[0.14em] text-white/90 backdrop-blur-md">
                            <PlayCircle className="h-3.5 w-3.5" />
                            再生先: YouTube
                          </div>
                        </div>

                        <div className="min-w-0">
                          <div className="mb-2 inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[10px] tracking-[0.14em] text-sky-100">
                            {work.label}
                          </div>
                          <div className="text-lg font-semibold tracking-tight text-white">{work.title}</div>
                          <div className="mt-1.5 text-xs leading-6 text-sky-100/80">{work.role}</div>
                          <div className="mt-2.5 text-sm leading-6 text-slate-300">{work.desc}</div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {work.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-200"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>

                <a
                  href={siteLinks.works}
                  className="relative mt-4 inline-flex items-center text-sm font-medium text-sky-200 transition hover:text-white"
                >
                  作品展示ページへ
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </AnimatedPanel>
            </motion.div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 pb-16 lg:px-10">
        <section id="features">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div>
              <p className="text-sm font-medium text-sky-600">ページ一覧</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                サービス・コンテンツ
              </h2>
            </div>
          </motion.div>


          <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {featureCards.map((card, i) => {
              const Icon = card.icon;

              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 24, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.05 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <AnimatedPanel className="rounded-[1.75rem] border border-white/70 bg-white/75 backdrop-blur">
                    <motion.div whileHover={{ y: -5, scale: 1.01 }}>
                      <Card className="border-none bg-transparent shadow-none">
                        <CardContent className="p-5">
                          <div className="mb-4 flex items-center justify-between">
                            <Icon className="h-6 w-6 text-sky-500" />
                            <span className="rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-500">
                              {card.badge}
                            </span>
                          </div>
                          <h4 className="text-lg font-semibold text-slate-900">{card.title}</h4>
                          <p className="mt-3 text-sm leading-7 text-slate-600">{card.desc}</p>
                          <Link
                            href={card.href}
                            className="mt-4 inline-flex min-h-[44px] items-center text-sm font-medium text-sky-600 transition hover:text-sky-700"
                          >
                            {card.linkText}
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </AnimatedPanel>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section id="guide" className="mt-16 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.6 }}
          >
            <AnimatedPanel className="rounded-[1.9rem] border border-white/70 bg-white/80 backdrop-blur-xl">
              <div className="grid gap-6 p-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <div>
                  <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                    はじめての方へ
                  </div>
                  <h3 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                    はじめての依頼でも、安心して相談できるように。
                  </h3>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                    まだ迷っていても大丈夫です。ざっくりした費用感だけでも、まずは気軽に相談してください！はじめての歌ってみたでも、流れが分かるように丁寧に案内します。
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Button
                      asChild
                      className="h-12 rounded-full border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(30,41,59,0.84))] px-6 text-sm text-white shadow-[0_18px_40px_rgba(148,163,184,0.22)] backdrop-blur-xl hover:bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.9))]"
                    >
                      <a href={siteLinks.googleForm} target="_blank" rel="noreferrer">
                        {contactActionLabels.primary}
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-12 rounded-full border-white/75 bg-white/30 px-6 text-sm text-slate-700 shadow-[0_10px_30px_rgba(148,163,184,0.12)] backdrop-blur-2xl hover:bg-white/45"
                    >
                      <Link href={siteLinks.audioCheck}>音声データチェックを試す</Link>
                    </Button>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  {[
                    "まず相談からでOK",
                    "送ってほしいものが分かる",
                    "FAQで不安を整理できる",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-600"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedPanel>
          </motion.div>

          <AnimatedPanel className="rounded-[1.9rem] border border-white/70 bg-white/80 backdrop-blur-xl">
            <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-sm font-medium text-sky-600">{contactPolicyCopy.eyebrow}</p>
                <h4 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                  {contactPolicyCopy.title}
                </h4>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                  {contactPolicyCopy.full}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button
                  asChild
                  className="h-12 rounded-full border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(30,41,59,0.84))] px-6 text-sm text-white shadow-[0_18px_40px_rgba(148,163,184,0.22)] backdrop-blur-xl hover:bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.9))]"
                >
                  <a href={siteLinks.googleForm} target="_blank" rel="noreferrer">
                    {contactActionLabels.primary}
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-full border-white/75 bg-white/30 px-6 text-sm text-slate-700 shadow-[0_10px_30px_rgba(148,163,184,0.12)] backdrop-blur-2xl hover:bg-white/45"
                >
                  <a href={siteLinks.x} target="_blank" rel="noreferrer">
                    {contactActionLabels.secondary}
                  </a>
                </Button>
              </div>
            </div>
          </AnimatedPanel>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}