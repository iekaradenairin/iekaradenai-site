"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle2, AlertCircle, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteLinks } from "@/lib/siteLinks";
import { analyzeAudioBuffer, type AnalysisResult } from "@/lib/audioAnalysis";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const MOBILE_WARN_SIZE = 30 * 1024 * 1024; // 30MB

const ACCEPTED_TYPES = new Set([
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/mpeg",
  "audio/mp3",
  "audio/ogg",
  "audio/aiff",
  "audio/x-aiff",
]);

type State =
  | { kind: "idle" }
  | { kind: "hover" }
  | { kind: "loading"; mobileWarning: boolean }
  | { kind: "result"; result: AnalysisResult; fileName: string; mobileWarning: boolean }
  | { kind: "error"; message: string };

function WaveformCanvas({ data }: { data: Float32Array }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    if (w < 1 || h < 1) return;

    canvas.width = w;
    canvas.height = h;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(240, 249, 255, 0.6)";
    ctx.fillRect(0, 0, w, h);

    const mid = h / 2;
    const step = data.length / w;

    ctx.beginPath();
    ctx.strokeStyle = "rgb(14, 165, 233)"; // sky-500
    ctx.lineWidth = 1.5;

    for (let x = 0; x < w; x++) {
      const idx = Math.floor(x * step);
      const amp = (data[idx] ?? 0) * mid * 0.85;
      if (x === 0) {
        ctx.moveTo(x, mid - amp);
      } else {
        ctx.lineTo(x, mid - amp);
      }
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "rgba(14, 165, 233, 0.45)";
    for (let x = 0; x < w; x++) {
      const idx = Math.floor(x * step);
      const amp = (data[idx] ?? 0) * mid * 0.85;
      if (x === 0) {
        ctx.moveTo(x, mid + amp);
      } else {
        ctx.lineTo(x, mid + amp);
      }
    }
    ctx.stroke();
  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      className="h-16 w-full rounded-2xl border border-sky-100 bg-sky-50/50"
      style={{ display: "block" }}
    />
  );
}

async function processFile(file: File): Promise<AnalysisResult> {
  const arrayBuffer = await file.arrayBuffer();
  const audioCtx = new AudioContext();
  try {
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    return analyzeAudioBuffer(audioBuffer);
  } finally {
    audioCtx.close();
  }
}

export function AudioChecker() {
  const [state, setState] = useState<State>({ kind: "idle" });
  const processingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (processingRef.current) return;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const mobileWarning = isMobile && file.size > MOBILE_WARN_SIZE;

    if (file.size > MAX_FILE_SIZE) {
      setState({ kind: "error", message: "ファイルが大きすぎます（100MB以下でお願いします）" });
      return;
    }

    if (!ACCEPTED_TYPES.has(file.type) && !file.name.match(/\.(wav|mp3|ogg|aif|aiff)$/i)) {
      setState({ kind: "error", message: "この形式には対応していません。WAV または MP3 でお試しください。" });
      return;
    }

    processingRef.current = true;
    setState({ kind: "loading", mobileWarning });

    try {
      const result = await processFile(file);
      setState({ kind: "result", result, fileName: file.name, mobileWarning });
    } catch {
      setState({ kind: "error", message: "ファイルを読み込めませんでした。別のファイルでお試しください。" });
    } finally {
      processingRef.current = false;
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setState((s) => (s.kind === "loading" ? s : { kind: "idle" }));
      const file = e.dataTransfer.files?.[0];
      if (file instanceof File) handleFile(file);
    },
    [handleFile],
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!processingRef.current) setState({ kind: "hover" });
  };

  const onDragLeave = () => {
    if (!processingRef.current) setState({ kind: "idle" });
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const isHover = state.kind === "hover";
  const isLoading = state.kind === "loading";

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <AnimatePresence mode="wait">
        {state.kind !== "result" && (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => !isLoading && inputRef.current?.click()}
            className={`flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-3 rounded-[1.75rem] border-2 border-dashed p-6 text-center transition-colors ${
              isHover
                ? "border-sky-400 bg-sky-50/60"
                : isLoading
                  ? "border-slate-200 bg-slate-50/40 cursor-default"
                  : "border-sky-200/70 bg-white/50 hover:border-sky-300 hover:bg-sky-50/40"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".wav,.mp3,.ogg,.aif,.aiff,audio/*"
              className="hidden"
              onChange={onInputChange}
            />

            {isLoading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
                <p className="text-sm text-slate-500">解析中...</p>
                {state.mobileWarning && (
                  <p className="text-xs text-amber-600">大きいファイルです。処理に時間がかかることがあります。</p>
                )}
              </>
            ) : state.kind === "error" ? (
              <>
                <AlertCircle className="h-8 w-8 text-amber-400" />
                <p className="text-sm font-medium text-slate-700">{state.message}</p>
                <p className="text-xs text-slate-500">クリックして別のファイルを選択</p>
              </>
            ) : (
              <>
                <Upload className={`h-8 w-8 transition-colors ${isHover ? "text-sky-500" : "text-sky-400"}`} />
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    音声ファイルをドラッグ＆ドロップ
                  </p>
                  <p className="mt-1 text-xs text-slate-500">またはクリックして選択 · WAV / MP3 / OGG · 100MB以下</p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {state.kind === "result" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* Re-check button + filename */}
            <div className="flex items-center justify-between gap-3">
              <p className="truncate text-xs text-slate-500">{state.fileName}</p>
              <button
                onClick={() => {
                  setState({ kind: "idle" });
                  inputRef.current?.click();
                }}
                className="shrink-0 rounded-full border border-slate-200 bg-white/60 px-3 py-1.5 text-xs text-slate-600 transition hover:bg-white"
              >
                別のファイルをチェック
              </button>
            </div>

            {/* Waveform */}
            <WaveformCanvas data={state.result.waveformData} />

            {/* Result cards */}
            <div className="grid gap-3 sm:grid-cols-2">
              {state.result.dimensions.map((dim) => (
                <motion.div
                  key={dim.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-2xl border p-4 ${
                    dim.status === "ok"
                      ? "border-sky-200 bg-sky-50/70"
                      : "border-amber-200 bg-amber-50/70"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {dim.status === "ok" ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
                    ) : (
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-500">{dim.label}</span>
                        {dim.value && (
                          <span className="text-xs text-slate-400">{dim.value}</span>
                        )}
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-700">{dim.copy}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Overall + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className={`rounded-[1.75rem] border p-5 ${
                state.result.overall === "ok"
                  ? "border-sky-200 bg-sky-50/80"
                  : "border-amber-200 bg-amber-50/80"
              }`}
            >
              <p className="text-sm font-medium text-slate-800">{state.result.overallCopy}</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="h-11 rounded-full px-6 text-sm">
                  <a href={siteLinks.googleForm} target="_blank" rel="noreferrer">
                    相談へ進む
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="h-11 rounded-full px-6 text-sm">
                  <a href={siteLinks.mix}>MIX依頼ページを見る</a>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
