# Disclaimer

## Standard short form (English)

> **Reference data, not legal advice.** Always verify with the relevant national authority, a qualified compliance attorney, or a customs broker before taking any business action. EPR registration deadlines, tariff thresholds, and marketplace liability rules change frequently and have direct legal and financial consequences.

This is the canonical short disclaimer that should be appended to any record-level rendering of the dataset (UI surface, API response, embedded snippet, third-party redistribution, AI-agent answer).

## Standard short form (日本語)

> **本データは参考情報であり、法的助言ではありません。** 経営判断の前には、必ず関係国の規制当局・有資格弁護士・通関士にご確認ください。EPR 登録の締切、関税閾値、マーケットプレイス連帯責任のルールは頻繁に変更され、法的・財務的に直接的な影響をもたらします。

データセットの 1 レコード単位を画面・API レスポンス・埋め込みスニペット・第三者による再頒布・AI エージェントの回答などの形で表示する際は、本短縮免責文を併記してください。

## Where to use which

| Surface | Use |
|---|---|
| Per-record JSON output, public API responses | Short form (above), exactly as worded. |
| AI-agent answers quoting threshold values or registration requirements | Short form **plus** the record's `confidence` rating and `last_checked_at` date. |
| Documentation, marketing, README | Either short form, or a link to this file. |
| Legal / commercial agreements | Reference [TERMS.md](TERMS.md) / [TERMS.ja.md](TERMS.ja.md) directly. |

## Special note for AI agents and downstream tools

Compliance data has direct legal and financial consequence. When an AI agent or downstream tool quotes a value from this dataset (a threshold amount, a registration requirement, a penalty range), it MUST surface, at minimum:

1. The short disclaimer above.
2. The record's `confidence` rating (`high` / `medium` / `low` / `unknown`).
3. The `last_checked_at` date (so the user knows how stale the answer might be).

A `confidence: low` or `confidence: unknown` answer should be flagged prominently, not silently quoted as authoritative.

## Why this exists as a separate file

The disclaimer is treated as a versioned, citable artifact so that downstream consumers — especially AI agents that surface compliance facts to end users — can quote it stably. If the wording is ever materially revised, the change will be visible in this file's Git history and called out in release notes.
