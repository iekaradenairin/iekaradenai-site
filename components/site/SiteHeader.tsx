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
    <header className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 flex min-w-0 shrink items-center gap-3"
      >
        <Link href={TOP_URL} className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <motion.div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-shinkai-800/70 shadow-[0_12px_32px_rgba(13,25,32,0.4)] ring-1 ring-white/10 backdrop-blur-2xl sm:h-11 sm:w-11"
            animate={{
              boxShadow: [
                "0 12px 32px rgba(13,25,32,0.4)",
                "0 18px 42px rgba(95,168,199,0.22)",
                "0 12px 32px rgba(13,25,32,0.4)",
              ],
            }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Radio className="h-5 w-5 text-sheen" />
          </motion.div>

          <div className="min-w-0">
            <p className="whitespace-nowrap text-xs font-medium text-shinkai-300 sm:text-sm">music works</p>
            <div className="whitespace-nowrap text-sm font-semibold tracking-wide text-shinkai-100 sm:text-base">
              家から出ない倫
            </div>
          </div>
        </Link>
      </motion.div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="flex shrink-0 items-center gap-1.5 md:hidden">
          <Link
            href={siteLinks.works}
            className="inline-flex shrink-0 whitespace-nowrap rounded-full border border-white/10 bg-shinkai-800/70 px-2.5 py-1.5 text-[11px] text-shinkai-200 shadow-sm backdrop-blur"
          >
            作品
          </Link>
          <Link
            href={siteLinks.about}
            className="inline-flex shrink-0 whitespace-nowrap rounded-full border border-white/10 bg-shinkai-800/70 px-2.5 py-1.5 text-[11px] text-shinkai-200 shadow-sm backdrop-blur"
          >
            世界観
          </Link>
        </div>

        <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="hidden shrink-0 items-center gap-4 whitespace-nowrap text-sm text-shinkai-300 md:flex lg:gap-6"
        >
          <Link
            href={siteLinks.works}
            className="rounded-full bg-shinkai-700/80 px-3 py-1.5 text-shinkai-100 shadow-sm transition hover:bg-shinkai-700"
          >
            作品
          </Link>
          <Link href={siteLinks.about} className="transition hover:text-shinkai-100">
            世界観
          </Link>
          <Link href={siteLinks.log} className="transition hover:text-shinkai-100">
            log
          </Link>
          <Link href={siteLinks.mix} className="text-xs text-shinkai-300 transition hover:text-shinkai-100">
            依頼
          </Link>
        </motion.nav>

        {currentLabel ? (
          <div className="hidden shrink-0 whitespace-nowrap rounded-full border border-sheen/25 bg-shinkai-800/60 px-3 py-1 text-xs font-medium text-sheen lg:inline-flex">
            {currentLabel}
          </div>
        ) : null}
      </div>
    </header>
  );
}