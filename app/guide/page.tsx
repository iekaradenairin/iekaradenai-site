"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Disc3, CircleHelp, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteLinks } from "@/lib/siteLinks";
import { contactPolicyCopy, contactActionLabels } from "@/lib/contactPolicy";
import { SiteFooter } from "@/components/site/SiteFooter";

const steps = [
  { step: "STEP 1", title: "まず相談する", desc: "まだ迷っていても大丈夫です。ざっくりした費用感だけでも、まずは気軽に相談してください。" },
  { step: "STEP 2", title: "音源を準備する", desc: "まずはボーカル音源とオケがあれば大丈夫です。不安がある場合は、音声データチェックで提出前の確認もできます。" },
  { step: "STEP 3", title: "制作・確認・納品", desc: "やり取りしながら、できるだけ希望に寄り添って進めます。納品は基本的に、すべてのデータを受け取ってから1ヶ月が目安です。" },
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

export default function GuidePage() {
  return (
    <PageFrame>
      <main className="mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-10 lg:pt-10">
        <section className="space-y-6">
          <AnimatedPanel className="rounded-[1.9rem] border border-white/70 bg-white/80 p-6 backdrop-blur-xl">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">はじめての方へ</div>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">はじめての依頼でも、安心して相談できるように。</h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                  まだ迷っていても大丈夫です。ざっくりした費用感だけでも、まずは気軽に相談してください。はじめての歌ってみたでも、流れが分かるように丁寧に案内します。
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button asChild className="h-12 rounded-full px-6">
                    <a href={siteLinks.googleForm} target="_blank" rel="noreferrer">{contactActionLabels.primary}</a>
                  </Button>
                  <Button asChild variant="outline" className="h-12 rounded-full px-6">
                    <Link href={siteLinks.audioCheck}>音声データチェックを試す</Link>
                  </Button>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {["まず相談からでOK", "送ってほしいものが分かる", "FAQで不安を整理できる"].map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-600">{item}</div>
                ))}
              </div>
            </div>
          </AnimatedPanel>

          <div className="grid gap-4 xl:grid-cols-3">
            {steps.map((item) => (
              <AnimatedPanel key={item.step} className="rounded-[1.75rem] border border-white/70 bg-white/75 p-5 backdrop-blur">
                <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-sky-700">{item.step}</div>
                <h2 className="mt-3 text-xl font-semibold text-slate-900">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.desc}</p>
              </AnimatedPanel>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <AnimatedPanel className="rounded-[1.75rem] border border-white/70 bg-white/75 p-6 backdrop-blur">
              <div className="flex items-center gap-2">
                <Disc3 className="h-4 w-4 text-sky-600" />
                <p className="text-sm font-medium text-sky-600">送ってほしいもの</p>
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">まずは、ここだけ分かれば大丈夫です</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/70 p-4">
                  <div className="text-sm font-medium text-slate-900">必須</div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    <li>・ボーカル音源</li>
                    <li>・オケ</li>
                  </ul>
                </div>
                <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/70 p-4">
                  <div className="text-sm font-medium text-slate-900">あると助かるもの</div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    <li>・参考曲</li>
                    <li>・キー情報</li>
                    <li>・依頼内容メモ</li>
                    <li>・納期希望</li>
                  </ul>
                </div>
              </div>
            </AnimatedPanel>

            <AnimatedPanel className="rounded-[1.75rem] border border-white/70 bg-white/75 p-6 backdrop-blur">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-sky-600" />
                <p className="text-sm font-medium text-sky-600">音源について</p>
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">音源に不安があっても大丈夫です</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                モノラル、エフェクトなし、頭出し済み、24bit / 44.1kHz以上、ハモリやコーラスは別トラック、という形が理想ではあります。ただ、最初から完璧でなくても大丈夫です。
              </p>
              <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-slate-50/70 p-4 text-sm leading-7 text-slate-600">
                キー変更を希望する場合は、相談の段階で先に教えてください。変更後のオケがあるとスムーズですが、手元にない場合もまずは相談してもらえれば大丈夫です。
              </div>
            </AnimatedPanel>
          </div>

          <AnimatedPanel className="rounded-[1.75rem] border border-white/70 bg-white/75 p-6 backdrop-blur">
            <div className="flex items-center gap-2">
              <CircleHelp className="h-4 w-4 text-sky-600" />
              <p className="text-sm font-medium text-sky-600">よくある質問</p>
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">初回の不安を、先に整理しておきたい人へ</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {[
                ["こんな状態で相談していいのか不安です", "最初から完璧にまとまっていなくても大丈夫です。今ある状態を見せてもらえれば、確認しながら進められます。"],
                ["何を渡せばいいか分かりません", "まずはボーカル音源とオケがあれば大丈夫です。参考曲や希望の雰囲気があると、方向性を合わせやすくなります。"],
                ["音質が悪かったらどうしよう", "不安な場合は、まず音声データチェックを使ってみてください。"],
                ["納期はどれくらいですか？", "内容や時期によって変わるため、まずは気軽にご相談ください。"],
              ].map(([q, a]) => (
                <div key={q} className="rounded-[1.2rem] border border-slate-200 bg-slate-50/70 p-4">
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
