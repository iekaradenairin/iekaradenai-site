"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteLinks } from "@/lib/siteLinks";
import { contactPolicyCopy } from "@/lib/contactPolicy";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { PageFrame } from "@/components/site/PageFrame";
import { WaveformHero } from "@/app/components/WaveformHero";
import { AnimatedPanel } from "@/components/site/AnimatedPanel";
import { works, heroWork, youtubeThumbnailUrl } from "@/lib/works";

export default function TopPage() {
  return (
    <PageFrame>
      <section className="relative overflow-hidden">
        <motion.div
          className="pointer-events-none absolute left-[5%] top-10 h-24 w-24 rounded-full border border-sheen/20 bg-sheen/5 backdrop-blur-xl"
          animate={{ y: [0, -8, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute right-[8%] top-28 h-16 w-16 rounded-full border border-sheen/15 bg-sheen/5 backdrop-blur-xl"
          animate={{ y: [0, 10, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        />

        <SiteHeader />

        <div className="mx-auto grid max-w-7xl gap-6 px-6 pb-16 pt-4 lg:px-10 xl:grid-cols-[minmax(0,1fr)_minmax(400px,520px)] xl:gap-8 2xl:pb-20 2xl:pt-8">
          <div className="relative z-10 flex min-w-0 flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65 }}
              className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-shinkai-800/70 px-4 py-2 text-sm text-shinkai-200 shadow-[0_10px_30px_rgba(13,25,32,0.3)] ring-1 ring-white/10 backdrop-blur-xl"
            >
              <span>家から出ない倫 ・ SynthesizerVでオリジナル曲を作っています ・ {works.length}曲</span>
            </motion.div>

            <div className="relative overflow-hidden rounded-[2rem] py-2">
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.06 }}
                className="max-w-4xl whitespace-pre-line text-4xl font-semibold leading-tight tracking-tight text-shinkai-100 md:text-5xl xl:text-6xl"
              >
                {`言えなかった言葉のことを、
ずっと書いています。`}
              </motion.h1>
              <motion.div
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-[linear-gradient(120deg,rgba(95,168,199,0),rgba(95,168,199,0.35),rgba(95,168,199,0))] mix-blend-screen"
                animate={{ x: ["-10%", "320%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.6 }}
              />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.14 }}
              className="mt-4 max-w-3xl text-base leading-8 text-shinkai-200 md:text-lg"
            >
              和ロックとポップスのあいだで、屋上や神社の階段、湖や桜――情景に感情を託して曲を作っています。
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.28 }}
              className="mt-6 flex flex-col gap-3 sm:flex-row"
            >
              <motion.div
                animate={{ y: [0, -2, 0], scale: [1, 1.012, 1] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <Button asChild className="h-12 rounded-full border border-sheen/40 bg-sheen px-6 text-sm text-shinkai-950 shadow-[0_18px_40px_rgba(95,168,199,0.25)] backdrop-blur-xl hover:bg-sheen/90">
                  <Link href={siteLinks.works}>
                    作品を見る
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>

              <Button
                asChild
                variant="outline"
                className="h-12 rounded-full border-white/15 bg-shinkai-800/50 px-6 text-sm text-shinkai-200 shadow-[0_10px_30px_rgba(13,25,32,0.2)] backdrop-blur-2xl hover:bg-shinkai-800/80"
              >
                <Link href={siteLinks.about}>世界観を見る</Link>
              </Button>
            </motion.div>
          </div>

          <div className="relative z-10 min-w-0 xl:justify-self-end xl:w-full xl:max-w-[520px] xl:pt-4">
            <motion.div
              className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-sheen/25 via-shinkai-400/15 to-transparent blur-2xl"
              animate={{ opacity: [0.72, 1, 0.76], scale: [1, 1.03, 1] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <AnimatedPanel className="relative overflow-hidden rounded-[1.9rem] border border-white/14 bg-shinkai-700/80 p-5 text-shinkai-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_80px_rgba(13,25,32,0.4)]">
                <motion.div
                  className="pointer-events-none absolute inset-0 opacity-50"
                  animate={{ backgroundPosition: ["0% 0%", "120% 0%"] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  style={{
                    backgroundImage:
                      "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(125,211,252,0.16) 30%, rgba(255,255,255,0) 58%)",
                    backgroundSize: "180% 100%",
                  }}
                />

                <p className="relative text-xs tracking-[0.2em] text-sheen">最新作</p>

                <a
                  href={`https://youtu.be/${heroWork.youtubeId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative mt-3 block overflow-hidden rounded-2xl ring-1 ring-white/10"
                >
                  <div className="relative aspect-video">
                    {/* eslint-disable-next-line @next/next/no-img-element -- external YouTube thumbnail (i.ytimg.com), not an optimizable local/remote-configured asset */}
                    <img
                      src={youtubeThumbnailUrl(heroWork.youtubeId, "hqdefault")}
                      alt={heroWork.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.05),rgba(15,23,42,0.20)_55%,rgba(15,23,42,0.65))]" />
                    <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/20 px-2.5 py-1 text-[10px] tracking-[0.14em] text-white/90 backdrop-blur-md">
                      <PlayCircle className="h-3.5 w-3.5" />
                      YouTubeで見る
                    </div>
                  </div>
                </a>

                <div className="relative mt-4 min-w-0">
                  <div className="text-xl font-semibold tracking-tight text-shinkai-100">{heroWork.title}</div>
                  {heroWork.scene ? (
                    <p className="mt-2 text-sm leading-7 text-shinkai-200">{heroWork.scene}</p>
                  ) : null}
                  {heroWork.moods || heroWork.vocal ? (
                    <p className="mt-3 text-xs leading-6 text-shinkai-300">
                      {[heroWork.moods?.join(" / "), heroWork.vocal].filter(Boolean).join(" ・ ")}
                    </p>
                  ) : null}
                </div>

                <Link
                  href={siteLinks.works}
                  className="relative mt-4 inline-flex min-h-11 items-center text-sm font-medium text-sheen transition hover:text-shinkai-100"
                >
                  すべての作品を見る
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </AnimatedPanel>
            </motion.div>
          </div>
        </div>

        <WaveformHero className="absolute bottom-0 left-0 right-0 h-12 px-6 opacity-70 lg:px-10" />
      </section>

      <main className="mx-auto max-w-7xl px-6 pb-16 pt-6 lg:px-10">
        <AnimatedPanel className="rounded-[1.9rem] border border-white/10 bg-shinkai-800/70 backdrop-blur-xl">
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-medium text-sheen">MIX・作曲のご依頼をご検討の方へ</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-shinkai-100">
                {contactPolicyCopy.title}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-shinkai-200">{contactPolicyCopy.full}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-full border-white/15 bg-shinkai-800/50 px-6 text-sm text-shinkai-200 shadow-sm hover:bg-shinkai-700/60"
              >
                <Link href={siteLinks.mix}>MIX依頼ページへ</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-full border-white/15 bg-shinkai-800/50 px-6 text-sm text-shinkai-200 shadow-sm hover:bg-shinkai-700/60"
              >
                <Link href={siteLinks.compose}>作曲依頼ページへ</Link>
              </Button>
            </div>
          </div>
        </AnimatedPanel>
      </main>

      <SiteFooter />
    </PageFrame>
  );
}
