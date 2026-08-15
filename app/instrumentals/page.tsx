"use client";

import React from "react";
import Link from "next/link";
import { Disc3, ExternalLink, ShieldCheck, Mic2, Sparkles, Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteLinks } from "@/lib/siteLinks";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { AnimatedPanel } from "@/components/site/AnimatedPanel";
import { PageFrame } from "@/components/site/PageFrame";
import { ContactBlock } from "@/components/site/ContactBlock";

const steps = [
  {
    icon: Search,
    step: "STEP 1",
    title: "ピアプロで曲を探す",
    desc: "配布中の音源はピアプロにまとめています。曲名や雰囲気から気になるものを選んでください。",
  },
  {
    icon: Download,
    step: "STEP 2",
    title: "音源をダウンロード",
    desc: "利用条件は音源ごとにピアプロのページへ記載しています。ダウンロード前に目を通してもらえると安心です。",
  },
  {
    icon: Mic2,
    step: "STEP 3",
    title: "歌ってみたに使う",
    desc: "あとは自由に歌っていただければ大丈夫です。完成した作品を聴かせていただけるとうれしいので、よければお知らせください。",
  },
] as const;

const highlights = [
  {
    icon: Disc3,
    title: "配布先はピアプロに一本化",
    desc: "音源も利用条件もピアプロ側で最新の状態にしています。ここを見に行けば全部そろいます。",
  },
  {
    icon: Sparkles,
    title: "透明感や空気感のある曲が中心",
    desc: "爽やかさ、青春感、少しのエモーショナルさ。そうした質感の曲が多めです。",
  },
  {
    icon: Mic2,
    title: "歌ってみた用途を想定",
    desc: "歌ってみたで使ってもらうことを前提に用意しています。気軽に手に取ってください。",
  },
] as const;

const usagePolicy = [
  {
    title: "利用条件はピアプロの記載が最新です",
    body: "音源ごとの条件はピアプロの各ページに書いています。ダウンロード前にそちらをご確認ください。",
  },
  {
    title: "歌ってみたでの使用を中心に想定しています",
    body: "それ以外の用途で迷う場合は、無理にご自身で判断せず、一度ご相談ください。",
  },
  {
    title: "細かいケースは相談ベースで大丈夫です",
    body: "条件の読み方に迷ったときも、そのままご相談ください。できるだけ柔軟に考えます。",
  },
] as const;

export default function InstrumentalsPage() {
  return (
    <PageFrame>
      <SiteHeader currentLabel="オフボーカル配布" />
      <main className="mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-10 lg:pt-10">
        <section className="space-y-6">
          <AnimatedPanel className="rounded-[2rem] border border-white/70 bg-white/80 p-6 backdrop-blur-xl">
            <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
              <div>
                <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                  オフボーカル配布
                </div>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
                  歌ってみたに使えるオフボーカルを、
                  <br />
                  ピアプロで配布しています。
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                  曲の一覧・音源のダウンロード・利用条件は、すべてピアプロにまとめています。気になる曲があれば、そのままダウンロードしてご利用いただけます。
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button asChild className="h-12 rounded-full px-6">
                    <a href={siteLinks.piapro} target="_blank" rel="noreferrer">
                      ピアプロで音源を見る
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="h-12 rounded-full px-6">
                    <Link href={siteLinks.works}>どんな曲かを聴いてみる</Link>
                  </Button>
                </div>
              </div>

              <AnimatedPanel className="rounded-[1.75rem] border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.94),rgba(30,41,59,0.92))] p-5 text-white">
                <div className="flex items-center gap-2 text-sky-200">
                  <Disc3 className="h-4 w-4" />
                  <p className="text-sm font-medium">Piapro</p>
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  ダウンロードはピアプロから
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-200">
                  ピアプロはクリプトン・フューチャー・メディアが運営する創作物の投稿サイトです。音源はそちらに置いているので、下のボタンからそのまま進んでください。
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="mt-5 h-11 w-full rounded-full border-white/30 bg-white px-6 text-slate-900 hover:bg-white/90 hover:text-slate-900"
                >
                  <a href={siteLinks.piapro} target="_blank" rel="noreferrer">
                    ピアプロのページを開く
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </AnimatedPanel>
            </div>
          </AnimatedPanel>

          <div className="grid gap-4 xl:grid-cols-3">
            {steps.map((item) => {
              const Icon = item.icon;
              return (
                <AnimatedPanel
                  key={item.step}
                  className="h-full rounded-[1.75rem] border border-white/70 bg-white/75 p-5 backdrop-blur"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50">
                      <Icon className="h-5 w-5 text-sky-500" />
                    </div>
                    <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-sky-700">
                      {item.step}
                    </div>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.desc}</p>
                </AnimatedPanel>
              );
            })}
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <AnimatedPanel
                  key={item.title}
                  className="rounded-[1.75rem] border border-white/70 bg-white/75 p-5 backdrop-blur"
                >
                  <Icon className="mb-4 h-6 w-6 text-sky-500" />
                  <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.desc}</p>
                </AnimatedPanel>
              );
            })}
          </div>

          <AnimatedPanel className="rounded-[1.9rem] border border-white/70 bg-white/82 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-sky-600" />
              <p className="text-sm font-medium text-sky-600">利用について</p>
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              まずはこの方針でご確認いただければ大丈夫です
            </h2>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {usagePolicy.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.25rem] border border-slate-200 bg-slate-50/75 p-4"
                >
                  <div className="text-sm font-medium text-slate-900">{item.title}</div>
                  <div className="mt-2 text-sm leading-7 text-slate-600">{item.body}</div>
                </div>
              ))}
            </div>
          </AnimatedPanel>

          <AnimatedPanel className="rounded-[1.9rem] border border-white/70 bg-white/82 p-6 backdrop-blur-xl">
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-medium text-sky-600">配布ページへ</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                  気になる曲があれば、そのまま使ってください
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                  配布中の音源はピアプロにまとめています。歌ってみたに使いたい方は、こちらからご覧ください。MIXまで含めて相談したい場合は、MIX依頼ページもあわせてどうぞ。
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button asChild className="h-12 rounded-full px-6">
                  <a href={siteLinks.piapro} target="_blank" rel="noreferrer">
                    ピアプロで音源を見る
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="h-12 rounded-full px-6">
                  <Link href={siteLinks.mix}>MIX依頼ページへ</Link>
                </Button>
              </div>
            </div>
          </AnimatedPanel>

          <ContactBlock />
        </section>
      </main>
      <SiteFooter />
    </PageFrame>
  );
}
