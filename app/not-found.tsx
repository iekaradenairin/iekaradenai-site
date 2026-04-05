"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Radio, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteLinks } from "@/lib/siteLinks";

export default function NotFound() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f3fbff_0%,#e8f5ff_30%,#f8fcff_70%,#ffffff_100%)] text-slate-800">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link href={siteLinks.home} className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/35 backdrop-blur-2xl">
            <Radio className="h-5 w-5 text-sky-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-sky-700">music works</p>
            <div className="text-base font-semibold tracking-wide text-slate-900">倫 / Rin</div>
          </div>
        </Link>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 py-24 text-center lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="rounded-[2rem] border border-white/70 bg-white/80 p-10 backdrop-blur-xl shadow-[0_10px_40px_rgba(148,163,184,0.12)] max-w-lg w-full"
        >
          <p className="text-sm font-medium text-sky-600">404</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            ページが見つかりません
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            お探しのページは存在しないか、移動した可能性があります。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="h-12 rounded-full px-6">
              <Link href={siteLinks.home}>
                トップページへ
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-full px-6">
              <Link href={siteLinks.mix}>MIX依頼を見る</Link>
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
