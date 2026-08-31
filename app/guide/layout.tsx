import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "はじめての方へ — 家から出ない倫",
  description: "はじめての歌ってみたでも、安心して相談できるように。依頼の流れ・必要なもの・よくある質問をまとめています。まずは気軽にご相談ください。",
  openGraph: {
    title: "はじめての方へ — 家から出ない倫",
    description: "はじめての歌ってみたでも、安心して相談できるように。依頼の流れ・必要なもの・よくある質問をまとめています。",
    url: "https://iekaradenai.work/guide",
    siteName: "家から出ない倫",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "はじめての方へ — 家から出ない倫",
    description: "はじめての歌ってみたでも、安心して相談できるように。依頼の流れ・必要なもの・よくある質問をまとめています。",
  },
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}
