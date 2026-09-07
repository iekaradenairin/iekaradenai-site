import type { Metadata } from "next";

const description = "MIX・作曲のご依頼を受け付けています。まずはお気軽にご相談ください。";

export const metadata: Metadata = {
  title: "ご依頼 - 家から出ない倫",
  description,
  openGraph: {
    title: "ご依頼 - 家から出ない倫",
    description,
    url: "https://iekaradenai.work/order",
    siteName: "家から出ない倫",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ご依頼 - 家から出ない倫",
    description,
  },
};

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
