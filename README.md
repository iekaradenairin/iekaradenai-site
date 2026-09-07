# iekaradenai-site

家から出ない倫（ボカロP／SynthesizerVでオリジナル曲を作っています）の作品・世界観サイト。
Next.js の静的エクスポート（`output: "export"`）で、Cloudflare Pages にホストしています。

- 本番: https://iekaradenai.work
- プレビュー: Cloudflare Pages のブランチプレビュー（`main` 以外へのプッシュで自動生成）

ページは5枚。`/top` `/works` `/instrumentals` `/audio-check` `/order` です。
（v1 の `/about` `/mix` `/compose` `/guide` `/log` `/links` は
`archive/v1-redesign-20260907` タグに凍結してあります。文言は `SITE_CONTENT.md` に全文あり）

## 曲を足す

**サイトは触りません。** YouTube の[全曲プレイリスト](https://www.youtube.com/playlist?list=PL9xTJo4NgKecdcBhJaL3MCZu9JBFjKG0h)に
新曲を追加して、サイトを再ビルドするだけです。

1. プレイリストに曲を追加する
2. Cloudflare Pages で再デプロイする（`main` への push、またはダッシュボードの "Retry deployment"）

ビルド時に `scripts/fetch-works.mjs` がプレイリスト全件を取りに行き、
`lib/works.generated.json` に焼き込みます。**並びは公開日の新しい順**なので、
プレイリスト内での並べ替えは気にしなくて大丈夫です。一番新しい曲がトップの「最新作」になります。

非公開・削除済みの動画は自動で除外されます。

### 必要な設定（初回だけ）

プレイリストの取得には YouTube Data API のキーが要ります。
Cloudflare Pages の **ビルド環境変数** に `YOUTUBE_API_KEY` を入れてください。

- Google Cloud Console でプロジェクトを作り、YouTube Data API v3 を有効化 → APIキーを発行
- 使うアカウントは `schuldkrone.80@gmail.com`（このワークスペースの既定）
- キーは**ビルド時にしか使わない**ので、ブラウザには出ません。閲覧者が増えてもクォータを食いません

キーが未設定でも**ビルドは失敗しません**。その場合はコミット済みの
`lib/works.generated.json` がそのまま使われます（新曲が載らないだけ）。
API が落ちていたときも同じで、前回の内容を維持します。

手元で取り込みたいときは:

```bash
YOUTUBE_API_KEY=xxxx npm run fetch-works
```

## 確認する

```bash
npm run check
```

型チェック・`lib/works.generated.json` の検査・テスト・lint をまとめて見ます。数秒で終わります。

`npm run build` はもう少し時間がかかります（プレイリスト取得 + OG画像生成 + 静的書き出し）。
プッシュ前に一度通しておくと安心です。

## 出す

- **小さい変更**: `main` に直接コミットしてプッシュでOK。Cloudflare Pages が自動でビルド・公開します
- **見た目やページ構成が変わる大きい変更**: 作業ブランチを切ってプッシュ → Cloudflare Pages がプレビューURLを発行 → 目視確認してから `main` にマージ

## 戻す

1. まず Cloudflare Pages のダッシュボードで、直前の正常なデプロイを「Rollback」する（数秒で反映、一番早い）
2. その後、原因になったコミットを `git revert` で打ち消して `main` にプッシュする（履歴を書き換えない）

## 開発環境

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) で確認。Node のバージョンは `.nvmrc` を参照。

## 中身のメモ

| 場所 | 何か |
|---|---|
| `app/globals.css` | デザイントークンと共通クラス。Claude Design のインラインstyleをここに畳んである |
| `components/site/RippleCanvas.tsx` | カーソル追従の水紋。全ページに敷く（デザイン方針で必須） |
| `components/site/ParticleField.tsx` | トップのヒーローで漂う粒子（three.js） |
| `components/site/WorksDeck.tsx` | 作品カードが水底から浮上する演出 |
| `lib/audioAnalysis.ts` | 音声データチェックの解析。純関数なのでテストから直接叩ける |
| `scripts/fetch-works.mjs` | プレイリスト取り込み。ビルド時に走る |

音声データチェックの解析は**すべてブラウザ内で完結**します。ファイルは送信も保存もしません
（ページ上でもそう明言しているので、ここに送信処理を足さないこと）。
