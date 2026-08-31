import type { Metadata } from "next";

const description = "作った曲のオフボーカルをピアプロで配布しています。歌ってみたにぜひご利用ください。";

export const metadata: Metadata = {
  title: "オフボーカル配布 — 家から出ない倫",
  description,
  openGraph: {
    title: "オフボーカル配布 — 家から出ない倫",
    description,
    url: "https://iekaradenai.work/instrumentals",
    siteName: "家から出ない倫",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "オフボーカル配布 — 家から出ない倫",
    description,
  },
};

export default function InstrumentalsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
