"use client";

import { useState } from "react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { AnimatedPanel } from "@/components/site/AnimatedPanel";
import { PageFrame } from "@/components/site/PageFrame";
import { WorkCard } from "@/components/site/WorkCard";
import { worksSorted } from "@/lib/works";

export default function WorksPage() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <PageFrame>
      <SiteHeader currentLabel="作品" />
      <main className="mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-10 lg:pt-10">
        <section className="space-y-6">
          <AnimatedPanel className="rounded-[2rem] border border-white/70 bg-white/80 p-6 backdrop-blur-xl">
            <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
              作品
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              これまでに作った{worksSorted.length}曲、
              <br />
              新しい順に並んでいます。
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
              和ロックとポップスのあいだで、情景に感情を託して書いています。気になった1曲から聴いてみてください。
            </p>
          </AnimatedPanel>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {worksSorted.map((work) => (
              <WorkCard key={work.title} work={work} activeId={activeId} onActivate={setActiveId} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </PageFrame>
  );
}
