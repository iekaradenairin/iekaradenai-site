"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileAudio, CircleCheckBig, TriangleAlert, ChevronDown, ChevronUp, ShieldCheck, Waves, SlidersHorizontal, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteLinks } from "@/lib/siteLinks";
import { contactPolicyCopy, contactActionLabels } from "@/lib/contactPolicy";
import { SiteFooter } from "@/components/site/SiteFooter";

type CheckStatus = "ok" | "consult";
type CheckMode = "vocal" | "master";

type CheckItem = {
  name: string;
  status: CheckStatus;
  summary: string;
  value?: string;
  note?: string;
  action?: string;
};

type CheckedFile = {
  id: string;
  fileName: string;
  modeLabel: string;
  overall: CheckStatus;
  overallText: string;
  shortComment: string;
  meta: { duration: string; size: string };
  items: CheckItem[];
};

const mockFilesByMode: Record<CheckMode, CheckedFile[]> = {
  vocal: [
    {
      id: "vocal-1",
      fileName: "main_vocal_take01.wav",
      modeLabel: "ボーカル素材チェック",
      overall: "ok",
      overallText: "○ 問題なし",
      shortComment: "モノラル / 48kHz / 24bit。ピークも安定していて、大きな問題は見られません。",
      meta: { duration: "03:41", size: "64.2MB" },
      items: [
        { name: "ファイル形式", status: "ok", summary: "WAV 形式です。大きな問題は見られません。", value: "PCM / 48kHz / 24bit" },
        { name: "チャンネル数", status: "ok", summary: "モノラルです。ボーカル素材として問題ない状態です。", value: "1ch" },
        { name: "S/N比（参考）", status: "ok", summary: "大きな不安はなさそうです。", value: "推定 S/N: 61dB", note: "参考値です。" },
      ],
    },
    {
      id: "vocal-2",
      fileName: "lead_vo_stereo_export.wav",
      modeLabel: "ボーカル素材チェック",
      overall: "consult",
      overallText: "△ 一度確認したい",
      shortComment: "ステレオ書き出しです。提出前に一度確認したい状態です。",
      meta: { duration: "04:08", size: "71.8MB" },
      items: [
        { name: "ファイル形式", status: "ok", summary: "WAV 形式です。大きな問題は見られません。", value: "PCM / 44.1kHz / 24bit" },
        { name: "チャンネル数", status: "consult", summary: "ステレオです。モノラル書き出しの方が進めやすい場合があります。", value: "2ch", action: "DAW の書き出し設定で、ボーカルトラックをモノラルで書き出してください。" },
        { name: "ピーク / ヘッドルーム", status: "consult", summary: "ピークがやや高めです。余裕を持たせられると安心です。", value: "Peak: -1.2dBFS", action: "書き出し時のレベルを少し下げてください。" },
      ],
    },
  ],
  master: [
    {
      id: "master-1",
      fileName: "full_mix_preview.wav",
      modeLabel: "一般音源チェック",
      overall: "ok",
      overallText: "○ 問題なし",
      shortComment: "ステレオ / 48kHz / 24bit。一般音源として大きな問題は見られません。",
      meta: { duration: "04:22", size: "82.1MB" },
      items: [
        { name: "ファイル形式", status: "ok", summary: "WAV 形式です。大きな問題は見られません。", value: "PCM / 48kHz / 24bit" },
        { name: "チャンネル数", status: "ok", summary: "ステレオです。一般音源として問題ない状態です。", value: "2ch" },
        { name: "左右バランス", status: "ok", summary: "大きな偏りは見られません。", value: "L/R diff: 1.4dB" },
      ],
    },
  ],
};


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

function SummaryBadge({ status, text }: { status: CheckStatus; text: string }) {
  const ok = status === "ok";
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
      {ok ? <CircleCheckBig className="h-3.5 w-3.5" /> : <TriangleAlert className="h-3.5 w-3.5" />}
      {text}
    </span>
  );
}

function FileResultCard({ file }: { file: CheckedFile }) {
  const [open, setOpen] = useState(file.id === "vocal-1");

  return (
    <AnimatedPanel className="rounded-[1.75rem] border border-white/70 bg-white/78 backdrop-blur-xl">
      <div className="p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <SummaryBadge status={file.overall} text={file.overallText} />
              <span className="rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-500">{file.modeLabel}</span>
            </div>
            <h3 className="mt-3 truncate text-xl font-semibold tracking-tight text-slate-900">{file.fileName}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{file.shortComment}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[220px] lg:grid-cols-1">
            <div className="rounded-[1.1rem] border border-slate-200 bg-slate-50/80 px-4 py-3">
              <div className="text-[11px] tracking-[0.14em] text-slate-400">長さ</div>
              <div className="mt-1 text-sm font-medium text-slate-700">{file.meta.duration}</div>
            </div>
            <div className="rounded-[1.1rem] border border-slate-200 bg-slate-50/80 px-4 py-3">
              <div className="text-[11px] tracking-[0.14em] text-slate-400">ファイルサイズ</div>
              <div className="mt-1 text-sm font-medium text-slate-700">{file.meta.size}</div>
            </div>
          </div>
        </div>

        <button type="button" onClick={() => setOpen((v) => !v)} className="mt-5 inline-flex items-center text-sm font-medium text-sky-600">
          詳細を見る
          {open ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
        </button>

        {open ? (
          <div className="mt-5 grid gap-3">
            {file.items.map((item) => (
              <div key={item.name} className="rounded-[1.2rem] border border-slate-200 bg-slate-50/75 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-sm font-medium text-slate-900">{item.name}</div>
                  <SummaryBadge status={item.status} text={item.status === "ok" ? "○ 問題なし" : "△ 一度確認したい"} />
                </div>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.summary}</p>
                {item.value ? <div className="mt-2 text-xs text-slate-400">{item.value}</div> : null}
                {item.action ? <div className="mt-3 rounded-[1rem] border border-sky-100 bg-sky-50/70 px-4 py-3 text-sm leading-7 text-slate-600">見直し方：{item.action}</div> : null}
                {item.note ? <div className="mt-3 text-sm text-slate-500">補足：{item.note}</div> : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </AnimatedPanel>
  );
}

export default function AudioCheckPage() {
  const [mode, setMode] = useState<CheckMode>("vocal");
  const files = useMemo(() => mockFilesByMode[mode], [mode]);
  const summary = useMemo(() => ({
    total: files.length,
    ok: files.filter((f) => f.overall === "ok").length,
    consult: files.filter((f) => f.overall === "consult").length,
  }), [files]);

  return (
    <PageFrame>
      <main className="mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-10 lg:pt-10">
        <section className="space-y-6">
          <AnimatedPanel className="rounded-[2rem] border border-white/70 bg-white/80 p-6 backdrop-blur-xl">
            <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
              <div>
                <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">音声データチェック</div>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
                  提出前に、
                  <br />
                  音源の状態を簡易チェックできます。
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                  WAV かどうか、モノラル / ステレオ、ピークや参考値などをブラウザ上で確認できます。難しい数値を見るためというより、「大きな問題がなさそうか」を確認するためのページです。
                </p>
                <div className="mt-5 inline-flex items-start gap-2 rounded-[1rem] border border-sky-100 bg-sky-50/70 px-4 py-3 text-sm leading-7 text-slate-600">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                  解析はブラウザ内で行います。音源ファイルはサーバーへ送信しません。
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-1">
                {[
                  { label: "チェック対象", value: "ボーカル / 一般音源" },
                  { label: "対応形式", value: "複数ファイル対応" },
                  { label: "使いどころ", value: "提出前の簡易確認" },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.3rem] border border-slate-200 bg-slate-50/70 p-4">
                    <div className="text-xs tracking-[0.14em] text-slate-500">{item.label}</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedPanel>

          <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
            <AnimatedPanel className="rounded-[1.75rem] border border-white/70 bg-white/78 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-sky-600" />
                <p className="text-sm font-medium text-sky-600">チェックモード</p>
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">用途に合わせて見方を切り替えます</h2>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {[
                  { key: "vocal" as const, title: "ボーカル素材チェック", desc: "MIX依頼前のボーカル素材向けです。" },
                  { key: "master" as const, title: "一般音源チェック", desc: "2mix や完成音源向けです。" },
                ].map((item) => (
                  <button key={item.key} type="button" onClick={() => setMode(item.key)} className={`rounded-[1.3rem] border px-4 py-4 text-left transition ${mode === item.key ? "border-sky-200 bg-sky-50/85 shadow-sm" : "border-slate-200 bg-slate-50/70"}`}>
                    <div className="text-sm font-medium text-slate-900">{item.title}</div>
                    <div className="mt-2 text-sm leading-7 text-slate-600">{item.desc}</div>
                  </button>
                ))}
              </div>
            </AnimatedPanel>

            <AnimatedPanel className="rounded-[1.75rem] border border-white/70 bg-white/78 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-sky-600" />
                <p className="text-sm font-medium text-sky-600">ファイルを追加する</p>
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">複数ファイルをまとめて確認できます</h2>
              <div className="mt-5 rounded-[1.5rem] border border-dashed border-sky-200 bg-sky-50/60 p-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-sky-100">
                  <FileAudio className="h-6 w-6 text-sky-500" />
                </div>
                <div className="mt-4 text-base font-medium text-slate-900">ここにファイルをドラッグ&ドロップ</div>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  WAV を中心に、複数ファイルをまとめて確認できます。ここではUI試作としてサンプル結果を表示しています。
                </p>
                <Button className="mt-5 h-11 rounded-full px-6">ファイルを選ぶ</Button>
              </div>
            </AnimatedPanel>
          </div>

          <AnimatedPanel className="rounded-[1.75rem] border border-white/70 bg-white/78 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <Waves className="h-4 w-4 text-sky-600" />
              <p className="text-sm font-medium text-sky-600">チェック結果</p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.2rem] border border-slate-200 bg-slate-50/75 p-4">
                <div className="text-xs tracking-[0.14em] text-slate-500">チェックしたファイル数</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">{summary.total}</div>
              </div>
              <div className="rounded-[1.2rem] border border-emerald-200 bg-emerald-50/70 p-4">
                <div className="text-xs tracking-[0.14em] text-emerald-700">○ 問題なし</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">{summary.ok}</div>
              </div>
              <div className="rounded-[1.2rem] border border-amber-200 bg-amber-50/70 p-4">
                <div className="text-xs tracking-[0.14em] text-amber-700">△ 一度確認したい</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">{summary.consult}</div>
              </div>
            </div>
            <div className="mt-4 inline-flex items-start gap-2 rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-600">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
              まずは ○ と △ を目安に見てください。細かい数値は必要に応じて詳細で確認できます。
            </div>
          </AnimatedPanel>

          <div className="grid gap-4">
            {files.map((file) => (
              <FileResultCard key={file.id} file={file} />
            ))}
          </div>

          <ContactBlock useNextStep />
        </section>
      </main>
      <SiteFooter />
    </PageFrame>
  );
}
