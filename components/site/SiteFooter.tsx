"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Radio, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteLinks } from "@/lib/siteLinks";
import { contactPolicyCopy, contactActionLabels } from "@/lib/contactPolicy";

const pageLinks = [
  { label: "はじめての方へ", href: siteLinks.guide },
  { label: "MIX依頼", href: siteLinks.mix },
  { label: "音声データチェック", href: siteLinks.audioCheck },
  { label: "作品展示", href: siteLinks.works },
  { label: "オフボーカル配布", href: siteLinks.instrumentals },
  { label: "作曲依頼", href: siteLinks.compose },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-white/70 bg-[linear-gradient(180deg,rgba(248,252,255,0.82),rgba(255,255,255,0.96))]">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <motion.div
          animate={{
            boxShadow: [
              "0 10px 24px rgba(148,163,184,0.08)",
              "0 16px 30px rgba(148,163,184,0.11)",
              "0 10px 24px rgba(148,163,184,0.08)",
            ],
          }}
          transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-[2rem] border border-white/70 bg-white/70 p-6 backdrop-blur-2xl"
        >
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <Link href={siteLinks.home} className="inline-flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/45">
                  <Radio className="h-5 w-5 text-sky-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-sky-700">倫 / Rin</div>
                  <div className="text-sm text-slate-500">music works</div>
                </div>
              </Link>

              <p className="mt-5 text-sm leading-7 text-slate-600">
                透明感のある音づくりと作品の世界観を大切にしながら、MIX・作曲・編曲のご相談を受けています。
              </p>

              <div className="mt-5 rounded-[1.25rem] border border-slate-200 bg-slate-50/70 p-4 text-sm leading-7 text-slate-600">
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

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <div className="text-xs tracking-[0.16em] text-slate-500">ページ一覧</div>
                <div className="mt-4 grid gap-2">
                  {pageLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="rounded-2xl border border-slate-200 bg-white/55 px-4 py-3 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs tracking-[0.16em] text-slate-500">外部リンク</div>
                <div className="mt-4 grid gap-2">
                  <a href={siteLinks.googleForm} target="_blank" rel="noreferrer" className="inline-flex items-center justify-between rounded-2xl border border-slate-200 bg-white/55 px-4 py-3 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-white">
                    <span>Googleフォーム</span>
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  </a>
                  <a href={siteLinks.x} target="_blank" rel="noreferrer" className="inline-flex items-center justify-between rounded-2xl border border-slate-200 bg-white/55 px-4 py-3 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-white">
                    <span>XのDMで相談する</span>
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  </a>
                  <a href={siteLinks.youtubeChannel} target="_blank" rel="noreferrer" className="inline-flex items-center justify-between rounded-2xl border border-slate-200 bg-white/55 px-4 py-3 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-white">
                    <span>YouTube</span>
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  </a>
                  <a href={siteLinks.piapro} target="_blank" rel="noreferrer" className="inline-flex items-center justify-between rounded-2xl border border-slate-200 bg-white/55 px-4 py-3 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-white">
                    <span>ピアプロ</span>
                    <ExternalLink className="h-4 w-4 text-slate-400" />
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
