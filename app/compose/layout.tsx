import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "作曲依頼 — 倫 / Rin music works",
  description: "作曲・編曲のご依頼を受けています。費用感や納期・参考曲の共有、方向性のすり合わせも、相談ベースで進められます。",
  openGraph: {
    title: "作曲依頼 — 倫 / Rin music works",
    description: "作曲・編曲のご依頼を受けています。費用感や納期・参考曲の共有、方向性のすり合わせも、相談ベースで進められます。",
    url: "https://iekaradenai.work/compose",
    siteName: "倫 / Rin music works",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "作曲依頼 — 倫 / Rin music works",
    description: "作曲・編曲のご依頼を受けています。費用感や納期・参考曲の共有、方向性のすり合わせも、相談ベースで進められます。",
  },
};

export default function ComposeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
