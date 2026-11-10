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
新曲を追加すれば、翌朝6時17分ごろ（JST）の自動ジョブがサイトに反映します。

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

変更はまず `staging` にプッシュして検証し、確認が済んだものを `main` にマージします。
`main` への直接プッシュで見た目や機能の変更を公開しない運用です。

| 環境 | ブランチ | URL |
|---|---|---|
| 本番 | `main` | https://iekaradenai.work |
| 検証 | `staging` | https://staging.iekaradenai-site.pages.dev |

### 検証から本番まで

1. 作業前に `origin/main` の最新変更を `staging` に取り込む（日次更新の作品データもここで同期）
2. `staging` で変更し、`npm run check` を通してコミット・プッシュする
3. GitHub Actions「サイトの検査」と Cloudflare Pages のデプロイが両方成功したことを確認する
4. 検証URLで PC・スマホの表示、リンク、再生、演出を確認する
5. `staging` → `main` のPRを作り、ユーザーの本番反映OKを得てからマージする
6. 本番デプロイの成功と実際の表示を確認する

ブランチの検証URLは常に最新のデプロイを指します。特定の検証結果を共有する場合は、
Cloudflare Pages が発行するデプロイごとの固有URLとコミットIDも記録してください。
検査の成功とデプロイの成功は別なので、両方を確認してから本番へ進めます。
これは運用上の手順であり、ブランチ保護による強制ではありません。

### 環境の違い

- Cloudflare Pages の本番ブランチは `main`、`staging` は Preview としてビルドします。
- ビルドコマンドは `npm run build`、公開ディレクトリは `out` です。
- `app/layout.tsx` が `CF_PAGES_BRANCH` を見て、本番以外に `noindex, nofollow` を付けます。
  検証URLは公開URLです。検索除外は閲覧制限ではありません。
- YouTube は読み取りのみ。本番と同じ再生リストで表示を検証できます。
  Preview の `YOUTUBE_API_KEY` が未設定なら、コミット済みの作品データでビルドします。
- 再生リストの日次更新は引き続き `main` で動きます。検証環境の作品データは、
  `main` の取り込み、または次のビルド時の取得で更新されます。
- ビルド時に再生リストを取り直すため、検証と本番のビルドの間に再生リストを変えると、
  掲載データが変わる場合があります。機能の確認にはコミットID、掲載内容の確認には実際の一覧も使います。

今回追加する「歌ってくれた作品」は YouTube のみを対象にし、専用の再生リストから取得する方針です。
ページと取得処理は、検証環境を整えた後に追加します。

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
| `components/site/NightRain.tsx` | トップのヒーロー右側。夜の水面に降る雨と水紋（three.js） |
| `components/site/WorksDeck.tsx` | 作品カードが水底から浮上する演出 |
| `lib/audioAnalysis.ts` | 音声データチェックの解析。純関数なのでテストから直接叩ける |
| `scripts/fetch-works.mjs` | プレイリスト取り込み。ビルド時に走る |

音声データチェックの解析は**すべてブラウザ内で完結**します。ファイルは送信も保存もしません
（ページ上でもそう明言しているので、ここに送信処理を足さないこと）。

## 歌ってくれた作品

`/works/covers` は `/works` と水紋・背景を共有します。作品ページ内の切り替えで
天気雨へ明転し、オリジナル作品へ戻ると夜へ暗転します。OSの「動きを減らす」設定では
光の演出・カード浮上・水紋を止めます。

掲載元は **YouTube の専用再生リストのみ**です。
`lib/covers.config.json` の `playlistId` に、再生リストURLの `list=` 以降を設定してください。
未設定の間は作品を捏造せず、空の案内を表示します。

取得には既存の `YOUTUBE_API_KEY` を使います。`npm run fetch-covers` で取り込み、
`npm run build` でも取得します。`lib/covers.generated.json` は取得結果なので直接編集しません。
APIの取得に失敗した場合は前回のデータを維持します。正常に取得した空リストは反映します。
動画タイトルは書式を推測して分割せず、そのまま表示します。チャンネル名は歌唱者と断定せず
「投稿」として表示し、埋め込みの可否に関係なくYouTubeへのリンクを置きます。

日次更新ジョブはオリジナルと歌ってくれた作品を両方取得・検査します。
このジョブの変更が `main` に入るまでは、ステージングではプッシュ時のビルドで取得します。
取得処理・一覧・演出をステージングで確認し、本番反映はユーザーの確認後に行います。

## 歌ってくれた作品の自動発見

曲名抽出・YouTube検索・ルール判定・再生リストへの自動追加・Discord通知のコードは
`scripts/automation/` にあります。AIを呼び出す処理はありません。
`lib/discovery.config.json` の `enabled` は true に準備済みです。本番の日次処理は毎朝6時17分ごろ（JST）に実行されます。
準備・再認証・手動検証・停止方法は [運用手順](docs/YOUTUBE_AUTOMATION.md) を参照してください。
