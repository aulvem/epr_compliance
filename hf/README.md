---
language:
  - en
  - ja
license: cc-by-4.0
tags:
  - cross-border-ecommerce
  - regulations
  - epr
  - tariff
  - eu
  - compliance
  - structured-data
size_categories:
  - n<1K
task_categories:
  - text-classification
  - question-answering
pretty_name: EPR + De Minimis Tariff Compliance Dataset
configs:
  - config_name: default
    data_files:
      - split: train
        path: epr_compliance_v0.1.csv
---

# EPR + De Minimis Tariff Compliance Dataset (Cross-Border, EU/UK/US)

A structured, machine-readable dataset of packaging Extended Producer Responsibility (EPR) regimes and de minimis customs thresholds across EU, UK, and US, designed for cross-border e-commerce sellers and AI agents.

## Overview

The cross-border compliance landscape changes constantly: EPR regimes expand scope, de minimis thresholds get suspended or reformed, EU PPWR phases in. Most existing online resources are human-readable narrative — almost none are usable by AI agents or typed applications without scraping. `epr_compliance` fills that gap with a typed schema, explicit `current_state` flags, and an append-only `timeline` per record that records what already happened AND what is scheduled.

Every record cites primary government sources (with reputable named secondary sources accepted for fast-moving transitions per `SKILL.md` §2.13), carries an explicit `last_checked_at` date, and a `confidence` rating.

> **Reference data, not legal advice. Consult a qualified compliance attorney, customs broker, or local regulatory authority before taking any business action.**

## What's in v0.1

| Metric | Value |
|---|---|
| Records | 14 |
| EPR records | 7 (DE / FR / IT / ES / NL / GB / US) |
| de_minimis_tariff records | 7 (same geographies) |
| Timeline events | 84 |
| Confidence: high | 11 |
| Confidence: medium | 3 |
| Languages | English (master) + Japanese (view) |
| Last checked | 2026-04-27 |
| Schema version | 0.1 |
| License | CC-BY 4.0 |

The 7 geographies covered:

1. Germany (DE) — VerpackG / ZSVR / LUCID
2. France (FR) — AGEC / CITEO / Triman
3. Italy (IT) — D.Lgs 152/2006 / CONAI
4. Spain (ES) — Royal Decree 1055/2022 / Ecoembes
5. Netherlands (NL) — Packaging Management Decree 2014 / Verpact
6. United Kingdom (GB) — pEPR Regulations 2024 / PackUK
7. United States (US, CA representative) — SB 54 / CalRecycle / CAA

## How to use

### Python (`datasets` library)

```python
from datasets import load_dataset

ds = load_dataset("Aulvem/epr-compliance")
print(ds["train"][0])
# {'id': 'epr_de_packaging', 'record_type': 'packaging_epr', 'country': 'DE', ...}
```

### Direct JSON fetch (preserves nested structure)

The CSV is the default split (flattened union of both record types, with the timeline collapsed to a latest-event view), but the JSON file preserves the original structure including the full `timeline` array and the `oneOf` discrimination by `record_type`. Use the JSON if your code needs to filter by `record_type` or walk the complete event log.

```python
import json, urllib.request

url = "https://huggingface.co/datasets/Aulvem/epr-compliance/resolve/main/epr_compliance_v0.1.json"
data = json.load(urllib.request.urlopen(url))

# Filter by record type
epr_records = [r for r in data["records"] if r["record_type"] == "packaging_epr"]
tariff_records = [r for r in data["records"] if r["record_type"] == "de_minimis_tariff"]

# Walk the timeline of one record
for ev in data["records"][0]["timeline"]:
    print(ev["date"], ev["event_type"], ev["description_en"])
```

### Schema validation

```python
import json, urllib.request, jsonschema  # pip install jsonschema

base = "https://huggingface.co/datasets/Aulvem/epr-compliance/resolve/main"
schema  = json.load(urllib.request.urlopen(f"{base}/schema.json"))
dataset = json.load(urllib.request.urlopen(f"{base}/epr_compliance_v0.1.json"))
jsonschema.validate(dataset, schema)   # raises on first failure
```

## Schema

The full JSON Schema (Draft 2020-12) ships in this dataset as `schema.json`. Two record types share the same array, discriminated by `record_type`.

### Common fields (both types)

| Field | Type | Notes |
|---|---|---|
| `id` | string | `epr_<cc>_packaging` or `tariff_<cc>_de_minimis` |
| `record_type` | const | `"packaging_epr"` or `"de_minimis_tariff"` |
| `country` | string | ISO 3166-1 alpha-2 (uppercase) |
| `country_name_en` / `country_name_ja` | string | English master + Japanese view |
| `notes_en` / `notes_ja` | string | Material context and carve-outs |
| `source_urls` | array of URI | All authoritative sources cited |
| `last_checked_at` | string (ISO date) | Verification date |
| `confidence` | enum | `high` / `medium` / `low` / `unknown` |
| `current_state` | object | `{ status, as_of }`; status enum `active` / `suspended` / `scheduled_for_removal` / `removed` / `unknown` |
| `timeline` | array of object | Append-only event log. Substantive events sorted descending; `initial_verification` foundation marker pinned to array tail |

### `packaging_epr` specific

| Field | Type | Notes |
|---|---|---|
| `regulation_name_en` | string | Original-language name (e.g. `VerpackG`, `Triman`); not translated |
| `regulation_name_ja` | string | Japanese gloss only — original remains canonical |
| `registration_required` | enum | `yes` / `no` / `conditional` / `unknown` |
| `registration_authority_en/ja` | string | Registering body (e.g. ZSVR for DE) |
| `registration_url` | string (URI) | Single canonical entry-point URL |
| `covered_categories` | array of enum | `paper`, `cardboard`, `plastic`, `glass`, `metal`, `wood`, `composite`, etc. |
| `reporting_frequency` | enum | `annual` / `biannual` / `quarterly` / `monthly` / `on_threshold` / `unknown` |
| `marketplace_liability` | enum | Whether marketplaces (Amazon, Etsy) bear seller liability |
| `penalties_en/ja` | string | Verbatim penalty range with original currency |

### `de_minimis_tariff` specific

| Field | Type | Notes |
|---|---|---|
| `threshold_value` | number \| null | Numeric threshold |
| `threshold_currency` | string \| null | ISO 4217 (always paired with `threshold_value`) |
| `threshold_value_jpy_estimate` | number \| null | Approximate JPY equivalent (not authoritative) |
| `applies_to_categories` | array of string | Goods categories (default `["all_goods"]`) |
| `vat_above_threshold` | enum | Whether VAT / sales tax applies above threshold |
| `duty_above_threshold` | enum | Whether import duty applies above threshold |
| `special_regimes` | array of string | Voluntary regimes (`IOSS`, `OSS`, etc.) |
| `reporting_burden_en/ja` | string | Free-text declaration summary |

The CSV at `epr_compliance_v0.1.csv` is a flattened 37-column view of both record types (record_type-specific fields appear empty for the other type; the `timeline` is collapsed to a latest-event view via `latest_event_*` and `timeline_event_count` columns). The complete timeline is preserved in JSON only. Both files are kept bit-identical with the canonical sources in the GitHub repository.

## Important notice

> **Reference only. Always verify with official sources before taking compliance, customs, or tax actions.**

Cross-border compliance rules change frequently and have direct legal and financial consequences. Confirm directly with qualified attorneys, customs brokers, or local regulatory authorities before making business decisions. The dataset maintainers accept no liability for outcomes derived from this data.

## Update cadence

The dataset is automatically re-fetched and re-extracted weekly (Mondays 03:00 UTC) by a GitHub Actions workflow in the source repository. Each run produces a pull request against the canonical GitHub repository with a structured diff against the prior snapshot. Updates are merged into the canonical dataset only after human review, and the merged result is mirrored here on Hugging Face.

You can pin to a specific revision using the standard HF dataset versioning, e.g. `load_dataset("Aulvem/epr-compliance", revision="<commit-sha>")`.

## Roadmap

| Version | Focus |
|---|---|
| v0.1 (current) | 14 records, packaging EPR + de minimis tariff |
| v0.2 | WEEE EPR, textile EPR; broader marketplace liability data |
| v0.3 | Asia-Pacific (JP / KR / TW) and additional US states |
| v1.0 | Public REST API for cross-border compliance queries |
| v2.0 | MCP server for direct AI-agent integration |

Schema changes are additive — v0.1-pinned consumers will not be broken by later versions.

## Source repository

Canonical source, weekly extraction pipeline, schema definition, and contribution process all live on GitHub:

**https://github.com/aulvem/epr_compliance**

Issues, pull requests, and inaccuracy reports should go there. This Hugging Face dataset is a downstream mirror.

## How to cite

If you use this dataset in research, products, or downstream tooling, please cite as:

> epr_compliance contributors (2026). *epr_compliance: AI-readable EPR + De Minimis Tariff Compliance Dataset* (v0.1). Available at https://huggingface.co/datasets/Aulvem/epr-compliance (mirror) and https://github.com/aulvem/epr_compliance (canonical), licensed under CC-BY 4.0.

CC-BY 4.0 requires attribution; the citation above — or any substantively equivalent form that names the dataset, version, and license — satisfies that requirement.

## License

Released under [Creative Commons Attribution 4.0 International (CC-BY 4.0)](https://creativecommons.org/licenses/by/4.0/). You are free to share and adapt, including for commercial use, provided you give appropriate credit.

The underlying regulatory text remains the property of each government and regulator. This dataset extracts factual information (registration thresholds, fee structures, deadlines, penalty caps) under principles applicable to factual extraction; it does not redistribute the original legislative or regulatory prose. If you republish raw regulator-authored text obtained via the source URLs, observe each regulator's own terms.

## Contact

Questions, bug reports, and corrections via GitHub issues:

**https://github.com/aulvem/epr_compliance/issues**

Please cite the official source page when reporting an inaccuracy.
