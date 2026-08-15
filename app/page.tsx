import type { Metadata } from "next";

import TopPage from "./top/page";
import { siteLinks } from "@/lib/siteLinks";

// output: "export"（静的エクスポート）ではサーバーが無く、redirect() は
// リダイレクトではなくエラーページを生成してしまう。
// そのため / では TOP の内容をそのまま描画し、正規URLは /top を指す。
export const metadata: Metadata = {
  alternates: {
    canonical: `${siteLinks.domain}${siteLinks.home}`,
  },
};

export default function Page() {
  return <TopPage />;
}
