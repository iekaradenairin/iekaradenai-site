import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "倫 / Rin music works — MIX・作曲依頼",
  description: "透明感のある音づくりと作品の世界観を大切にしながら、MIX・作曲・編曲のご相談を受けています。はじめての歌ってみたから、こだわりの1曲まで。",
  openGraph: {
    title: "倫 / Rin music works — MIX・作曲依頼",
    description: "透明感のある音づくりと作品の世界観を大切にしながら、MIX・作曲・編曲のご相談を受けています。",
    url: "https://iekaradenai.work/top",
    siteName: "倫 / Rin music works",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "倫 / Rin music works — MIX・作曲依頼",
    description: "透明感のある音づくりと作品の世界観を大切にしながら、MIX・作曲・編曲のご相談を受けています。",
  },
};

export default function TopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
