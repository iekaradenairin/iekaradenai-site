"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Radio } from "lucide-react";
import { siteLinks } from "@/lib/siteLinks";

type SiteHeaderProps = {
  currentLabel?: string;
};

const TOP_URL = "/top";

export function SiteHeader({ currentLabel }: SiteHeaderProps) {
  return (
    <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 flex items-center gap-3"
      >
        <Link href={TOP_URL} className="flex items-center gap-3">
          <motion.div
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/35 shadow-[0_12px_32px_rgba(148,163,184,0.14)] ring-1 ring-white/50 backdrop-blur-2xl"
            animate={{
              boxShadow: [
                "0 12px 32px rgba(148,163,184,0.14)",
                "0 18px 42px rgba(56,189,248,0.18)",
                "0 12px 32px rgba(148,163,184,0.14)",
              ],
            }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Radio className="h-5 w-5 text-sky-500" />
          </motion.div>

          <div>
            <p className="text-sm font-medium text-sky-700">music works</p>
            <div className="text-base font-semibold tracking-wide text-slate-900">倫 / Rin</div>
          </div>
        </Link>
      </motion.div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href={siteLinks.guide}
            className="inline-flex rounded-full border border-white/70 bg-white/55 px-3 py-2 text-xs text-slate-800 shadow-sm backdrop-blur"
          >
            はじめての方へ
          </Link>
          <Link
            href={siteLinks.works}
            className="inline-flex rounded-full border border-white/70 bg-white/55 px-3 py-2 text-xs text-slate-800 shadow-sm backdrop-blur"
          >
            作品
          </Link>
          <Link
            href={TOP_URL}
            className="inline-flex rounded-full border border-white/70 bg-white/55 px-3 py-2 text-xs text-slate-800 shadow-sm backdrop-blur"
          >
            TOP
          </Link>
        </div>

        <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="hidden items-center gap-6 text-sm text-slate-700 md:flex"
        >
          <Link href={TOP_URL} className="transition hover:text-slate-900">
            TOP
          </Link>
          <Link
            href={siteLinks.guide}
            className="rounded-full bg-white/60 px-3 py-1.5 text-slate-900 shadow-sm transition hover:bg-white/80"
          >
            はじめての方へ
          </Link>
          <Link href={siteLinks.works} className="transition hover:text-slate-900">
            作品
          </Link>
        </motion.nav>

        {currentLabel ? (
          <div className="hidden rounded-full border border-sky-100 bg-sky-50/80 px-3 py-1 text-xs font-medium text-sky-700 md:inline-flex">
            {currentLabel}
          </div>
        ) : null}
      </div>
    </header>
  );
}