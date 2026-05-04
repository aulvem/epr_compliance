# epr_compliance — AI が読める EPR + 少額輸入関税データセット

主要EU加盟国・英国・米国における2つの越境EC関連規制 ──「**包装EPR(拡大生産者責任)登録要件**」と「**少額輸入(de minimis)関税の閾値**」── を、機械可読な構造化データとして提供します。

これらの情報は Web 上の人間向けガイドや法律事務所の解説にバラバラに散在しており、AI エージェントや EC バックエンドからそのまま使える形にはなっていません。`epr_compliance` はその「構造化された層」を提供することを目的としています。

> **⚠️ 本データは参考情報であり、法的助言ではありません。 経営判断の前には必ず EU コンプライアンスに精通した弁護士、通関士、または現地の規制当局にご確認ください。**

## このプロジェクトは何か

- `data/` 配下に JSON / CSV のデータ本体(`record_type` で2タイプを判別するスキーマ)
- `skills/epr-extraction/SKILL.md` に、各フィールドを公式機関ページからどう抽出するかの厳密なルール
- `scripts/` に、公式ソースの再取得と再抽出を行うツール群
- 毎週の自動更新差分を Git で追跡し、「いつ何が変わったか」を後から監査可能 — 締切や閾値が頻繁に動くドメインなので重要

## このデータセットの公開場所

- **GitHub**(本リポジトリ)— 真実のソース、抽出履歴、週次更新パイプライン
- **Hugging Face Datasets** — [Aulvem/epr-compliance](https://huggingface.co/datasets/Aulvem/epr-compliance) — データセットプレビューと `datasets` ライブラリ統合のミラー

## v0.1 の対象範囲

| | |
|---|---|
| 対象国・地域 | 7地域(DE / FR / IT / ES / NL / GB / US — 米国はカリフォルニア州を代表州として収録) |
| 各地域の制度数 | 2(包装EPR + 少額輸入関税閾値) |
| レコード数 | 14件(packaging_epr 7件 + de_minimis_tariff 7件) |
| タイムライン件数 | 84件(各レコードの append-only イベントログ。SKILL.md §2 参照) |
| 信頼度 | high 11件 / medium 3件 |
| 現状 | active 7件 / scheduled_for_removal 6件(規制移行期)/ suspended 1件 |
| 言語 | 英語(master)+ 日本語(view) |
| スキーマ | v0.1 — [skills/epr-extraction/SKILL.md](skills/epr-extraction/SKILL.md) を参照 |
| 更新頻度 | 毎週月曜 03:00 UTC(GitHub Actions) |
| ライセンス | CC-BY 4.0 — [LICENSE](LICENSE) を参照 |

v0.1 で対象とする 7 地域:

1. ドイツ(DE)
2. フランス(FR)
3. イタリア(IT)
4. スペイン(ES)
5. オランダ(NL)
6. 英国(GB)
7. 米国(US)

各地域に対して `packaging_epr` と `de_minimis_tariff` を1件ずつ。

## 想定ユーザー

- 越境ECセラー(Shopify、Amazon FBA、Etsy 等)
- マーケットプレイスのコンプライアンス・エンジニアリング担当
- セラーからの「相手国の要件は?」という質問に答える AI エージェント
- 越境EC規制の断片化を研究する研究者

## 免責事項

> **本データは参考情報であり、法的助言ではありません。 経営判断の前には必ず関係国の規制当局・有資格弁護士・通関士に確認してください。**

EPR 登録の締切、関税閾値、マーケットプレイス連帯責任のルールは頻繁に変更され、法的・財務的に直接的な影響をもたらします。本データセットは調査の出発点としてご利用いただき、最終決定は必ず公式情報・専門家助言に基づいて行ってください。詳細は [DISCLAIMER.md](DISCLAIMER.md) および [TERMS.ja.md](TERMS.ja.md) をご覧ください。

## 使い方

```bash
# データを直接読む
cat data/epr_compliance_v0.1.json

# CSV(フラット化版)も用意しています
cat data/epr_compliance_v0.1.csv
```

プログラムから利用する場合は、特定のスキーマバージョン(`v0.1`)に固定してください。スキーマの破壊的変更は `v0.2`, `v0.3` のように別バージョンで公開され、既存バージョンへの上書きは行いません。

## Pro 版(商用 / 監査品質)

上記の無料版は AI 読み取り可能な構造化レイヤーです。
**Pro 版** は、コンプライアンスチームが必要とする監査品質のメタデータを追加します:

- **抽出根拠 (extraction_evidence)** — 元ソース URL、取得タイムスタンプ、各フィールドを支えるスニペット
- **信頼度判断記録 (confidence_rationale)** — ISO / SOC 2 監査の証跡としてそのまま使える意思決定要因の文書化
- **変更履歴 (change_history)** — 規制改正の経年追跡のための構造化バージョンログ
- **クロスリファレンス (cross_references)** — 関連 EU 規制および他の Aulvem データセットへのリンク
- **コンプライアンス担当者向けノート (compliance_officer_notes)** — 落とし穴、推奨アクション、公式連絡先、所要時間目安

3 つの tier:

| Tier | 価格 | 用途 | 購入 |
|------|------|------|------|
| Snapshot | $19 | 個人 / 単独ユーザー調査 | [aulvem.gumroad.com/l/xqtzbb](https://aulvem.gumroad.com/l/xqtzbb) |
| Subscription | $79/年 | 社内利用 + 週次更新 52 回 + 四半期ブリーフ 4 回 | [aulvem.gumroad.com/l/hnkxj](https://aulvem.gumroad.com/l/hnkxj) |
| Commercial License | $499/年 | 再配布 / white-label / REST API 権 + 年 1 回のカスタマイズ | [aulvem.gumroad.com/l/mhxxhf](https://aulvem.gumroad.com/l/mhxxhf) |

無料版(本データセット)は CC-BY 4.0 のもと永続的に無料で、週次更新も継続します。Pro 版は無料版の厳密な上位集合で、Pro 版の購入が無料版へのアクセスを置き換えるものではありません。

## ライセンスと出典表記

本データセットは [クリエイティブ・コモンズ 表示 4.0 国際 (CC-BY 4.0)](LICENSE) で公開されます。出典を明記いただければ、商用利用を含めた共有・改変が自由です。

各国政府・規制当局が公開している原文の規制テキストおよび当局名・ロゴ等の権利は各機関に帰属します。本プロジェクトはそこから「構造化された事実」(登録要件・閾値・頻度・可否フラグなど)を抽出して再利用しやすい形に整えており、その成果物が本データセットです。原文をそのまま再掲する場合は、各機関の利用規約を遵守する責任は再掲者にあります。

## 引用方法

本データセットを研究・プロダクト・派生ツール等でご利用いただく場合は、以下の形式で出典を明記してください。

> epr_compliance contributors (2026). *epr_compliance: AI-readable EPR + De Minimis Tariff Dataset* (v0.1). https://github.com/aulvem/epr_compliance, CC-BY 4.0 ライセンス.

CC-BY 4.0 はクレジット表示を必須としており、上記の形式、もしくはデータセット名・バージョン・ライセンスを明示する実質的に同等な表記であれば要件を満たします。

## ロードマップ

- **v0.1(現行)** — 7地域 × 2制度(約14件)、JSON / CSV
- **v0.2** — WEEE(電子廃棄物)EPR、電池 EPR、繊維 EPR(`record_type` を追加)
- **v0.3** — 業種別オーバーレイ(化粧品・食品接触材・電子機器)
- **v1.0** — 公開 REST API(地域別・カテゴリ別エンドポイント)
- **v2.0** — AI エージェント直接接続向け MCP サーバー化

詳細は [docs/roadmap.md](docs/roadmap.md) をご覧ください。

## コントリビューション

不具合報告・修正提案は GitHub Issue でお願いします。誤りを指摘いただく際は、根拠となる公式ページの URL を併記いただけると助かります。

## 関連ドキュメント

- [English README](README.md)
