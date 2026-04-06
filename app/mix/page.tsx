"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Waves,
  Headphones,
  Music4,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { siteLinks } from "@/lib/siteLinks";
import { AnimatedPanel } from "@/components/site/AnimatedPanel";
import { SectionHeader } from "@/components/site/SectionHeader";
import { PageFrame } from "@/components/site/PageFrame";

const GOOGLE_FORM_URL = siteLinks.googleForm;
const BEGINNER_URL = siteLinks.guide;
const AUDIO_CHECK_URL = siteLinks.audioCheck;
const X_URL = siteLinks.x;

const pricing = [
  { label: "ボーカルMIX", value: "15,000円", note: "自然な補正 / マスタリング込み" },
  { label: "ハモリ提案込み", value: "20,000円", note: "雰囲気に合わせた提案込み" },
  { label: "追加対応", value: "内容に応じてご相談", note: "コラボ・特殊処理・特急対応など" },
] as const;

const capabilities = [
  {
    icon: Waves,
    title: "自然な補正 / タイミング補正",
    desc: "違和感を抑えながら、聴きやすく気持ちよく届く形へ整えます。",
  },
  {
    icon: Headphones,
    title: "声に合わせた音づくり",
    desc: "曲や声質に合わせて、抜け感や空気感を見ながらバランスを整えます。",
  },
  {
    icon: Music4,
    title: "ハモリや雰囲気づくりの相談",
    desc: "必要に応じて、本家の雰囲気に寄せるだけでなく、曲に合うかたちを一緒に考えます。",
  },
] as const;

const suitableFor = [
  "はじめて歌ってみたを投稿する",
  "自然で聴きやすいMIXにしたい",
  "透明感や空気感を大切にしたい",
  "何を準備すればいいか分からない",
  "ハモリや雰囲気づくりも少し相談したい",
] as const;

const requiredItems = ["ボーカル音源", "オケ"] as const;

const helpfulItems = [
  "参考曲",
  "キー情報",
  "依頼内容メモ",
  "ハモリ希望の有無",
  "納期希望",
  "活動の背景や曲の用途",
] as const;

const sourceGuide = [
  "モノラル推奨",
  "エフェクトなし推奨",
  "頭出し済みだと助かります",
  "24bit / 44.1kHz 以上推奨",
  "ハモリ / コーラスは別トラック推奨",
] as const;

const deliveryGuide = [
  "納品形式は mp3 / wav",
  "基本は、すべてのデータ受領後から1ヶ月程度が目安",
  "お急ぎの場合は、まずご相談ください",
  "修正は内容を確認しながら丁寧に対応",
] as const;

const faqs = [
  {
    q: "はじめてでも依頼できますか？",
    a: "もちろん大丈夫です。内容がまだまとまりきっていない場合も、ご相談をいただきながら一緒に整理していけます。",
  },
  {
    q: "音源に自信がありません",
    a: "不安がある場合は、まず音声データチェックをご利用ください。それでも判断しにくい部分は、ご相談をいただきながら確認していけます。",
  },
  {
    q: "修正ってお願いできますか？",
    a: "対応可能です。内容を確認しながら、できる範囲で丁寧に調整いたします。",
  },
  {
    q: "ハモリも相談できますか？",
    a: "対応可能です。本家の雰囲気に寄せるだけでなく、曲に合うかたちを一緒に考えることもあります。",
  },
  {
    q: "納期はどれくらいですか？",
    a: "基本は、すべてのデータ受領後から1ヶ月程度を目安としています。お急ぎの場合も、まずは一度ご相談ください。",
  },
] as const;


export default function MixPage() {
  return (
    <PageFrame>
      <SiteHeader currentLabel="MIX依頼" />

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-2 lg:px-10 lg:pt-4">
        <section className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AnimatedPanel className="rounded-[2rem] border border-white/70 bg-white/80 backdrop-blur-xl">
              <div className="grid gap-6 p-6 md:p-7 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.55 }}
                    className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700"
                  >
                    <motion.div
                      animate={{ rotate: [0, 8, -5, 0], scale: [1, 1.08, 1] }}
                      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                    </motion.div>
                    <span>MIX依頼</span>
                  </motion.div>

                  <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 md:text-5xl">
                    声の魅力を大切にしながら、<br className="hidden md:inline" />
                    作品として自然に届くかたちへ整えます。
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                    聴きやすく自然な補正をベースに、透明感や空気感を大切にしながら仕上げます。
                    はじめてのご依頼でも進め方が分かりやすいよう丁寧にご案内し、ハモリや雰囲気づくりについても、できる範囲で一緒に整えていきます。
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <motion.div
                      animate={{ y: [0, -2, 0], scale: [1, 1.012, 1] }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <a href={GOOGLE_FORM_URL} target="_blank" rel="noreferrer">
                        <Button className="h-12 rounded-full border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(30,41,59,0.84))] px-6 text-sm text-white shadow-[0_18px_40px_rgba(148,163,184,0.22)] backdrop-blur-xl hover:bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.9))]">
                          Googleフォームから相談する
                        </Button>
                      </a>
                    </motion.div>

                    <Link href={BEGINNER_URL}>
                      <Button
                        variant="outline"
                        className="h-12 rounded-full border-white/75 bg-white/30 px-6 text-sm text-slate-700 shadow-[0_10px_30px_rgba(148,163,184,0.12)] backdrop-blur-2xl hover:bg-white/45"
                      >
                        はじめての方へ
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-1">
                  {pricing.map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.12 + i * 0.08 }}
                      whileHover={{ y: -4 }}
                      className="rounded-[1.3rem] border border-slate-200 bg-slate-50/70 p-4"
                    >
                      <div className="text-xs tracking-[0.14em] text-slate-500">{item.label}</div>
                      <div className="mt-2 text-xl font-semibold text-slate-900">{item.value}</div>
                      <div className="mt-1 text-sm text-slate-500">{item.note}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedPanel>
          </motion.div>

          <div className="grid gap-4 xl:grid-cols-3">
            {capabilities.map((item, i) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -5 }}
                >
                  <AnimatedPanel className="h-full rounded-[1.75rem] border border-white/70 bg-white/75 backdrop-blur">
                    <div className="p-5">
                      <Icon className="mb-4 h-6 w-6 text-sky-500" />
                      <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{item.desc}</p>
                    </div>
                  </AnimatedPanel>
                </motion.div>
              );
            })}
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
            <AnimatedPanel className="rounded-[1.75rem] border border-white/70 bg-white/75 backdrop-blur">
              <div className="p-6">
                <SectionHeader eyebrow="対応内容" title="MIXで対応できること" />
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    "自然なピッチ補正 / タイミング補正",
                    "声に合わせた音づくり",
                    "空間処理 / バランス調整",
                    "マスタリング込み",
                    "mp3 / wav 納品",
                    "ご相談ベースでの進行",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedPanel>

            <AnimatedPanel className="rounded-[1.75rem] border border-white/70 bg-white/75 backdrop-blur">
              <div className="p-6">
                <SectionHeader eyebrow="このような方に向いています" title="ご相談しながら進めたい方へ" />
                <div className="space-y-3 text-sm text-slate-600">
                  {suitableFor.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                    >
                      ・{item}
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedPanel>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.04fr_0.96fr]">
            <AnimatedPanel className="rounded-[1.75rem] border border-white/70 bg-white/75 backdrop-blur">
              <div className="p-6">
                <SectionHeader eyebrow="送ってほしいもの" title="まずは、この内容が分かれば大丈夫です" />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/70 p-4">
                    <div className="text-sm font-medium text-slate-900">必須</div>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                      {requiredItems.map((item) => (
                        <li key={item}>・{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/70 p-4">
                    <div className="text-sm font-medium text-slate-900">なるべくあると助かるもの</div>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                      {helpfulItems.map((item) => (
                        <li key={item}>・{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  参考曲やご希望の雰囲気、活動の背景なども共有いただけると、方向性をより丁寧に合わせやすくなります。活動の節目や投稿予定日がある場合も、分かる範囲でお知らせいただけると助かります。
                </p>
              </div>
            </AnimatedPanel>

            <AnimatedPanel className="rounded-[1.75rem] border border-white/70 bg-white/75 backdrop-blur">
              <div className="p-6">
                <SectionHeader
                  eyebrow="音源の推奨状態"
                  title="このような形ですと、よりスムーズに進められます"
                />
                <div className="grid gap-3 text-sm text-slate-600">
                  {sourceGuide.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3"
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  理想的な形はありますが、最初から完璧でなくても問題ありません。不安がある場合は、
                  <Link
                    href={AUDIO_CHECK_URL}
                    className="mx-1 font-medium text-sky-600 underline underline-offset-4 transition hover:text-sky-700"
                  >
                    音声データチェックページ
                  </Link>
                  で簡易チェックをしてからお送りください。状態に迷う場合は、そのままご相談いただいても大丈夫です。より良い作品にしたいという気持ちがあれば、その時点から一緒に整えていければと思っています。
                </p>

                <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-slate-50/70 p-4 text-sm leading-7 text-slate-600">
                  キー変更をご希望の場合は、ご相談の段階であらかじめお知らせください。変更後のオケがあるとスムーズですが、お手元にない場合も、まずは一度ご相談ください。
                </div>

                <Link
                  href={AUDIO_CHECK_URL}
                  className="mt-4 inline-flex items-center text-sm font-medium text-sky-600 transition hover:text-sky-700"
                >
                  音声データチェックページへ
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </AnimatedPanel>
          </div>

          <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
            <AnimatedPanel className="rounded-[1.75rem] border border-white/70 bg-white/75 backdrop-blur">
              <div className="p-6">
                <SectionHeader eyebrow="納品について" title="納品と進行の目安について" />
                <div className="grid gap-3 text-sm text-slate-600">
                  {deliveryGuide.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedPanel>

            <AnimatedPanel className="rounded-[1.75rem] border border-white/70 bg-white/75 backdrop-blur">
              <div className="p-6">
                <SectionHeader eyebrow="よくある質問" title="ご相談前によくいただくご質問" />
                <div className="space-y-3">
                  {faqs.map((item) => (
                    <motion.div
                      key={item.q}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.45 }}
                      className="rounded-[1.2rem] border border-slate-200 bg-slate-50/70 p-4"
                    >
                      <div className="text-sm font-medium text-slate-900">Q. {item.q}</div>
                      <div className="mt-2 text-sm leading-7 text-slate-600">{item.a}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedPanel>
          </div>

          <AnimatedPanel className="rounded-[1.9rem] border border-white/70 bg-white/80 backdrop-blur-xl">
            <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <SectionHeader
                  eyebrow="ご相談はこちら"
                  title="まずは、気軽にご相談ください"
                  body="まだご依頼を迷っている段階でも問題ありません。費用感だけを知りたい場合や、現在の音源で進められるか確認したい場合など、事前のご相談から歓迎しています。ご相談の入口は Googleフォーム を基本に、軽いご連絡は X からでも大丈夫です。やり取りが進んだあとは Discord で進める想定です。"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <a href={GOOGLE_FORM_URL} target="_blank" rel="noreferrer">
                  <Button className="h-12 rounded-full border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(30,41,59,0.84))] px-6 text-sm text-white shadow-[0_18px_40px_rgba(148,163,184,0.22)] backdrop-blur-xl hover:bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.9))]">
                    Googleフォームから相談する
                  </Button>
                </a>

                <a href={X_URL} target="_blank" rel="noreferrer">
                  <Button
                    variant="outline"
                    className="h-12 rounded-full border-white/75 bg-white/30 px-6 text-sm text-slate-700 shadow-[0_10px_30px_rgba(148,163,184,0.12)] backdrop-blur-2xl hover:bg-white/45"
                  >
                    Xで相談する
                  </Button>
                </a>
              </div>
            </div>
          </AnimatedPanel>
        </section>
      </main>

      <SiteFooter />
    </PageFrame>
  );
}