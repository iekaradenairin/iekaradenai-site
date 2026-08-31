# iekaradenai-site

家から出ない倫（ボカロP／SynthesizerVでオリジナル曲を作っています）の作品・世界観サイト。
Next.js の静的エクスポート（`output: "export"`）で、Cloudflare Pages にホストしています。

- 本番: https://iekaradenai.work
- プレビュー: Cloudflare Pages のブランチプレビュー（`main` 以外へのプッシュで自動生成）

## 曲を足す

1. `lib/works.ts` の `works` 配列に、以下をコピペして埋める。

   ```ts
   {
     title: '曲名',
     youtubeId: 'xxxxxxxxxxx', // 必須。この2つだけで公開できる
     releasedAt: '2026-01-01', // 分かる範囲でOK。不明なら省略
     scene: '情景文。誰と何があった曲か',
     vocal: '歌唱ソフト/歌い手名',
     moods: ['和ロック'], // lib/works.ts の MOODS から選ぶ
     nicoId: 'smXXXXXXXX', // ニコニコにも上げた場合のみ
   },
   ```

   **必須は `title` と `youtubeId` だけ**。他は空でもビルドは通る。紹介文（`scene`）は週末に足せばいい。

2. `youtubeId` の取り出し方: `https://youtu.be/xxxxxxxxxxx` の `xxxxxxxxxxx`（11文字）の部分だけ。URL全体を貼らない。

3. **並び順・トップページは自動**。`releasedAt` が一番新しい曲が `/top` の「最新作」になる（`featured: true` を付けた曲があればそれが例外的に優先される）。何もいじる必要はない。

## 確認する

```bash
npm run check
```

数秒で終わる。型エラー・`lib/works.ts` の不備（YouTube ID の形式・重複）・簡易テスト・lint をまとめて見る。`lib/works.ts` を壊すとここで日本語のエラーメッセージが出る。

`npm run build` はもう少し時間がかかる（OG画像生成 + 静的書き出し）。プッシュ前に一度通しておくと安心。

## 出す

- **曲を1曲足すだけなど、小さい変更**: `main` に直接コミットしてプッシュでOK。Cloudflare Pages が自動でビルド・公開する。
- **見た目やページ構成が変わる大きい変更**: 作業ブランチを切ってプッシュ → Cloudflare Pages がプレビューURLを発行する → 目視確認してから `main` にマージ。

## 戻す

1. まず Cloudflare Pages のダッシュボードで、直前の正常なデプロイを「Rollback」する（数秒で反映、一番早い）。
2. その後、原因になったコミットを `git revert` で打ち消して `main` にプッシュする（履歴を書き換えない）。

## 開発環境

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) で確認。Node のバージョンは `.nvmrc` を参照。
