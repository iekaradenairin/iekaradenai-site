"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PlayCircle, Sparkles, Music4, Mic2, Wand2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteLinks } from "@/lib/siteLinks";
import { contactPolicyCopy, contactActionLabels } from "@/lib/contactPolicy";
import { SiteFooter } from "@/components/site/SiteFooter";

const featuredWorks = [
  { label: "注目作品", title: "花笑み、ひとひら", role: "作曲 / 編曲 / MIX", desc: "透明感と夏の空気を、まっすぐ閉じ込めた1曲。", url: "https://www.youtube.com/watch?v=BC8ZgzJWhX0", thumbnail: "https://i.ytimg.com/vi/BC8ZgzJWhX0/hqdefault.jpg" },
  { label: "透明感の軸", title: "水星巡航トリップ", role: "作曲 / 編曲 / 作詞 / 仕上げ", desc: "瑞々しさと爽やかさの中に、ほのかなエモーショナルさがにじむ1曲。", url: "https://www.youtube.com/watch?v=wfamkctKfUw&pp=0gcJCcUKAYcqIYzv", thumbnail: "https://i.ytimg.com/vi/wfamkctKfUw/hqdefault.jpg" },
  { label: "MIX参考", title: "紫色のひまわり", role: "MIX / ハモリ提案", desc: "夜の感情を丁寧にすくい取るような、余韻を大切にしたMIX。", url: "https://youtu.be/yu2VQvv9l5s", thumbnail: "https://i.ytimg.com/vi/yu2VQvv9l5s/hqdefault.jpg" },
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

export default function WorksPage() {
  return (
    <PageFrame>
      <main className="mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-10 lg:pt-10">
        <section className="space-y-6">
          <AnimatedPanel className="rounded-[2rem] border border-white/70 bg-white/80 p-6 backdrop-blur-xl">
            <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
              <div>
                <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">作品展示</div>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
                  音の雰囲気ごと、
                  <br />
                  作品として見てもらえるように。
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                  透明感や空気感、爽やかさ、少しのエモーショナルさ。そうした質感がどう作品に乗るかを、まとめて見てもらえるページです。
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button asChild className="h-12 rounded-full px-6">
                    <a href={siteLinks.youtubeChannel} target="_blank" rel="noreferrer">
                      YouTubeで見る
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="h-12 rounded-full px-6">
                    <Link href={siteLinks.mix}>MIX依頼を見る</Link>
                  </Button>
                </div>
              </div>

              <AnimatedPanel className="rounded-[1.75rem] border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.94),rgba(30,41,59,0.92))] p-5 text-white">
                <div className="flex items-center gap-2 text-sky-200">
                  <Wand2 className="h-4 w-4" />
                  <p className="text-sm font-medium">Sound Direction</p>
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">声の魅力と、作品の世界観が両方見えるように</h2>
                <p className="mt-3 text-sm leading-7 text-slate-200">
                  ただ整えるだけでなく、その作品が持っている空気を崩さないことを大切にしています。
                </p>
              </AnimatedPanel>
            </div>
          </AnimatedPanel>

          <div className="grid gap-4 xl:grid-cols-3">
            {[
              { icon: Sparkles, title: "透明感のある音づくり", desc: "声の魅力を残しながら、透明感や空気感が自然に伝わる仕上がりを大切にしています。" },
              { icon: Music4, title: "世界観ごとの整え方", desc: "爽やかさ、青春感、少しのエモーショナルさなど、作品ごとの空気を崩さずにまとめていきます。" },
              { icon: Mic2, title: "歌ってみたに強い距離感", desc: "歌ってみたの中で気持ちよく届くバランス感を意識しています。" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <AnimatedPanel key={item.title} className="rounded-[1.75rem] border border-white/70 bg-white/75 p-5 backdrop-blur">
                  <Icon className="mb-4 h-6 w-6 text-sky-500" />
                  <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.desc}</p>
                </AnimatedPanel>
              );
            })}
          </div>

          <AnimatedPanel className="rounded-[1.9rem] border border-white/70 bg-white/82 p-6 backdrop-blur-xl">
            <p className="text-sm font-medium text-sky-600">代表作品</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">まず見てほしい3作品</h2>
            <div className="mt-5 grid gap-4 xl:grid-cols-3">
              {featuredWorks.map((work) => (
                <a key={work.title} href={work.url} target="_blank" rel="noreferrer" className="group rounded-[1.5rem] border border-slate-200 bg-white/70 p-4 transition hover:-translate-y-1 hover:border-slate-300 hover:bg-white">
                  <div className="relative aspect-video overflow-hidden rounded-[1.25rem] ring-1 ring-slate-200">
                    <img src={work.thumbnail} alt={work.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                  </div>
                  <div className="mt-4 inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-[10px] tracking-[0.14em] text-sky-700">{work.label}</div>
                  <div className="mt-3 text-xl font-semibold tracking-tight text-slate-900">{work.title}</div>
                  <div className="mt-2 text-xs leading-6 text-slate-500">{work.role}</div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{work.desc}</p>
                </a>
              ))}
            </div>
          </AnimatedPanel>

          <ContactBlock />
        </section>
      </main>
      <SiteFooter />
    </PageFrame>
  );
}
