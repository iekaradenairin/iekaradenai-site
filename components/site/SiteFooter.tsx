"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Radio, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteLinks } from "@/lib/siteLinks";
import { contactPolicyCopy, contactActionLabels } from "@/lib/contactPolicy";

const workLinks = [
  { label: "作品", href: siteLinks.works },
  { label: "世界観", href: siteLinks.about },
  { label: "log", href: siteLinks.log },
] as const;

const requestLinks = [
  { label: "MIX依頼", href: siteLinks.mix },
  { label: "音声データチェック", href: siteLinks.audioCheck },
  { label: "作曲依頼", href: siteLinks.compose },
  { label: "オフボーカル配布", href: siteLinks.instrumentals },
  { label: "はじめての方へ", href: siteLinks.guide },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[linear-gradient(180deg,rgba(13,25,32,0.3),rgba(13,25,32,0.6))]">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <motion.div
          animate={{
            boxShadow: [
              "0 10px 24px rgba(13,25,32,0.3)",
              "0 16px 30px rgba(13,25,32,0.4)",
              "0 10px 24px rgba(13,25,32,0.3)",
            ],
          }}
          transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-[2rem] border border-white/10 bg-shinkai-800/70 p-6 backdrop-blur-2xl"
        >
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <Link href={siteLinks.home} className="inline-flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-shinkai-700/60">
                  <Radio className="h-5 w-5 text-sheen" />
                </div>
                <div>
                  <div className="text-sm font-medium text-shinkai-100">家から出ない倫</div>
                  <div className="text-sm text-shinkai-300">music works</div>
                </div>
              </Link>

              <p className="mt-5 text-sm leading-7 text-shinkai-200">
                和ロックとポップスのあいだで、情景に感情を託して曲を作っています。よければ、覗いていってください。
              </p>

              <div className="mt-5 rounded-[1.25rem] border border-white/10 bg-shinkai-900/40 p-4 text-sm leading-7 text-shinkai-200">
                {contactPolicyCopy.footerBody}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <div>
                <div className="text-xs tracking-[0.16em] text-shinkai-300">作品</div>
                <div className="mt-4 grid gap-2">
                  {workLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="rounded-2xl border border-white/10 bg-shinkai-900/40 px-4 py-3 text-sm text-shinkai-200 transition hover:border-white/20 hover:bg-shinkai-700/50"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs tracking-[0.16em] text-shinkai-300">ご依頼について</div>
                <div className="mt-4 grid gap-2">
                  {requestLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="rounded-2xl border border-white/10 bg-shinkai-900/40 px-4 py-3 text-sm text-shinkai-200 transition hover:border-white/20 hover:bg-shinkai-700/50"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs tracking-[0.16em] text-shinkai-300">外部リンク</div>
                <div className="mt-4 grid gap-2">
                  <a href={siteLinks.youtubeChannel} target="_blank" rel="noreferrer" className="inline-flex items-center justify-between rounded-2xl border border-white/10 bg-shinkai-900/40 px-4 py-3 text-sm text-shinkai-200 transition hover:border-white/20 hover:bg-shinkai-700/50">
                    <span>YouTube</span>
                    <ExternalLink className="h-4 w-4 text-shinkai-300" />
                  </a>
                  <a href={siteLinks.youtubePlaylist} target="_blank" rel="noreferrer" className="inline-flex items-center justify-between rounded-2xl border border-white/10 bg-shinkai-900/40 px-4 py-3 text-sm text-shinkai-200 transition hover:border-white/20 hover:bg-shinkai-700/50">
                    <span>全曲プレイリスト</span>
                    <ExternalLink className="h-4 w-4 text-shinkai-300" />
                  </a>
                  <a href={siteLinks.niconico} target="_blank" rel="noreferrer" className="inline-flex items-center justify-between rounded-2xl border border-white/10 bg-shinkai-900/40 px-4 py-3 text-sm text-shinkai-200 transition hover:border-white/20 hover:bg-shinkai-700/50">
                    <span>ニコニコ動画</span>
                    <ExternalLink className="h-4 w-4 text-shinkai-300" />
                  </a>
                  <a href={siteLinks.piapro} target="_blank" rel="noreferrer" className="inline-flex items-center justify-between rounded-2xl border border-white/10 bg-shinkai-900/40 px-4 py-3 text-sm text-shinkai-200 transition hover:border-white/20 hover:bg-shinkai-700/50">
                    <span>ピアプロ</span>
                    <ExternalLink className="h-4 w-4 text-shinkai-300" />
                  </a>
                  <a href={siteLinks.x} target="_blank" rel="noreferrer" className="inline-flex items-center justify-between rounded-2xl border border-white/10 bg-shinkai-900/40 px-4 py-3 text-sm text-shinkai-200 transition hover:border-white/20 hover:bg-shinkai-700/50">
                    <span>Xで相談する</span>
                    <ExternalLink className="h-4 w-4 text-shinkai-300" />
                  </a>
                  <a href={siteLinks.googleForm} target="_blank" rel="noreferrer" className="inline-flex items-center justify-between rounded-2xl border border-white/10 bg-shinkai-900/40 px-4 py-3 text-sm text-shinkai-200 transition hover:border-white/20 hover:bg-shinkai-700/50">
                    <span>Googleフォーム</span>
                    <ExternalLink className="h-4 w-4 text-shinkai-300" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

export default SiteFooter;
