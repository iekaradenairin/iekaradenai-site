import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "音声データチェック — 倫 / Rin music works",
  description: "提出前に、このままで大丈夫そうかをかんたんに確認できます。音声ファイルをドラッグ＆ドロップするだけで、ノイズ・音割れ・サンプルレートを自動チェック。",
  openGraph: {
    title: "音声データチェック — 倫 / Rin music works",
    description: "提出前に、このままで大丈夫そうかをかんたんに確認できます。音声ファイルをドラッグ＆ドロップするだけで自動チェック。",
    url: "https://iekaradenai.work/audio-check",
    siteName: "倫 / Rin music works",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "音声データチェック — 倫 / Rin music works",
    description: "提出前に、このままで大丈夫そうかをかんたんに確認できます。音声ファイルをドラッグ＆ドロップするだけで自動チェック。",
  },
};

export default function AudioCheckLayout({ children }: { children: React.ReactNode }) {
  return children;
}
