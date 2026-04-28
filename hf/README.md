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

# EPR + De Minimis Tariff Compliance Dataset

A structured, machine-readable dataset of two adjacent cross-border e-commerce compliance regimes for major EU member states, the UK, and the US:

- **Packaging EPR** — extended producer responsibility for packaging waste (registration, reporting, materials covered, marketplace liability, penalties).
- **De minimis tariff thresholds** — low-value-import thresholds under which VAT and / or duty are waived or simplified, plus relevant special regimes (IOSS, OSS, etc.).

Designed to be directly consumable by AI agents and downstream e-commerce tooling without scraping.

## Overview

Cross-border sellers — Shopify stores, Amazon FBA, Etsy shops — need to know two things before shipping into a market: (1) whether they need to pre-register for the destination's packaging EPR scheme, and (2) above what import value VAT / duty kick in. Both topics are scattered across government PDFs, law-firm summaries, and outdated blog posts. `epr_compliance` provides the missing structured layer.

Every record cites authoritative sources (national EPR registration authorities, customs schedules, tax agencies) and carries an explicit `last_checked_at` date plus a `confidence` rating. Unknown values are marked `unknown` / `null` / `[]` rather than guessed.

> **Reference data, not legal advice. Consult a qualified EU compliance attorney, customs broker, or local regulatory authority before taking any business action.**

## What's in v0.1

| Metric | Value |
|---|---|
| Records | ~14 (planned) |
| Jurisdictions | 7 (DE, FR, IT, ES, NL, GB, US) |
| Regimes per jurisdiction | 2 (packaging EPR + de minimis tariff) |
| Language coverage | English (master) + Japanese (view) |
| Schema version | 0.1 |
| License | CC-BY 4.0 |

The 7 v0.1 jurisdictions:

1. Germany (DE)
2. France (FR)
3. Italy (IT)
4. Spain (ES)
5. Netherlands (NL)
6. United Kingdom (GB)
7. United States (US)

## How to use

### Python (`datasets` library)

```python
from datasets import load_dataset

ds = load_dataset("Aulvem/epr-compliance")
print(ds["train"][0])
# {'id': 'epr_de_packaging', 'record_type': 'packaging_epr', 'country': 'DE', ...}
```

### Direct JSON fetch (preserves nested arrays + record_type discrimination)

The CSV is the default split (flattened union of both record types), but the JSON file preserves the original structure and `oneOf` discrimination by `record_type`. Use the JSON if your code needs to filter by record_type cleanly.

```python
import json, urllib.request

url = "https://huggingface.co/datasets/Aulvem/epr-compliance/resolve/main/epr_compliance_v0.1.json"
data = json.load(urllib.request.urlopen(url))

# Filter by record type
epr_records = [r for r in data["records"] if r["record_type"] == "packaging_epr"]
tariff_records = [r for r in data["records"] if r["record_type"] == "de_minimis_tariff"]
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

The full JSON Schema (Draft 2020-12) ships in this dataset as `schema.json`. Two record types share the same array, discriminated by `record_type`:

### Common fields (both types)

| Field | Type | Notes |
|---|---|---|
| `id` | string | `epr_<cc>_packaging` or `tariff_<cc>_de_minimis` |
| `record_type` | const | `"packaging_epr"` or `"de_minimis_tariff"` |
| `country` | string | ISO 3166-1 alpha-2 (uppercase) |
| `country_name_en/ja` | string | English master + Japanese view |
| `notes_en/ja` | string | Material context and carve-outs |
| `source_urls` | array of URI | All authoritative sources cited |
| `last_checked_at` | string (ISO date) | Verification date |
| `confidence` | enum | `high` / `medium` / `low` / `unknown` |

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

The CSV at `epr_compliance_v0.1.csv` is a flattened union view of both record types (record_type-specific fields appear empty for the other type). Both files are kept bit-identical with the canonical sources in the GitHub repository.

## Important notice

> **Reference data, not legal advice.**

EPR registration deadlines, tariff thresholds, and marketplace liability rules **change frequently** and have direct legal and financial consequences. Confirm directly with the relevant national EPR registration authority, customs schedule, or treasury / tax agency — and consult a qualified EU compliance attorney or licensed customs broker before taking any business action. The dataset maintainers accept no liability for outcomes derived from this data.

## Update cadence

The dataset is automatically re-fetched and re-extracted weekly (Mondays 03:00 UTC) by a GitHub Actions workflow in the source repository. Each run produces a pull request with a structured diff against the prior snapshot. Updates are merged into the canonical dataset only after human review, and the merged result is mirrored here on Hugging Face.

You can pin to a specific revision using the standard HF dataset versioning, e.g. `load_dataset("Aulvem/epr-compliance", revision="<commit-sha>")`.

## Roadmap

| Version | Focus |
|---|---|
| v0.1 (current) | 7 jurisdictions × 2 regimes (~14 records) |
| v0.2 | WEEE EPR + battery EPR + textile EPR (additive `record_type` values) |
| v0.3 | Industry-specific overlays (cosmetics, food contact, electronics) |
| v1.0 | Public REST API with route-by-jurisdiction + route-by-product-category endpoints |
| v2.0 | MCP server for direct AI-agent integration (Claude, ChatGPT, Cursor) |

Schema changes are additive — v0.1-pinned consumers will not be broken by later versions.

## Source repository

Canonical source, weekly extraction pipeline, schema definition, and contribution process all live on GitHub:

**https://github.com/aulvem/epr_compliance**

Issues, pull requests, and inaccuracy reports should go there. This Hugging Face dataset is a downstream mirror.

## How to cite

If you use this dataset in research, products, or downstream tooling, please cite as:

> epr_compliance contributors (2026). *EPR + De Minimis Tariff Compliance Dataset* (v0.1). Available at https://huggingface.co/datasets/Aulvem/epr-compliance (mirror) and https://github.com/aulvem/epr_compliance (canonical), licensed under CC-BY 4.0.

CC-BY 4.0 requires attribution; the citation above — or any substantively equivalent form that names the dataset, version, and license — satisfies that requirement.

## License

Released under [Creative Commons Attribution 4.0 International (CC-BY 4.0)](https://creativecommons.org/licenses/by/4.0/). You are free to share and adapt, including for commercial use, provided you give appropriate credit.

The underlying regulation text and authority names remain the property of each government / authority. This dataset extracts factual information (registration requirements, threshold values, frequency enums) under principles applicable to factual extraction; it does not redistribute the original prose. If you republish raw regulator-authored text obtained via the source URLs, observe each authority's own terms.

## Contact

Questions, bug reports, and corrections via GitHub issues:

**https://github.com/aulvem/epr_compliance/issues**

Please cite the official source page when reporting an inaccuracy.
