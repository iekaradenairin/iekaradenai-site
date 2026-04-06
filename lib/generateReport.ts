import type { AnalysisResult } from "./audioAnalysis";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatDb(db: number): string {
  if (!isFinite(db)) return "-∞ dBFS";
  return `${db.toFixed(1)} dBFS`;
}

function formatSeconds(sec: number): string {
  if (sec < 0.1) return "0.0 秒";
  return `${sec.toFixed(2)} 秒`;
}

function channelLabel(numChannels: number, isEffectivelyMono: boolean): string {
  if (numChannels === 1) return "モノラル";
  if (isEffectivelyMono) return `ステレオ (${numChannels}ch) ※実質モノラル`;
  return `ステレオ (${numChannels}ch)`;
}

export function generateMarkdownReport(result: AnalysisResult, fileName: string): string {
  const { dimensions, overall, overallCopy, metrics } = result;
  const now = new Date();
  const dateStr = now.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const overallLabel = overall === "ok" ? "✅ 問題なし" : "⚠️ 要確認";

  const dimensionRows = dimensions
    .map((d) => {
      const status = d.status === "ok" ? "✅" : "⚠️";
      const value = d.value ?? "—";
      return `| ${d.label} | ${status} | ${value} | ${d.copy} |`;
    })
    .join("\n");

  const lines = [
    `# 音声データチェックレポート`,
    ``,
    `**ファイル名**: ${fileName}`,
    `**チェック日時**: ${dateStr}`,
    `**総合判定**: ${overallLabel}`,
    ``,
    `> ${overallCopy}`,
    ``,
    `---`,
    ``,
    `## チェック項目`,
    ``,
    `| 項目 | 状態 | 値 | コメント |`,
    `|------|:----:|-----|---------|`,
    dimensionRows,
    ``,
    `---`,
    ``,
    `## 詳細データ`,
    ``,
    `| 項目 | 値 |`,
    `|------|-----|`,
    `| 再生時間 | ${formatDuration(metrics.duration)} |`,
    `| ピークレベル | ${formatDb(metrics.peakLevel)} |`,
    `| RMSレベル（全体） | ${formatDb(metrics.rmsLevel)} |`,
    `| ダイナミックレンジ | ${metrics.dynamicRange.toFixed(1)} dB |`,
    `| 頭の無音 | ${formatSeconds(metrics.headSilence)} |`,
    `| 末尾の無音 | ${formatSeconds(metrics.tailSilence)} |`,
    `| サンプルレート | ${metrics.sampleRate.toLocaleString("ja-JP")} Hz |`,
    `| チャンネル | ${channelLabel(metrics.numChannels, metrics.isEffectivelyMono)} |`,
    ``,
    `---`,
    ``,
    `*このレポートは [iekaradenai.com](https://iekaradenai.com) の音声データチェックツールで生成されました*`,
  ];

  return lines.join("\n");
}

export function downloadMarkdownReport(result: AnalysisResult, fileName: string): void {
  const md = generateMarkdownReport(result, fileName);
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const baseName = fileName.replace(/\.[^.]+$/, "");
  a.href = url;
  a.download = `audio-check_${baseName}.md`;
  a.click();
  URL.revokeObjectURL(url);
}
