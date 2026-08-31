import type { Metadata } from "next";
import { works } from "@/lib/works";

const description = `和ロックとポップスのあいだで書いてきた、情景に感情を託した楽曲${works.length}曲。`;

export const metadata: Metadata = {
  title: "作品 — 家から出ない倫",
  description,
  openGraph: {
    title: "作品 — 家から出ない倫",
    description,
    url: "https://iekaradenai.work/works",
    siteName: "家から出ない倫",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "作品 — 家から出ない倫",
    description,
  },
};

export default function WorksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
