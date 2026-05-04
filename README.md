# epr_compliance — AI-readable EPR + De Minimis Tariff Dataset

A structured, machine-readable dataset of two adjacent cross-border e-commerce compliance regimes — **packaging EPR registration requirements** and **de minimis import tariff thresholds** — for major EU member states, the UK, and the US.

The web is full of human-readable compliance guides; almost none are usable by an AI agent or a downstream e-commerce stack without scraping and re-parsing. `epr_compliance` is the missing structured layer.

> **⚠️ This is reference data, not legal advice. Consult a qualified EU compliance attorney, customs broker, or local regulatory authority before taking any business action.**

## What this is

- A JSON + CSV dataset (`data/`) following a documented schema with `record_type` discriminator.
- An extraction skill (`skills/epr-extraction/SKILL.md`) that defines exactly how each field is derived from official government / regulator pages.
- Tooling (`scripts/`) that re-fetches authoritative sources and re-extracts on a weekly cadence.
- Diff-based change tracking via Git, so consumers can audit *what* changed and *when* — important for a domain where deadlines and thresholds shift.

## Where to find this dataset

- **GitHub** (this repo) — canonical source, full extraction history, weekly update pipeline.
- **Hugging Face Datasets** — [Aulvem/epr-compliance](https://huggingface.co/datasets/Aulvem/epr-compliance) — mirror with auto-generated dataset preview and `datasets` library integration.

## v0.1 scope

| | |
|---|---|
| Jurisdictions | 7 (DE, FR, IT, ES, NL, GB, US — California as representative US state) |
| Regimes per jurisdiction | 2 (packaging EPR + de minimis tariff) |
| Records | 14 (7 packaging_epr + 7 de_minimis_tariff) |
| Timeline events | 84 (append-only event log per record; see SKILL.md §2) |
| Confidence | 11 high, 3 medium |
| Current state | 7 active, 6 scheduled_for_removal (regulatory transition), 1 suspended |
| Languages | English (master) + Japanese (view) |
| Schema | v0.1 — see [skills/epr-extraction/SKILL.md](skills/epr-extraction/SKILL.md) |
| Update cadence | Weekly (Mondays 03:00 UTC) via GitHub Actions |
| License | CC-BY 4.0 — see [LICENSE](LICENSE) |

The 7 jurisdictions covered in v0.1:

1. Germany (DE)
2. France (FR)
3. Italy (IT)
4. Spain (ES)
5. Netherlands (NL)
6. United Kingdom (GB)
7. United States (US)

Each jurisdiction gets two records: one `packaging_epr` and one `de_minimis_tariff`.

## Target audience

- Cross-border e-commerce sellers (Shopify, Amazon FBA, Etsy)
- Compliance engineering teams at marketplaces
- AI agents answering seller questions about destination-country requirements
- Researchers studying e-commerce regulatory fragmentation

## Disclaimer

> **Reference data, not legal advice. Always verify with the relevant national authority, a qualified compliance attorney, or a customs broker before taking any business action.**

EPR registration deadlines, tariff thresholds, and marketplace liability rules change frequently and have direct legal and financial consequences. Treat this dataset as a starting point for research, not as the final word. See [DISCLAIMER.md](DISCLAIMER.md) and [TERMS.md](TERMS.md).

## Usage

```bash
# Read the dataset directly
cat data/epr_compliance_v0.1.json

# Or as flattened CSV
cat data/epr_compliance_v0.1.csv
```

Programmatic consumers should pin to a specific schema version (`v0.1`) — breaking schema changes will be released as `v0.2`, `v0.3`, etc., not as in-place edits.

## Pro edition (commercial / audit-grade)

The free baseline above is the AI-readable structured layer.
The **Pro edition** adds audit-grade metadata that compliance teams need:

- **Extraction evidence** — original source URLs, fetched timestamps, and snippets supporting each field
- **Confidence rationale** — documented decision factors usable directly in ISO / SOC 2 audit trails
- **Change history** — structured version log for tracking regulatory amendments over time
- **Cross-references** — links to related EU regulations and other Aulvem datasets
- **Compliance officer notes** — pitfalls, recommended actions, official contacts, time estimates

Three tiers:

| Tier | Price | Use case | Get it |
|------|-------|----------|--------|
| Snapshot | $19 | Personal / single-user research | [aulvem.gumroad.com/l/xqtzbb](https://aulvem.gumroad.com/l/xqtzbb) |
| Subscription | $79 / year | Internal corporate use + 52 weekly updates + 4 quarterly briefs | [aulvem.gumroad.com/l/hnkxj](https://aulvem.gumroad.com/l/hnkxj) |
| Commercial License | $499 / year | Redistribution / white-label / REST API rights + 1 annual customization | [aulvem.gumroad.com/l/mhxxhf](https://aulvem.gumroad.com/l/mhxxhf) |

The free edition (this dataset) remains permanently free under CC-BY 4.0 and continues to receive weekly updates. Pro is a strict superset; Pro purchase does not replace your access to the free edition.

## License & attribution

The dataset is released under [Creative Commons Attribution 4.0 International (CC-BY 4.0)](LICENSE). You are free to share and adapt, including for commercial use, provided you give appropriate credit.

The underlying regulation text and authority names remain the property of each government / authority. We extract factual information (registration requirements, threshold values, frequency enums, yes/no flags) under principles applicable to factual extraction; the resulting dataset is our contribution. If you republish raw regulator-authored text, observe each authority's own terms.

## How to cite

If you use this dataset in research, products, or downstream tooling, please cite as:

> epr_compliance contributors (2026). *epr_compliance: AI-readable EPR + De Minimis Tariff Dataset* (v0.1). Available at https://github.com/aulvem/epr_compliance, licensed under CC-BY 4.0.

CC-BY 4.0 requires attribution; the citation above — or any substantively equivalent form that names the dataset, version, and license — satisfies that requirement.

## Roadmap

- **v0.1 (now)** — 7 jurisdictions × 2 regimes (~14 records), JSON/CSV.
- **v0.2** — WEEE EPR + battery EPR + textile EPR (additive `record_type` values).
- **v0.3** — Industry-specific overlays (cosmetics, food contact, electronics).
- **v1.0** — Public REST API with route-by-jurisdiction and route-by-product-category endpoints.
- **v2.0** — MCP server for direct AI agent consumption.

Full roadmap: [docs/roadmap.md](docs/roadmap.md).

## Contributing

Bug reports and corrections are welcome via GitHub issues. Please cite the official source page when reporting an inaccuracy.

## See also

- [日本語 README](README.ja.md)
