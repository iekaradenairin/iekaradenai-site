"use client";

import { useState } from "react";
import { Loader2, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { youtubeThumbnailUrl, type Work } from "@/lib/works";

type Version = { label: string | null; youtubeId: string };

type WorkCardProps = {
  work: Work;
  activeId: string | null;
  onActivate: (youtubeId: string) => void;
};

export function WorkCard({ work, activeId, onActivate }: WorkCardProps) {
  const versions: Version[] = [
    { label: null, youtubeId: work.youtubeId },
    ...(work.altVersions ?? []).map((v) => ({ label: v.label, youtubeId: v.youtubeId })),
  ];

  const [selectedId, setSelectedId] = useState(work.youtubeId);
  const [thumbQuality, setThumbQuality] = useState<"maxresdefault" | "hqdefault">("maxresdefault");
  const [thumbFailed, setThumbFailed] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const selected = versions.find((v) => v.youtubeId === selectedId) ?? versions[0];
  const isPlaying = activeId === selected.youtubeId;

  function selectVersion(id: string) {
    setSelectedId(id);
    setThumbQuality("maxresdefault");
    setThumbFailed(false);
    setIframeLoaded(false);
    if (activeId != null) onActivate(id);
  }

  function play() {
    setIframeLoaded(false);
    onActivate(selected.youtubeId);
  }

  const metaLine = [work.moods?.join(" / "), work.vocal, work.releasedAt ?? undefined]
    .filter(Boolean)
    .join(" ・ ");

  return (
    <div className="group rounded-2xl border border-white/10 bg-shinkai-800/70 p-3 backdrop-blur">
      <div className="relative aspect-video overflow-hidden rounded-xl ring-1 ring-white/10">
        {thumbFailed ? (
          <div className="flex h-full w-full items-center justify-center bg-shinkai-900 p-4 text-center">
            <span className="text-sm font-medium text-shinkai-100">{work.title}</span>
          </div>
        ) : (
          <img
            src={youtubeThumbnailUrl(selected.youtubeId, thumbQuality)}
            alt={work.title}
            loading="lazy"
            onLoad={(e) => {
              if (thumbQuality === "maxresdefault" && e.currentTarget.naturalWidth <= 120) {
                setThumbQuality("hqdefault");
              }
            }}
            onError={() => {
              if (thumbQuality === "maxresdefault") setThumbQuality("hqdefault");
              else setThumbFailed(true);
            }}
            className={cn(
              "h-full w-full object-cover transition-all duration-500",
              isPlaying
                ? "opacity-0"
                : "opacity-100 brightness-90 saturate-90 group-hover:brightness-100 group-hover:saturate-100 group-focus-within:brightness-100 group-focus-within:saturate-100"
            )}
          />
        )}

        {isPlaying ? (
          <iframe
            key={selected.youtubeId}
            src={`https://www.youtube-nocookie.com/embed/${selected.youtubeId}?autoplay=1`}
            title={work.title}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="autoplay; encrypted-media; picture-in-picture"
            onLoad={() => setIframeLoaded(true)}
            className={cn(
              "absolute inset-0 h-full w-full transition-opacity duration-500",
              iframeLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        ) : null}

        {isPlaying && !iframeLoaded ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        ) : null}

        {!isPlaying ? (
          <button
            type="button"
            aria-label={`${work.title} を再生`}
            onClick={play}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="rounded-full bg-black/40 p-4 backdrop-blur-sm transition group-hover:bg-black/55 group-focus-visible:bg-black/55">
              <PlayCircle className="h-10 w-10 text-white" />
            </span>
          </button>
        ) : null}
      </div>

      <div className="mt-3 min-w-0">
        <div className="text-lg font-semibold tracking-tight text-shinkai-100">{work.title}</div>
        {work.scene ? <p className="mt-2 text-sm leading-7 text-shinkai-200">{work.scene}</p> : null}
        {metaLine ? <p className="mt-2.5 text-xs leading-6 text-shinkai-300">{metaLine}</p> : null}

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          {versions.length > 1
            ? versions.map((v) => (
                <button
                  key={v.youtubeId}
                  type="button"
                  onClick={() => selectVersion(v.youtubeId)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 transition",
                    v.youtubeId === selectedId
                      ? "border-sheen bg-sheen text-shinkai-950"
                      : "border-white/10 bg-shinkai-700 text-shinkai-200 hover:border-white/20"
                  )}
                >
                  {v.label ?? "オリジナル"}
                </button>
              ))
            : null}

          <a
            href={`https://youtu.be/${selected.youtubeId}`}
            target="_blank"
            rel="noreferrer"
            className="ml-auto rounded-full border border-white/10 px-2.5 py-1 text-shinkai-200 transition hover:border-white/20"
          >
            YouTubeで見る
          </a>
          {work.nicoId ? (
            <a
              href={`https://www.nicovideo.jp/watch/${work.nicoId}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/10 px-2.5 py-1 text-shinkai-200 transition hover:border-white/20"
            >
              ニコニコで見る
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
