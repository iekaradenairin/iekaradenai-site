import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "作品展示 — 倫 / Rin music works",
  description: "透明感・空気感・青春感のあるサウンドを中心に、MIX・作曲・編曲の実績を展示しています。",
  openGraph: {
    title: "作品展示 — 倫 / Rin music works",
    description: "透明感・空気感・青春感のあるサウンドを中心に、MIX・作曲・編曲の実績を展示しています。",
    url: "https://iekaradenai.work/works",
    siteName: "倫 / Rin music works",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "作品展示 — 倫 / Rin music works",
    description: "透明感・空気感・青春感のあるサウンドを中心に、MIX・作曲・編曲の実績を展示しています。",
  },
};

export default function WorksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
