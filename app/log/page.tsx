import Link from 'next/link'
import { getAllPosts } from '@/lib/log'
import { PageFrame } from '@/components/site/PageFrame'
import { SiteHeader } from '@/components/site/SiteHeader'
import { SiteFooter } from '@/components/site/SiteFooter'

export const metadata = {
  title: 'log — 倫 / Rin',
}

export default function LogPage() {
  const posts = getAllPosts()

  return (
    <PageFrame>
      <SiteHeader currentLabel="log" />
      <main className="mx-auto max-w-3xl px-6 pb-20 pt-8 lg:px-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-sky-600">log</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            メモ・ブログ・備忘録
          </h1>
        </div>

        {posts.length === 0 ? (
          <p className="text-sm text-slate-500">まだ記事がありません。</p>
        ) : (
          <div className="grid gap-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/log/${post.slug}`}
                className="group rounded-[1.5rem] border border-white/70 bg-white/75 p-5 backdrop-blur transition hover:border-white/90 hover:bg-white/90"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 group-hover:text-sky-700 transition">
                      {post.title}
                    </p>
                    {post.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs text-sky-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {post.date && (
                    <time className="shrink-0 text-xs text-slate-400">{post.date}</time>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </PageFrame>
  )
}
