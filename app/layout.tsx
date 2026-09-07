import type { Metadata } from "next";
import { Shippori_Mincho, Zen_Kaku_Gothic_New } from "next/font/google";

import "./globals.css";
import { works } from "@/lib/works";

// 日本語フォントは全ウェイトを preload すると重すぎるので、latin だけ拾って
// 本体は swap で後追いさせる（デザイン側も display=swap 指定）。
const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
});

// 見出し用の明朝。デザインの「Shippori Mincho」に対応
const shippori = Shippori_Mincho({
  variable: "--font-shippori",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
  preload: false,
});

const description =
  `SynthesizerVでオリジナル曲を作っています。和ロックとポップスのあいだで、` +
  `言えなかった言葉を情景に託して曲を作るボカロP「家から出ない倫」の作品。` +
  (works.length ? `オリジナル曲${works.length}曲を公開中。` : "");

export const metadata: Metadata = {
  title: "家から出ない倫 — 和ロック×ポップスのオリジナル曲",
  description,
  metadataBase: new URL("https://iekaradenai.work"),
  openGraph: {
    siteName: "家から出ない倫",
    images: [{ url: "/og/default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
  // プレビュー用のブランチデプロイが検索に載らないようにする
  robots:
    process.env.CF_PAGES_BRANCH === "main"
      ? undefined
      : { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${zenKaku.variable} ${shippori.variable}`}>{children}</body>
    </html>
  );
}
