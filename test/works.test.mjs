import { test } from 'node:test'
import assert from 'node:assert/strict'
import { works, worksSorted, heroWork, compareWorks } from '../lib/works.ts'

const ID_RE = /^[A-Za-z0-9_-]{11}$/

test('every youtubeId matches the YouTube ID format', () => {
  for (const w of works) {
    assert.match(w.youtubeId, ID_RE, `${w.title}: ${w.youtubeId}`)
  }
})

test('no duplicate youtubeId across works', () => {
  const ids = works.map((w) => w.youtubeId)
  assert.equal(ids.length, new Set(ids).size)
})

test('no duplicate title across works', () => {
  const titles = works.map((w) => w.title)
  assert.equal(titles.length, new Set(titles).size)
})

test('worksSorted is newest-first with unreleased dates (null) last', () => {
  const dated = worksSorted.filter((w) => w.releasedAt != null)
  for (let i = 1; i < dated.length; i++) {
    assert.ok(dated[i - 1].releasedAt >= dated[i].releasedAt)
  }
  const nullStartIndex = worksSorted.findIndex((w) => w.releasedAt == null)
  if (nullStartIndex !== -1) {
    for (let i = nullStartIndex; i < worksSorted.length; i++) {
      assert.equal(worksSorted[i].releasedAt, null)
    }
  }
})

test('heroWork falls back to worksSorted[0] when nothing is featured', () => {
  assert.equal(works.some((w) => w.featured), false)
  assert.equal(heroWork, worksSorted[0])
})

test('compareWorks is a total order: antisymmetric and reflexive-zero', () => {
  const sample = [
    { title: 'A', youtubeId: 'aaaaaaaaaaa', releasedAt: '2026-01-01' },
    { title: 'B', youtubeId: 'bbbbbbbbbbb', releasedAt: '2026-01-01' },
    { title: 'C', youtubeId: 'ccccccccccc', releasedAt: null },
    { title: 'D', youtubeId: 'ddddddddddd', releasedAt: null },
  ]
  for (const a of sample) {
    for (const b of sample) {
      const ab = compareWorks(a, b)
      const ba = compareWorks(b, a)
      if (a === b) {
        assert.equal(ab, 0)
      } else {
        assert.notEqual(ab, 0, `${a.title} vs ${b.title} must not tie`)
        assert.equal(Math.sign(ab), -Math.sign(ba), `${a.title} vs ${b.title} must be antisymmetric`)
      }
    }
  }
})

test('sorting is deterministic regardless of input order', () => {
  const shuffled = [...works].reverse()
  const sortedA = [...works].sort(compareWorks).map((w) => w.youtubeId)
  const sortedB = [...shuffled].sort(compareWorks).map((w) => w.youtubeId)
  assert.deepEqual(sortedA, sortedB)
})
