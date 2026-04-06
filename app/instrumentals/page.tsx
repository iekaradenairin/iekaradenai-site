"use client";

import React from "react";
import Link from "next/link";
import { Disc3, ExternalLink, ShieldCheck, Music4, FileAudio, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteLinks } from "@/lib/siteLinks";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { AnimatedPanel } from "@/components/site/AnimatedPanel";
import { PageFrame } from "@/components/site/PageFrame";
import { ContactBlock } from "@/components/site/ContactBlock";

export default function InstrumentalsPage() {
  return (
    <PageFrame>
      <SiteHeader currentLabel="オフボーカル配布" />
      <main className="mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-10 lg:pt-10">
        <section className="space-y-6">
          <AnimatedPanel className="rounded-[2rem] border border-white/70 bg-white/80 p-6 backdrop-blur-xl">
            <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
              <div>
                <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">オフボーカル配布</div>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
                  配布中のオフボーカルは、
                  <br />
                  ピアプロにまとめています。
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                  このページでは、配布音源の一覧をサイト内に持たず、配布先への導線だけを整理しています。歌ってみたに使いたい方は、ピアプロ側からご覧ください。
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button asChild className="h-12 rounded-full px-6">
                    <a href={siteLinks.piapro} target="_blank" rel="noreferrer">
                      ピアプロで見る
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="h-12 rounded-full px-6">
                    <Link href={siteLinks.works}>作品展示を見る</Link>
                  </Button>
                </div>
              </div>

              <AnimatedPanel className="rounded-[1.75rem] border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.94),rgba(30,41,59,0.92))] p-5 text-white">
                <div className="flex items-center gap-2 text-sky-200">
                  <FileAudio className="h-4 w-4" />
                  <p className="text-sm font-medium">Download Guide</p>
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">必要な情報は、できるだけシンプルに</h2>
                <p className="mt-3 text-sm leading-7 text-slate-200">
                  オフボーカル配布ページは、導線を増やしすぎず、必要な人が迷わず配布先へ進めることを大切にしています。
                </p>
              </AnimatedPanel>
            </div>
          </AnimatedPanel>

          <div className="grid gap-4 xl:grid-cols-3">
            {[
              { icon: Disc3, title: "配布先はピアプロに統一", desc: "サイト内に曲一覧は持たず、配布音源はピアプロにまとめています。" },
              { icon: Music4, title: "歌ってみたで使いやすい形", desc: "必要な導線をできるだけ分かりやすくしています。" },
              { icon: Sparkles, title: "世界観ごと楽しんでもらえるとうれしい", desc: "曲の空気感や世界観もあわせて楽しんでもらえたらと思っています。" },
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

          <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
            <AnimatedPanel className="rounded-[1.9rem] border border-white/70 bg-white/82 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-sky-600" />
                <p className="text-sm font-medium text-sky-600">利用について</p>
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">まずはこの方針で見てもらえれば大丈夫です</h2>
              <div className="mt-5 grid gap-3">
                {[
                  ["まずはピアプロの内容をご確認ください", "配布中の音源や利用条件は、ピアプロ側でご確認ください。"],
                  ["歌ってみた用途を中心に想定しています", "用途に迷う場合は、無理に判断せず一度ご相談ください。"],
                  ["不明点は相談ベースで大丈夫です", "細かいケースで判断に迷う場合は、そのままご相談ください。"],
                ].map(([title, body]) => (
                  <div key={title} className="rounded-[1.25rem] border border-slate-200 bg-slate-50/75 p-4">
                    <div className="text-sm font-medium text-slate-900">{title}</div>
                    <div className="mt-2 text-sm leading-7 text-slate-600">{body}</div>
                  </div>
                ))}
              </div>
            </AnimatedPanel>

            <AnimatedPanel className="rounded-[1.9rem] border border-white/70 bg-white/82 p-6 backdrop-blur-xl">
              <p className="text-sm font-medium text-sky-600">こんなときに使いやすいページです</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">必要な導線だけ、静かにまとめています</h2>
              <div className="mt-5 space-y-3 text-sm text-slate-600">
                {[
                  "歌ってみたに使いたい",
                  "公開中の音源をまとめて確認したい",
                  "利用条件に迷うので一度相談したい",
                  "曲の雰囲気ごとにピアプロで探したい",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50/75 p-4">・{item}</div>
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
