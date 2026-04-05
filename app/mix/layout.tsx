import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MIX依頼 — 倫 / Rin music works",
  description: "声の魅力を大切にしながら、作品として自然に届くかたちへ整えます。はじめての歌ってみたでも安心。自然な補正をベースに、透明感のあるMIXをお届けします。",
  openGraph: {
    title: "MIX依頼 — 倫 / Rin music works",
    description: "声の魅力を大切にしながら、作品として自然に届くかたちへ整えます。はじめての歌ってみたでも安心。",
    url: "https://iekaradenai.work/mix",
    siteName: "倫 / Rin music works",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MIX依頼 — 倫 / Rin music works",
    description: "声の魅力を大切にしながら、作品として自然に届くかたちへ整えます。はじめての歌ってみたでも安心。",
  },
};

export default function MixLayout({ children }: { children: React.ReactNode }) {
  return children;
}
