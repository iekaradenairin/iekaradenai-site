import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "オフボーカル配布 — 倫 / Rin music works",
  description: "歌ってみたに使えるオフボーカルを配布しています。透明感や空気感のある楽曲を、ぜひ気軽にご利用ください。",
  openGraph: {
    title: "オフボーカル配布 — 倫 / Rin music works",
    description: "歌ってみたに使えるオフボーカルを配布しています。透明感や空気感のある楽曲を、ぜひ気軽にご利用ください。",
    url: "https://iekaradenai.work/instrumentals",
    siteName: "倫 / Rin music works",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "オフボーカル配布 — 倫 / Rin music works",
    description: "歌ってみたに使えるオフボーカルを配布しています。透明感や空気感のある楽曲を、ぜひ気軽にご利用ください。",
  },
};

export default function InstrumentalsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
