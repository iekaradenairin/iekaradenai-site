import { test } from 'node:test'
import assert from 'node:assert/strict'
import { renderMarkdown } from '../lib/log.ts'

test('renderMarkdown defuses javascript: scheme links', () => {
  const html = renderMarkdown('[click me](javascript:alert(1))')
  assert.ok(!html.includes('javascript:'), html)
  assert.match(html, /<a href="#">click me<\/a>/)
})

test('renderMarkdown defuses attribute-injection via link URL', () => {
  const html = renderMarkdown('[x](" onmouseover="alert(1)")')
  assert.ok(!html.includes('onmouseover='), html)
})

test('renderMarkdown escapes raw HTML in paragraphs', () => {
  const html = renderMarkdown('<script>alert(1)</script>')
  assert.ok(!html.includes('<script>'), html)
  assert.ok(html.includes('&lt;script&gt;'), html)
})

test('renderMarkdown escapes raw HTML inside headings and list items', () => {
  const html = renderMarkdown('# <img src=x onerror=alert(1)>\n- <b>bold</b>')
  assert.ok(!html.includes('<img src=x'), html)
  assert.ok(!html.includes('<b>bold</b>'), html)
})

test('renderMarkdown keeps safe relative and https links intact', () => {
  const html = renderMarkdown('[home](/log) and [ext](https://example.com)')
  assert.match(html, /<a href="\/log">home<\/a>/)
  assert.match(html, /<a href="https:\/\/example\.com">ext<\/a>/)
})

test('renderMarkdown still renders basic formatting', () => {
  const html = renderMarkdown('**bold** and *em* and `code`')
  assert.match(html, /<strong>bold<\/strong>/)
  assert.match(html, /<em>em<\/em>/)
  assert.match(html, /<code>code<\/code>/)
})
