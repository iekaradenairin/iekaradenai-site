import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Music4,
  Mic2,
  Wand2,
  Sparkles,
  Disc3,
  Radio,
  ChevronRight,
  PlayCircle,
  FileAudio,
  Waves,
  Headphones,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const options = [
  {
    id: "a",
    name: "A. Crystal Flow",
    catch: "ガラス感・高級感・信頼感・やさしさを両立",
    tag: "本命 / Hybrid",
    summary:
      "Aをベースに、Bの実績感とCのやさしい導線を少し混ぜた本命案。上質で透明感がありつつ、初めて依頼する人にも怖くないトップページを目指す。",
    heroTitle: `透明感のある音づくりを,
ていねいに、美しく届ける。`,
    heroSub:
      "すりガラスのような透明感と上品さを軸にしながら、歌ってみた投稿やVTuber風の活動に憧れる人でも、迷わず依頼やチェックに進める入口を整えたトップページ。",
    accent: "from-white/70 via-cyan-100/40 to-sky-200/30",
    glow: "from-cyan-200/40 via-sky-200/30 to-transparent",
    points: ["高級ガラス感", "実績感も出せる", "初心者にやさしい"],
  },
  {
    id: "b",
    name: "B. Studio Luxe",
    catch: "高級感・実績感・プロ感を重視",
    tag: "映える",
    summary:
      "作品展示を強く見せたいときに映える案。やや硬派で重厚感があり、『本格的にやっている人』感は強いが、やさしさは少し減る。",
    heroTitle: `作品で魅せて,
信頼で選ばれる。`,
    heroSub:
      "ポートフォリオを大きく見せて実績感を出す構成。アニメーションや奥行き表現で『しっかり音楽している人』という印象を強く出す。",
    accent: "from-slate-200/70 via-zinc-100/70 to-white",
    glow: "from-violet-300/20 via-slate-300/10 to-transparent",
    points: ["プロっぽい", "作品が主役になる", "少し硬派"],
  },
  {
    id: "c",
    name: "C. Airy Pop",
    catch: "青系ポップ・かわいさ・クール感を重視",
    tag: "やさしい",
    summary:
      "青系のかわいさを軸にしながら、少しクールで洗練された印象も入れた案。話しかけやすさを残しつつ、甘すぎないポップさで見せられる。",
    heroTitle: `相談しやすくて,
見た目もちゃんと良い。`,
    heroSub:
      "依頼のしやすさを前面に出しつつ、青系の軽やかなポップ感とクールさを両立したトップページ。やさしく見えるのに、子どもっぽくなりすぎない印象を目指す。",
    accent: "from-sky-100/80 via-cyan-100/70 to-white",
    glow: "from-sky-200/35 via-cyan-200/25 to-transparent",
    points: ["青系でかわいい", "やわらかいけど甘すぎない", "軽いクール感がある"],
  },
];

const featureCards = [
  {
    title: "MIX依頼",
    desc: "はじめての歌ってみた依頼でも迷いにくいように、必要な準備と流れを順番に案内します。",
    icon: Mic2,
    badge: "はじめてでも安心",
  },
  {
    title: "音声データチェック",
    desc: "難しい専門用語だけで終わらず、『このまま提出して大丈夫か』をやさしく確認できます。",
    icon: FileAudio,
    badge: "提出前に確認",
  },
  {
    title: "作品展示",
    desc: "YouTubeベースで実績を見やすく整理。音の方向性やクオリティ感もひと目で伝わります。",
    icon: PlayCircle,
    badge: "実績を見る",
  },
  {
    title: "作曲依頼",
    desc: "世界観や参考楽曲の伝え方まで含めて、相談ベースで進めやすい導線にしています。",
    icon: Music4,
    badge: "制作相談OK",
  },
];

const works = [
  { title: "Featured Work / Vocal Mix", meta: "歌ってみた・透明感・女性Vo" },
  { title: "Original Song / Compose", meta: "ポップス・切なめ・映像向け" },
  { title: "BGM / Arrangement", meta: "爽やか・配信用・明るい" },
];

const targetTags = [
  "歌ってみたを投稿したい",
  "はじめてMIX依頼する",
  "VTuber風の活動に憧れる",
  "提出データに不安がある",
];

const beginnerSteps = [
  "1. MIX依頼ページで、必要なものと流れを確認",
  "2. 音声データチェックで、提出前の状態をかんたん確認",
  "3. わからない部分は、そのまま相談してOK",
];

function GradientOrb({ className }: { className?: string }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-60 ${className}`}
      aria-hidden="true"
    />
  );
}

function SampleHome({ option }: { option: (typeof options)[number] }) {
  const statCards = useMemo(
    () => [
      { label: "Works", value: "12+", icon: Disc3 },
      { label: "Mix Support", value: "丁寧案内", icon: Headphones },
      { label: "Audio Check", value: "無料", icon: Waves },
    ],
    []
  );

  if (option.id === "b") {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#0b1220_0%,#111827_48%,#e5edf7_48%,#f3f6fb_100%)] text-white">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(125,211,252,0.16),transparent_28%),radial-gradient(circle_at_left,rgba(168,85,247,0.16),transparent_30%)]" />
          <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
                <Radio className="h-5 w-5 text-sky-300" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-sky-200/80">premium portfolio</p>
                <h1 className="text-base font-semibold tracking-wide text-white">Rin Sound Atelier</h1>
              </div>
            </div>
            <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
              <a href="#showcase" className="transition hover:text-white">Showcase</a>
              <a href="#services" className="transition hover:text-white">Services</a>
              <a href="#contact" className="transition hover:text-white">Contact</a>
            </nav>
          </header>

          <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-20 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-24">
            <div className="flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-sky-100 backdrop-blur"
              >
                <Sparkles className="h-4 w-4 text-sky-300" />
                <span>{option.catch}</span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-sky-100">{option.tag}</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.05 }}
                className="whitespace-pre-line text-5xl font-semibold leading-[1.02] tracking-tight text-white md:text-6xl lg:text-7xl"
              >
                {option.heroTitle}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.1 }}
                className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg"
              >
                {option.heroSub}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.15 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <Button className="h-12 rounded-full bg-white px-7 text-sm font-semibold text-slate-900 shadow-lg shadow-black/20 hover:bg-slate-100">
                  代表作品を見る
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="h-12 rounded-full border-white/20 bg-white/5 px-7 text-sm text-white backdrop-blur hover:bg-white/10">
                  MIX依頼を見る
                </Button>
              </motion.div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {statCards.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.2 + i * 0.05 }}
                      className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                    >
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                        <Icon className="h-5 w-5 text-sky-300" />
                      </div>
                      <div className="text-3xl font-semibold text-white">{item.value}</div>
                      <div className="mt-1 text-sm text-slate-400">{item.label}</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              id="showcase"
              className="relative"
            >
              <div className="absolute -inset-3 rounded-[2rem] bg-[linear-gradient(135deg,rgba(125,211,252,0.18),rgba(168,85,247,0.12),transparent)] blur-2xl" />
              <Card className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(15,23,42,0.95),rgba(17,24,39,0.92))] shadow-2xl shadow-black/30">
                <CardContent className="p-6 md:p-7">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-sky-200/80">Featured showcase</p>
                      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">作品を先に見せて、信頼を取る</h3>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">Studio view</div>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-4 aspect-[16/10] rounded-[1.25rem] bg-[linear-gradient(135deg,rgba(125,211,252,0.22),rgba(15,23,42,0.1),rgba(168,85,247,0.18))] ring-1 ring-white/10" />
                    <div className="grid gap-3 md:grid-cols-3">
                      {works.map((work, i) => (
                        <motion.div
                          key={work.title}
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.45, delay: 0.25 + i * 0.06 }}
                          className="group rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-3 transition hover:-translate-y-1 hover:bg-white/[0.06]"
                        >
                          <div className="mb-3 aspect-video rounded-2xl bg-[linear-gradient(135deg,rgba(125,211,252,0.16),rgba(255,255,255,0.04))] ring-1 ring-white/10" />
                          <div className="text-sm font-medium text-white">{work.title}</div>
                          <div className="mt-1 text-xs leading-6 text-slate-400">{work.meta}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <main className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
          <section id="services" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                >
                  <Card className="h-full rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                    <CardContent className="p-5 text-slate-800">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900">
                          <Icon className="h-5 w-5 text-sky-300" />
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">{card.badge}</span>
                      </div>
                      <h4 className="text-lg font-semibold text-slate-900">{card.title}</h4>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{card.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </section>
        </main>
      </div>
    );
  }

  if (option.id === "c") {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f4fbff_0%,#eaf6ff_45%,#ffffff_100%)] text-slate-800">
        <section className="relative overflow-hidden">
          <div className="absolute left-[-80px] top-16 h-64 w-64 rounded-full bg-sky-200/35 blur-3xl" />
          <div className="absolute right-[-60px] top-8 h-72 w-72 rounded-full bg-cyan-200/35 blur-3xl" />

          <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[1.25rem] bg-white shadow-sm ring-1 ring-sky-100">
                <Radio className="h-5 w-5 text-sky-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-sky-500">cool pop music support</p>
                <h1 className="text-base font-semibold tracking-wide text-slate-900">Rin Sound Atelier</h1>
              </div>
            </div>
            <nav className="hidden items-center gap-6 text-sm text-slate-500 md:flex">
              <a href="#quickstart" className="transition hover:text-slate-900">はじめての方へ</a>
              <a href="#features" className="transition hover:text-slate-900">できること</a>
              <a href="#works" className="transition hover:text-slate-900">作品</a>
            </nav>
          </header>

          <div className="mx-auto grid max-w-7xl gap-8 px-6 pb-16 pt-4 lg:grid-cols-[1fr_0.95fr] lg:px-10 lg:pb-20 lg:pt-8">
            <div className="flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm shadow-sm ring-1 ring-sky-100"
              >
                <Sparkles className="h-4 w-4 text-sky-500" />
                <span>{option.catch}</span>
                <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs text-sky-600">{option.tag}</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.05 }}
                className="whitespace-pre-line text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl lg:text-6xl"
              >
                {option.heroTitle}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.1 }}
                className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg"
              >
                {option.heroSub}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.15 }}
                className="mt-7 flex flex-col gap-3 sm:flex-row"
              >
                <Button className="h-12 rounded-full bg-[linear-gradient(135deg,#38bdf8,#60a5fa)] px-7 text-sm text-white shadow-lg shadow-sky-200/60 hover:bg-[linear-gradient(135deg,#22c1f1,#3b82f6)]">
                  はじめての依頼を見る
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="h-12 rounded-full border-sky-100 bg-white px-7 text-sm text-slate-700 hover:bg-sky-50">
                  音声チェックを試す
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="grid gap-4"
            >
              <Card className="rounded-[2rem] border-sky-100 bg-white/90 shadow-lg shadow-sky-100/50">
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-sky-500">quick start</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">まず何をすればいいか、すぐ分かる</h3>
                  <div id="quickstart" className="mt-5 grid gap-3">
                    {beginnerSteps.map((step, i) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.45, delay: 0.2 + i * 0.06 }}
                        className="rounded-[1.25rem] bg-[linear-gradient(135deg,#eef8ff,#f6fbff)] p-4 ring-1 ring-sky-100"
                      >
                        <div className="text-sm font-medium text-slate-700">{step}</div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="rounded-[1.75rem] border-sky-100 bg-sky-50/70 shadow-sm">
                  <CardContent className="p-5">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
                      <FileAudio className="h-5 w-5 text-sky-500" />
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900">音声チェックもやさしく案内</h4>
                    <p className="mt-2 text-sm leading-7 text-slate-600">難しい数値だけでなく、「このままで大丈夫か」を一目で分かるようにする。</p>
                  </CardContent>
                </Card>
                <Card className="rounded-[1.75rem] border-cyan-100 bg-cyan-50/70 shadow-sm">
                  <CardContent className="p-5">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
                      <Mic2 className="h-5 w-5 text-cyan-500" />
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900">かわいさの中に少しクールを入れる</h4>
                    <p className="mt-2 text-sm leading-7 text-slate-600">やわらかい雰囲気は残しつつ、青系の配色と整った余白で甘すぎない印象にする。</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </section>

        <main className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
          <section id="features" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                >
                  <Card className="h-full rounded-[2rem] border-white bg-white/90 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                    <CardContent className="p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-[linear-gradient(135deg,#eaf7ff,#eef8ff)]">
                          <Icon className="h-5 w-5 text-sky-500" />
                        </div>
                        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs text-sky-600">{card.badge}</span>
                      </div>
                      <h4 className="text-lg font-semibold text-slate-900">{card.title}</h4>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{card.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </section>

          <section id="works" className="mt-16 rounded-[2rem] bg-[linear-gradient(135deg,#eef8ff,#f5fbff)] p-6 ring-1 ring-sky-100 md:p-8">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sky-500">soft cool portfolio</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">やわらかく見せつつ、作品はちゃんと並べる</h3>
              </div>
              <Wand2 className="h-5 w-5 text-sky-400" />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {works.map((work, i) => (
                <motion.div
                  key={work.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  className="rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-sky-100"
                >
                  <div className="mb-3 aspect-video rounded-2xl bg-[linear-gradient(135deg,#dff4ff,#eaf6ff)]" />
                  <div className="text-sm font-medium text-slate-900">{work.title}</div>
                  <div className="mt-1 text-xs leading-6 text-slate-500">{work.meta}</div>
                </motion.div>
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f2faff_0%,#e9f5ff_34%,#f8fcff_70%,#ffffff_100%)] text-slate-800">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),transparent_28%),radial-gradient(circle_at_top_right,rgba(191,219,254,0.42),transparent_34%),radial-gradient(circle_at_40%_20%,rgba(255,255,255,0.72),transparent_18%)]" />
        <GradientOrb className={`left-[-70px] top-8 h-64 w-64 bg-gradient-to-br ${option.glow}`} />
        <GradientOrb className={`right-[-30px] top-20 h-80 w-80 bg-gradient-to-br ${option.glow}`} />
        <div className="absolute left-[14%] top-20 h-28 w-28 rounded-full border border-white/55 bg-white/20 blur-md backdrop-blur-2xl" />
        <div className="absolute right-[11%] top-40 h-16 w-16 rounded-full border border-white/45 bg-white/15 blur-md backdrop-blur-2xl" />

        <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/35 shadow-[0_12px_32px_rgba(148,163,184,0.14)] ring-1 ring-white/50 backdrop-blur-2xl">
              <Radio className="h-5 w-5 text-sky-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-sky-600">premium personal music site</p>
              <h1 className="text-base font-semibold tracking-wide">Rin Sound Atelier</h1>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <a href="#features" className="transition hover:text-slate-900">サービス</a>
            <a href="#guide" className="transition hover:text-slate-900">はじめての方へ</a>
            <a href="#works" className="transition hover:text-slate-900">作品</a>
          </nav>
        </header>

        <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-16 pt-4 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:pb-20 lg:pt-8">
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/65 bg-white/35 px-4 py-2 text-sm shadow-[0_10px_30px_rgba(148,163,184,0.10)] ring-1 ring-white/40 backdrop-blur-2xl"
            >
              <Sparkles className="h-4 w-4 text-sky-500" />
              <span>{option.catch}</span>
              <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs text-sky-600">{option.tag}</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.05 }}
              className="whitespace-pre-line text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl lg:text-6xl"
            >
              {option.heroTitle}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg"
            >
              {option.heroSub}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.14 }}
              className="mt-5 flex flex-wrap gap-2"
            >
              {targetTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/65 bg-white/32 px-3 py-1.5 text-xs text-slate-600 shadow-[0_8px_20px_rgba(148,163,184,0.08)] backdrop-blur-xl"
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.18 }}
              className="mt-7 flex flex-col gap-3 sm:flex-row"
            >
              <Button className="h-12 rounded-full border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(30,41,59,0.84))] px-6 text-sm text-white shadow-[0_18px_40px_rgba(148,163,184,0.22)] backdrop-blur-xl hover:bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.9))]">
                MIX依頼を見る
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-full border-white/75 bg-white/30 px-6 text-sm text-slate-700 shadow-[0_10px_30px_rgba(148,163,184,0.12)] backdrop-blur-2xl hover:bg-white/45"
              >
                作品を見る
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-full border-sky-100 bg-sky-50/70 px-6 text-sm text-sky-700 shadow-sm hover:bg-sky-100"
              >
                はじめての方へ
              </Button>
            </motion.div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {statCards.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.22 + i * 0.05 }}
                    className="rounded-[1.75rem] border border-white/70 bg-white/28 p-4 shadow-[0_18px_45px_rgba(148,163,184,0.14)] backdrop-blur-2xl"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50">
                      <Icon className="h-5 w-5 text-sky-500" />
                    </div>
                    <div className="text-2xl font-semibold text-slate-900">{item.value}</div>
                    <div className="mt-1 text-sm text-slate-500">{item.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="relative grid gap-4"
          >
            <div className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br ${option.accent} blur-2xl`} />
            <div className="absolute inset-x-8 top-0 h-px bg-white/80" />

            <Card className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/28 shadow-[0_30px_80px_rgba(148,163,184,0.18)] backdrop-blur-[28px]">
              <CardContent className="p-5 md:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">featured direction</p>
                    <h3 className="text-lg font-semibold text-slate-900">やさしい入口と、しっかり見える実績感</h3>
                  </div>
                  <div className="rounded-full bg-sky-50 px-3 py-1 text-xs text-sky-600">hybrid</div>
                </div>

                <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.40),rgba(239,246,255,0.20))] p-4 ring-1 ring-white/55 backdrop-blur-2xl">
                  <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-[1.25rem] border border-white/60 bg-white/30 p-4 shadow-[0_12px_30px_rgba(148,163,184,0.10)] backdrop-blur-2xl">
                      <p className="text-xs tracking-[0.2em] text-sky-500">FIRST STEP</p>
                      <h4 className="mt-2 text-xl font-semibold text-slate-900">はじめてでも、次にやることが分かる</h4>
                      <div className="mt-4 grid gap-3">
                        {beginnerSteps.map((step, i) => (
                          <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 14 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.18 + i * 0.05 }}
                            className="rounded-2xl border border-white/55 bg-white/35 p-3 text-sm text-slate-600 backdrop-blur-xl"
                          >
                            {step}
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.25rem] bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.94))] p-4 text-white shadow-sm">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs tracking-[0.2em] text-sky-200">PORTFOLIO</p>
                          <h4 className="mt-2 text-xl font-semibold">作品で「ちゃんとしてる感」を出す</h4>
                        </div>
                        <Wand2 className="h-5 w-5 text-sky-200" />
                      </div>
                      <p className="text-sm leading-7 text-slate-200">
                        作品展示では少しだけドラマチックな見せ方を入れて、信頼感や本格感を先に伝える。
                      </p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {works.map((work, i) => (
                          <motion.div
                            key={work.title}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.28 + i * 0.06 }}
                            className="group rounded-[1.15rem] border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition hover:-translate-y-1"
                          >
                            <div className="mb-3 aspect-video rounded-2xl bg-[linear-gradient(135deg,rgba(125,211,252,0.22),rgba(56,189,248,0.08))] ring-1 ring-white/10 transition group-hover:scale-[1.02]" />
                            <div className="text-sm font-medium text-white">{work.title}</div>
                            <div className="mt-1 text-xs leading-6 text-slate-300">{work.meta}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </div>

      <main className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
        <section id="features">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-sky-600">entry points</p>
              <h3 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">迷わず進める4つの入口</h3>
            </div>
            <div className="hidden text-sm text-slate-500 md:block">初見の人でも、やりたいことから選びやすい構成</div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                >
                  <Card className="group h-full rounded-[1.75rem] border-white/70 bg-white/75 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-100/60">
                    <CardContent className="p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50">
                          <Icon className="h-5 w-5 text-sky-500" />
                        </div>
                        <span className="rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-500">{card.badge}</span>
                      </div>
                      <h4 className="text-lg font-semibold text-slate-900">{card.title}</h4>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{card.desc}</p>
                      <div className="mt-5 flex items-center text-sm font-medium text-sky-600 transition group-hover:translate-x-0.5">
                        このページへ進む
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section id="guide" className="mt-16 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="rounded-[1.75rem] border-white/70 bg-white/75 shadow-sm backdrop-blur">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-sky-600">for beginners</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">歌い手さん向けのやさしい導線</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                音楽や機材に詳しくなくても、まず何を準備して、どこを確認すればよいかが分かるように、専門用語よりも行動のしやすさを優先した導線にする。
              </p>
              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <div className="rounded-2xl border border-white/60 bg-white/35 p-4 backdrop-blur-xl">・歌ってみた初投稿や、はじめての依頼でも流れが分かる</div>
                <div className="rounded-2xl border border-white/60 bg-white/35 p-4 backdrop-blur-xl">・音声チェック結果は、数値だけでなく意味もやさしく説明する</div>
                <div className="rounded-2xl border border-white/60 bg-white/35 p-4 backdrop-blur-xl">・エラーよりも「どう直せばいいか」を先に見せる</div>
              </div>
            </CardContent>
          </Card>

          <Card
            id="works"
            className="overflow-hidden rounded-[1.75rem] border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.94))] text-white shadow-xl shadow-slate-200/60"
          >
            <CardContent className="p-6 md:p-7">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sky-200">portfolio impact</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight">作品展示は少し“魅せる”</h3>
                </div>
                <Wand2 className="h-5 w-5 text-sky-200" />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.08 }}
                    className="group rounded-[1.25rem] border border-white/10 bg-white/5 p-3 backdrop-blur-sm"
                  >
                    <div className="aspect-video rounded-2xl bg-[linear-gradient(135deg,rgba(125,211,252,0.22),rgba(56,189,248,0.08))] ring-1 ring-white/10 transition group-hover:scale-[1.02]" />
                    <div className="mt-3 text-sm font-medium">Featured Movie #{i + 1}</div>
                    <div className="mt-1 text-xs leading-6 text-slate-300">
                      サムネイル演出やフェードで、実績感を一段上げるイメージ。
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

export default function MusicSiteHomeSamples() {
  const [selected, setSelected] = useState(options[0]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <div className="text-sm font-medium text-sky-600">Homepage UI Samples</div>
            <div className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
              爽やか / 綺麗め / 透明感 を軸にしたトップページ比較
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelected(option)}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  selected.id === option.id
                    ? "border-sky-300 bg-sky-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="text-sm font-semibold text-slate-900">{option.name}</div>
                <div className="mt-1 text-xs leading-5 text-slate-500">{option.catch}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-6 lg:px-8">
        <Card className="mb-6 rounded-[1.75rem] border-slate-200 bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="grid gap-5 md:grid-cols-[1.1fr_0.9fr] md:items-start">
              <div>
                <div className="mb-2 inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                  {selected.name}
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{selected.catch}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{selected.summary}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1 xl:grid-cols-3">
        