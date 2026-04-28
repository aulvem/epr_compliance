# Roadmap

Long-form companion to the brief roadmap in [README.md](../README.md). Versions describe project capability level. Each version ships when the previous is genuinely stable, not on a calendar deadline.

## v0.1 — Skeleton + 7 jurisdictions × 2 regimes (current)

Demonstrates that the schema and extraction pipeline work end-to-end for two adjacent compliance domains in one dataset.

- 7 jurisdictions: DE, FR, IT, ES, NL, GB, US
- 2 regimes per jurisdiction: packaging EPR + de minimis tariff threshold (~14 records total)
- v0.1 schema with `record_type` discriminator (English master + Japanese view)
- Weekly automated re-fetch + re-extract via GitHub Actions
- Public release under CC-BY 4.0

## v0.2 — Adjacent EPR schemes

Goal: cover the EPR schemes most relevant to cross-border e-commerce, beyond packaging.

- WEEE (Waste Electrical and Electronic Equipment) EPR
- Battery EPR
- Textile EPR (e.g. France's AGEC textile scheme)
- Expanded jurisdiction coverage where each scheme exists

Migration policy: v0.1 → v0.2 is additive, not destructive. v0.1 fields and existing records are preserved; new records get new `record_type` values.

## v0.3 — Industry-specific compliance carve-outs

Adds sector-specific overlays (cosmetics, food contact, electronics) for jurisdictions where the base EPR scheme has industry-specific sub-rules. Cross-references existing v0.1 / v0.2 records.

## v1.0 — Public REST API

Hosted query interface so applications do not need to redownload snapshots. The dataset itself remains free under CC-BY 4.0; the API is a convenience layer with route-by-jurisdiction and route-by-product-category endpoints.

## v2.0 — MCP server

Direct integration with AI agents (Claude, ChatGPT, Cursor). Primary tool: structured query joining EPR registration requirements, tariff thresholds, and any future industry overlays for a given seller's product catalog and target market.

## How versions interact with downstream consumers

| Version transition | Schema impact | Action required |
| --- | --- | --- |
| v0.1 → v0.1.x patch | None | None |
| v0.1 → v0.2 | Additive (new `record_type` values) | Optional |
| v0.2 → v0.3 | Additive (new overlay records) | Optional |
| v0.3 → v1.0 | None for dataset | Optional |
| v1.0 → v2.0 | None for dataset / API | Optional |

The intent across all versions is **never break a v0.1-pinned consumer.**

## Out of scope (not on the roadmap)

These are explicitly NOT planned at any version:

- HS code classification advice (this is the customs broker's role, never the dataset's)
- Country-of-origin determination for goods
- Free trade agreement (FTA) preferential rate calculations
- Declaration form layouts and language localization beyond EN / JA
- Any content that would make this dataset "legal advice" rather than reference data
