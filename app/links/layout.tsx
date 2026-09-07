import type { Metadata } from "next";

const description = "家から出ない倫の X・YouTube・ニコニコ動画へのリンクをまとめています。";

export const metadata: Metadata = {
  title: "リンク - 家から出ない倫",
  description,
  openGraph: {
    title: "リンク - 家から出ない倫",
    description,
    url: "https://iekaradenai.work/links",
    siteName: "家から出ない倫",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "リンク - 家から出ない倫",
    description,
  },
};

export default function LinksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
