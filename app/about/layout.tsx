import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "世界観 — 家から出ない倫",
  description: "言えなかった言葉のことを、ずっと書いています。和ロックとポップスのあいだで、情景に感情を託して曲を作るボカロP「家から出ない倫」の作風と制作環境。",
  openGraph: {
    title: "世界観 — 家から出ない倫",
    description: "言えなかった言葉のことを、ずっと書いています。和ロックとポップスのあいだで、情景に感情を託して曲を作っています。",
    url: "https://iekaradenai.work/about",
    siteName: "家から出ない倫",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "/og/about.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "世界観 — 家から出ない倫",
    description: "言えなかった言葉のことを、ずっと書いています。和ロックとポップスのあいだで、情景に感情を託して曲を作っています。",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
