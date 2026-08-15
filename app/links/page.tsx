'use client'

import { useEffect } from 'react'

import { siteLinks } from '@/lib/siteLinks'

// output: "export"（静的エクスポート）ではサーバーが無いため、
// next/navigation の redirect() は使えない（エラーページが生成される）。
// 外部URLへの転送はクライアント側で行う。
export default function LinksPage() {
  useEffect(() => {
    window.location.replace(siteLinks.x)
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center px-6 text-center">
      <p className="text-sm text-slate-600">
        X（旧Twitter）へ移動しています。切り替わらない場合は{' '}
        <a
          href={siteLinks.x}
          className="font-medium text-sky-600 underline underline-offset-4 hover:text-sky-700"
        >
          こちら
        </a>
        {' '}からどうぞ。
      </p>
    </main>
  )
}
