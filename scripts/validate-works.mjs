try {
  await import('../lib/works.ts')
  console.log('✓ lib/works.ts: 問題ありません')
} catch (err) {
  console.error(err.message)
  process.exit(1)
}
