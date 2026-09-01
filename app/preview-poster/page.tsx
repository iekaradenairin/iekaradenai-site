"use client";

import Link from "next/link";
import { ChevronRight, PlayCircle } from "lucide-react";
import { siteLinks } from "@/lib/siteLinks";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { PageFrame } from "@/components/site/PageFrame";
import { WaveformHero } from "@/app/components/WaveformHero";
import { works, heroWork, youtubeThumbnailUrl } from "@/lib/works";

export default function PreviewPosterPage() {
  return (
    <PageFrame>
      <section className="relative overflow-hidden">
        <SiteHeader />

        <div className="mx-auto grid max-w-6xl gap-10 px-6 pb-24 pt-6 lg:grid-cols-[1fr_auto] lg:gap-16 lg:px-10 lg:pb-32 lg:pt-10">
          <div className="order-last min-w-0 lg:order-none">
            <p className="text-xs tracking-[0.3em] text-shinkai-300">
              家から出ない倫 ・ SynthesizerVでオリジナル曲を作っています ・ {works.length}曲
            </p>

            <p className="mt-10 max-w-md text-base leading-8 text-shinkai-200">
              和ロックとポップスのあいだで、屋上や神社の階段、湖や桜――情景に感情を託して曲を作っています。
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link
                href={siteLinks.works}
                className="group inline-flex items-center gap-2 border-b border-sheen pb-1 text-sm font-medium text-sheen transition hover:text-shinkai-100 hover:border-shinkai-100"
              >
                作品を見る
                <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={siteLinks.about}
                className="border-b border-white/20 pb-1 text-sm text-shinkai-300 transition hover:border-white/40 hover:text-shinkai-100"
              >
                世界観を見る
              </Link>
            </div>

            <div className="mt-20 max-w-sm">
              <p className="text-xs tracking-[0.2em] text-sheen">最新作</p>

              <a
                href={`https://youtu.be/${heroWork.youtubeId}`}
                target="_blank"
                rel="noreferrer"
                className="group mt-4 block"
              >
                <div className="relative aspect-video overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element -- preview page, matches /top's existing thumbnail pattern */}
                  <img
                    src={youtubeThumbnailUrl(heroWork.youtubeId, "hqdefault")}
                    alt={heroWork.title}
                    className="h-full w-full object-cover grayscale-[0.2] brightness-90 transition duration-500 group-hover:grayscale-0 group-hover:brightness-100"
                  />
                  <div className="absolute left-0 top-0 flex items-center gap-1 bg-shinkai-950/60 px-2.5 py-1 text-[10px] tracking-[0.14em] text-shinkai-100 backdrop-blur-sm">
                    <PlayCircle className="h-3.5 w-3.5" />
                    YouTubeで見る
                  </div>
                </div>
              </a>

              <div className="mt-3 text-base font-semibold tracking-tight text-shinkai-100">{heroWork.title}</div>
              {heroWork.scene ? (
                <p className="mt-2 text-sm leading-7 text-shinkai-200">{heroWork.scene}</p>
              ) : null}
              <p className="mt-2 text-xs tracking-wide text-shinkai-300">
                {[heroWork.moods?.join(" / "), heroWork.vocal].filter(Boolean).join(" ・ ")}
              </p>
            </div>
          </div>

          <div className="order-first flex justify-center pb-4 lg:order-none lg:justify-end lg:pb-0 lg:pt-2">
            <h1
              className="max-h-[70vh] text-[1.7rem] font-semibold leading-[2.1] tracking-[0.08em] text-shinkai-100 [writing-mode:vertical-rl] md:text-[2rem] lg:max-h-none lg:text-[2.35rem]"
            >
              言えなかった言葉のことを、ずっと書いています。
            </h1>
          </div>
        </div>

        <WaveformHero className="absolute bottom-0 left-0 right-0 h-12 px-6 opacity-70 lg:px-10" />
      </section>

      <SiteFooter />
    </PageFrame>
  );
}
