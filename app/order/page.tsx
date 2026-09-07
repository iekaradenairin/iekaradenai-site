'use client'

import Link from 'next/link'

import { PageFrame } from '@/components/site/PageFrame'
import { SiteHeader } from '@/components/site/SiteHeader'
import { SiteFooter } from '@/components/site/SiteFooter'
import { Button } from '@/components/ui/button'
import { siteLinks } from '@/lib/siteLinks'
import { contactPolicyCopy, contactActionLabels } from '@/lib/contactPolicy'

// TODO(v2): Claude Design の `Order Page.dc.html` を移植してここを置き換える。
// 旧 /mix と /compose を統合したルート。現状は導線を切らないための最小実装。
export default function OrderPage() {
  return (
    <PageFrame>
      <SiteHeader currentLabel="ご依頼" />

      <main className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
        <p className="text-xs tracking-[0.16em] text-shinkai-300">{contactPolicyCopy.eyebrow}</p>
        <h1 className="mt-3 text-2xl font-semibold text-shinkai-100 sm:text-3xl">
          {contactPolicyCopy.title}
        </h1>
        <p className="mt-6 text-sm leading-8 text-shinkai-200">{contactPolicyCopy.full}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="h-12 rounded-full px-6">
            <a href={siteLinks.googleForm} target="_blank" rel="noreferrer">
              {contactActionLabels.primary}
            </a>
          </Button>
          <Button asChild variant="outline" className="h-12 rounded-full px-6">
            <a href={siteLinks.x} target="_blank" rel="noreferrer">
              {contactActionLabels.secondary}
            </a>
          </Button>
        </div>

        <p className="mt-10 text-sm leading-7 text-shinkai-200">
          送る前に音源の状態を確かめたい場合は{' '}
          <Link href={siteLinks.audioCheck} className="font-medium text-sheen underline underline-offset-4">
            音声データチェック
          </Link>
          {' '}を使ってください。
        </p>
      </main>

      <SiteFooter />
    </PageFrame>
  )
}
