import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";
import PageTransition from "./components/PageTransition";

const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "倫 / Rin music works — MIX・作曲依頼",
  description: "透明感のある音づくりと作品の世界観を大切にしながら、MIX・作曲・編曲のご相談を受けています。",
  metadataBase: new URL('https://iekaradenai.work'),
  openGraph: {
    siteName: '家から出ない倫 / Rin',
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
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  );
}
