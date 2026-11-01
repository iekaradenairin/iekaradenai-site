# YouTube作品の自動発見とDiscord通知

通常運用にAIは使いません。GitHub Actions / YouTube Data API / Discord Webhookで動きます。
現在はステージングで検証中です。`lib/discovery.config.json` の `enabled` は false のままです。

## 設定するもの

GitHubリポジトリのActions Secrets:

- `YOUTUBE_API_KEY`: 既存の読み取りキー
- `DISCORD_WEBHOOK_URL`: Discord通知先（登録済み）
- `YOUTUBE_CLIENT_ID` / `YOUTUBE_CLIENT_SECRET` / `YOUTUBE_REFRESH_TOKEN`: 自動追加用OAuth

Actions Variables:

- `COVERS_STAGING_PLAYLIST_ID`: 検証用リスト。掲載用 `lib/covers.config.json` とは必ず別のIDにします。

OAuthは `YoutubeAPIKEY-Site` プロジェクトに専用のデスクトップクライアントを作ります。
必要なスコープは `https://www.googleapis.com/auth/youtube.force-ssl` です。
このスコープ自体は1リスト限定の権限ではありません。処理側で対象IDを固定します。
外部ユーザー・テスト中では更新トークンが原則7日で失効するため、継続運用前に同意画面の状態を確認します。
再認証は `node scripts/authorize-youtube.mjs /absolute/path/to/client_secret.json` を使います。
資格情報は標準出力に出さず、`gh secret set` の標準入力で直接登録します。
認証途中のURL・コード・JSONをGitにコミットしないでください。

## 掲載条件

1. 原曲リストのタイトルを既存の分割規則で曲名にし、末尾の `feat. 歌唱名` を落とす
2. 全角半角・空白・句読点を正規化し、同じ曲をまとめる
3. 検索後、動画詳細の完全な概要欄を取得する
4. 曲名と、作者名または対応する原曲URLの両方がある動画を対象にする
5. 自分の投稿チャンネルの原曲動画、設定した除外ID・除外チャンネルを除く
6. 同じ原曲リストにあるコラボ動画も、他の投稿チャンネルなら一律除外しない

`titleOverrides` は動画ID→正しい曲名、`aliases` は曲名→別表記の配列です。
歌唱作品かの完全な判定ではなく、紹介動画などが混ざる可能性があります。Discordで確認し、違うものだけリストから削除します。

## 実行

既存の「再生リストの日次反映」ワークフローの手動実行でmodeを選びます。

- `refresh`: 既存のHP掲載データを更新
- `preview`: 最新の原曲データから検索・判定だけを実行。YouTube書き込み・Discord送信なし。結果は実行Summaryと7日間のartifact
- `notify-test`: 【検証】と明記したDiscord接続テスト。動画操作なし
- `apply`: 検証用リストへの追加と通知。stagingでのみ停止スイッチを一時的に上書きできる

検証例:

```bash
gh workflow run refresh-works.yml --ref staging -f mode=preview
gh workflow run refresh-works.yml --ref staging -f mode=notify-test
gh workflow run refresh-works.yml --ref staging -f mode=apply
```

定時実行はmainへの反映後に有効です。mainでの自動追加には `enabled: true` が必要です。
停止中も手動変更のHP反映は継続します。ステージングでの追加は検証用リストにしか書き込みません。
ステージングの通常ページは掲載用リストを表示するため、検証用リストへの追加だけでは表示は変わりません。
検証用リストをHPに表示する確認は、掲載用リストIDを本番と分けた検証ブランチで行います。

## 状態保存・削除・復旧

履歴は `automation-state` ブランチの `staging.json` / `production.json` に保存します。
公開リポジトリなので、ここには認証情報や非公開の概要欄は保存しません。動画ID・公開動画の候補情報・処理時刻だけです。
初回に既存の掲載作品を履歴へ登録します。一度掲載した動画は、リストから消えても自動再追加しません。
手動でリストへ戻した動画は掲載できます。履歴ファイルの削除は、この再追加防止を失わせます。

追加前に「追加処理中」を保存し、成功後に履歴とDiscord未送信通知を保存します。
保存に失敗したら外部への追加を続行しません。保存にはGitHubのSHAを用いて競合を検出します。
同じワークフローの実行は共通concurrencyで直列化します。手動操作との完全な排他ではありません。
通信切断で追加結果が不明な動画は、次回リストを照合し、存在すれば成功通知、なければ要確認通知を出します。
結果不明のものを自動で再追加しないため、未追加の動画が保留される可能性があります。その場合は通知の動画を手動追加してください。

1回最大5件。未追加候補は次回詳細を再確認してから処理します。
検索は1回最大36リクエスト。ページ途中と巡回位置を保存し、初回・7日ごとの過去検索と直近35日検索を行います。
検索の仕様により全件発見は保証できません。動画URLでの手動追加も使えます。

## Discord

成功した追加のみタイトル・投稿者・URL・判定理由を5件ずつ通知します。
異常は種類が変わったとき、復旧は正常に戻ったときに通知します。追加も異常もない日は送りません。
メンションとリンクの自動展開は無効です。秘密のWebhook URLやGoogle資格情報はログ・通知に含めません。
送信を確認できた通知はキューから除きます。送信後の通信切断・状態保存失敗では、再送で同じ通知が届く場合があります。
Discord送信失敗はキューを維持して次回再送し、GitHubのジョブも失敗にします。
GitHub自体の障害・実行未開始・ワークフロー停止は、この処理からDiscordへ通知できません。

## 本番移行の確認

- 曲名抽出・候補の実データ確認
- 検証リストへの追加・上限・重複・手動削除後の再追加防止
- 追加前後の状態保存失敗・結果不明の書き込み
- Discord成功通知・認証切れ・同一異常の抑制・復旧・通知再送
- HPへの追加・削除反映（サイトのロールバックではYouTubeへの追加は戻りません）

ユーザー確認後、mainへ反映して日次運用を有効にします。
