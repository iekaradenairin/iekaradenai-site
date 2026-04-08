import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllPosts, getPost, renderMarkdown } from '@/lib/log'
import { PageFrame } from '@/components/site/PageFrame'
import { SiteHeader } from '@/components/site/SiteHeader'
import { SiteFooter } from '@/components/site/SiteFooter'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return { title: `${post.title} — log` }
}

export default async function LogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const html = renderMarkdown(post.content)

  return (
    <PageFrame>
      <SiteHeader currentLabel="log" />
      <main className="mx-auto max-w-3xl px-6 pb-20 pt-8 lg:px-10">
        <Link
          href="/log"
          className="mb-6 inline-flex items-center gap-1 text-sm text-sky-600 hover:text-sky-700"
        >
          ← log 一覧
        </Link>

        <article>
          <header className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
              {post.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {post.date && (
                <time className="text-sm text-slate-400">{post.date}</time>
              )}
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs text-sky-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div
            className="log-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>
      </main>
      <SiteFooter />
    </PageFrame>
  )
}
