import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import PageTransition from "./components/PageTransition";
import { works } from "@/lib/works";

const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "家から出ない倫 — 和ロック×ポップスのオリジナル曲",
  description: `SynthesizerVでオリジナル曲を作っています。和ロックとポップスのあいだで、情景に感情を託して曲を作るボカロP「家から出ない倫」の作品と世界観。オリジナル曲${works.length}曲を公開中。`,
  metadataBase: new URL('https://iekaradenai.work'),
  openGraph: {
    siteName: '家から出ない倫',
    images: [{ url: '/og/default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${zenKaku.variable} antialiased`}>
        <MotionConfig reducedMotion="user">
          <PageTransition>
            {children}
          </PageTransition>
        </MotionConfig>
      </body>
    </html>
  );
}
