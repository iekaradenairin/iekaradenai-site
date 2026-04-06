export type AnalysisDimension = {
  id: string;
  label: string;
  status: "ok" | "warning";
  copy: string;
  value?: string;
};

export type AudioMetrics = {
  duration: number;         // 秒
  peakLevel: number;        // dBFS
  rmsLevel: number;         // dBFS
  dynamicRange: number;     // dB
  headSilence: number;      // 秒
  tailSilence: number;      // 秒
  sampleRate: number;
  numChannels: number;
  isEffectivelyMono: boolean; // ステレオだが実質モノラルか
};

export type AnalysisResult = {
  dimensions: AnalysisDimension[];
  overall: "ok" | "warning";
  overallCopy: string;
  waveformData: Float32Array;
  metrics: AudioMetrics;
};

// ---- 計算ユーティリティ ----

function rmsDb(samples: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < samples.length; i++) {
    sum += samples[i] * samples[i];
  }
  const rms = Math.sqrt(sum / samples.length);
  if (rms === 0) return -Infinity;
  return 20 * Math.log10(rms);
}

function noiseFloor(channelData: Float32Array, sampleRate: number): number {
  const windowSize = 1024;
  const maxSamples = Math.min(channelData.length, sampleRate * 30);
  const windows: number[] = [];

  for (let i = 0; i + windowSize <= maxSamples; i += windowSize) {
    const window = channelData.slice(i, i + windowSize);
    windows.push(rmsDb(window));
  }

  if (windows.length === 0) return -Infinity;

  windows.sort((a, b) => a - b);
  const cutoff = Math.floor(windows.length * 0.05);
  const quietWindows = windows.slice(0, Math.max(1, cutoff));
  return quietWindows.reduce((a, b) => a + b, 0) / quietWindows.length;
}

function peakClipCount(channelData: Float32Array): number {
  const threshold = Math.pow(10, -0.1 / 20);
  let count = 0;
  for (let i = 0; i < channelData.length; i++) {
    if (Math.abs(channelData[i]) >= threshold) count++;
  }
  return count;
}

function peakLevelDb(channelData: Float32Array): number {
  let peak = 0;
  for (let i = 0; i < channelData.length; i++) {
    const abs = Math.abs(channelData[i]);
    if (abs > peak) peak = abs;
  }
  if (peak === 0) return -Infinity;
  return 20 * Math.log10(peak);
}

function dynamicRangeDb(channelData: Float32Array, sampleRate: number): number {
  const windowSize = Math.floor(sampleRate * 0.1); // 100ms ウィンドウ
  const windows: number[] = [];

  for (let i = 0; i + windowSize <= channelData.length; i += windowSize) {
    const db = rmsDb(channelData.slice(i, i + windowSize));
    if (db !== -Infinity) windows.push(db);
  }

  if (windows.length < 2) return 0;
  windows.sort((a, b) => a - b);

  const loud = windows[Math.floor(windows.length * 0.95)];
  const quiet = windows[Math.floor(windows.length * 0.05)];
  return Math.max(0, loud - quiet);
}

function measureHeadSilence(channelData: Float32Array, sampleRate: number): number {
  const threshold = 0.001; // -60dBFS 相当
  for (let i = 0; i < channelData.length; i++) {
    if (Math.abs(channelData[i]) > threshold) {
      return i / sampleRate;
    }
  }
  return channelData.length / sampleRate;
}

function measureTailSilence(channelData: Float32Array, sampleRate: number): number {
  const threshold = 0.001;
  for (let i = channelData.length - 1; i >= 0; i--) {
    if (Math.abs(channelData[i]) > threshold) {
      return (channelData.length - 1 - i) / sampleRate;
    }
  }
  return channelData.length / sampleRate;
}

function checkEffectivelyMono(buffer: AudioBuffer): boolean {
  if (buffer.numberOfChannels < 2) return false;
  const ch0 = buffer.getChannelData(0);
  const ch1 = buffer.getChannelData(1);
  const sampleCount = Math.min(ch0.length, 8000);
  let sumDiff = 0;
  for (let i = 0; i < sampleCount; i++) {
    sumDiff += Math.abs(ch0[i] - ch1[i]);
  }
  return sumDiff / sampleCount < 0.001;
}

function downsampleWaveform(channelData: Float32Array, targetPoints: number): Float32Array {
  const result = new Float32Array(targetPoints);
  const step = channelData.length / targetPoints;
  for (let i = 0; i < targetPoints; i++) {
    const start = Math.floor(i * step);
    const end = Math.floor((i + 1) * step);
    let max = 0;
    for (let j = start; j < end && j < channelData.length; j++) {
      if (Math.abs(channelData[j]) > max) max = Math.abs(channelData[j]);
    }
    result[i] = max;
  }
  return result;
}

// ---- メイン分析 ----

export function analyzeAudioBuffer(buffer: AudioBuffer): AnalysisResult {
  const channelData = buffer.getChannelData(0);
  const sampleRate = buffer.sampleRate;
  const numChannels = buffer.numberOfChannels;
  const dimensions: AnalysisDimension[] = [];

  // Noise floor
  if (channelData.length >= 1024) {
    const nf = noiseFloor(channelData, sampleRate);
    if (nf === -Infinity) {
      dimensions.push({
        id: "noise",
        label: "ノイズ",
        status: "ok",
        copy: "無音のファイルのようです",
      });
    } else {
      const ok = nf < -50;
      dimensions.push({
        id: "noise",
        label: "ノイズ",
        status: ok ? "ok" : "warning",
        copy: ok
          ? "ノイズは気にならないレベルです"
          : "ノイズがやや大きめです。静かな環境で録り直すと、仕上がりがよくなります",
        value: `${nf.toFixed(1)} dBFS`,
      });
    }
  }

  // Peak / clipping
  const clips = peakClipCount(channelData);
  const clippingOk = clips < 10;
  dimensions.push({
    id: "peak",
    label: "音割れ",
    status: clippingOk ? "ok" : "warning",
    copy: clippingOk
      ? "音割れは見つかりませんでした"
      : "音割れの可能性があります。録音レベルを少し下げて試してみてください",
    value: clips > 0 ? `${clips} 箇所` : undefined,
  });

  // Sample rate
  const rateOk = sampleRate >= 44100;
  dimensions.push({
    id: "samplerate",
    label: "サンプルレート",
    status: rateOk ? "ok" : "warning",
    copy: rateOk
      ? `サンプルレートは十分です (${sampleRate.toLocaleString("ja-JP")}Hz)`
      : `サンプルレートが低めです (${sampleRate.toLocaleString("ja-JP")}Hz)。44,100Hz 以上が推奨です`,
    value: `${sampleRate.toLocaleString("ja-JP")} Hz`,
  });

  // Channel count
  const isEffectivelyMono = checkEffectivelyMono(buffer);
  const monoOk = numChannels === 1;
  dimensions.push({
    id: "channels",
    label: "チャンネル",
    status: monoOk ? "ok" : "warning",
    copy: monoOk
      ? "モノラルです（推奨）"
      : isEffectivelyMono
        ? "ステレオですが、左右がほぼ同一です。モノラルに変換してから提出すると理想的です"
        : "ステレオです。モノラル推奨ですが、このまま提出しても大丈夫です",
    value: numChannels === 1 ? "モノラル" : `ステレオ (${numChannels}ch)`,
  });

  const hasWarning = dimensions.some((d) => d.status === "warning");
  const overall = hasWarning ? "warning" : "ok";
  const overallCopy = hasWarning
    ? "いくつか気になる点があります。録り直しも検討してみてください。迷う場合は、そのまま相談していただいても大丈夫です"
    : "この音源なら、そのまま相談に進めそうです";

  const waveformData = downsampleWaveform(channelData, 600);

  // 詳細メトリクス
  const metrics: AudioMetrics = {
    duration: buffer.duration,
    peakLevel: peakLevelDb(channelData),
    rmsLevel: rmsDb(channelData),
    dynamicRange: dynamicRangeDb(channelData, sampleRate),
    headSilence: measureHeadSilence(channelData, sampleRate),
    tailSilence: measureTailSilence(channelData, sampleRate),
    sampleRate,
    numChannels,
    isEffectivelyMono,
  };

  return { dimensions, overall, overallCopy, waveformData, metrics };
}
