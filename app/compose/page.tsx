"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ChevronRight, Music4, Wand2, Disc3, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteLinks } from "@/lib/siteLinks";
import { contactPolicyCopy, contactActionLabels } from "@/lib/contactPolicy";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

const suitableCases = [
  "オリジナル曲を作ってみたい",
  "活動の雰囲気に合う曲がほしい",
  "透明感や空気感のあるサウンドにしたい",
  "参考曲はあるけれど、どう伝えればいいか分からない",
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

export default function ComposePage() {
  return (
    <PageFrame>
      <SiteHeader currentLabel="作曲依頼" />
      <main className="mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-10 lg:pt-10">
        <section className="space-y-6">
          <AnimatedPanel className="rounded-[2rem] border border-white/70 bg-white/80 p-6 backdrop-blur-xl">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">作曲依頼</div>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
                  世界観のある1曲を、
                  <br />
                  ていねいに形にしていきます。
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                  透明感や空気感、少しのエモーショナルさを大切にしながら、活動や作品の雰囲気に合う楽曲を一緒に整えていきます。
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button asChild className="h-12 rounded-full px-6">
                    <a href={siteLinks.googleForm} target="_blank" rel="noreferrer">
                      まず相談する
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="h-12 rounded-full px-6">
                    <Link href={siteLinks.works}>作品を見る</Link>
                  </Button>
                </div>
              </div>

              <AnimatedPanel className="rounded-[1.75rem] border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.94),rgba(30,41,59,0.92))] p-5 text-white">
                <div className="flex items-center gap-2 text-sky-200">
                  <Wand2 className="h-4 w-4" />
                  <p className="text-sm font-medium">Sound / Direction</p>
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">透明感や空気感が自然に残る、まっすぐ届く音づくり</h2>
                <p className="mt-3 text-sm leading-7 text-slate-200">
                  爽やかさ、瑞々しさ、少しのエモーショナルさ。そうした空気を大切にしながら、作品全体の雰囲気まで含めて整えていきます。
                </p>
              </AnimatedPanel>
            </div>
          </AnimatedPanel>

          <div className="grid gap-4 xl:grid-cols-[0.98fr_1.02fr]">
            <AnimatedPanel className="rounded-[1.75rem] border border-white/70 bg-white/78 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-sky-600" />
                <p className="text-sm font-medium text-sky-600">こんな相談に向いています</p>
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">世界観の相談から始めたい方へ</h2>
              <div className="mt-5 space-y-3 text-sm text-slate-600">
                {suitableCases.map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50/75 p-4">・{item}</div>
                ))}
              </div>
            </AnimatedPanel>

            <AnimatedPanel className="rounded-[1.75rem] border border-white/70 bg-white/78 p-6 backdrop-blur-xl">
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  { title: "作曲", desc: "活動やイメージに合わせた楽曲制作の相談ができます。", icon: Music4 },
                  { title: "編曲 / アレンジ", desc: "方向性に合わせて、質感や展開の整理を一緒に進められます。", icon: Disc3 },
                  { title: "雰囲気づくりの相談", desc: "言葉の印象から方向を整える相談ができます。", icon: Sparkles },
                  { title: "完成形までの相談", desc: "必要に応じてMIXまで含めて完成イメージを考えられます。", icon: Headphones },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-[1.2rem] border border-slate-200 bg-slate-50/75 p-4">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50">
                        <Icon className="h-4 w-4 text-sky-500" />
                      </div>
                      <div className="text-sm font-medium text-slate-900">{item.title}</div>
                      <div className="mt-2 text-sm leading-7 text-slate-600">{item.desc}</div>
                    </div>
                  );
                })}
              </div>
            </AnimatedPanel>
          </div>

          <AnimatedPanel className="rounded-[1.75rem] border border-white/70 bg-white/78 p-6 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">ご相談前によくいただくご質問</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {[
                ["まだイメージがまとまっていません", "参考曲や、好きな雰囲気の言葉が少しあるだけでも大丈夫です。"],
                ["歌詞がなくても相談できますか？", "先に曲の方向を考える形でも進められます。"],
                ["MIX依頼の延長で作曲も相談できますか？", "可能です。世界観づくりから相談したい場合にも対応できます。"],
                ["料金はどれくらいですか？", "内容によって変わるため、まずは相談内容を見ながらご案内しています。"],
              ].map(([q, a]) => (
                <div key={q} className="rounded-[1.2rem] border border-slate-200 bg-slate-50/75 p-4">
                  <div className="text-sm font-medium text-slate-900">Q. {q}</div>
                  <div className="mt-2 text-sm leading-7 text-slate-600">{a}</div>
                </div>
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
