# iekaradenai-site

家から出ない倫（ボカロP／SynthesizerVでオリジナル曲を作っています）の作品・世界観サイト。
Next.js の静的エクスポート（`output: "export"`）で、Cloudflare Pages にホストしています。

- 本番: https://iekaradenai.work
- プレビュー: Cloudflare Pages のブランチプレビュー（`main` 以外へのプッシュで自動生成）

ページは5枚。`/top` `/works` `/instrumentals` `/audio-check` `/order` です。
（v1 の `/about` `/mix` `/compose` `/guide` `/log` `/links` は
`archive/v1-redesign-20260907` タグに凍結してあります。文言は `SITE_CONTENT.md` に全文あり）

## 曲を足す

**プレイリストに入れるだけです。** [全曲プレイリスト](https://www.youtube.com/playlist?list=PL9xTJo4NgKecdcBhJaL3MCZu9JBFjKG0h)に
新曲を追加すれば、翌朝6時（JST）の自動ジョブがサイトに反映します。

内訳はこうなっています。

1. GitHub Actions（`.github/workflows/refresh-works.yml`）が毎日プレイリストを読む
2. 前回と中身が違えば `lib/works.generated.json` をコミットして push する
3. その push で Cloudflare Pages がビルド・公開する

変化が無い日はコミットしないので、無駄なビルドは走りません。

**今すぐ載せたいとき**は、GitHub の Actions タブ →「再生リストの日次反映」→
"Run workflow" で手動実行できます。

並びは公開日の新しい順です。プレイリスト内での並べ替えは気にしなくて大丈夫で、
一番新しい曲が自動でトップの「最新作」になります。非公開・削除済みの動画は除外されます。

### 曲名の出方

カードには YouTube のタイトルをそのまま出すのではなく、
`曲名 / 倫 feat. 歌唱名` のスラッシュで割って、曲名を大きく・クレジットを小さく出しています。
`【初投稿】` のような角括弧の接頭辞は落とします。規則は `lib/workTitle.ts` にあります。

### トップの世界観セクション

トップの3枚（「あの双子座に願いを」など）は**プレイリスト連動ではありません**。
見出しも曲名ではなく手書きのコピーなので、`app/top/page.tsx` の `worldCards` を直接編集します。

ビルド時に `scripts/fetch-works.mjs` がプレイリスト全件を取りに行き、
`lib/works.generated.json` に焼き込みます。**並びは公開日の新しい順**なので、
プレイリスト内での並べ替えは気にしなくて大丈夫です。一番新しい曲がトップの「最新作」になります。

非公開・削除済みの動画は自動で除外されます。

### APIキーの置き場所（設定済み）

プレイリストの取得には YouTube Data API v3 のキーが要ります。
`schuldkrone.80@gmail.com` の Google Cloud で発行し、2箇所に登録してあります。

| 置き場所 | 用途 |
|---|---|
| GitHub の Actions シークレット `YOUTUBE_API_KEY` | 日次ジョブが使う。**実質こちらが本番** |
| Cloudflare Pages のビルド環境変数 `YOUTUBE_API_KEY` | ビルド時にも一応取り直す（Preview / Production 両方） |

キーは**サーバー側でしか使わない**のでブラウザには出ません。閲覧者が増えてもクォータを食いません。
消費は1日1ユニット程度で、無料枠（1日1万）に対して誤差です。

キーの制限は「APIの制限 = YouTube Data API v3 のみ」。ビルドはIPが固定できないので
アプリケーションの制限は「なし」にしてあります。

**キーが無くてもビルドは失敗しません。** コミット済みの `lib/works.generated.json` が
そのまま使われます（新曲が載らないだけ）。API が落ちていたときも前回の内容を維持します。

ただし日次ジョブは `--strict` で走らせているので、**キー失効やクォータ切れがあれば
ジョブが赤くなって気づけます**。ここで握りつぶすと更新が黙って止まるためです。

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
