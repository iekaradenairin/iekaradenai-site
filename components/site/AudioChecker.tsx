'use client'

import { useRef, useState } from 'react'

import { buildReport, measure, parseWavHeader, type Report } from '@/lib/audioAnalysis'

const MAX_BYTES = 200 * 1024 * 1024

type Phase =
  | { kind: 'idle' }
  | { kind: 'busy'; fileName: string }
  | { kind: 'error'; message: string }
  | { kind: 'done'; fileName: string; report: Report }

export function AudioChecker() {
  const input = useRef<HTMLInputElement>(null)
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' })
  const [hot, setHot] = useState(false)

  async function analyze(file: File) {
    setPhase({ kind: 'busy', fileName: file.name })
    try {
      if (file.size > MAX_BYTES) throw new Error('size')

      const buf = await file.arrayBuffer()
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctx) throw new Error('unsupported')

      const ctx = new Ctx()
      // decodeAudioData は渡した ArrayBuffer を detach するので、
      // ヘッダ解析用にコピーを渡す
      const audio = await ctx.decodeAudioData(buf.slice(0))
      const wav = parseWavHeader(buf)
      const report = buildReport(file, audio, measure(audio), wav)
      void ctx.close()

      setPhase({ kind: 'done', fileName: file.name, report })
    } catch (err) {
      setPhase({
        kind: 'error',
        message:
          err instanceof Error && err.message === 'size'
            ? 'ファイルが大きすぎます。200MB以下で書き出したものをお使いください。'
            : 'この形式は読み込めないようです。WAV や MP3 で書き出したものをお試しください。',
      })
    }
  }

  const report = phase.kind === 'done' ? phase.report : null

  return (
    <>
      <section className="section" style={{ padding: '0 var(--gutter) 96px' }}>
        <button
          type="button"
          className="dropzone"
          data-hot={hot || undefined}
          onClick={() => input.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            if (!hot) setHot(true)
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            setHot(false)
          }}
          onDrop={(e) => {
            e.preventDefault()
            setHot(false)
            const f = e.dataTransfer?.files?.[0]
            if (f) void analyze(f)
          }}
        >
          <input
            ref={input}
            type="file"
            accept="audio/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void analyze(f)
              e.target.value = ''
            }}
          />

          {phase.kind === 'idle' ? (
            <span className="stack" style={{ alignItems: 'center', gap: 14 }}>
              <span className="display display--panel" style={{ textShadow: 'none' }}>
                音声ファイルをここに置いてください
              </span>
              <span style={{ fontSize: 13, lineHeight: 1.9, color: 'var(--ink-5)' }}>
                クリックして選択もできます　WAV / MP3 / OGG / M4A
              </span>
              <span className="mono" style={{ fontSize: 11, lineHeight: 1, color: 'var(--ink-9)' }}>
                DRAG &amp; DROP
              </span>
            </span>
          ) : null}

          {phase.kind === 'busy' ? (
            <span className="stack" style={{ alignItems: 'center', gap: 14 }}>
              <span className="display display--panel" style={{ textShadow: 'none' }}>
                解析しています…
              </span>
              <span style={{ fontSize: 13, color: 'var(--ink-5)' }}>{phase.fileName}</span>
            </span>
          ) : null}

          {phase.kind === 'error' ? (
            <span className="stack" style={{ alignItems: 'center', gap: 14 }}>
              <span className="display display--card" style={{ color: 'var(--bad)', textShadow: 'none' }}>
                読み込めませんでした
              </span>
              <span style={{ fontSize: 13, lineHeight: 1.9, color: 'var(--ink-5)', maxWidth: '26em' }}>
                {phase.message}
              </span>
              <span className="mono" style={{ fontSize: 11, lineHeight: 1, color: 'var(--ink-9)' }}>
                クリックしてもう一度選ぶ
              </span>
            </span>
          ) : null}

          {phase.kind === 'done' ? (
            <span className="stack" style={{ alignItems: 'center', gap: 10 }}>
              <span className="mono" style={{ fontSize: 11, lineHeight: 1, color: 'var(--ink-9)' }}>
                {phase.fileName}
              </span>
              <span className="display display--card" style={{ textShadow: 'none' }}>
                別のファイルを見るならここに置いてください
              </span>
            </span>
          ) : null}
        </button>
      </section>

      {report ? (
        <section className="section" style={{ padding: '0 var(--gutter) 96px' }} aria-live="polite">
          <div className="stack" style={{ gap: 30 }}>
            <div className="panel summary" data-tone={report.summary.tone} style={{ gap: 22, justifyContent: 'flex-start' }}>
              <div className="stack" style={{ gap: 10, minWidth: 0, flex: '1 1 300px' }}>
                <span className="eyebrow" style={{ fontSize: 10, letterSpacing: '0.2em' }}>
                  RESULT
                </span>
                <span className="display" style={{ fontSize: 26, lineHeight: 1.45, textShadow: 'none' }}>
                  {report.summary.title}
                </span>
                <p className="body-sm" style={{ color: 'var(--ink-2)' }}>
                  {report.summary.body}
                </p>
              </div>
              <div className="mono stack" style={{ gap: 8, fontSize: 11, lineHeight: 1.9, color: 'var(--ink-6)' }}>
                <span>{report.spec.format}</span>
                <span>{report.spec.length}</span>
                <span>{report.spec.channels}</span>
              </div>
            </div>

            <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,250px),1fr))', gap: 22 }}>
              {report.checks.map((c) => (
                <div key={c.label} className="card" style={{ gap: 14, padding: '26px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <span className="label">{c.label}</span>
                    <span className="badge" data-level={c.level}>
                      {c.badge}
                    </span>
                  </div>
                  <span className="mono" style={{ fontSize: 20, lineHeight: 1, color: 'var(--ink-1)' }}>
                    {c.value}
                  </span>
                  <p className="body-xs">{c.note}</p>
                </div>
              ))}
            </div>

            <p className="note" style={{ maxWidth: '44em' }}>
              ※
              自動での簡易判定です。ここで「注意」が出ても実際には問題ないこと、逆に「大丈夫そう」でも聴いて相談したいことがあります。最終的な判断は、実際に聴かせてもらってからお伝えします。
            </p>
          </div>
        </section>
      ) : null}
    </>
  )
}

export default AudioChecker
