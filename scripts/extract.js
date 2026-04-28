// scripts/extract.js
//
// Convert cached government / regulator HTML into structured JSON records that
// conform to data/schema.json, by sending each page (plus the SKILL.md
// extraction contract and schema.json) to an LLM and parsing the response.
//
// Inputs:
//   cache/html/{id}_{date}.html              — produced by scripts/fetch.js
//   data/sources.json                        — id → metadata (which records to update)
//   data/schema.json                         — JSON Schema for validation (oneOf by record_type)
//   skills/epr-extraction/SKILL.md           — extraction contract (master)
//
// Output:
//   data/epr_compliance_v0.1.json            — canonical dataset, updated in place
//
// Usage: node scripts/extract.js
//
// SKELETON ONLY. The LLM call is a signature; orchestration is a TODO.

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SOURCES_FILE = resolve(ROOT, 'data/sources.json');
const SCHEMA_FILE  = resolve(ROOT, 'data/schema.json');
const SKILL_FILE   = resolve(ROOT, 'skills/epr-extraction/SKILL.md');
const DATASET_FILE = resolve(ROOT, 'data/epr_compliance_v0.1.json');
const CACHE_DIR    = resolve(ROOT, 'cache/html');

const DEFAULT_MODEL = process.env.EPR_COMPLIANCE_MODEL ?? 'claude-opus-4-7';
const MAX_TOKENS = 4096;
const HTML_CHAR_BUDGET = 60_000;

/**
 * Locate the most recent cached HTML file for a given id.
 * @param {string} id
 * @returns {Promise<{ path: string, fetched_at: string, html: string } | null>}
 *   Resolves to null if no cache exists for this id (extract.js should keep
 *   the previous record rather than throw).
 */
async function loadLatestCache(id) {
  // TODO: readdir(CACHE_DIR), filter files matching /^{id}_(\d{4}-\d{2}-\d{2})\.html$/,
  //       pick the one with the highest date, readFile it, return { path, fetched_at, html }.
  throw new Error('not implemented');
}

/**
 * Build the LLM user-message payload per SKILL.md §5 (canonical extraction prompt).
 * The caller passes the expected target record_type so the LLM knows whether to
 * emit a packaging_epr or de_minimis_tariff record (some pages cover both).
 * @param {{
 *   skillMarkdown: string,
 *   schema: object,
 *   source: { id: string, url: string, source_language?: string, record_type: string },
 *   html: string
 * }} args
 * @returns {string}
 */
function buildPrompt({ skillMarkdown, schema, source, html }) {
  // TODO: assemble the canonical prompt per SKILL.md §5.
  //  - Look up `schema.$defs[source.record_type === 'packaging_epr' ? 'packaging_epr_record' : 'de_minimis_tariff_record']`
  //    and inject only that branch (the LLM doesn't need the full oneOf wrapper).
  //  - Inject source URL, source language, record id, target record_type.
  //  - Truncate html to HTML_CHAR_BUDGET; keep head + tail if truncated.
  //  - End with: "Output only the JSON object — no prose, no Markdown fences."
  throw new Error('not implemented');
}

/**
 * Call the LLM and return the raw response text.
 *
 * Implementation must be swappable: callers must not import SDK types.
 * Default backend: @anthropic-ai/sdk, reading ANTHROPIC_API_KEY from env.
 *
 * @param {{ system: string, user: string, model?: string }} args
 * @returns {Promise<string>}
 */
async function callLLM({ system, user, model = DEFAULT_MODEL }) {
  // TODO:
  //   const Anthropic = (await import('@anthropic-ai/sdk')).default;
  //   const client = new Anthropic();
  //   const res = await client.messages.create({
  //     model, max_tokens: MAX_TOKENS, system,
  //     messages: [{ role: 'user', content: user }],
  //   });
  //   return res.content.filter(b => b.type === 'text').map(b => b.text).join('');
  throw new Error('not implemented');
}

/**
 * Parse and lightly validate the model's JSON response.
 *
 * Per SKILL.md §4, validation failures degrade the record (notes_en prefixed
 * with "VALIDATION:" + confidence downgraded) rather than throwing.
 *
 * @param {string} text
 * @param {string} expectedRecordType - 'packaging_epr' | 'de_minimis_tariff'
 * @returns {object} a record per data/schema.json $defs.<type>_record
 */
function parseExtractedRecord(text, expectedRecordType) {
  // TODO: strip stray Markdown fences (```json ... ```), JSON.parse, then run:
  //   - record_type === expectedRecordType (else: VALIDATION + downgrade)
  //   - id pattern matches record_type
  //   - country uppercase, id-embedded country lowercase, equal modulo case
  //   - threshold_value/threshold_currency coupling (de_minimis_tariff only)
  //   - last_checked_at not in the future
  // On any failure: prepend notes_en with "VALIDATION: <reason>" and set
  // confidence = "low" (unless already "unknown"). Do not throw.
  throw new Error('not implemented');
}

/**
 * Orchestrate one extraction run.
 *  1. read SOURCES_FILE, SCHEMA_FILE, SKILL_FILE, and the previous DATASET_FILE.
 *  2. for each source: loadLatestCache → buildPrompt → callLLM → parseExtractedRecord.
 *  3. on per-record failure (no cache, parse error, network error): keep the
 *     previously committed record verbatim and log the skip.
 *  4. assemble new dataset { ...prev, last_generated_at: now, records } and
 *     write DATASET_FILE atomically (write temp, rename).
 */
async function main() {
  // TODO: implement orchestration; emit a one-line summary per record to stderr
  //       (id, ok|skipped|failed, reason) so the workflow logs are auditable.
  throw new Error('not implemented');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
