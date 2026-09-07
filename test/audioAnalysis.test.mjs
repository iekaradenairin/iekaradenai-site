import assert from 'node:assert/strict'
import test from 'node:test'

import { buildReport, measure, parseWavHeader } from '../lib/audioAnalysis.ts'

/** 指定の振幅で鳴り続ける音を作る。quietTail を付けると末尾に無音区間ができる */
function tone({ amp = 0.5, seconds = 4, sampleRate = 48000, channels = 1, quietTail = 0, quietAmp = 0 }) {
  const length = Math.round(sampleRate * seconds)
  const tailFrom = Math.round(sampleRate * (seconds - quietTail))
  const data = []
  for (let c = 0; c < channels; c++) {
    const buf = new Float32Array(length)
    for (let i = 0; i < length; i++) {
      const a = i >= tailFrom ? quietAmp : amp
      buf[i] = Math.sin((2 * Math.PI * 440 * i) / sampleRate) * a
    }
    data.push(buf)
  }
  return {
    numberOfChannels: channels,
    length,
    sampleRate,
    duration: seconds,
    getChannelData: (c) => data[c],
  }
}

const FILE = { name: 'take01.wav', size: 5 * 1048576 }

test('無音区間が無い音源では S/N を測らず null を返す', () => {
  // 鳴りっぱなしの音で一番静かなフレームを拾うと S/N を過大評価してしまうため
  const m = measure(tone({ amp: 0.5 }))
  assert.equal(m.snr, null)
  assert.equal(m.noiseDb, null)
})

test('無音区間があれば S/N が測れる', () => {
  const m = measure(tone({ amp: 0.5, seconds: 6, quietTail: 3, quietAmp: 0.0005 }))
  assert.ok(m.snr !== null)
  assert.ok(m.snr > 40, `S/N が期待より低い: ${m.snr}`)
})

test('S/N が測れないときは「参考」バッジになり、総評は緑のまま', () => {
  const audio = tone({ amp: 0.5 })
  const report = buildReport(FILE, audio, measure(audio), { bits: 24, rate: 48000 })
  const noise = report.checks.find((c) => c.label === 'ノイズの量')
  assert.equal(noise.level, 'info')
  assert.equal(noise.value, '測れませんでした')
  assert.equal(report.summary.tone, 'ok')
})

test('振り切った音源は音割れを bad と判定し、総評も bad に落ちる', () => {
  const audio = tone({ amp: 1.0 })
  const report = buildReport(FILE, audio, measure(audio), { bits: 24, rate: 48000 })
  assert.equal(report.checks.find((c) => c.label === '音割れ').level, 'bad')
  assert.equal(report.summary.tone, 'bad')
})

test('小さすぎる音源は音量を bad と判定する', () => {
  const audio = tone({ amp: 0.005 })
  const report = buildReport(FILE, audio, measure(audio), { bits: 24, rate: 48000 })
  assert.equal(report.checks.find((c) => c.label === '音量').level, 'bad')
})

test('44.1kHz は warn、48kHz/24bit は ok', () => {
  const audio = tone({ amp: 0.5 })
  const m = measure(audio)
  const at441 = buildReport(FILE, audio, m, { bits: 24, rate: 44100 })
  const at48 = buildReport(FILE, audio, m, { bits: 24, rate: 48000 })
  assert.equal(at441.checks.find((c) => c.label === '書き出し形式').level, 'warn')
  assert.equal(at48.checks.find((c) => c.label === '書き出し形式').level, 'ok')
})

test('WAV ヘッダが読めない形式は「参考」扱いにして拡張子を出す', () => {
  const audio = tone({ amp: 0.5 })
  const report = buildReport({ name: 'take01.mp3', size: 1048576 }, audio, measure(audio), { bits: 0, rate: 0 })
  const fmt = report.checks.find((c) => c.label === '書き出し形式')
  assert.equal(fmt.level, 'info')
  assert.equal(fmt.value, 'MP3')
})

test('左右が同一のステレオは「実質モノラル」と伝える', () => {
  const audio = tone({ amp: 0.5, channels: 2 })
  const report = buildReport(FILE, audio, measure(audio), { bits: 24, rate: 48000 })
  assert.equal(report.spec.channels, 'ステレオ（左右同一・実質モノラル）')
})

test('parseWavHeader が fmt チャンクからビット深度とレートを読む', () => {
  // 最小限の WAV ヘッダ（RIFF / WAVE / fmt 16バイト）
  const buf = new ArrayBuffer(44)
  const v = new DataView(buf)
  const put = (o, s) => [...s].forEach((ch, i) => v.setUint8(o + i, ch.charCodeAt(0)))
  put(0, 'RIFF')
  v.setUint32(4, 36, true)
  put(8, 'WAVE')
  put(12, 'fmt ')
  v.setUint32(16, 16, true)
  v.setUint16(20, 1, true) // PCM
  v.setUint16(22, 2, true) // channels
  v.setUint32(24, 48000, true) // sample rate
  v.setUint16(34, 24, true) // bits per sample
  put(36, 'data')

  assert.deepEqual(parseWavHeader(buf), { bits: 24, rate: 48000 })
})

test('WAV でないデータは 0 を返して呼び出し側に「不明」と判断させる', () => {
  assert.deepEqual(parseWavHeader(new ArrayBuffer(8)), { bits: 0, rate: 0 })
  assert.deepEqual(parseWavHeader(new ArrayBuffer(100)), { bits: 0, rate: 0 })
})
