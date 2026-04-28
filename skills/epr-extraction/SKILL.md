---
name: epr-extraction
description: Extract structured EPR registration and de minimis tariff threshold data from official government sources into the v0.1 schema. Used by scripts/extract.js when processing fetched HTML / PDF text.
---

# EPR + De Minimis Tariff Extraction Skill (v0.1)

This skill defines how to convert an authoritative government / regulator page (HTML or plain text) into a single JSON record that conforms to the `epr_compliance_v0.1` schema. It is the core knowledge asset of this dataset.

The extractor (LLM or rule-based) MUST follow every section of this document. When in doubt, prefer `unknown` over a guess.

The dataset has **two record types** that share one array, discriminated by `record_type`:

- `packaging_epr` — extended producer responsibility for packaging waste (paper / plastic / glass / metal / wood / composite, etc.)
- `de_minimis_tariff` — low-value-import threshold under which VAT and / or duty are waived or simplified

---

## 1. Target schema

Every output record MUST contain exactly the fields defined for its `record_type`. Field order is not significant, but no required field may be omitted.

### 1.1 `packaging_epr` record

| Field | Type | Notes |
|---|---|---|
| `id` | string | Format `epr_<cc>_packaging`, where `<cc>` is the lowercase ISO 3166-1 alpha-2 country code. |
| `record_type` | const | Must be `"packaging_epr"`. |
| `country` | string | ISO 3166-1 alpha-2 country code, **uppercase**. |
| `country_name_en` / `country_name_ja` | string | English master + Japanese view. |
| `regulation_name_en` | string | Official statute / scheme name. **Preserve the original-language name** (e.g. `VerpackG`, `Triman`, `Plastic Packaging Tax`); do not translate proper nouns. |
| `regulation_name_ja` | string \| null | Optional Japanese gloss; the original name in `regulation_name_en` remains canonical. |
| `registration_required` | enum | `yes` / `no` / `conditional` / `unknown`. `conditional` if it depends on volume threshold, marketplace channel, etc. |
| `registration_authority_en` / `_ja` | string \| null | Name of the registering body (e.g. `Stiftung Zentrale Stelle Verpackungsregister (ZSVR)`). |
| `registration_url` | string (URI) | Single canonical entry-point URL, required. |
| `covered_categories` | array of enum | `paper`, `cardboard`, `plastic`, `glass`, `metal`, `wood`, `composite`, `biodegradable`, `other`, `unknown`. |
| `reporting_frequency` | enum | `annual` / `biannual` / `quarterly` / `monthly` / `on_threshold` / `unknown`. |
| `marketplace_liability` | enum | Whether marketplaces (Amazon, Etsy, etc.) bear seller liability. |
| `penalties_en` / `penalties_ja` | string | Penalty range / structure as stated. **Preserve verbatim** including currency. |
| `notes_en` / `notes_ja` | string | Anything material that does not fit elsewhere (deadlines, transition periods, sector-specific carve-outs). |
| `source_urls` | array of URI | All sources cited; first SHOULD equal `registration_url`. |
| `last_checked_at` | string (ISO date) | Date the page was fetched. |
| `confidence` | enum | `high` / `medium` / `low` / `unknown`. See §3. |

### 1.2 `de_minimis_tariff` record

| Field | Type | Notes |
|---|---|---|
| `id` | string | Format `tariff_<cc>_de_minimis`. |
| `record_type` | const | Must be `"de_minimis_tariff"`. |
| `country` | string | ISO 3166-1 alpha-2 uppercase. |
| `country_name_en` / `country_name_ja` | string | |
| `threshold_value` | number \| null | Numeric value of the de minimis threshold. `null` if no de minimis exists or value not stated. |
| `threshold_currency` | string \| null | ISO 4217 (e.g. `EUR`, `GBP`, `USD`). **Always paired with `threshold_value`** — never store currency without a value. |
| `threshold_value_jpy_estimate` | number \| null | Approximate JPY equivalent at `last_checked_at`. Computed via a generic FX rate; **not authoritative** — the original currency value in `threshold_value` is the master. |
| `applies_to_categories` | array of string | Goods categories (e.g. `["all_goods"]`, `["non-tobacco", "non-alcohol"]`). Default to `["all_goods"]` when no carve-outs. |
| `vat_above_threshold` | enum | Whether VAT / sales-tax is owed above the threshold. |
| `duty_above_threshold` | enum | Whether import duty is owed above the threshold. |
| `special_regimes` | array of string | Voluntary or simplified regimes (e.g. `["IOSS"]`, `["OSS"]`, `["GSP"]`). |
| `reporting_burden_en` / `_ja` | string | Free-text summary (one paragraph max). Preserve original phrasing. |
| `notes_en` / `notes_ja` | string | Pending changes (e.g. de minimis reform), exemption schedules. |
| `source_urls` | array of URI | |
| `last_checked_at` | string (ISO date) | |
| `confidence` | enum | |

---

## 2. Extraction rules (HARD RULES — do not violate)

1. **No invention.** If a field is not stated on the source page, output `"unknown"` (string fields), `null` (numeric fields), or `[]` (array fields). Do not infer from sister jurisdictions, prior versions, or general knowledge.
2. **Preserve the source's currency verbatim.** Yen stays yen, EUR stays EUR, GBP stays GBP, USD stays USD. The only normalized companion field is `threshold_value_jpy_estimate` for `de_minimis_tariff` — and it is explicitly labeled as an estimate.
3. **Preserve numbers + units separately.** Penalty caps like `"up to EUR 200,000"` go into `penalties_en` verbatim; the extractor must NOT split into structured numeric fields in v0.1.
4. **Regulation names in the original language.** `VerpackG` (DE), `Triman` (FR), `Plastic Packaging Tax` (UK), `EPR for Packaging` (NL/IT/ES localized names) — keep as on the source. `regulation_name_ja` is a Japanese GLOSS, not a translation that replaces the original.
5. **Penalty ranges preserved verbatim.** Do not collapse `"between EUR 1,000 and EUR 200,000 per infringement"` into a single number. Range, lower bound, upper bound, and per-infringement framing all stay in `penalties_en`.
6. **Date discipline.** `last_checked_at` is the fetch date, not the regulation's effective date. Effective dates and deadlines (transition periods, reporting due dates) go in `notes_en` as ISO dates.
7. **Country code consistency.** `id` uses lowercase (`epr_de_packaging`), `country` field uses uppercase (`DE`). The extractor must keep both in sync.
8. **One canonical source per record.** `registration_url` is a single URL; supplementary references go into `source_urls` array. `source_urls[0]` SHOULD equal `registration_url`.
9. **Language fields are mirrors, not duplicates.** `notes_en` and `notes_ja` should contain the same factual claims, translated. If a fact is only available in one language and you cannot translate it confidently, mirror it verbatim with a `[ja: untranslated]` or `[en: untranslated]` tag.
10. **Empty is meaningful.** An empty `covered_categories: []` means "the page does not enumerate categories"; use `["unknown"]` if the source explicitly says coverage is unspecified, OR keep `[]` and explain in `notes_en`. Be consistent.
11. **VAT vs duty are independent fields.** A regime may waive duty but charge VAT (typical for EU IOSS), or vice versa. Each gets its own enum; do not collapse into one.
12. **`threshold_currency` requires `threshold_value`.** Never `value=null, currency="EUR"`. If unsure of the value, both stay null.

---

## 3. Confidence rubric

Assign exactly one of `high` / `medium` / `low` / `unknown` to the record:

- **high** — Source is the **government's own official site** (the registration authority, customs schedule, or treasury / tax agency), the page is in a language the extractor reads natively, the page directly states the field, and no internal contradictions were found.
- **medium** — Official site, **but**: page is a summary linking out to a PDF that was not fetched, OR translation was required from a non-primary language, OR 1–2 fields are `unknown` for unobvious reasons, OR the page's "last updated" timestamp is more than 18 months old.
- **low** — Information was assembled from **secondary sources** (industry association guidance, law-firm blog, compliance-vendor documentation), OR the regulation was unclear and required interpretation, OR more than 2 fields are `unknown`.
- **unknown** — Could not access the source, or the source page does not actually state EPR / tariff policy.

A record with `confidence: low` is still publishable; it signals to downstream users (especially AI agents quoting compliance facts) that they should re-verify before any business action.

**Critical:** EPR and tariff data carry direct legal and financial consequence. If in doubt between two confidence levels, choose the lower one.

---

## 4. Validation (run after extraction, before commit)

The extractor MUST run these checks and either fix the record or downgrade `confidence`:

1. **Enum check.** All enum fields contain only allowed values.
2. **Discriminator check.**
   - `record_type === "packaging_epr"` ⇒ id must match `^epr_[a-z]{2}_packaging$`.
   - `record_type === "de_minimis_tariff"` ⇒ id must match `^tariff_[a-z]{2}_de_minimis$`.
   - The lowercase 2-letter portion of `id` MUST equal `country.toLowerCase()`.
3. **Currency-value coupling.** If `threshold_value` is set, `threshold_currency` MUST NOT be null. If `threshold_value` is null, `threshold_currency` MUST be null.
4. **URL check.** `registration_url` (and every `source_urls[i]`) returns HTTP 200 within the last fetch cycle. If 4xx / 5xx, mark `confidence: "low"` and add a `VALIDATION:` prefix to `notes_en`.
5. **Date check.** `last_checked_at` is not in the future and not more than 14 days older than the run date.
6. **JPY estimate sanity.** If `threshold_value_jpy_estimate` is set, it MUST be within a plausible factor of the original (e.g. for a EUR 150 threshold: 15,000–35,000 JPY range using realistic FX). Wildly inconsistent estimates indicate a unit error and trigger downgrade.

If a hard validation fails and cannot be repaired, do not delete — emit the record with `confidence: "low"` and a `notes_en` entry beginning `VALIDATION:`.

---

## 5. LLM extraction prompt (canonical)

`scripts/extract.js` should send the following system prompt to the LLM, with the page text and target schema appended:

> You are a structured-data extractor for the `epr_compliance` open dataset, which provides AI-readable EPR registration requirements and de minimis tariff thresholds for cross-border e-commerce. You will receive the text of one official government / regulator page. Output exactly one JSON object conforming to the v0.1 schema described below. Follow these rules without exception:
>
> 1. Determine `record_type` from the page content. If both EPR and tariff information appear on the same page, output the record matching the prompt's expected target (passed by the caller); if neither, output `confidence: "unknown"` and explain in `notes_en`.
> 2. If a field is not stated on the page, output `"unknown"` (string fields), `null` (numeric fields), or `[]` (array fields). **Never infer from outside knowledge.**
> 3. Preserve the source's currency and regulation name verbatim. Do not translate proper nouns.
> 4. `threshold_value` and `threshold_currency` move together: both set, or both null.
> 5. `country` is uppercase (e.g. `DE`); `id`'s embedded country segment is lowercase (e.g. `epr_de_packaging`).
> 6. Mirror `notes_en` and `notes_ja`. If a fact is only in one language and you are not confident in the translation, mirror verbatim with `[ja: untranslated]` or `[en: untranslated]`.
> 7. Set `confidence` per the rubric in §3. Be honest. EPR and tariff records have legal consequence — a low-confidence record is more useful than a wrong high-confidence one.
> 8. Run the validation checks in §4. If a check fails, fix the record if possible; otherwise prefix `notes_en` with `"VALIDATION:"` and downgrade `confidence`.
> 9. Output only the JSON object — no prose, no Markdown fences, no commentary.
>
> Target record_type: <inject "packaging_epr" or "de_minimis_tariff">
> Schema: <inject schema definition for the target record_type>
> Source URL: <inject URL>
> Source language: <inject language>
> Page text: <inject text>

The extractor wrapper code is responsible for parsing the JSON response, re-running validation server-side, and writing the result to `data/epr_compliance_v0.1.json`.

---

## 6. Out of scope for v0.1

Explicitly NOT extracted in this version (deferred to v0.2 / v0.3):

- **WEEE** (Waste Electrical and Electronic Equipment) EPR — separate scheme, separate registration, often separate compliance schemes.
- **Textile EPR** (e.g. France's textile EPR under AGEC law) — large category, distinct producer obligations.
- **Battery EPR** — separate directive.
- **Chemicals compliance** (REACH, RoHS) — out of scope; not an EPR scheme.
- **Industry-specific sub-rules** (cosmetics, food contact, electronics) — deferred to v0.3.
- **Declaration form templates** — language and document layouts vary too much; out of scope.
- **HS code classification advice** — never. This dataset is not a customs broker.

These are tracked in [docs/roadmap.md](../../docs/roadmap.md).
