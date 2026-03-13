"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Radio, Sparkles, ChevronRight, Mic2, FileAudio, PlayCircle, Music4, Disc3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { siteLinks } from "@/lib/siteLinks";
import { contactPolicyCopy, contactActionLabels } from "@/lib/contactPolicy";
import { SiteFooter } from "@/components/site/SiteFooter";

const featureCards = [
  { title: "MIX依頼", desc: "はじめての歌ってみた依頼でも迷いにくいように、必要な準備から相談の流れまで順番に案内します。", icon: Mic2, href: siteLinks.mix, linkText: "MIX依頼ページへ" },
  { title: "音声データチェック", desc: "『このまま提出して大丈夫か』をやさしく確認できます。", icon: FileAudio, href: siteLinks.audioCheck, linkText: "音声データチェックページへ" },
  { title: "作品展示", desc: "作品や関与実績を見やすく整理。音の方向性もひと目で伝わります。", icon: PlayCircle, href: siteLinks.works, linkText: "作品展示ページへ" },
  { title: "作曲依頼", desc: "参考曲の共有や方向性のすり合わせも、相談ベースで進められます。", icon: Music4, href: siteLinks.compose, linkText: "作曲依頼ページへ" },
  { title: "オフボーカル配布", desc: "歌ってみたに使えるオフボーカルを公開しています。", icon: Disc3, href: siteLinks.instrumentals, linkText: "配布中の音源を見る" },
] as const;

const works = [
  { label: "注目作品", title: "花笑み、ひとひら", role: "作曲 / 編曲 / MIX", desc: "透明感と夏の空気を、まっすぐ閉じ込めた1曲。", url: "https://www.youtube.com/watch?v=BC8ZgzJWhX0" },
  { label: "透明感の軸", title: "水星巡航トリップ", role: "作曲 / 編曲 / 作詞 / 仕上げ", desc: "爽やかさと瑞々しさがにじむ1曲。", url: "https://www.youtube.com/watch?v=wfamkctKfUw&pp=0gcJCcUKAYcqIYzv" },
  { label: "MIX参考", title: "紫色のひまわり", role: "MIX / ハモリ提案", desc: "夜の感情を丁寧にすくい取るようなMIX。", url: "https://youtu.be/yu2VQvv9l5s" },
] as const;


function GlassOrb({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      className={`pointer-events-none absolute rounded-full blur-3xl opacity-55 ${className ?? ""}`}
      animate={{ x: [0, 18, -10, 0], y: [0, -14, 8, 0], scale: [1, 1.04, 0.98, 1] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

function AnimatedPanel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      animate={{
        boxShadow: [
          "0 10px 24px rgba(148,163,184,0.10)",
          "0 18px 34px rgba(148,163,184,0.14)",
          "0 10px 24px rgba(148,163,184,0.10)",
        ],
      }}
      transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f3fbff_0%,#e8f5ff_30%,#f8fcff_70%,#ffffff_100%)] text-slate-800">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.88),transparent_24%),radial-gradient(circle_at_top_right,rgba(191,219,254,0.32),transparent_30%),radial-gradient(circle_at_40%_18%,rgba(255,255,255,0.45),transparent_14%)]"
          animate={{ opacity: [0.78, 1, 0.82] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <GlassOrb className="left-[-120px] top-[-40px] h-72 w-72 bg-gradient-to-br from-cyan-200/40 via-sky-200/30 to-transparent" delay={0.2} />
        <GlassOrb className="right-[-80px] top-10 h-96 w-96 bg-gradient-to-br from-cyan-200/35 via-sky-200/25 to-transparent" delay={1.2} />
      </div>
      {children}
    </div>
  );
}

function ContactBlock({ useNextStep = false }: { useNextStep?: boolean }) {
  return (
    <AnimatedPanel className="rounded-[1.9rem] border border-white/70 bg-white/82 backdrop-blur-xl">
      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-sm font-medium text-sky-600">{contactPolicyCopy.eyebrow}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            {useNextStep ? contactPolicyCopy.nextStepTitle : contactPolicyCopy.title}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            {useNextStep ? contactPolicyCopy.nextStepBody : contactPolicyCopy.full}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Button asChild className="h-12 rounded-full px-6">
            <a href={siteLinks.googleForm} target="_blank" rel="noreferrer">
              {contactActionLabels.primary}
            </a>
          </Button>
          <Button asChild variant="outline" className="h-12 rounded-full px-6">
            <a href={siteLinks.x} target="_blank" rel="noreferrer">
              {contactActionLabels.secondary}
            </a>
          </Button>
        </div>
      </div>
    </AnimatedPanel>
  );
}

export default function TopPage() {
  return (
    <PageFrame>
      <section className="relative overflow-hidden">
        <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/35 ring-1 ring-white/50 backdrop-blur-2xl">
              <Radio className="h-5 w-5 text-sky-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-sky-700">倫 / Rin music works</p>
              <h1 className="text-base font-semibold tracking-wide text-slate-900">倫 / Rin</h1>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-slate-700 md:flex">
            <a href="#features" className="transition hover:text-slate-900">サービス</a>
            <Link href={siteLinks.guide} className="transition hover:text-slate-900">はじめての方へ</Link>
            <Link href={siteLinks.works} className="transition hover:text-slate-900">作品</Link>
          </nav>
        </header>

        <div className="mx-auto grid max-w-7xl gap-8 px-6 pb-16 pt-4 lg:grid-cols-[1.02fr_0.98fr] lg:px-10">
          <div className="relative z-10 flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-sm text-slate-800 ring-1 ring-white/60 backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-sky-500" />
              <span>声の透明感と、作品の世界観を整える</span>
            </div>

            <h2 className="max-w-4xl whitespace-pre-line text-4xl font-semibold leading-tight tracking-tight text-slate-950 md:text-5xl xl:text-6xl">
              {`声の透明感も、
作品の世界観も、まっすぐ届くように。`}
            </h2>

            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700 md:text-lg">
              声の良さを大切にしながら、聴きやすく自然な補正をベースに、希望や世界観へできるだけ寄り添って制作します。はじめての依頼でも相談しやすいように、ハモリや雰囲気づくりもできる範囲で丁寧に考えます。
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-12 rounded-full px-6">
                <Link href={siteLinks.guide}>はじめての方へ<ChevronRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="h-12 rounded-full px-6">
                <Link href={siteLinks.mix}>MIX依頼を見る</Link>
              </Button>
              <Button asChild variant="outline" className="h-12 rounded-full px-6">
                <Link href={siteLinks.audioCheck}>音声データチェックを試す</Link>
              </Button>
            </div>
          </div>

          <Card className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/28 shadow-[0_30px_80px_rgba(148,163,184,0.18)] backdrop-blur-[28px]">
            <CardContent className="p-5 md:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">サイトの方向性</p>
                  <h3 className="text-lg font-semibold text-slate-900">声の魅力と、音楽の世界観を両立</h3>
                </div>
                <div className="rounded-full bg-sky-50 px-3 py-1 text-xs text-sky-600">作品も見える</div>
              </div>

              <div className="grid gap-3">
                {works.map((work) => (
                  <a key={work.title} href={work.url} target="_blank" rel="noreferrer" className="rounded-[1rem] border border-slate-200 bg-white/60 p-4">
                    <div className="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-[10px] tracking-[0.14em] text-sky-700">{work.label}</div>
                    <div className="mt-3 text-lg font-semibold text-slate-900">{work.title}</div>
                    <div className="mt-1 text-xs text-slate-500">{work.role}</div>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{work.desc}</p>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 pb-16 lg:px-10">
        <section id="features">
          <div className="mb-6">
            <p className="text-sm font-medium text-sky-600">入口一覧</p>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">迷わず進める5つの入口</h3>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {featureCards.map((card) => {
              const Icon = card.icon;
              return (
                <AnimatedPanel key={card.title} className="rounded-[1.75rem] border border-white/70 bg-white/75 backdrop-blur">
                  <Card className="border-none bg-transparent shadow-none">
                    <CardContent className="p-5">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50">
                        <Icon className="h-5 w-5 text-sky-500" />
                      </div>
                      <h4 className="text-lg font-semibold text-slate-900">{card.title}</h4>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{card.desc}</p>
                      <Link href={card.href} className="mt-4 inline-flex items-center text-sm font-medium text-sky-600">
                        {card.linkText}
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </CardContent>
                  </Card>
                </AnimatedPanel>
              );
            })}
          </div>
        </section>

        <section className="mt-16">
          <ContactBlock />
        </section>
      </main>

      <SiteFooter />
    </PageFrame>
  );
}
