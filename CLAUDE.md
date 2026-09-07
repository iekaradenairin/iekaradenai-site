# iekaradenai-site

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review

## Testing

Run `npm run check` (typecheck + `lib/works.generated.json` validation + `node --test` + lint) or `npm test` for just the test suite. Tests live in `test/*.test.mjs`, run against source `.ts` / `.mjs` files directly via Node's native TypeScript stripping (no ts-node/tsx needed). See README.md for the full command list.

## この版について（v2 / 2026-09）

- ページは5枚だけ（`/top` `/works` `/instrumentals` `/audio-check` `/order`）。v1 は `archive/v1-redesign-20260907` タグに凍結、文言は `SITE_CONTENT.md` に全文ある。
- **作品データは YouTube のプレイリストが唯一の出所。** `lib/works.ts` に曲を手書きしない。ビルド時に `scripts/fetch-works.mjs` が取得して `lib/works.generated.json` を書く。
- デザインは Claude Design 由来。インラインstyleだった値は `app/globals.css` にトークン化して畳んである。新しい要素を足すときも同じクラスを使い、色や余白の数値を直接JSXに散らさない。
- **新規ページには水紋（`RippleCanvas`）を必ず付ける**（デザイン側の方針）。
- 音声データチェックの解析はブラウザ内で完結する。ファイルの送信・保存処理を足さないこと（ページ上でそう明言している）。
