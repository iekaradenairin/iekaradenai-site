"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Waves, Headphones, Music4 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteLinks } from "@/lib/siteLinks";
import { contactPolicyCopy, contactActionLabels } from "@/lib/contactPolicy";
import { SiteFooter } from "@/components/site/SiteFooter";

const pricing = [
  { label: "ボーカルMIX", value: "15,000円", note: "自然な補正 / マスタリング込み" },
  { label: "ハモリ提案込み", value: "20,000円", note: "雰囲気に合わせた提案込み" },
  { label: "追加対応", value: "内容に応じてご相談", note: "コラボ・特殊処理・特急対応など" },
] as const;

const faqs = [
  { q: "はじめてでも依頼できますか？", a: "もちろん大丈夫です。内容がまだまとまりきっていない場合も、一緒に整理しながら進めていけます。" },
  { q: "音源に自信がありません", a: "まず音声データチェックをご利用ください。それでも判断しにくい部分は、ご相談をいただきながら確認していけます。" },
  { q: "ハモリも相談できますか？", a: "対応可能です。本家の雰囲気に寄せるだけでなく、曲に合う形を一緒に考えることもあります。" },
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

export default function MixPage() {
  return (
    <PageFrame>
      <main className="mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-10 lg:pt-10">
        <section className="space-y-6">
          <AnimatedPanel className="rounded-[2rem] border border-white/70 bg-white/80 p-6 backdrop-blur-xl">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">MIX依頼</div>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
                  声の魅力を大切にしながら、
                  <br />
                  作品として自然に届くかたちへ整えます。
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                  聴きやすく自然な補正をベースに、透明感や空気感を大切にしながら仕上げます。はじめてのご依頼でも進め方が分かりやすいよう丁寧にご案内します。
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button asChild className="h-12 rounded-full px-6">
                    <a href={siteLinks.googleForm} target="_blank" rel="noreferrer">Googleフォームから相談する</a>
                  </Button>
                  <Button asChild variant="outline" className="h-12 rounded-full px-6">
                    <Link href={siteLinks.guide}>はじめての方へ</Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-1">
                {pricing.map((item) => (
                  <div key={item.label} className="rounded-[1.3rem] border border-slate-200 bg-slate-50/70 p-4">
                    <div className="text-xs tracking-[0.14em] text-slate-500">{item.label}</div>
                    <div className="mt-2 text-xl font-semibold text-slate-900">{item.value}</div>
                    <div className="mt-1 text-sm text-slate-500">{item.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedPanel>

          <div className="grid gap-4 xl:grid-cols-3">
            {[
              { icon: Waves, title: "自然な補正 / タイミング補正", desc: "違和感を抑えながら、聴きやすく気持ちよく届く形へ整えます。" },
              { icon: Headphones, title: "声に合わせた音づくり", desc: "曲や声質に合わせて、抜け感や空気感を見ながらバランスを整えます。" },
              { icon: Music4, title: "ハモリや雰囲気づくりの相談", desc: "必要に応じて、本家に寄せるだけでなく曲に合う形を一緒に考えます。" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <AnimatedPanel key={item.title} className="rounded-[1.75rem] border border-white/70 bg-white/75 p-5 backdrop-blur">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50">
                    <Icon className="h-5 w-5 text-sky-500" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.desc}</p>
                </AnimatedPanel>
              );
            })}
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <AnimatedPanel className="rounded-[1.75rem] border border-white/70 bg-white/75 p-6 backdrop-blur">
              <p className="text-sm font-medium text-sky-600">送ってほしいもの</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">まずは、この内容が分かれば大丈夫です</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/70 p-4">
                  <div className="text-sm font-medium text-slate-900">必須</div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    <li>・ボーカル音源</li>
                    <li>・オケ</li>
                  </ul>
                </div>
                <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/70 p-4">
                  <div className="text-sm font-medium text-slate-900">なるべくあると助かるもの</div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    <li>・参考曲</li>
                    <li>・キー情報</li>
                    <li>・依頼内容メモ</li>
                    <li>・ハモリ希望</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                理想的な形はありますが、最初から完璧でなくても問題ありません。不安がある場合は、音声データチェックページもご利用ください。
              </p>
            </AnimatedPanel>

            <AnimatedPanel className="rounded-[1.75rem] border border-white/70 bg-white/75 p-6 backdrop-blur">
              <p className="text-sm font-medium text-sky-600">よくある質問</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">ご相談前によくいただくご質問</h2>
              <div className="mt-5 space-y-3">
                {faqs.map((item) => (
                  <div key={item.q} className="rounded-[1.2rem] border border-slate-200 bg-slate-50/70 p-4">
                    <div className="text-sm font-medium text-slate-900">Q. {item.q}</div>
                    <div className="mt-2 text-sm leading-7 text-slate-600">{item.a}</div>
                  </div>
                ))}
              </div>
            </AnimatedPanel>
          </div>

          <ContactBlock />
        </section>
      </main>
      <SiteFooter />
    </PageFrame>
  );
}
