import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "はじめての方へ — 倫 / Rin music works",
  description: "はじめての歌ってみたでも、安心して相談できるように。依頼の流れ・必要なもの・よくある質問をまとめています。まずは気軽にご相談ください。",
  openGraph: {
    title: "はじめての方へ — 倫 / Rin music works",
    description: "はじめての歌ってみたでも、安心して相談できるように。依頼の流れ・必要なもの・よくある質問をまとめています。",
    url: "https://iekaradenai.work/guide",
    siteName: "倫 / Rin music works",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "はじめての方へ — 倫 / Rin music works",
    description: "はじめての歌ってみたでも、安心して相談できるように。依頼の流れ・必要なもの・よくある質問をまとめています。",
  },
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}
