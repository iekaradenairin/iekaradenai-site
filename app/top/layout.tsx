import type { Metadata } from "next";
import { works } from "@/lib/works";

export const metadata: Metadata = {
  title: "家から出ない倫 — 和ロック×ポップスのオリジナル曲",
  description: `SynthesizerVでオリジナル曲を作っています。和ロックとポップスのあいだで、情景に感情を託して曲を作るボカロP「家から出ない倫」の作品と世界観。オリジナル曲${works.length}曲を公開中。`,
  openGraph: {
    title: "家から出ない倫 — 和ロック×ポップスのオリジナル曲",
    description: "SynthesizerVでオリジナル曲を作っています。和ロックとポップスのあいだで、情景に感情を託して曲を作っています。",
    url: "https://iekaradenai.work/top",
    siteName: "家から出ない倫",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "家から出ない倫 — 和ロック×ポップスのオリジナル曲",
    description: "SynthesizerVでオリジナル曲を作っています。和ロックとポップスのあいだで、情景に感情を託して曲を作っています。",
  },
};

export default function TopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
